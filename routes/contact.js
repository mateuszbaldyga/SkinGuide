var express = require('express'),
    router = express.Router(),
    gmailTransporter = require('../config/gmail.transporter');

router.get('/contact', function(req, res) {
  res.render('contact');
});

router.post('/contact', function (req, res) {

  var message = {
    from: 'moja.web.aplikacja@gmail.com',
    to: 'matbaldyga@gmail.com',
    subject: req.body.name + ' <' + req.body.email + '>',
    text: req.body.message
  };

  gmailTransporter.sendMail(message, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
      req.flash('success', 'Twoja wiadomośc została wysłana. Dziękuję za kontakt :)');
      res.redirect('/contact');
    }
    gmailTransporter.close();
  });
});

module.exports = router;