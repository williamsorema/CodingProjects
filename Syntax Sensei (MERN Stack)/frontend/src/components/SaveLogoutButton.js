import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SaveLogoutButton.css';
import axios from "axios";

const SaveLogoutButton = (QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw) => {

    // for api connection
    var bp = require("./Path.js");

    const storage = require('../tokenStorage');

    // for navigating to other pages.
    const navigate = useNavigate();

    const Logout = async (QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw) => {
        SaveProgress(UserTokenRaw, LanguageName, CurrentQuestion, QuestionsCorrect);
        storage.storeToken("");
        navigate('/');
    };

    // Updates the users progress to the database.
    const SaveProgress = async (UserTokenRaw, LanguageName, CurrentQuestion, NumberCorrect) => {

        const data = {
            token: UserTokenRaw,
            userCourses: LanguageName,
            currentQuestion: CurrentQuestion,
            numCorrect: NumberCorrect
        };

        try {

            const response = await axios.post(bp.buildPath('api/updateProgress'), data);

        } catch (error) {
            console.log(error);
            console.log('broke in dashboardbutton->saveprogress.')
            
        }

    };

    return (

        <div>
            <button type='button' id='SaveLogoutButton' className='btn-custom w-100 overflow-hidden' onClick={() => Logout(QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw)}>Logout</button>
        </div>

    );
};

export default SaveLogoutButton;
