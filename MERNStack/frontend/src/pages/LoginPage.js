import React from 'react'; 
import '../styles/Login.css'
import { FaUserAlt } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import BackgroundVideo from '../images/background.mp4';
import Sensei from '../images/sensei.GIF'
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {

    return (
        <div>
             <video autoPlay muted loop className='BackgroundVideo'>
                <source src={BackgroundVideo} type='video/mp4' />
             </video>

             <div className = 'container'>
                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <NavBar />
                    </div>
                </div>
                <div className='sensei'>
                    <img className="sensei" src={Sensei} />
                </div>
                
                <div className='row'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};


export default LoginPage;
