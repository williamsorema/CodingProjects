import React from "react";
import '../styles/LoginTitle.css'
import ShurikenX from '../images/FancyX.png'

function LoginTitle() {
    return (
        <div className="container">
            <div className="row">
                <div className="col d-flex align-items-center justify-content-end">
                    <h1 id="SyntaxTitleElement">SYNTA<img id="ShurikenImage" className="img-fluid" src={ShurikenX} /></h1>
                </div>
            </div>

            <div className="row">
                <div className="col d-flex align-items-center justify-content-end">
                    <h1 id="SyntaxSubTitleElement">SENSEI</h1>
                </div>
            </div>

        </div>
    );
};

export default LoginTitle;

