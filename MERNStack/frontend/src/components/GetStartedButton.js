import React from "react";
import {Link} from "react-router-dom"
import '../styles/GetStartedButton.css'

function GetStartedButton() {
    return (
        <div className="container">
            <div className="row">
                <div className="col d-flex justify-content-end align-items-center">
                    <Link to="/signup">
                    <button type="button" id="GetStartedButtonElement" className="btn">GET STARTED</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GetStartedButton;