import React, { useState } from "react";
import { jwtDecode as decode } from "jwt-decode";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";


import '../styles/SignupForm.css';

function SignupForm() {

  var bp = require("./Path.js");
  var storage = require("../tokenStorage.js");
  const [loginFirst, setLoginFirst] = useState("");
  const [loginLast, setLoginLast] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    let validationMessage = "";    
     // check for empty fields
    if (!loginFirst) {
      setMessage("Please enter a valid First Name.");
      return false;
    }
    else if (!loginLast) {
      setMessage("Please enter a valid Last Name.");
      return false;
    }
    else if (!loginEmail) {
      setMessage("Please enter a valid Email");
      return false;
    }    
    else if (!loginUserName) {
      setMessage("Please enter a valid username");
      return false;
    }    
    else if (!loginPassword) {
      setMessage("Please enter a valid password");
      return false;
    }    
    else if (!confirmPassword) {
      setMessage("Please confirm your password");
      return false;
    }
    // email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(loginEmail.trim())) {
       setMessage(`Please enter a valid email address`);
       return false;
    }
    // password complexity validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(loginPassword)) {
      setMessage("Password must contain letters, at least one number, one special character, and at least 8 characters total.");
      return false;
    }
    // check if passwords match
    if (loginPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }
    setMessage(null);
    return true;
  };

  const doSignup = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
  	  return;
    }
    console.log(loginFirst);
    console.log(loginLast);
    console.log(loginEmail);
    console.log(loginUserName);
    console.log(loginPassword);

    // Incoming: FirstName, LastName, Email, Username, Password
    var obj = { FirstName: loginFirst, LastName: loginLast, Email: loginEmail, Username: loginUserName, Password: loginPassword };
    var js = JSON.stringify(obj);
    var config = {
      method: "post",
      url: bp.buildPath("api/signup"),
      headers: {
        "Content-Type": "application/json",
      },
      data: js,
    };
    axios(config)
      .then(function (response) {
        var res = response.data;
        storage.storeToken(res.token);
        var uddecoded = decode(storage.retrieveToken(), { complete: true });

        try {
          var ud = uddecoded;
          var userId = ud.userId;
          var firstName = ud.firstName;
          var lastName = ud.lastName;
          var user = { firstName: firstName, lastName: lastName, id: userId };
          localStorage.setItem("user_data", JSON.stringify(user));
          window.location.href = "/CheckEmail";
          sendLink(storage.retrieveToken());
        } catch (e) {
          console.error(e.response.data);
          return "";
        }
      })
      .catch(function (error) {
        if (error.response.status === 400)
          setMessage("Username not available. Choose another one.");
        else
          setMessage("Something went wrong. Try again later");
          console.error(error.response.data.error);
      });
  };

  function sendLink(storedToken) {
    // Incoming: Token
    var obj1 = { token: storedToken};
    var js1 = JSON.stringify(obj1);
    var config1 = {
      method: "post",
      url: bp.buildPath("api/sendVerificationLink"),
      headers: {
        "Content-Type": "application/json",
      },
      data: js1,
    };
    axios(config1)
      .then(function (response) {
        var res = response.data;
        if (res.error) {
          setMessage("Something went wrong");
        } else {
          setMessage("Verification email sent. Please check your email to verify your account.");
        }
      })
      .catch(function (error) {
        console.error(error.response.data);
      });
  }


  return (

    <div id="SignupParentElement" className='wrapper'>

      <form onSubmit={doSignup}>

          <h1>Sign Up</h1>

          <div className='input-box'>
              <input type="text" id='loginFirst' placeholder='First Name' required value={loginFirst} onChange={(e) => setLoginFirst(e.target.value)}/>
          </div>

          <div className='input-box'>
              <input type="text" id='loginLast' placeholder='Last Name' required value={loginLast} onChange={(e) => setLoginLast(e.target.value)}/>
          </div>

          <div className='input-box'>
              <input type="text" id='loginEmail' placeholder='Email' required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
          </div>

          <div className='input-box'>
              <input type="text"  id='LoginUserName' placeholder='Username' required value={loginUserName} onChange={(e) => setLoginUserName(e.target.value)}/>
              <FaUserAlt className='icon' />
          </div>

          <div className='input-box'>
              <input type="password" id='LoginPassword' placeholder='Password' required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
              <FaUnlockAlt className='icon'/>                
          </div>

          <div className='input-box'>
              <input type="password" id='confirmPassword' placeholder='Confirm Password' required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              <FaUnlockAlt className='icon'/>                
          </div>
          {message && <p className="message error">{message}</p>}
          <button type= "submit" onClick={doSignup}>Sign Up</button>

          <div className='register-link'>
              <p>Already have an account? <a href= "/login">Login</a></p>
          </div>
                    
      </form>
    </div>
  );
}

export default SignupForm;
