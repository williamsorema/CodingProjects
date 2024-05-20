import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../styles/HomePage.css'
import BackgroundVideo from '../images/background.mp4'
import NavBar from '../components/NavBar';
import AnnoucementBox from '../components/AnnouncementBox';

const VerifiedPage = () => {

  let { result } = useParams();

  useEffect(() => {

    let textb = document.getElementById('announceBoxText');
    let buttonb = document.getElementById('ContinueButton');

    if (result === 'success')
    {
        textb.textContent = "Your account is now verified. Let's get started!";
        buttonb.onclick = () => {window.location.href = "/login";};
    }
    else if (result === 'expired')
    {
        textb.textContent = "The verification link has expired. Click 'continue' to send a new one";
        buttonb.onclick = () => {window.location.href = "/CheckEmail";};
    }
    else if (result === 'late')
    {
        textb.textContent = "Your account is verified already. Login to get started";
        buttonb.onclick = () => {window.location.href = "/login";};
    }
    else if (result === 'unavailable')
    {
        textb.textContent = "Something went wrong on our end. Try again later";
        buttonb.onclick = () => {window.location.href = "/";};
    }
    else
    {
        textb.textContent = "Hello! What are you doing?";
        buttonb.disabled = true;
    }
  });

  return (

    <div id='LoginPage' className='overflow-auto'>

      <video autoPlay muted loop className='BackgroundVideo'>
          <source src={BackgroundVideo} type='video/mp4' />
      </video>

      <div className='container'>

          <div className='row'>
              <div className='col d-flex align-items-center justify-content-center'>
                  <NavBar />
              </div>
          </div>

      </div>

      <div className='h-100 d-flex align-items-center justify-content-center'>
          <AnnoucementBox />
      </div>

    </div>
  );
};

export default VerifiedPage;
