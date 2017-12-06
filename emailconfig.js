var nodemailer=require('nodemailer');
//var smtpTransport=require('nodemailer-smtp-transport')
//var xoauth2=require('xoauth2');


	// create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
	    service: process.env.EMAIL_SERVICE,
	    auth:{
		    
		        user: process.env.EMAIL_USER,
		        pass: process.env.EMAIL_PASS
            }

    });

class Email
{


	sendMail(mailoptions,callback)
	{
	   var mailOptions=mailoptions;

	   transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log("Cannot send email:" + error);
                    callback(error,null);
                }else{
                    console.log('Message sent: ' + info.response);
                    callback(null,"Account created successfully,an activation link has been sent to your email");
                };
                });

	}
	
}

module.exports=Email;