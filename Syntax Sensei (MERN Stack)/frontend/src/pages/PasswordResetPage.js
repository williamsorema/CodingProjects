import React from 'react'; 
import '../styles/Login.css'
import BackgroundVideo from '../images/background.mp4';
import NavBar from '../components/NavBar';
import ResetPasswordForm from '../components/ResetPasswordForm';


const PasswordResetPage = () => {
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
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
};


export default PasswordResetPage;