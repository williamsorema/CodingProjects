import React, {useState} from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({Progress}) => {

    return (
        <div className='container'>

            <div className='row'>
                <div className='col'>
                    <div id='ProgressContainer' className='progress mt-3 mb-3' style={{height: '25px'}}>
                        <div id='ProgressBar' className='progress-bar overflow-visible text-dark' style={{width: `${Progress}%`}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                            <span>{Progress}%</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProgressBar;
