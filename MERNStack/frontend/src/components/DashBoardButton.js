import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashBoardButton.css';
import axios from "axios";

const DashBoardButton = (QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw) => {

    // for api connection
    var bp = require("./Path.js");

    // for navigating to other pages.
    const navigate = useNavigate();

    const ToDashBoard = async (QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw) => {
        SaveProgress(UserTokenRaw, LanguageName, CurrentQuestion, QuestionsCorrect);
        navigate('/landing');
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
            <button type='button' id='DashBoardButton' className='w-100 mb-3' onClick={() => ToDashBoard(QuestionsCorrect, LanguageName, CurrentQuestion, UserTokenRaw)}>Return to Dashboard</button>
        </div>

    );
};

export default DashBoardButton;
