var express = require("express"),
    router = express.Router();

router.get("/gallery", function(req, res) {
  res.render("gallery");
});

module.exports = router;