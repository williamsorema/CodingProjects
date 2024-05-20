import React from 'react'; 
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode as decode } from "jwt-decode";
import axios from "axios";
import '../styles/Dashboard.css'
import BackgroundVideo from '../images/background.mp4';
import NavBar from '../components/NavBar';
import LoadingPage from './LoadingPage.js';

var bp = require("../components/Path.js");
var storage = require("../tokenStorage.js");

const course_ids = {
    1: 'c++',
    2: 'python',
    3: 'haskell',
};

const GetQuestionBank = async (CourseID) => {
    try {
        const response = await axios.get(bp.buildPath('api/course-question-bank/' + CourseID));
        const { questions, error } = response.data;
        console.log(bp.buildPath('api/course-question-bank/' + CourseID));
        console.log(response);


        if (error) {
            console.error('Error fetching data:', error);
            return []; 
        }
        
        return questions;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const GetUserCourseInfo = async (CourseID) => {
    var token = storage.retrieveToken();

    var config = {
        method: "get",
        url: bp.buildPath("api/user-courses"),
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    };

    try {
        // Attempt to access the api.
        const response = await axios(config);

        if (response.status === 401)
        {
          storage.storeToken("");
          window.location.href = "/login";
        }
        else if (response.status === 403)
        {
          window.location.href = "/CheckEmail";
        }
        else
        {
          console.error(response.data.error);
        }

        // extract the data 
        var res = response.data.courses;
        
        if (res.error) {
            //setMessage("Error getting courses");
        } 

        // If we find the language we clicked on, return its info.
        for (let i = 0; i < res.length; i++) {

            if (res[i].Language === CourseID) {
                console.log('hehehehahahahah');
                console.log(res[i]);
                return res[i];
            }
        }

    } catch (error) {
        console.log(error);
    }
};

const HandleClick = async (CourseID, navigate) => {
    try {
        const Questions = await GetQuestionBank(CourseID);
        const UserCourseInfo = await GetUserCourseInfo(CourseID);
        const UserTokenRaw = storage.retrieveToken();
        const UserTokenDecoded = decode(storage.retrieveToken(), { complete: true });
        navigate('/Questions', {state: {QuestionBank: Questions, UserInfo: UserCourseInfo, UserTokenRaw: UserTokenRaw, UserTokenDecoded: UserTokenDecoded}});
    } catch (error) {
        console.log('It Broke! >:(')
    }
};

function getCourseInfo(courses) {
    var courseInfoArray = [];

    return new Promise(async (resolve, reject) => {
        let promises = [];
        for (let i = 0; i < courses.length; i++) {
            var config = {
                method: "get",
                url: bp.buildPath("api/getCourse/" + courses[i].Language),
            };
            let promise = axios(config)
                .then(function (response) {
                    var res = response.data;
                    if (res.error) {
                        console.log("Error getting course info")
                    } else {
                        try { 
                            courseInfoArray.push(res.courseData);
                        } catch (e) {
                            console.log(e.toString());
                            return "";
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            promises.push(promise);
        }

        await Promise.all(promises);
        resolve(courseInfoArray);
    });
}

const getCourses = async (event) => {
    var token = storage.retrieveToken();
    var config = {
        method: "get",
        url: bp.buildPath("api/user-courses"),
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    };
    try {
        const response = await axios(config);
        var res = response.data;
        return res.courses;
    } catch (error) {
      if (error.response.status === 400)
      {
        window.location.href = "/login";
      }
      else if (error.response.status === 401)
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

      return null;
    }
};

function Dashboard({courses, courseInfo, isLoaded}) {
    
    // for passing information to other pages.
    const navigate = useNavigate();

    let info = [];
    for (let i = 0; i < courseInfo.length; i++) {
        let course = courseInfo[i];
        for (let id in course_ids) {
            if (course.Language === course_ids[id]) {
                info[id - 1] = course;
            }
        }
    }

    return (
        <>
        {isLoaded ?
        <div className='dashboard' id="dashboard">
                {info.map((c, index) => (
                    <button key={index} className= 'course' id= {c.Language} onClick={HandleClick.bind(null, c.Language, navigate)}>  
                        <img className= 'logo' src={c.LogoFile} />
                        <h1>{c.Description}</h1>
                        <div className='progressBar'> 
                            <div className= 'progressBar-inner' style={{width: courses[index].CurrentQuestion*10 + '%'}}></div>
                        </div>
                        <p>{courses[index].CurrentQuestion*10}% complete</p>
                        <p>{courses[index].NumCorrect} out of 10 correct</p>
                    </button>
                ))}
            </div>: <LoadingPage></LoadingPage>}
        </>
    );
}

const DashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [courseInfo, setCourseInfo] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let ignore = false;

        var res = getCourses();

        if (res) {
            res.then((res) => {
                if (ignore) return;
                if (res)
                {
                  setCourses(res);
                
                  getCourseInfo(res).then((courseInfoArray) => {
                      setCourseInfo(courseInfoArray);
                      setIsLoaded(true);
                  });
                }
            });
        }

        return () => { ignore = true; };
    }, []);

    return (
        <div>
             <video autoPlay muted loop className='BackgroundVideo'>
                <source src={BackgroundVideo} type='video/mp4' />
             </video>

             <div className = 'container'>
                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-center'>
                        <NavBar />
                    </div>
                </div>
                <div className='title'>
                    <h1>MY COURSES</h1>
                </div>
                <Dashboard courses={courses} courseInfo={courseInfo} isLoaded={isLoaded}/>
            </div>
        </div>
    );
};

export default DashboardPage;
