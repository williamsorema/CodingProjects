import React from "react";
import {Link} from "react-router-dom"
import '../styles/LoginButton.css'

function LoginButton() {
    return(
        <div className="container">
            <div className="row">
                <div className="col d-flex justify-content-end align-items-center">
                    <Link to="/login">
                    <button type="button" id="LoginButtonElement" className="btn">I ALREADY HAVE AN ACCOUNT</button>
                    </Link>
                </div>
            </div>
        </div>




    );
};

export default LoginButton;