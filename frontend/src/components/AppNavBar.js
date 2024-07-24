// components/AppNavbar.js

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import UserIcon from "../images/user.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AppNavBar = (props) => {
  let navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, name, setName, email, setEmail } = props;
  
  const handleLogout = () => {
      setIsLoggedIn(false);
      sessionStorage.setItem("isLoggedIn", JSON.stringify(false));

      setName(null);
      setEmail(null);
      navigate("/");
      toast.success("You are successfully logged out!");
    };

    // useEffect(() => {
    //     console.log('isLoggedIn changed:', isLoggedIn);
    //   }, [isLoggedIn]);

    // console.log(isLoggedIn)


  return (
    
    <Navbar fluid>
        <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">WhatBytes</span>
        {/* <Navbar.Link href="/login" className="text-lg">Login</Navbar.Link> */}
      {isLoggedIn ? (
        <div className="flex md:order-2">
          <Dropdown arrowIcon={false}
            label={ <img alt="User Icon" width="26" height="26"  src={UserIcon} className="mb-3 rounded-full shadow-lg "/>}>
            <Dropdown.Header >
              <span className="block text-sm">{name}</span>
              <span className="block truncate text-sm font-medium">{email}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
          </Dropdown>
        </div>
      )
    :  <Navbar.Link href="/login" className="text-lg">Login</Navbar.Link>}

     
    </Navbar>
  );
};

export default AppNavBar;