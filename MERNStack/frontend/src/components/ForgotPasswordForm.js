import React, { useState } from 'react';
import axios from "axios";
import '../styles/LoginForm.css';
import BackgroundVideo from '../images/background.mp4';
import Sensei from '../images/sensei.GIF';
import bp from './Path.js';  // Consider using ES6 imports if possible

const ForgotPasswordForm = () => {
    const [recoveryData, setRecoveryData] = useState({username: '', email: ''});
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);

    const handleInputChange = (e) => {
        setRecoveryData({...recoveryData, [e.target.name]: e.target.value});
    };

    const handleRecoveryRequest = async (event) => {
        event.preventDefault();  // Prevents the default form submission behavior
        try {
            const response = await axios.post(bp.buildPath('api/requestPasswordReset'), recoveryData);
            if (response.data) {
                setSuccessMessage(true);
                setFailMessage(false);
            } else {
                throw new Error('Recovery failure');
            }
        } catch (error) {
            console.error('Error during recovery request:', error);
            setSuccessMessage(false);
            setFailMessage(true);
        }
    };

    return (
        <div className='container-fluid'>
            <video autoPlay muted loop className='BackgroundVideo'>
                <source src={BackgroundVideo} type='video/mp4' />
            </video>
            <div className='sensei'>
                <img src={Sensei} alt='Sensei character' className='sensei-img' />
            </div>
            <div className='wrapper'>
                <form onSubmit={handleRecoveryRequest}>
                    <h1 style={{ fontSize: '30px' }}>Let's find your account</h1>
                    <p>Please enter your username and email to search for your account.</p>
                    {successMessage && <p style={{ color: 'green' }} id='successMessage'>We found your account! Please check your email.</p>}
                    {failMessage && <p style={{ color: 'red' }} id='failMessage'>We couldn't find your account, please try again or sign up!</p>}
                    <div className='input-box'>
                        <input type='text' name='username' value={recoveryData.username} onChange={handleInputChange} placeholder='Username'/>
                    </div>
                    <div className='input-box'>
                        <input type='email' name='email' value={recoveryData.email} onChange={handleInputChange} placeholder='Email'/>
                    </div>
                    <button type='submit' id='RequestButton'>Reset your password</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
