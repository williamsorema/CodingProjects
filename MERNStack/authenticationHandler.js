// Verify Email

require('dotenv').config();
module.exports = {
    sendVerificationEmail,
    sendPassRec,
    sendPassConfirmation
};


const nodemailer = require('nodemailer');

const jwt = require('./createJWT.js');
const emailSender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});


const Path = require("./frontend/src/components/Path");

function verifyEmail(toEmail, fn, token) {
    const path = Path.buildPath(`verify/${token}`);
    return {
        from: process.env.EMAIL_ADDRESS,
        to: toEmail,
        subject: 'Verify Your Email Address',
        text: `Hello! You recently signed up for Syntax Sensei. Please follow the link to verify your email: ${path}`,
        html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
            body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
            table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
            img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
            p { display:block;margin:13px 0; }</style><style type="text/css">@media only screen and (min-width:480px) {
            .mj-column-per-100 { width:100% !important; max-width: 100%; }
            }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:480px) {
            table.mj-full-width-mobile { width: 100% !important; }
            td.mj-full-width-mobile { width: auto !important; }
            }</style></head><body style="word-spacing:normal;"><div><div style="margin:0px auto;max-width:90%;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:200px;"><img height="auto" src="cid:thesenseiimage" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #fa304c;font-size:1px;margin:0px auto;width:100%;"></p></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:26px;line-height:1;text-align:left;color:#fa304c;">Hello, ${fn}!</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#000000;">You recently signed up for Syntax Sensei. Please follow the link to verify your email.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><a style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#0070ff;" href="${path}">${path}</a></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>`,
        attachments: [{
            filename: 'SenseiImage.png',
            path: './frontend/src/images/SenseiCropped.png',
            cid: 'thesenseiimage'
        }]
    }
}


function sendVerificationEmail(user) {
    const token = jwt.createVerificationToken(user._id);
    emailSender.sendMail(verifyEmail(user.Email, user.FirstName, token), function (error, info) {
        if (error) console.error(error);
        //console.log('Verification Email Sent');
        //console.log(info);
    });
}

//Password (requesting change)
function psEmail(toEmail, token) {
    const path = Path.buildPathFrontend(`reset/${token}`);
    return {
        from: process.env.EMAIL_ADDRESS,
        to: toEmail,
        subject: 'Reset Password',
        text: `A password reset has been requested for your account. Follow the link to reset your password: ${path}`,
        html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
            body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
            table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
            img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
            p { display:block;margin:13px 0; }</style><style type="text/css">@media only screen and (min-width:480px) {
            .mj-column-per-100 { width:100% !important; max-width: 100%; }
            }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:480px) {
            table.mj-full-width-mobile { width: 100% !important; }
            td.mj-full-width-mobile { width: auto !important; }
            }</style></head><body style="word-spacing:normal;"><div><div style="margin:0px auto;max-width:90%;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:200px;"><img height="auto" src="cid:thesenseiimage" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #fa304c;font-size:1px;margin:0px auto;width:100%;"></p></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:26px;line-height:1;text-align:left;color:#fa304c;">A password reset has been requested for your account.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#000000;">If this was not you, you can safely disregard and delete this email. Otherwise, follow the link to reset your password.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><a style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#0070ff;" href="${path}">${path}</a></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>`,
        attachments: [{
            filename: 'SenseiImage.png',
            path: './frontend/src/images/SenseiCropped.png',
            cid: 'thesenseiimage'
        }]
    }
}

function sendPassRec(user) {
    const toEmail = user.Email;
    const token = jwt.createVerificationToken(user._id);
    emailSender.sendMail(psEmail(toEmail, token), function (error, info) {
        if (error) console.error(error);
        //console.log('Password Recovery Email Sent');
        //console.log(info);
    });
}

//Password (Successful change)
function psConfirmEmail(toEmail) {
    return {
        from: "senseijake24@gmail.com",
        to: toEmail,
        subject: 'Password Changed',
        text: `Your password was successfully changed. If this was not you, please email us at senseijake24@gmail.com`,
        html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
            body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
            table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
            img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
            p { display:block;margin:13px 0; }</style><style type="text/css">@media only screen and (min-width:480px) {
            .mj-column-per-100 { width:100% !important; max-width: 100%; }
            }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:480px) {
            table.mj-full-width-mobile { width: 100% !important; }
            td.mj-full-width-mobile { width: auto !important; }
            }</style></head><body style="word-spacing:normal;"><div><div style="margin:0px auto;max-width:90%;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:200px;"><img height="auto" src="cid:thesenseiimage" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #fa304c;font-size:1px;margin:0px auto;width:100%;"></p></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:26px;line-height:1;text-align:left;color:#fa304c;">Your password was successfully changed.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#000000;">If this was not you, please email us right away at senseijake24@gmail.com</div></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>`,
        attachments: [{
            filename: 'SenseiImage.png',
            path: './frontend/src/images/SenseiCropped.png',
            cid: 'thesenseiimage'
        }]
    }
}

function sendPassConfirmation(user) {
    const toEmail = user.Email;
    emailSender.sendMail(psConfirmEmail(toEmail), function (error, info) {
        if (error) console.error(error);
        //console.log('Change Confirmed Email Sent');
        //console.log(info);
    });
}

/*
function createMailOptions(toEmail, token) {
    const path = Path.buildPath(`verify/${token}`);
    return {
        from: process.env.EMAIL_ADDRESS,
        to: toEmail,
        subject: 'Verify Your Email Address',
        html: `Hello! You recently signed up for an account with our website. Please follow the link below to verify your email
        <a href="${path}">${path}</a>`
    }
}


function sendVerificationEmail(user) {
    const toEmail = user.Email;
    const token = jwt.createVerificationToken(user._id);
    emailSender.sendMail(createMailOptions(toEmail, token), function (error, info) {
        if (error) throw Error(error);
        //console.log('Email Sent');
        //console.log(info);
    });
}
*/