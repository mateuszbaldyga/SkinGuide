var express = require('express'),
    router = express.Router();

router.get('/offers', function(req, res) {
  res.render('offers');
});

module.exports = router;