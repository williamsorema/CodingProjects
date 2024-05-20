import React from 'react';
import '../styles/NavBar.css'
import HomeButton from './HomeButton';
import GitHubButton from './GitHubButton';
import AboutUsButton from './AboutUsButton';
import { FaUserAlt } from "react-icons/fa";
import ShurikenX from '../images/FancyX.png'

function NavBar() {
    return (
        <div id='NavBarBackGround'>
            <nav className='navbar navbar-default bg-customNavBar'>
                <div className='container-fluid'>
                    <div className='d-flex align-items-center justify-content-between w-100'> {/* justify-content-between to distribute items along the main axis */}
                        <div>
                            <a href="/">
                                <img className='shuriken' src={ShurikenX}/>
                            </a>
                        </div>
                        <div className='d-flex flex-row align-items-end'> {/* Align items at the end in a column */}
                            <div className='home-underline-animation'>
                                <HomeButton />
                            </div>
                            <div className='github-underline-animation'>
                                <GitHubButton />
                            </div>
                            <div className='aboutus-underline-animation'>
                                <AboutUsButton />
                            </div>
                            <a href="/login">
                                <FaUserAlt className='profileIcon' />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>           
    );
};

export default NavBar;

