var stars = document.querySelectorAll(".rate span");
var form = $("#formA");
var clicked = 0;

function init(){
  setNavigation();
  rate();
  newCommentDisplay();
  dateDisplay();
  // hideHr();
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

// function hideHr() {
//   $("hr:last-of-type").hide();
// }

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

//real-time-comment-display {
function newCommentDisplay() {
    $("#button-sendOpinion").click(function(){
      var data = {
          "numOfStars": form.find('#rateNum').val(),
          "commentText": form.find('#text').val(),
          "commentAvatar": form.find('#avatar').val(),
          "commentAuthor": form.find('#currentuser').val(),
        }
        // console.log(data);
        if(data.numOfStars && data.commentText){
          postComment(data);
        }
    })
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
    error: postError,
  });
}

function postSuccess(data, textStatus, jqXHR) {
  console.log('sukces!')
  form[0].reset();
  resetStars();
  clicked = 0;
  displayComment(data);
  dateDisplay();
  scrollToFormBottom();
}

function postError(jqXHR, textStatus, errorThrown) {
  console.log("Error, status = " + textStatus + ", " +
              "error thrown: " + errorThrown
            );
  }
  
function displayComment(data) {
  // console.log('dataL!!!!!', data);
  var commentRating = "";
  for(var i=0; i<data.numOfStars; i++){
    commentRating += "<span>&#x2605</span>";
    }
  var template = $($(".comment")[0]).clone();
  template.find("img").attr("src", data.commentAvatar);
  $("author", template).text(data.commentAuthor);
  // var i = template.find("author");//.text(data.commentAuthor);
  // console.log('tuu: ', i);
  // $("h2", $tmc).text('new title');
  // template.find("starsRated")[0].innerHTML = commentRating;
  // template.find("text")[0].innerText = data.commentText;
  // $(template).appendTo("#commentsWrapper").show("slow");
  // console.log(template);
  $("#commentsWrapper").append(template);
}
// } real-time-comment-display

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

//===========================================
//                 TESTY
//===========================================
// if(stars.length !== 5){alert('stars.length !== 5')}