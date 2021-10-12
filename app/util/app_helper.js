const Datauri = require('datauri');
const Path = require('path');
const SendgridMail = require('@sendgrid/mail');

SendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        SendgridMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

function generateOTP(otp_length) {
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP.toString();
};

module.exports = {
    sendEmail,
    generateOTP
}