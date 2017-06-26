var stars = document.querySelectorAll(".rate span");
var clicked = 0;

function init(){
  setNavigation();
  rate();
  newCommentDisplay();
  dateDisplay();
  hideHr();
  addOpinionButtonAction();
  hideLandingPage();
  // navHideShowOnScroll(); //trzeba dopracować
}

init();
document.querySelector("body")


function scrollToFormBottom(){
  $(document.querySelector("body")).animate({
    scrollTop: $("#showForm").offset().top
    }, "slow");
}

function hideLandingPage(){
  function hideIt(){
    $("#landpic").slideUp(600);
  }
  $("#button-getStarted").on("click", hideIt);
  $( window ).on("scroll", hideIt);
}

function resetStars(){
  for(var i=0; i<stars.length; i++){
      stars[i].innerHTML = "&#9734;";
      stars[i].classList.remove("rate-hover");
  }
}

function hideHr() {
  $("hr:last-of-type").hide();
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
    })
}

function dateDisplay(){
    var dateField = document.querySelectorAll(".date"),
        dateNow = new Date();
        // console.log(dateField[0].getAttribute("status"));
      for(var i=0; i<dateField.length; i++){
        if(dateField[i].getAttribute("status")){
          var dateCompare = dateNow.getDate() - dateField[i].innerText.slice(8, 10);
          dateField[i].removeAttribute("status");

          if(dateCompare <= 1){
              dateField[i].setAttribute("title", dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = "Today at " + dateField[i].innerText.slice(16, 21);
          }
          else if(dateCompare <= 2){
              dateField[i].setAttribute("title", dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = "Yesterday at " + dateField[i].innerText.slice(16, 21);
          }
          else{
              dateField[i].setAttribute("title", dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = dateCompare + " days ago";
          }
          $(dateField[i]).show(0);
      }
    }
}

function rate(){
    function piceofCode(i){
      stars[i].innerHTML = "&#9733;";
      stars[i].classList.add("rate-hover");
    }
    for(var i=0; i<stars.length; i++){
        stars[i].addEventListener("click", function(){
            clicked = this.getAttribute("value");
            document.querySelector("#rateNum").setAttribute("value", clicked);
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i)}
        })
        stars[i].addEventListener("mouseenter", function(){
            resetStars();
            var number = this.getAttribute("value");
            for(var i=0; i<number; i++){piceofCode(i)}
        })
        stars[i].addEventListener("mouseleave", function(){
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i)}
        })
    }
}

// function validateForm() {
//     var x = document.forms["FormA"]["fname"].value;
//     if (x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }

function addOpinionButtonAction() {
  $("#button-addOpinion").click(function(){

  $(this).hide(0);
  $("#showForm").show("slow");
  scrollToFormBottom();
  })
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





//============REAL TIME PRÓBA
function newCommentDisplay() {
    $("#button-sendOpinion").click(function(){
      var form = $("#formA");
      var data = {
          "numOfStars": form.find('#rateNum').val(),
          "commentText": form.find('#text').val(),
          "commentAvatar": form.find('#avatar').val(),
          "commentAuthor": form.find('#currentuser').val(),
        }
        console.log(data);
        // form.submit();
        postComment(data);
          // commentRating = "";
          // for(var i=0; i<numOfStars; i++){
          //   commentRating += "<span>&#x2605</span>";
          //   }
    //   var template = document.querySelector(".comment");
    //   template.getElementsByTagName("img")[0].setAttribute("src", commentAvatar);
    //   template.getElementsByClassName("author")[0].innerText = commentAuthor;
    //   template.getElementsByClassName("starsRated")[0].innerHTML = commentRating;
    //   template.getElementsByClassName("#text")[0].innerText = commentText;
    //   $(template).appendTo("#commentsWrapper").show("slow");
    //   form.submit();
    //   form[0].reset();
    //   resetStars();
    //   scrollToFormBottom();
    //   clicked = 0;
    //   setTimeout(function(){
    //     window.stop()
    //   }, 1000);
    //   dateDisplay();
    })
  }

function START(){
  $('#formA').submit(handleSubmit);
};

function handleSubmit() {
  var form = $(this);
  var data = {
          "numOfStars": form.find('#rateNum').val(),
          "commentText": form.find('#text').val(),
          "commentAvatar": form.find('#avatar').val(),
          "commentAuthor": form.find('#currentuser').val(),
          }

  postComment(data);

  return false;
}

function postComment(data) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/skinguide',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    success: postSuccess,
    error: console.log('error')
  });
}

function postSuccess(data, textStatus, jqXHR) {
  $('#formA').get(0).reset();
  // displayComment(data);
}
  
function displayComment(data) {
  var commentHtml = createComment(data);
  var commentEl = $(commentHtml);
  commentEl.hide();
  var postsList = $('#posts-list');
  postsList.addClass('has-comments');
  postsList.prepend(commentEl);
  commentEl.slideDown();
}

function createComment(data) {
  var html = '' +
  '<li><article id="' + data.id + '" class="hentry">' +
    '<footer class="post-info">' +
      '<abbr class="published" title="' + data.date + '">' +
        parseDisplayDate(data.date) +
      '</abbr>' +
      '<address class="vcard author">' +
        'By <a class="url fn" href="#">' + data.comment_author + '</a>' +
      '</address>' +
    '</footer>' +
    '<div class="entry-content">' +
      '<p>' + data.comment + '</p>' +
    '</div>' +
  '</article></li>';

  return html;
}

function parseDisplayDate(date) {
  date = (date instanceof Date? date : new Date( Date.parse(date) ) );
  var display = date.getDate() + ' ' +
                ['January', 'February', 'March',
                 'April', 'May', 'June', 'July',
                 'August', 'September', 'October',
                 'November', 'December'][date.getMonth()] + ' ' +
                date.getFullYear();
  return display;
}

$(function() {

  $(document).keyup(function(e) {
    e = e || window.event;
    if(e.keyCode === 85){
      displayComment({
        "id": "comment_1",
        "comment_post_ID": 1,
        "date":"Tue, 21 Feb 2012 18:33:03 +0000",
        "comment": "The realtime Web rocks!",
        "comment_author": "Phil Leggetter"
      });
    }
  });

});


//===========================================
//                 TESTY
//===========================================
// if(stars.length !== 5){alert('stars.length !== 5')}