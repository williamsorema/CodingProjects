import React from 'react';

import '../styles/SignupPage.css'
import BackgroundVideo from '../images/background.mp4'
import NavBar from '../components/NavBar';
import SignupForm from '../components/SignupForm';
import { FaUserAlt } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";

const SignupPage = () => {
    return (
        <div id='SignupPage'>
            <video autoPlay muted loop className='BackgroundVideo'>
                <source src={BackgroundVideo} type='video/mp4' />
            </video>

            <div classname = 'container'>
                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <NavBar />
                    </div>
                </div>

                <div className='row'>
                    <SignupForm />
                </div>

            </div>

        </div>
    );
}

export default SignupPage;