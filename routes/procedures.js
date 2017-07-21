var express = require("express"),
    router = express.Router(),
    Group = require("../models/group");

router.get('/procedures', function(req, res) {
  Group.find({}, function(err, allGroups) {
    if (!err) {
      console.log('znaleziono wszystkie grupy');
    };
    res.render("procedures/show", {
      groups: allGroups
    });
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
