import React, {useState} from 'react';
import '../styles/QuestionCounters.css';



const QuestionCounters = ({QuestionsCorrect, QuestionsIncorrect}) => {
    return (

        <div className='container'>
            <div className='row'>

                <div className='col mt-2 mb-4'>

                    <div id='CorrectCounter'>
                        Correct: <br /> {QuestionsCorrect}
                    </div>

                </div>

                <div className='col mt-2 mb-4'>

                    <div id='IncorrectCounter'>
                        Incorrect: {QuestionsIncorrect}
                    </div>

                </div>

            </div>
        </div>

    );
};

export default QuestionCounters;