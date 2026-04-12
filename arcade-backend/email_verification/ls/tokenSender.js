// Filename - tokenSender.js

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
	host:'smtp.resend.com',
	port: 3000,
	secure: true,
	auth: {
		user: 'resend',
		pass: 're_9aJsbZ8H_9UPPmYapuHQ1qMLCmo5wBzeW'
	}
});

const token = jwt.sign({
        data: 'Token Data'
    }, 'ourSecretKey', { expiresIn: '30m' }  
);    

const mailConfigurations = {

    // It should be a string of sender/server email
    from: 'noreply@tempclassproject.xyz',

    to: 'receiverEmail@gmail.com',

    // Subject of Email
    subject: 'Email Verification',
    
    // This would be the text of email body
    text: `Greetings, fellow non-AI human!
    	   Thank you for visiting our Arcade website!
	   You have requested to verify your email.
	   Please follow the given link to verify your email:
	   http://www.tempclassproject.xyz/verify/${token}
	   Thanks
	
	  (Do-not-reply: This is an automated message)`
};

transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
    console.log(info);
});
