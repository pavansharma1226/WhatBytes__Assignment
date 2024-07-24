WhatBytes Django + React Assignment

Implementation 

Import necessary modules and functions for Django and DRF (Django Rest Framework).

 >> make_password: for Hashing passwords using salt.

 >> send_mail: for sending reset password emails.

 >> APIView, Response, status: DRF classes for creating API views for different routes.
 
 >> used custom models and serializers for storing data and verifying it.
 
 >> datetime, timedelta: Handle date and time operations like getting joined date and making token valid for 1 hr(ResetPassword).
 
 >> hashlib, uuid: Generate unique tokens and hashes.
 
 >> re: Use regular expressions to verify password should contains atleast Uppercase, Lowercase, Special Character and number.

 >> Used session storage to store the data of user logged in and only allowing user logged in to access Dasboard, Profile and ChangePassword route
Otherwise it will redirect to login page if user is not logged in

 >> Used toaster for Enhancing user experience by providing Error Notifications
 
 >> Used Sql3lite for storing data(default using python)
 
 >>Used Tailwind css for styling


1. Login Page
Display two fields: Username/Email and Password.
Include links/buttons for Sign Up and Forgot Password.

3. Sign Up Page
Include fields for Username, Email, Password, and Confirm Password.
Include a link/button to go back to the Login page.

4. Forgot Password Page
Include a field for Email and a button to send reset instructions.
Upon clicking the button, send an email with a link to reset the password.

5. Change Password Page
Require authentication to access this page.
Include fields for Old Password, New Password, and Confirm Password.
Include a link/button to go back to the Dashboard.

6. Dashboard
Only accessible to authenticated users.
Display a greeting message like "Hi, username!".
Include links to the Profile page and Change Password page.
Include an option to logout.

7. Profile Page
Display information such as Username, Email, Date Joined, and Last Updated.
Include a link/button to go back to the Dashboard.
Include an option to logout.
