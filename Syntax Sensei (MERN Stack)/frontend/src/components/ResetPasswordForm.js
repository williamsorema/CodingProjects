import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode as decode } from "jwt-decode";
import axios from "axios";
import { FaUnlockAlt } from "react-icons/fa";


import '../styles/SignupForm.css';

function ResetPasswordForm() {

  const bp = require("./Path.js");
  const storage = require("../tokenStorage.js");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { token } = useParams();


  const validateForm = () => {  
     // check for empty fields
    if (Password == "") {
      setMessage("Please enter a valid password");
      return false;
    }    
    else if (ConfirmPassword == "") {
      setMessage("Please confirm your password");
      return false;
    }
    // password complexity validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(Password)) {
      setMessage("Password must contain letters, at least one number, one special character, and at least 8 characters total.");
      return false;
    }
    // check if passwords match
    if (Password !== ConfirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }
    setMessage(null);
    return true;
  };

  const doPasswordChange = async (event) => {
    event.preventDefault();

    if (validateForm())
    {
      let obj = { token: token, password: Password };
      let js = JSON.stringify(obj);
      let config = {
        method: "post",
        url: bp.buildPath("api/resetPassword"),
        headers: {
          "Content-Type": "application/json",
        },
        data: js,
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200)
          {
            let res = response.data;
            storage.storeToken(res.token);
            let uddecoded = decode(storage.retrieveToken(), { complete: true });
            try
            {
              let { userId, firstName, lastName, verified } = uddecoded;
              let user = { firstName: firstName, lastName: lastName, id: userId, verified: verified };
              localStorage.setItem("user_data", JSON.stringify(user));
              if (verified)
              {
                window.location.href = "/login";
              }
              else
              {
                window.location.href = "/CheckEmail";
              }
            }
            catch (e)
            {
              console.error(e.message);
            }
          }
          else
          {
            console.error(response.data.error);
          }
        })
        .catch(function (error)
        {
          if (error.response.status === 401)
          {
            setMessage('The password reset link has expired');
          }
          else
          {
            setMessage('Something went wrong. Try again later');
            console.error(error.response.data.error);
          }
        });
    }
  };


  return (
    
    <div id="SignupParentElement" className='wrapper'>

      <form onSubmit={doPasswordChange}>

          <h1>Enter a new password</h1>

          <div className='input-box'>
              <input type="password" id='PasswordInput' placeholder='Password' required value={Password} onChange={(e) => setPassword(e.target.value)}/>
              <FaUnlockAlt className='icon'/>
          </div>

          <div className='input-box'>
              <input type="password" id='ConfirmPasswordInput' placeholder='Confirm Password' required value={ConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              <FaUnlockAlt className='icon'/>
          </div>

          {message && <p className="message error">{message}</p>}
          
          <button type= "submit">Confirm</button>
                    
      </form>
    </div>
    
  );
}

export default ResetPasswordForm;
