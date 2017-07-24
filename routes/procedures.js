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

module.exports = router;
