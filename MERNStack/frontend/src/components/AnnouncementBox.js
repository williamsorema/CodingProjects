import React from 'react';

import '../styles/AnnouncementBox.css';

function AnnouncementBox() {

  return (

    <div id="AnnouncementBoxParent" className='wrapper'>
        <div class="row d-flex align-items-center justify-content-center">
            <h1 id="announceBoxText"></h1>
            <button type="button" id="ContinueButton" className="btn">Continue</button>
        </div>
    </div>
  );
}

export default AnnouncementBox;