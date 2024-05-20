import React from 'react';

import '../styles/QuestionPageNavBar.css';

import DashBoardButton from './DashBoardButton';
import HintButton from './HintButton';
import SaveLogoutButton from './SaveLogoutButton';
import ProgressBar from './ProgressBar';
import QuestionCounters from './QuestionCounters';

const QuestionPageNavBar = ({Progress, QuestionsCorrect, QuestionsIncorrect, UsersName, LanguageName, CurrentQuestion, UserTokenRaw}) => {
    return (

        <div id='QuestionPageNavElement'>

            <div className='container-fluid'>
                <DashBoardButton QuestionsCorrect={QuestionsCorrect} LanguageName={LanguageName} CurrentQuestion={CurrentQuestion} UserTokenRaw={UserTokenRaw}/>
                <div className='row'>

                    <div id='UsersName' className='col d-flex align-items-center justify-content-center'>
                        <h1 id='Name' className='d-none d-xl-inline text-wrap'>{UsersName}</h1>
                    </div>
                </div>

                <div className='row' >
                    <div className='col' >
                        <ProgressBar Progress={Progress}/>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <QuestionCounters QuestionsCorrect={QuestionsCorrect} QuestionsIncorrect={QuestionsIncorrect} />
                    </div>
                </div>
                
                <div className='d-grid gap-2 mx-auto'>
                    <SaveLogoutButton QuestionsCorrect={QuestionsCorrect} LanguageName={LanguageName} CurrentQuestion={CurrentQuestion} UserTokenRaw={UserTokenRaw}/>
                </div>
            </div>
        </div>
    );
};

export default QuestionPageNavBar;





