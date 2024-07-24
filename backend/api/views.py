# api/views.py

from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Token
from .serializers import UserSerializer, TokenSerializer
from django.conf import settings
from datetime import datetime, timedelta
import hashlib
import uuid
from django.utils import timezone
import re

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:3000"


def mail_template(content, button_url, button_text):
    return f"""<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: "Verdana", serif; color: #000;">
                <div style="max-width: 600px; margin: 10px; background-color: #fafafa; padding: 25px; border-radius: 20px;">
                <p style="text-align: left;">{content}</p>
                <a href="{button_url}" target="_blank">
                    <button style="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff;">{button_text}</button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                <a href="{button_url}" target="_blank">
                    <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">{button_url}</p>
                </a>
                </div>
            </body>
            </html>"""


# Create your views here.
class ResetPasswordView(APIView):
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]
        date = datetime.now()
        date_string = date.strftime('%Y-%m-%d %H:%M:%S')

        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(pattern, request.data['password']):
            return Response(
                {"success": False, "message": "Password must contains Uppercase, Lowercase, Special character and Number.", "lastUpdated" :  date_string},
                status=status.HTTP_200_OK,
            )
        
        token_obj = Token.objects.filter(
            user_id=user_id).order_by("-created_at")[0]
        if token_obj.expires_at < timezone.now():
            return Response(
                {
                    "success": False,
                    "message": "Password Reset Link has expired!",
                },
                status=status.HTTP_200_OK,
            )
        elif token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {
                    "success": False,
                    "message": "Reset Password link is invalid!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password, salt=SALT)
            ret_code = User.objects.filter(
                id=user_id).update(password=hashed_password)
            if ret_code:
                token_obj.save()
                return Response(
                    {
                        "success": True,
                        "message": "Your password reset was successfully!",
                    },
                    status=status.HTTP_200_OK,
                )
                
                
# Create your views here.
class ChangePasswordView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@#$!%*?&]{8,}$'
        if not re.match(pattern, request.data['password']):
            return Response(
                {"success": False, "message": "Password must contains Uppercase, Lowercase, Special character and Number."},
                status=status.HTTP_200_OK,
            )
        
        
        oldpassword = request.data["oldpassword"]
        old_hashed_password = make_password(password=oldpassword, salt=SALT)
        userdata = User.objects.get(email=email)
        # print(userdata.password)
        # print(old_hashed_password)
        
        if userdata.password == old_hashed_password:
            hashed_password = make_password(password=password, salt=SALT)
            if(hashed_password == old_hashed_password):
                return Response(
                    {
                        "success": False,
                        "message": "New Password and old Password Cannot be Same",
                    },
                    status=status.HTTP_200_OK,
                )
            date = datetime.now()
            date_string = date.strftime('%Y-%m-%d %H:%M:%S')

            ret_code = User.objects.filter(
                email=email).update(password=hashed_password, lastUpdated=date_string)
            if ret_code:
                return Response(
                    {
                        "success": True,
                        "message": "Your password Changed successfully!",
                        "lastUpdated" : date_string,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                    {
                        "success": False,
                        "message": "Old password is Incorrect",
                    },
                    status=status.HTTP_200_OK,
                )

class ForgotPasswordView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        # print("user",email)
        user = User.objects.filter(email=email)
        # print("spkiauhggv:",user)
        if(user.exists()):
            created_at = timezone.now()
            expires_at = timezone.now() + timezone.timedelta(1)
            salt = uuid.uuid4().hex
            token = hashlib.sha512(
                (str(user[0].id) + user[0].password + created_at.isoformat() + salt).encode(
                    "utf-8"
                )
            ).hexdigest()
            token_obj = {
                "token": token,
                "created_at": created_at,
                "expires_at": expires_at,
                "user_id": user[0].id,
            }
            serializer = TokenSerializer(data=token_obj)
            if serializer.is_valid():
                serializer.save()
                 
                subject = "Forgot Password Link"
                content = mail_template(
                    "We have received a request to reset your password. Please reset your password using the link below.",
                    f"{URL}/resetPassword?id={user[0].id}&token={token}",
                    "Reset Password",
                )
                send_mail(
                    subject=subject,
                    message=content,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    html_message=content,
                )
                return Response(
                    {
                        "success": True,
                        "message": "A password reset link has been sent to your email.",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                error_msg = ""
                for key in serializer.errors:
                    error_msg += serializer.errors[key][0]
                return Response(
                    {
                        "success": False,
                        "message": error_msg,
                    },
                    status=status.HTTP_200_OK,
                )
                
        else:
            return Response(
                {
                        "success": False,
                        "message": "Email Not Registered",
                    },
                    status=status.HTTP_200_OK,
                )

class RegistrationView(APIView):
    def post(self, request, format=None):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@#$!%*?&]{8,}$'
        if not re.match(pattern, request.data['password']):
            return Response(
                {"success": False, "message": "Password must contains Uppercase, Lowercase, Special character and Number."},
                status=status.HTTP_200_OK,
            )
            
        date = datetime.now()
        date_string = date.strftime('%Y-%m-%d %H:%M:%S')

        request.data["lastUpdated"] = date_string    
        request.data["password"] = make_password(
            password=request.data["password"], salt=SALT
        )
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "You are now registered on our website!", "lastUpdated" : date_string},
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {"success": False, "message": error_msg},
                status=status.HTTP_200_OK,
            )


class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        hashed_password = make_password(password=password, salt=SALT)
        user = User.objects.filter(email=email)
        if not user.exists():
            return Response(
                {
                    "success": False,
                    "message": "Email Not Registered",
                },
                status=status.HTTP_200_OK,
            )
        elif(user[0].password != hashed_password):
            return Response(
                {
                    "success": False,
                    "message": "Invalid Password",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": True, "message": "You are now logged in!", "name" : user[0].name, "joined" : user[0].JoinedOn, "lastUpdated" : user[0].lastUpdated},
                status=status.HTTP_200_OK,
                
            )