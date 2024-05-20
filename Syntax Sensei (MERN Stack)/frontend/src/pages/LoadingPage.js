import React from "react";
import ShurikenX from '../images/FancyX.png'
import '../styles/Loading.css'
import BackgroundVideo from '../images/background.mp4';


function LoadingPage() {
    return (
        <div>
            <div className="load">
                <img id="X" src={ShurikenX} />
                <div className='loadingBar'> 
                    <div className= 'loadingBar-inner'></div>
                </div>
                <div className='dynamicText'>
                    <p>Loading...</p>
                </div>
            </div>

        </div>
    );
};

export default LoadingPage;