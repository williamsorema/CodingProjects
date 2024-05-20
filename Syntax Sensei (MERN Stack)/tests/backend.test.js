/*
    Defines tests for the backend
*/

const supertest = require('supertest');
const Path = require('../frontend/src/components/Path');

const ObjectId = require('mongodb').ObjectId;

const server = require('../server');
const JWT = require('../createJWT');


beforeAll(() => {

    // Nothing to setup
    return;
});
  
afterAll(() => {

    // Shutdown everything
    server.listener.close();
    server.mongo.close();
});


// JWT tests
//
describe('JWT', () => {

    test('Access token', async() => {

        const validateToken = function (tok) {

            let valid = JWT.isValidAccessToken(tok);

            expect(valid).toBe(true);

            let payload = JWT.getPayload(tok);

            expect(payload.userId).toEqual(id);
            expect(payload.firstName).toEqual(fn);
            expect(payload.lastName).toEqual(ln);
            expect(payload.verified).toBe(false);
        }

        const id = '6603323d82133af020264b04';
        const fn = 'Guest';
        const ln = 'User';
        const ver = false;

        const token = JWT.createAccessToken(fn, ln, ver, id).accessToken;

        validateToken(token);

        const newToken = JWT.refresh(token).accessToken;

        validateToken(newToken);
    });

    test('Verification token', async() => {

        const id = '6603323d82133af020264b04';

        const token = JWT.createVerificationToken(id);

        let valid = JWT.isValidVerificationToken(token);

        expect(valid).toBe(true);

        let payload = JWT.getPayload(token);

        expect(payload.userId).toEqual(id);
    });
});


// Login endpoint tests
//
describe('Login', () => {

    test('Valid credentials', async() => {

        let validUser = {"login": "guest", "password": ""};
        const response = await superPost('/login', validUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
        expect(response.body.token).not.toBe("");
    });

    test('Blank credentials', async() => {

        let blankUser = {"login": "", "password": ""};
        const response = await superPost('/login', blankUser);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Undefined credentials', async() => {

        const response = await superPost('/login', {});

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Invalid credentials', async() => {

        let invalidUser = {"login": "_njbv2aejh4wrjkgsrnaj3", "password": "lfnjkg34gp9#$jrbw4f"};
        const response = await superPost('/login', invalidUser);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });
});


// Signup endpoint tests
//
describe('Signup', () => {

    test('Blank username', async() => {

        let blankUsername = {"FirstName": "Delete", "LastName": "if in database", "Email": "", "Username": "", "Password": "password"};

        const response = await superPost('/signup', blankUsername);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Undefined username', async() => {

        let undefinedUsername = {"FirstName": "Guest", "LastName": "User", "Email": "", "Password": ""};

        const response = await superPost('/signup', undefinedUsername);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Existing username', async() => {

        let existUsername = {"FirstName": "Guest", "LastName": "User", "Email": "", "Username": "guest", "Password": ""};

        const response = await superPost('/signup', existUsername);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Unique username', async() => {

        let newUsername = {"FirstName": "Delete", "LastName": "if in database", "Email": "", "Username": "_prltgnwkcedbsyertt", "Password": ""};

        const response = await superPost('/signup', newUsername);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.error).toBe("");

        // Delete the new user so this test works more than once!
        //
        try
        {
            const Users = server.mongo.db("MainDatabase").collection("Users");
            const UserCourses = server.mongo.db("MainDatabase").collection("UserCourses");

            let user = await Users.findOne({ Username: "_prltgnwkcedbsyertt" });

            await Users.deleteOne({ Username: "_prltgnwkcedbsyertt" });

            await UserCourses.deleteMany({ UserId: user._id.toString() });
        }
        catch (e)
        {
            console.warn("Signup -> Unique username: Newly created user not removed.");
        }
    });
});


// Send Verification Link endpoint tests
//
describe('SendVerificationLink', () => {

    test('User not verified', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "6603323d82133af020264b04").accessToken;

        expect(JWT.isValidAccessToken(token)).toBe(true);

        const response = await superPost('/sendVerificationLink', {"token": token});

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
    });


    test('User verified / Token not verified', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "65f0d3f92c22df65ba6ea6d2").accessToken;

        const response = await superPost('/sendVerificationLink', {"token": token});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).not.toBe("");
    });

    test('User verified / Token verified', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "65f0d3f92c22df65ba6ea6d2").accessToken;

        const response = await superPost('/sendVerificationLink', {"token": token});

        expect(response.statusCode).toBe(400);
        expect(response.body.error).not.toBe("");
    });

    test('Blank token', async() => {

        let blankToken = {"token": ""};

        const response = await superPost('/sendVerificationLink', blankToken);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).not.toBe("");
    });

    test('Undefined token', async() => {

        let noToken = {};

        const response = await superPost('/sendVerificationLink', noToken);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).not.toBe("");
    });

    test('Expired token', async() => {

        let expToken = {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAzMzIzZDgyMTMzYWYwMjAyNjRiMDQiLCJmaXJzdE5hbWUiOiJHdWVzdCIsImxhc3ROYW1lIjoiVXNlciIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzExNTcwNDM4LCJleHAiOjE3MTE1NzA0OTh9.4NfLt10jEIv4PJMkufZUoX5-clC_Dx2GFOTYB77fchI"};

        const response = await superPost('/sendVerificationLink', expToken);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).not.toBe("");
    });
});


// Request Password Reset tests
//
describe('requestPasswordReset', () => {

    test('Correct username & email', async() => {

        let validReq = {username: 'guest', email: 'heather.leffler@ethereal.email'};

        const response = await superPost('/requestPasswordReset', validReq);

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
    });

    test('Invalid username', async() => {

        let invalidReq = {username: '_vairhbgtlndfbfsfgsgabgdoih', email: 'fake@fakemail.com'};

        const response = await superPost('/requestPasswordReset', invalidReq);

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
    });

    test("Email does not match user's", async() => {

        let validReq = {username: 'guest', email: 'fake@fakemail.com'};

        const response = await superPost('/requestPasswordReset', validReq);

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
    });

    test('Undefined username & email', async() => {

        const response = await superPost('/requestPasswordReset', {});

        expect(response.statusCode).toBe(400);
        expect(response.body.error).not.toBe("");
    });
});


// Change Password tests
//
describe('changePassword', () => {

    test('Valid token / verified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "660a25f3527fb4d540a5f2b2").accessToken;

        let validReq = {token: token, oldPassword: process.env.TEST_USER_PASSWORD, newPassword: process.env.TEST_USER_PASSWORD};

        const response = await superPost('/changePassword', validReq);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe("");
        expect(response.body.error).toBe("");
    });

    test('Valid token / verified user / incorrect password', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "660a25f3527fb4d540a5f2b2").accessToken;

        let validReq = {token: token, oldPassword: "blah", newPassword: process.env.TEST_USER_PASSWORD};

        const response = await superPost('/changePassword', validReq);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Valid token / unverified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "660a25f3527fb4d540a5f2b2").accessToken;

        let invalidReq = {token: token, oldPassword: "test", newPassword: "test"};

        const response = await superPost('/changePassword', invalidReq);

        expect(response.statusCode).toBe(403);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Valid token / missing passwords', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "660a25f3527fb4d540a5f2b2").accessToken;

        let invalidReq = {token: token};

        const response = await superPost('/changePassword', invalidReq);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Expired token', async() => {

        let expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAzMzIzZDgyMTMzYWYwMjAyNjRiMDQiLCJmaXJzdE5hbWUiOiJHdWVzdCIsImxhc3ROYW1lIjoiVXNlciIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzExNTcwNDM4LCJleHAiOjE3MTE1NzA0OTh9.4NfLt10jEIv4PJMkufZUoX5-clC_Dx2GFOTYB77fchI";

        let invalidReq = {token: expToken, oldPassword: "test", newPassword: "test"};

        const response = await superPost('/changePassword', invalidReq);

        expect(response.statusCode).toBe(401);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });
});


// Change Password tests
//
describe('resetPassword', () => {

  test('Valid token', async() => {

      let token = JWT.createVerificationToken("660a25f3527fb4d540a5f2b2");

      let validReq = {token: token, password: process.env.TEST_USER_PASSWORD};

      const response = await superPost('/resetPassword', validReq);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).not.toBe(null);
      expect(response.body.error).toBe("");
  });

  test('Missing password', async() => {

    let token = JWT.createVerificationToken("660a25f3527fb4d540a5f2b2");

    let invalidReq = {token: token};

    const response = await superPost('/resetPassword', invalidReq);

    expect(response.statusCode).toBe(400);
    expect(response.body.token).toBe(null);
    expect(response.body.error).not.toBe("");
  });

  test('Expired token', async() => {

      let expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWU1NDliNDk0NzhkMTY5MjQxNDZmYTgiLCJpYXQiOjE3MTI4MDM2MjEsImV4cCI6MTcxMjgwNDgyMX0.MhSVOucEhB_B02QoJ_GZPA7JWnJrzqFAY1YO49PKcTs";

      let invalidReq = {token: expToken, password: process.env.TEST_USER_PASSWORD};

      const response = await superPost('/resetPassword', invalidReq);

      expect(response.statusCode).toBe(401);
      expect(response.body.token).toBe(null);
      expect(response.body.error).not.toBe("");
  });

  test('Missing token', async() => {

      let invalidReq = { password: "test"};

      const response = await superPost('/resetPassword', invalidReq);

      expect(response.statusCode).toBe(401);
      expect(response.body.token).toBe(null);
      expect(response.body.error).not.toBe("");
  });
});


// Get User Courses tests
//
describe('user-courses', () => {

    test('Valid token / verified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "65e549b49478d16924146fa8").accessToken;

        const response = await superGet('/user-courses', token);

        expect(response.statusCode).toBe(200);
        expect(response.body.courses).not.toStrictEqual([]);
        expect(response.body.error).toBe("");
    });

    test('Valid token / unverified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "660a25f3527fb4d540a5f2b2").accessToken;

        const response = await superGet('/user-courses', token);

        expect(response.statusCode).toBe(403);
        expect(response.body.courses).toStrictEqual([]);
        expect(response.body.error).not.toBe("");
    });

    test('Expired token', async() => {

        let expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAzMzIzZDgyMTMzYWYwMjAyNjRiMDQiLCJmaXJzdE5hbWUiOiJHdWVzdCIsImxhc3ROYW1lIjoiVXNlciIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzExNTcwNDM4LCJleHAiOjE3MTE1NzA0OTh9.4NfLt10jEIv4PJMkufZUoX5-clC_Dx2GFOTYB77fchI";

        const response = await superGet('/user-courses', expToken);

        expect(response.statusCode).toBe(401);
        expect(response.body.courses).toStrictEqual([]);;
        expect(response.body.error).not.toBe("");
    });

    test('Missing token', async() => {

        const response = await superGet('/user-courses', ' ');

        expect(response.statusCode).toBe(400);
        expect(response.body.courses).toStrictEqual([]);
        expect(response.body.error).not.toBe("");
    });

    test('Missing Authorization header', async() => {

        const response = await superGet('api/user-courses', null);

        expect(response.statusCode).toBe(400);
        expect(response.body.courses).toStrictEqual([]);
        expect(response.body.error).not.toBe("");
    });
});


// Update Progress tests
//
describe('updateProgress', () => {

    test('Valid token / verified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "65e549b49478d16924146fa8").accessToken;

        let req = { token: token, userCourses: 'c++', currentQuestion: 0, numCorrect: 0 };

        const response = await superPost('/updateProgress', req);

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("");
    });

    test('Valid token / unverified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "65e549b49478d16924146fa8").accessToken;

        let req = { token: token, userCourses: 'c++', currentQuestion: 0, numCorrect: 0 };

        const response = await superPost('/updateProgress', req);

        expect(response.statusCode).toBe(403);
        expect(response.body.error).not.toBe("");
    });

    test('Expired token', async() => {

        let expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAzMzIzZDgyMTMzYWYwMjAyNjRiMDQiLCJmaXJzdE5hbWUiOiJHdWVzdCIsImxhc3ROYW1lIjoiVXNlciIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzExNTcwNDM4LCJleHAiOjE3MTE1NzA0OTh9.4NfLt10jEIv4PJMkufZUoX5-clC_Dx2GFOTYB77fchI";

        let req = { token: expToken, userCourses: 'c++', currentQuestion: 0, numCorrect: 0 };

        const response = await superPost('/updateProgress', req);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).not.toBe("");
    });

    test('Missing token', async() => {

        let req = { userCourses: 'c++', currentQuestion: 0, numCorrect: 0 };

        const response = await superPost('/updateProgress', req);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).not.toBe("");
    });

    test('Missing course', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "65e549b49478d16924146fa8").accessToken;

        let req = { token: token, currentQuestion: 0, numCorrect: 0 };

        const response = await superPost('/updateProgress', req);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).not.toBe("");
    });
});


// Get Course tests
//
describe('getCourse', () => {

    test('Valid course', async() => {

        const response = await superGet('api/getCourse/c++', null);

        expect(response.statusCode).toBe(200);
        expect(response.body.courseData).not.toBe(null);
        expect(response.body.error).toBe("");
    });
    
    test('Invalid course', async() => {

        const response = await superGet('api/getCourse/language', null);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.courseData).toBe(null);
        expect(response.body.error).not.toBe("");
    });
});


// Get Question Bank tests
//
describe('course-question-bank', () => {

    test('Valid course', async() => {

        const response = await superGet('api/course-question-bank/c++', null);

        expect(response.statusCode).toBe(200);
        expect(response.body.questions).not.toStrictEqual([]);
        expect(response.body.error).toBe("");
    });
    
    test('Invalid course', async() => {

        const response = await superGet('api/course-question-bank/language', null);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.questions).toStrictEqual([]);
        expect(response.body.error).not.toBe("");
    });
});


// Process email verification link endpoint tests
//
describe('Verifification Link Processing', () => {

  test('Valid link / Unverified user', async() => {

      let token = JWT.createVerificationToken("6603323d82133af020264b04");

      let response = await superGet(`verify/${token}`);

      // Unverify the user so this test works more than once!
      //
      try
      {
          const users = server.mongo.db("MainDatabase").collection("Users");
          await users.updateOne({"_id": ObjectId.createFromHexString("6603323d82133af020264b04")}, {$set: {Verified: false}});
      }
      catch (e)
      {
          console.warn("Verifification Link Processing -> Valid link / Unverified user: User not unverified after test.");
      }

      expect(response.statusCode).toBe(303);
      expect(response.header.location).toBe(Path.buildPathFrontend('verified/success'));
  });

  test('Valid link / Verified user', async() => {

      let token = JWT.createVerificationToken("65f0d3f92c22df65ba6ea6d2");

      let response = await superGet(`verify/${token}`);

      expect(response.statusCode).toBe(303);
      expect(response.header.location).toBe(Path.buildPathFrontend('verified/late'));
  });

  test('Expired token', async() => {

      let response = await superGet('verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYwZDNmOTJjMjJkZjY1YmE2ZWE2ZDIiLCJpYXQiOjE3MTE2NjI4ODYsImV4cCI6MTcxMTY2NDA4Nn0.7wocvQIDyQvqdNruUi2S1A-f39LkFA99iqlirCfpp0U');

      expect(response.statusCode).toBe(303);
      expect(response.header.location).toBe(Path.buildPathFrontend('verified/expired'));
  });

  test('Garbage token', async() => {

      let response = await superGet('verify/garbage');

      expect(response.statusCode).toBe(303);
      expect(response.header.location).toBe(Path.buildPathFrontend('verified/expired'));
  });

  test('Access token', async() => {

      let token = JWT.createAccessToken("Test", "Test", true, "65f0d3f92c22df65ba6ea6d2").accessToken;

      let response = await superGet(`verify/${token}`);

      expect(response.statusCode).toBe(303);
      expect(response.header.location).toBe(Path.buildPathFrontend('verified/expired'));
  });
});

// Exchange token endpoint tests
//
describe('exchangeToken', () => {

    test('Valid token / verified user / verified token', async() => {

        let token = JWT.createAccessToken("Test", "Test", true, "660a25f3527fb4d540a5f2b2").accessToken;

        let invalidReq = {token: token};

        const response = await superPost('/exchangeToken', invalidReq);

        expect(response.statusCode).toBe(400);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Valid token / verified user / unverified token', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "660a25f3527fb4d540a5f2b2").accessToken;

        let validReq = {token: token};

        const response = await superPost('/exchangeToken', validReq);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.error).toBe("");
    });

    test('Valid token / unverified user', async() => {

        let token = JWT.createAccessToken("Test", "Test", false, "6603323d82133af020264b04").accessToken;

        let invalidReq = {token: token};

        const response = await superPost('/exchangeToken', invalidReq);

        expect(response.statusCode).toBe(403);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Missing token', async() => {

        const response = await superPost('/exchangeToken', {});

        expect(response.statusCode).toBe(401);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });

    test('Expired token', async() => {

        let expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAzMzIzZDgyMTMzYWYwMjAyNjRiMDQiLCJmaXJzdE5hbWUiOiJHdWVzdCIsImxhc3ROYW1lIjoiVXNlciIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzExNTcwNDM4LCJleHAiOjE3MTE1NzA0OTh9.4NfLt10jEIv4PJMkufZUoX5-clC_Dx2GFOTYB77fchI";

        let invalidReq = {token: expToken, oldPassword: "test", newPassword: "test"};

        const response = await superPost('/exchangeToken', invalidReq);

        expect(response.statusCode).toBe(401);
        expect(response.body.token).toBe(null);
        expect(response.body.error).not.toBe("");
    });
});


//
// Wrapper functions for GET and POST
//

async function superGet(endpoint, token)
{
    if (token)
        return await supertest(Path.buildPath('api')).get(endpoint)
                                                     .set('Authorization', `Bearer ${token}`);
    else
        return await supertest(Path.buildPath('')).get(endpoint);
}

async function superPost(endpoint, body)
{
    return await supertest(Path.buildPath('api')).post(endpoint)
                               .send(body)
                               .set('Accept', 'application/json')
                               .set('Content-Type', 'application/json');
}

