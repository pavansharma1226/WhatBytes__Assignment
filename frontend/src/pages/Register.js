// pages/Register.js

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import CountryInput from "../components/CountryInput";
import { useEffect } from "react";

const URL = process.env.REACT_APP_BACKEND_URL + "/api/register";
const Register = (props) => {
  const { isLoggedIn, setIsLoggedIn, setName, setEmail, setJoined, setLastUpdated } = props;
  let navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("profile");
  });

  const handleRegister = async (ev) => {
    ev.preventDefault();
    const name = ev.target.name.value;
    const email = ev.target.email.value;
    const password = ev.target.password.value;
    const confirmpassword = ev.target.confirmpassword.value;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    if (password !== confirmpassword) toast.error("Passwords do not match !");
    else{
       
        const formData = {
        name: name,
        email: email,
        password: password,
        JoinedOn : formattedDate,
      };
      try {
        const res = await axios.post(URL, formData);
        const data = res.data;
        if (data.success === true) {
          toast.success(data.message);
          setIsLoggedIn(true);
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));

          setLastUpdated(data.lastUpdated);
          sessionStorage.setItem("lastUpdated", JSON.stringify(data.lastUpdated));

          setName(name);
          sessionStorage.setItem("name", JSON.stringify(name));

          setEmail(email);
          sessionStorage.setItem("email", JSON.stringify(email));

          setJoined(formattedDate)
          sessionStorage.setItem("joined", JSON.stringify(formattedDate));

          navigate("/profile");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log("Some error occured", err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-6 py-8 mx-auto my-5 lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Create an account
          </h1>
          <form
            className="space-y-4 md:space-y-"
            action="POST"
            onSubmit={handleRegister}
          >
            <div>
              <div className="mb-2 block">
                <label htmlFor="name" className="text-sm font-medium required">
                  Name
                </label>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <label htmlFor="email" className="text-sm font-medium required">
                  Email
                </label>
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="Your Email"
                required
              />
            </div>

            <div class="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium required"
                  >
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <label
                    htmlFor="confirmpassword"
                    className="text-sm font-medium required"
                  >
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  placeholder="Re-enter Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  required
                />
              </div>
            </div>



            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                  aria-describedby="terms"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a className="font-medium text-purple-600 hover:underline dark:text-purple-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              class="w-full focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
            >
              Create an account
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="login"
                className="font-semibold leading-6 text-purple-600 hover:text-purple-500"
              >
                Login Here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;