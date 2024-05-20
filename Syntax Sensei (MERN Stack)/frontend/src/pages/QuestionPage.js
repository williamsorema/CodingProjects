import React, {useEffect, useState} from 'react';
import axios from "axios";
import '../styles/QuestionPage.css';
import BackGroundVideo from '../images/background.mp4'
import NavBar from '../components/QuestionPageNavBar.js';
import { useLocation } from 'react-router-dom';
import Sensei from '../images/sensei.GIF'

const QuestionPage = () => {

    // For api build path.
    const bp = require("../components/Path.js");
    const storage = require("../tokenStorage.js");

    // Contains data from the dashboard page.
    const location = useLocation(); 

    if (location.state == null)
    {
      window.location.href = "/landing";
    }
    else if (storage.retrieveToken() == "")
    {
      window.location.href = "/login";
    }

    // User info.
    const UserTokenRaw = location.state.UserTokenRaw;
    const UserCourseInfo = location.state.UserInfo;
    const QuestionBank = location.state.QuestionBank;
    const UsersName = location.state.UserTokenDecoded.firstName + ' ' + location.state.UserTokenDecoded.lastName;
    const LanguageName = UserCourseInfo.Language;
    const [CurrentQuestion, SetCurrentQuestion] = useState(UserCourseInfo.CurrentQuestion); 

    // Question and answer choices.
    let QuestionText = QuestionBank[CurrentQuestion].QuestionText;
    let CorrectAnswer = QuestionBank[CurrentQuestion].Answer; 
    let Incorrect1 = QuestionBank[CurrentQuestion].OtherChoices[0];
    let Incorrect2 = QuestionBank[CurrentQuestion].OtherChoices[1];
    let Incorrect3 = QuestionBank[CurrentQuestion].OtherChoices[2];
    
    // for answer choices

    const [Answer1, SetAnswer1] = useState(CorrectAnswer);
    const [Answer2, SetAnswer2] = useState(Incorrect1);
    const [Answer3, SetAnswer3] = useState(Incorrect2);
    const [Answer4, SetAnswer4] = useState(Incorrect3);

    // Progress bar control.
    const [Progress, SetProgress] = useState(UserCourseInfo.CurrentQuestion * 10); 

    // Sets the value for incorrect and correct question counters.
    const [QuestionsCorrect, SetQuestionsCorrect] = useState(UserCourseInfo.NumCorrect); 
    const [QuestionsIncorrect, SetQuestionsIncorrect] = useState((UserCourseInfo.CurrentQuestion - UserCourseInfo.NumCorrect)); 

    // For conditional display of buttons and messages.
    const [Tries, SetTries] = useState(0);
    const [Correct, SetCorrect] = useState(false);
    const [Incorrect, SetIncorrect] = useState(false);
    const [IncorrectTryAgain, SetTryAgain] = useState(false);
    const [NextButton, SetNextButton] = useState(false);
    const [RestartButton, SetRestartButton] = useState(false);

    // For applying conditional styles to answer choices.
    const [StyleButton1, SetStyleButton1] = useState();
    const [StyleButton2, SetStyleButton2] = useState();
    const [StyleButton3, SetStyleButton3] = useState();
    const [StyleButton4, SetStyleButton4] = useState();

    // For Toggling the hover animation for answer choices after they have been chosen.
    const [StyleHover1, SetStyleHover1] = useState('btn-custom mt-2 mb-2');
    const [StyleHover2, SetStyleHover2] = useState('btn-custom mt-2 mb-2');
    const [StyleHover3, SetStyleHover3] = useState('btn-custom mt-2 mb-2');
    const [StyleHover4, SetStyleHover4] = useState('btn-custom mt-2 mb-2');

    // For disabling already chosen buttons.
    const [DisableButton1, SetButtonDisable1] = useState(false);
    const [DisableButton2, SetButtonDisable2] = useState(false);
    const [DisableButton3, SetButtonDisable3] = useState(false);
    const [DisableButton4, SetButtonDisable4] = useState(false);

    // randomizes the correct answer location.
    const RandomizeAnswers = () => {

        // Get a random int
        const CorrectAnswerLocation = GetRandomInt();

        // apply the answer choices.
        switch (CorrectAnswerLocation) {

            case 1:
                SetAnswer1(CorrectAnswer);
                SetAnswer2(Incorrect1);
                SetAnswer3(Incorrect2);
                SetAnswer4(Incorrect3);
                break;
            case 2:
                SetAnswer1(Incorrect1);
                SetAnswer2(CorrectAnswer);
                SetAnswer3(Incorrect2);
                SetAnswer4(Incorrect3);
                break;
            case 3:
                SetAnswer1(Incorrect1);
                SetAnswer2(Incorrect2);
                SetAnswer3(CorrectAnswer);
                SetAnswer4(Incorrect3);
                break;
            case 4:
                SetAnswer1(Incorrect1);
                SetAnswer2(Incorrect2);
                SetAnswer3(Incorrect3);
                SetAnswer4(CorrectAnswer);
                break;
        }
    };
    
    // Generates a random integer.
    const GetRandomInt = () => {
        return Math.floor(Math.random() * (5 - 1) + 1);
    };

    // For updating the current question.
    useEffect(() => {
        try {
            // save progress to the database.
            SaveProgress(UserTokenRaw, LanguageName, CurrentQuestion, QuestionsCorrect);
            RandomizeAnswers();
        } catch (error) {
            console.log('Failed to save progress. :(');
        }
    }, [CurrentQuestion]);

    // Conditional styles for buttons.
    const CorrectStyle = {
        backgroundColor: 'green',
        borderColor: 'green',
        color: 'white',
    };

    const IncorrectStyle = {
        backgroundColor: 'red',
        color: 'white',
    };

    // Disables all buttons.
    const DisableAllButtons = () => {
        SetButtonDisable1(true);
        SetButtonDisable2(true);
        SetButtonDisable3(true);
        SetButtonDisable4(true);
    };

    // Enables all buttons.
    const EnableAllButtons = () => {
        SetButtonDisable1(false);
        SetButtonDisable2(false);
        SetButtonDisable3(false);
        SetButtonDisable4(false);
    };

    // Reveals the correct and incorrect choices when the correct answer is chosen.
    const RevealStyles = (ButtonChosen) => {

        switch (ButtonChosen) {
            case 1: 
                SetStyleButton1(CorrectStyle);
                SetStyleButton2(IncorrectStyle);
                SetStyleButton3(IncorrectStyle);
                SetStyleButton4(IncorrectStyle);
                break;
            case 2:
                SetStyleButton1(IncorrectStyle);
                SetStyleButton2(CorrectStyle);
                SetStyleButton3(IncorrectStyle);
                SetStyleButton4(IncorrectStyle);
                break;
            case 3:
                SetStyleButton1(IncorrectStyle);
                SetStyleButton2(IncorrectStyle);
                SetStyleButton3(CorrectStyle);
                SetStyleButton4(IncorrectStyle);
                break;
            case 4:
                SetStyleButton1(IncorrectStyle);
                SetStyleButton2(IncorrectStyle);
                SetStyleButton3(IncorrectStyle);
                SetStyleButton4(CorrectStyle);
                break;
        }

    };

    // Removes the hover animation from the selected button.
    const RemoveButtonHover = (ButtonChosen) => {
        
        switch (ButtonChosen) {
            case 1:
                SetStyleHover1('btn-custom-alt mt-2 mb-2');
                break;
            case 2:
                SetStyleHover2('btn-custom-alt mt-2 mb-2');
                break;
            case 3:
                SetStyleHover3('btn-custom-alt mt-2 mb-2');
                break;
            case 4:
                SetStyleHover4('btn-custom-alt mt-2 mb-2');
                break;
        }

    };

    // Removes the hover animation from all the answer choice buttons.
    const RemoveAllHover = () => {
        SetStyleHover1('btn-custom-alt mt-2 mb-2');
        SetStyleHover2('btn-custom-alt mt-2 mb-2');
        SetStyleHover3('btn-custom-alt mt-2 mb-2');
        SetStyleHover4('btn-custom-alt mt-2 mb-2');
    };

    // Applies the hover animation to all the answer choice buttons.
    const ResetAllHover = () => {
        SetStyleHover1('btn-custom mt-2 mb-2');
        SetStyleHover2('btn-custom mt-2 mb-2');
        SetStyleHover3('btn-custom mt-2 mb-2');
        SetStyleHover4('btn-custom mt-2 mb-2');
    };

    // Sets all buttons to the default style.
    const ResetButtonStyles = () => {
        SetStyleButton1();
        SetStyleButton2();
        SetStyleButton3();
        SetStyleButton4();
    };

    // Disables and applies incorrect style to incorrect answer choice.
    const DisableIncorrectChoice = (ButtonChosen) => {

        switch (ButtonChosen) {
            case 1: 
                SetButtonDisable1(true);
                SetStyleButton1(IncorrectStyle);
                break;
            case 2:
                SetButtonDisable2(true);
                SetStyleButton2(IncorrectStyle);
                break;
            case 3:
                SetButtonDisable3(true);
                SetStyleButton3(IncorrectStyle);
                break;
            case 4:
                SetButtonDisable4(true);
                SetStyleButton4(IncorrectStyle);
                break;
        }

    };

    // Increments progress by 10%.
    const UpdateProgress = () => {
        SetProgress(Progress + 10);
    };

    // Increments questions answered correctly by 1 if user is on first try.
    const UpdateCorrectQuestions = () => {
        if (Tries == 0) {
            SetQuestionsCorrect(QuestionsCorrect + 1);
        }  
    };

    // Increments questions answered incorrectly by 1 if user is on first try.
    const UpdateIncorrectQuestions = () => {
        if (Tries == 0) {
            SetQuestionsIncorrect(QuestionsIncorrect + 1);
        }
    };

    // Restarts the current lesson when all questions have been answered.                      
    const RestartLesson = (UserTokenRaw, LanguageName, CurrentQuestion, NumberCorrect) => {
        SetProgress(0);
        SetQuestionsCorrect(0);
        SetQuestionsIncorrect(0);
        SetCurrentQuestion(0);
        SetTries(0);
        SetRestartButton(false);
        EnableAllButtons();
        ResetButtonStyles();


        // Save progress to the database.
        try {
            SaveProgress(UserTokenRaw, LanguageName, CurrentQuestion, NumberCorrect);
        } catch (error) {
            console.log('it broke in restart');
            console.log(error);
        }
    };

    // Handle conditional messages when the correct answer is chosen.
    const HandleCorrectAnswerChoice = (ButtonChosen, QuestionBank) => {

        // Disable all buttons
        DisableAllButtons();

        // Apply the correct styles to all buttons revealing incorrect answers.          
        RevealStyles(ButtonChosen);

        // Remove the hover animation from all answer choices.
        RemoveAllHover();

        // Remove other messages if present.
        SetTryAgain(false);

        // If at the end of the lesson.
        if (CurrentQuestion == (QuestionBank.length - 1)) {
            SetRestartButton(true);
            UpdateProgress();
        }

        else {
            SetCorrect(true);
            SetNextButton(true);
            SetTries(0);
        }

    };

    // Handle conditional messages when an incorrect answer is chosen.
    const HandleIncorrectAnswerChoice = (ButtonChosen, QuestionBank) => {

        // Disable the incorrect button and remove the hover animation.
        DisableIncorrectChoice(ButtonChosen);

        // Remove the hover animation from the chosen answer.
        RemoveButtonHover(ButtonChosen);
                
        // Disaplay the try again message and increment the try count.
        SetTryAgain(true);
        SetTries(Tries + 1);

        // Check if the user is out of tries for this question.
        if (Tries === 2) {

            DisableAllButtons();
            RemoveAllHover();
            
            // If all questions have been answered.
            if (CurrentQuestion == (QuestionBank.length - 1)) {
                SetRestartButton(true);
                UpdateProgress();
            }

            else {
                SetTryAgain(false);
                SetIncorrect(true);
                SetNextButton(true);
                SetTries(0);
            }
        }

    };

    // Checks the answer and displays the proper messages.               
    const CheckAnswer = (ButtonChosen, CorrectAnswer, ChosenAnswer, QuestionBank) => {

        console.log(ChosenAnswer);
        console.log(CorrectAnswer);

        // If the correct answer was chosen.
        if (ChosenAnswer === CorrectAnswer) {

            // Increment answers answered correctly.
            UpdateCorrectQuestions();
            
            // Handle conditional messages.
            HandleCorrectAnswerChoice(ButtonChosen, QuestionBank);
            
        }

        else {

            // Update the numbre of incorrectly answered questions.
            UpdateIncorrectQuestions();
            
            // Handle conditional messages.
            HandleIncorrectAnswerChoice(ButtonChosen, QuestionBank);
        }

    };

    // Moves to the next question and removes messages.                                            
    const NextQuestion = async (UserTokenRaw, LanguageName, CurrentQuestion, NumberCorrect) => {

        console.log('Current question before inc: ', CurrentQuestion);

        // Increment the current question.
        SetCurrentQuestion(CurrentQuestion + 1);

        EnableAllButtons();

        // Reset all styles.
        SetStyleButton1();
        SetStyleButton2();
        SetStyleButton3();
        SetStyleButton4();

        // Apply the hover animation to all the answer choices.
        ResetAllHover();

        // Clear messages.
        SetCorrect(false);
        SetIncorrect(false);
        SetTryAgain(false);

        // Remove the next question button
        SetNextButton(false);

        // Update progress bar.
        UpdateProgress();


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
          if (error.response.status === 401)
          {
            storage.storeToken("");
            window.location.href = "/login";
          }
          else if (error.response.status === 403)
          {
            window.location.href = "/CheckEmail";
          }
          else
          {
            console.error(error.response.data.error);
          }
        }

    };

    return(

        <div id='QuestionPageElement'>

            <video autoPlay muted loop className='BackGroundVideo'>
                <source src={BackGroundVideo} type='video/mp4' />
            </video>

            <div className='container-fluid'>
                
                <div className='row'>

                    <div className='col-3 d-none d-xl-inline'>
                        <NavBar Progress={Progress} QuestionsCorrect={QuestionsCorrect} QuestionsIncorrect={QuestionsIncorrect} UsersName={UsersName} LanguageName={LanguageName} CurrentQuestion={CurrentQuestion} UserTokenRaw={UserTokenRaw}/>
                    </div>

                    <div className='col-xl-8'>

                        <div id='MessageRow'> 

                            <div className='col d-flex align-items-center justify-content-center'>
                                <span className='placeholder'></span>
                                {Correct && <h2 className='bubble' id='ResultMessageCorrect'>Correct!</h2>}
                                {Incorrect && <h2 className='bubble' id='ResultMessageIncorrect'>The correct answer was...</h2>}
                                {IncorrectTryAgain && <h2 className='bubble' id='ResultMessageTryAgain'>Incorrect, try again.</h2>}
                            </div>
                        </div>
                        <div className='sensei'>

                   	       <img src={Sensei} />

                	    </div>
                        <div id='QuestionRow' className='row m-0 p-3' >
                            <div className='col d-flex align-items-center justify-content-center'>
                                <h1 id='QuestionText'>{QuestionText}</h1>
                            </div>
                        </div>                        

                        <div id='ButtonRow' className='row m-5 pt-2 pb-2'>
                            <div className='col d-flex align-items-center justify-content-center'>
                                <div className='answers'>
                                    <button id='AnswerOne' className={StyleHover1} style={StyleButton1} disabled={DisableButton1} onClick={() => CheckAnswer(1, CorrectAnswer, Answer1, QuestionBank)}>{Answer1}</button>
                                    <button id='AnswerTwo' className={StyleHover2} style={StyleButton2} disabled={DisableButton2} onClick={() => CheckAnswer(2, CorrectAnswer, Answer2, QuestionBank)}>{Answer2}</button>
                                    <button id='AnswerThree' className={StyleHover3} style={StyleButton3} disabled={DisableButton3} onClick={() => CheckAnswer(3, CorrectAnswer, Answer3, QuestionBank)}>{Answer3}</button>
                                    <button id='AnswerFour' className={StyleHover4} style={StyleButton4} disabled={DisableButton4} onClick={() => CheckAnswer(4, CorrectAnswer, Answer4, QuestionBank)}>{Answer4}</button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col d-flex align-items-center justify-content-center'>
                                {NextButton && <button id='NextQestionButton' className='btn-custom btnColor' onClick={() => NextQuestion(UserTokenRaw, LanguageName, CurrentQuestion, QuestionsCorrect)}>Next Question</button>}
                                {RestartButton && <button id='RestartButton' className='btn-custom btnColor' onClick={() => RestartLesson(UserTokenRaw, LanguageName, 0, 0)}>Restart</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionPage;

