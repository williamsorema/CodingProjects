const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createAccessToken = function (fn, ln, ver, id) {
  return _createAccessToken(fn, ln, ver, id);
};

exports.createVerificationToken = function (id) {

  const user = { userId: id };

  const verificationToken = jwt.sign(user, process.env.VERIFICATION_TOKEN_SECRET, { expiresIn: '20m' });

  return verificationToken;
};

_createAccessToken = function (fn, ln, ver, id) {
  try {
    const user = { userId: id, firstName: fn, lastName: ln, verified: ver };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });

    var ret = { accessToken: accessToken };
  } catch (e) {
    var ret = { error: e.message };
  }
  return ret;
};


exports.isValidAccessToken = function (token) {
  var isValid = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, verifiedJWT) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    }
  );
  return isValid;
};

exports.isValidVerificationToken = function (token) {
  var isValid = jwt.verify(
    token,
    process.env.VERIFICATION_TOKEN_SECRET,
    (err, verifiedJWT) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    }
  );
  return isValid;
};


exports.getPayload = function (token) {

  return jwt.decode(token, { complete: true }).payload;
}

exports.refresh = function (token) {
  var ud = jwt.decode(token, { complete: true });

  var userId = ud.payload.userId;
  var firstName = ud.payload.firstName;
  var lastName = ud.payload.lastName;
  var verified = ud.payload.verified;

  return _createAccessToken(firstName, lastName, verified, userId);
};
