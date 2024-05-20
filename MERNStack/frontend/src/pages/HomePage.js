import React, { useState, useEffect } from 'react';

import '../styles/HomePage.css'
import BackgroundVideo from '../images/background.mp4'
import SenseiMobile from '../images/senseimobile.PNG';
import Loading from '../pages/LoadingPage';

import NavBar from '../components/NavBar';
import LoginTitle from '../components/LoginTitle';
import LoginSubTitle from '../components/LoginSubTitle';
import SenseiImage from '../components/SenseiImage'
import GetStartedButton from '../components/GetStartedButton';
import LoginButton from '../components/LoginButton';

const HomePage = () => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data with a timeout
        setTimeout(() => {
        setLoading(false);
    }, 2000); // 2 seconds loading
    }, []);

    if (isLoading) {
    	return <Loading/>; 
    }
    
    return (

        <div id='LoginPage' className='overflow-auto'>

            <video autoPlay muted loop className='BackgroundVideo'>
                <source src={BackgroundVideo} type='video/mp4' />
            </video>

            <div className='container'>
                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <NavBar />
                    </div>
                </div>

                <div className='parent'>
                    <div className='top'>
                         <img id='mobileSensei' src={SenseiMobile} alt="Syntax Sensei" />
                    </div>
                    <div className='mobile'>
                         <div className='row'>
                            <LoginTitle />
                        </div>
                        <div className='row'>
                            <LoginSubTitle />
                        </div>
                        <div className='row d-none d-xl-block'> 
                            <SenseiImage />
                        </div>
                        <div className='row'>
                            <GetStartedButton />
                        </div>

                        <div className='row'>
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
