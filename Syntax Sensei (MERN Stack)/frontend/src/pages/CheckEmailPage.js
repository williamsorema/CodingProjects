import React, { useState } from "react";

import NavBar from '../components/NavBar';
import '../styles/LoginForm.css'
import Sensei from '../images/sensei.GIF'
import BackgroundVideo from '../images/background.mp4'

const CheckEmailPage = () => {

    return (
        <div>
            <video autoPlay muted loop className='BackgroundVideo'>
              <source src={BackgroundVideo} type='video/mp4' />
            </video>
             <div classname = 'container'>
                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <NavBar />
                    </div>
                </div>
                <div className='sensei'>
                    <img className="sensei" src={Sensei} />
                </div>

            <div className='wrapper' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1>Almost there!</h1>
                    <div className='register-link'>
                      <p>Check your email for the link we sent you, then</p> 
		      <a style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#fa304c'}} href= "/login">Login</a>
                    </div>
		</div>
            </div>
        </div>
    );
};


export default CheckEmailPage;
