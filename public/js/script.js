var stars = document.querySelectorAll(".rate span"),
    starsQuantity = stars.length,
    form = $("#formA"),
    landpic = $("#landpic");

var clicked = 0;

function init(){
  setNavigation();
  rate();
  newCommentDisplay();
  dateFormat();
  addOpinionButtonAction();
  hideLandingPage();
  skipLandingPage();
  AddFunctionDestroyComment();
  // navHideShowOnScroll(); //trzeba dopracować
}

init();

function scrollToFormBottom(){
  $(document.querySelector("body")).animate({
    scrollTop: $("#showForm").offset().top
    }, "slow");
}

function hideLandingPage(){
  function hideIt(){
    landpic.slideUp(600);
  }
  $("#button-getStarted").on("click", hideIt);
  $(window).on("scroll", hideIt);
}

function skipLandingPage(){
  $("#oNas").click(function(){
    // alert('dwadaw');
    landpic.hide();
  });
}

function resetStars(){
  for(var i=0; i<starsQuantity; i++){
      stars[i].innerHTML = "&#9734;";
      stars[i].classList.remove("rate-hover");
  }
}

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    $(".nav a").each(function () {
        var href = $(this).attr("href");
        if (path === href) {
            $(this).closest("a").attr("id", "active");
        }
    });
}

function dateFormat(){
    var dateFields = document.querySelectorAll(".date"),
        dateNow = new Date();
      for(var i=0, len = dateFields.length; i<len; i++){
          var dateComment = new Date(dateFields[i].innerText),
              dateComparison = dateNow.getDate() - dateComment.getDate(),
              commentMinutes = dateComment.getMinutes(),
              commentTime = `${dateComment.getHours()}:${commentMinutes<10?'0':''}${commentMinutes}`;
          // console.log(dateComparison);
          if(dateComparison <= 1){
              dateFields[i].innerText = `Today at ${commentTime}`;
          }
          else if(dateComparison <= 2){
              dateFields[i].innerText = `Yesterday at ${commentTime}`;
          }
          else{
              dateFields[i].innerText = `${dateComparison} days ago`;
          }
          $(dateFields[i]).show(0);
      }
    }

//real-time-comment-display {
function newCommentDisplay() {
    $("#button-sendOpinion").click(function(){
      var data = {
          "numOfStars": form.find('#rateNum').val(),
          "commentText": form.find('#text').val(),
          "commentAvatar": form.find('#avatar').val(),
          "commentAuthor": form.find('#currentuser').val()
        };
        console.log(data);
        if(data.numOfStars && data.commentText){
          postComment(data);
        }
    });
  }

function postComment(data) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/skinguide',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    success: function (commentId) {
               data.commentId = commentId;
               form[0].reset();
               resetStars();
               clicked = 0;
               displayComment(data);
               scrollToFormBottom();
               AddFunctionDestroyComment();  
             },
    error: error,
  });
}

function AddFunctionDestroyComment(){
  var buttonDeleteComment = $(".button-DeleteComment");
  buttonDeleteComment.each(function(){
    var thisButton = $(this);
    thisButton.on('click', function(){
    console.log('delete click', thisButton );
    commentId = {
      "commentId": $.trim(thisButton.attr("data"))
    };
    console.log('commentId: ', commentId);
    $.ajax({
      url: 'http://localhost:3000/skinguide',
      data: commentId,
      type: 'DELETE',
      success: function(){
        thisButton.parents("div.comment").hide("normal", function(){$(this).remove();});
      },
      error: error,
      });
    });
  });
}

function error(jqXHR, textStatus, errorThrown) {
  console.log(`Error, status = ${textStatus}, error thrown: ${errorThrown}`);
  }
  
function displayComment(data) {
  console.log('dataL!!!!!', data);
  var commentRating = "",
      template = document.getElementsByClassName("comment")[0];
      template = $(template).clone()[0];
  for(var i=0; i<data.numOfStars; i++){
    commentRating += "<span>&#9733;</span>\n";
    }
  template.getElementsByTagName("img")[0].setAttribute("src", data.commentAvatar);
  template.getElementsByClassName("author")[0].innerText = data.commentAuthor;
  template.getElementsByClassName("starsRated")[0].innerHTML = commentRating;
  template.getElementsByClassName("text")[0].innerText = data.commentText;
  template.getElementsByClassName("date")[0].innerText = Date();
  template.getElementsByClassName("button-DeleteComment")[0].setAttribute("data", data.commentId);
  dateFormat(template);
  $(template.outerHTML).appendTo("#commentsWrapper").hide(0, function(){$(this).show("normal");});
}
// } real-time-comment-display

function rate(){
    function piceofCode(i){
      stars[i].innerHTML = "&#9733;";
      stars[i].classList.add("rate-hover");
    }
    for(var i=0; i<starsQuantity; i++){
        stars[i].addEventListener("click", function(){
            clicked = this.getAttribute("value");
            document.querySelector("#rateNum").setAttribute("value", clicked);
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i);}
        });
        stars[i].addEventListener("mouseenter", function(){
            resetStars();
            var number = this.getAttribute("value");
            for(var i=0; i<number; i++){piceofCode(i);}
        });
        stars[i].addEventListener("mouseleave", function(){
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i);}
        });
    }
}

function addOpinionButtonAction() {
  $("#button-addOpinion").click(function(){
    $(this).hide(0);
    $("#showForm").show("normal");
    scrollToFormBottom();
  });
}

function navHideShowOnScroll() {
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $(".navbar").outerHeight();
  $(window).scroll(function(event){
      didScroll = true;
  });
  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);
  function hasScrolled() {
    var st = $(this).scrollTop();
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $(".navbar").removeClass("nav-down").addClass("nav-up");
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $(".navbar").removeClass("nav-up").addClass("nav-down");
        }
      }
}
}

//===========================================
//                 TESTY
//===========================================
// if(starsQuantity !== 5){alert('starsQuantity !== 5')}