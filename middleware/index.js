var Comment = require("../models/comment"),
    middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
if(req.isAuthenticated()){
    Comment.findById(req.body.commentId, function(err, foundComment){
    if(err){
      res.redirect("back");
    }  
    else {
        // does user own the comment?
      try {
        var check = foundComment.author.id.equals(req.user._id);
      } catch(err) {
        // console.log(err);
      }
      if(check) {
        next();
      } else {
        // req.flash("error", "You don't have permission to do that");
        res.redirect("back");
      }
    }
    });
  } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
  }
}

module.exports = middlewareObj;