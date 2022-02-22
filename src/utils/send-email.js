"use strict";
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail({ user, img }) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   tls: {
  //     ciphers: "SSLv3",
  //   },
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "a.ifeoluwadara@gmail.com", // generated ethereal user
      pass: "Suite1190", // generated ethereal password
    },
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("../event-server-node/views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("../event-server-node/views/"),
  };

  // use a template file with nodemailer
  // transporter.use('compile', hbs(handlebarOptions))

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "ajims119@gmail.com", // sender address
    to: user?.email, // list of receivers
    // to: "josephadeleke1914@gmail.com", // list of receivers
    subject: "Event Invitation", // Subject line
    text: "You've succesfully registered fo the event.", // plain text body
    // template: 'email', // the name of the template file i.e email.handlebars
    attachDataUrls: true, //to accept base64 content in messsage
    html:
      "<h1>Hello " +
      user.username +
      "</h1>  </br> </br><p >Thank you for registering. The QRCode below is your permit to enter the venue</p>  </br> </br><p >Phone : " +
      user.phone +
      "</p> <p>Sex : " +
      user.sex +
      "</p> <p>Email : " +
      user.email +
      ' <p/> </br>  <img width="100%" height="350" src="' +
      img +
      '">', // html body
    // html: "<b>Hello world?</b>", // html body
    // attachments,
    //   context:{
    //     name: "Adebola", // replace {{name}} with Adebola
    //     attachments: attachments, // replace {{name}} with Adebola
    //     company: 'My Company' // replace {{company}} with My Company
    // }
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// sendMail(attachments).catch(console.error);
// sendMail().catch(console.error);

module.exports = sendMail;
