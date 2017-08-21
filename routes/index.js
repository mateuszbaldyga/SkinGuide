var express = require('express'),
    cors = require('cors'),
    router = express.Router(),

    Comment = require('../models/comment'),

    middleware = require('../middleware'),

    corsOptions = {
      origin: ['https://evening-hamlet-47726.herokuapp.com', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
    };

router.get('/', function(req, res) {
  Comment.find({}, function(err, allComments) {
    if(err) {
      res.sendStatus(404);
    } else {
      console.log('Get route: SUCCESS!');
      res.render('index', { comments: allComments });
    }
  });
});

router.post('/', middleware.isLoggedIn, cors(corsOptions), function(req, res) {
  var newComment = {
        text: req.body.commentText,
        author: {
          id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar
        },
      rating: req.body.numOfStars,
      }
    Comment.create(newComment, function(err, newComment) {
      if(err) {
        console.log('Post route: ERROR!');
        res.sendStatus(500);
      } else {
        console.log('Post route: SUCCESS!');
        res.send(newComment._id);
      }
    });
});

router.put('/', middleware.checkCommentOwnership, cors(corsOptions), function(req, res) {
  Comment.findByIdAndUpdate(req.body.commentId, { text: req.body.editFormText },function(err) {
    if(err){
      console.log('Update route: ERROR');
      res.redirect('back');
    } else {
      console.log('Update route: SUCCESS!');
      res.sendStatus(200);
    }
  });
});

router.delete('/', middleware.checkCommentOwnership, cors(corsOptions), function(req, res) {
  Comment.findByIdAndRemove(req.body.commentId, function(err){
      if(err){
        console.log('Delete route: ERROR');
        res.sendStatus(500);
      } else {
        console.log('Delete route: SUCCESS!');
        res.sendStatus(200);
      }
   });
});

module.exports = router;
