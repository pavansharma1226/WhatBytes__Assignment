// App.js

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppNavBar from "./components/AppNavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/ResetPassword";
import Change from "./pages/Change";
import Profile from "./pages/Profile";
import { useState } from "react";


const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return JSON.parse(sessionStorage.getItem("isLoggedIn")) || false;
  });

const [name, setName] = useState(() => {
    return sessionStorage.getItem("name") || "";
  });
  const [email, setEmail] = useState(() => {
    return sessionStorage.getItem("email") || "";
  });
  const [joined, setJoined] = useState(() => {
    return sessionStorage.getItem("joined") || "";
  });
  const [lastUpdated, setLastUpdated] = useState(() => {
    return sessionStorage.getItem("lastUpdated") || "";
  });

  
  return (
    <div className="md:h-screen bg-purple-100">
      <BrowserRouter>
        <ToastContainer />
        <AppNavBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
        />
        <div>
          <Routes>
            <Route path="/" exact
              element={
                <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route path="register" exact
              element={
                <Register
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setName={setName}
                  setEmail={setEmail}
                  setJoined = {setJoined}
                  setLastUpdated = {setLastUpdated}
                />
              }
            />
            <Route path="login" exact
              element={
                <Login
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setName={setName}
                  setEmail={setEmail}
                  setJoined = {setJoined}
                  setLastUpdated = {setLastUpdated}
                />
              }
            />
            <Route path="forgotPassword" exact
              element={<ForgotPassword isLoggedIn={isLoggedIn} />}
            />
            <Route path="resetPassword" 
              element={<ResetPassword isLoggedIn={isLoggedIn} setLastUpdated = {setLastUpdated}
                      />}
            />

          <Route path="changePassword" 
              element={<Change   isLoggedIn={isLoggedIn} email={email} setLastUpdated = {setLastUpdated}
                      />}
            />

            

          <Route path="dashboard" exact
              element={
                <Dashboard setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} name={name} email={email} joined = {joined}/>
              }
            />

            <Route path="profile" exact
              element={
                <Profile setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} name={name} email={email} joined = {joined} lastUpdated = {lastUpdated}
                />}
            />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;