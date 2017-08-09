var express = require("express"),
    router = express.Router();

router.get("/contact", function(req, res) {
  res.render("contact");
});

router.post('/contact', function (req, res) {
  var mailOpts, smtpTrans;
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  smtpTrans = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
      user: 'matbaldyga@gmail.com',
      })
    }
    });
  //Mail options
  mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
      to: 'matbaldyga@gmail.com',
      subject: 'SkinGuide - Contact Form',
      text: req.body.message
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
      //Email not sent
      if (error) {
          res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Error occured, message not sent.', err: true, page: 'contact' })
      }
      //Yay!! Email sent
      else {
          res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' })
      }
  });
});

module.exports = router;