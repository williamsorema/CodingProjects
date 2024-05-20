import React from "react";
import Sensei from '../images/SenseiCropped.png'
import '../styles/SenseiImage.css'


function SenseiImage() {
    return (
        <div className="container-fluid">
            <div className="row"> 
                <img id="SenseiImageElement" className="img-fluid" src={Sensei} />
            </div>
        </div>
    );
};

export default SenseiImage;