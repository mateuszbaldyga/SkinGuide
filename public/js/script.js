var stars = document.querySelectorAll('.form > .rate > span');
var clicked = 0;

function init(){
  setNavigation();
  rate();
  newCommentDisplay();
  dateDisplay();
  hideHr();
  addOpinionButtonAction();
  scrollToIndex();
  // navHideShowOnScroll(); //trzeba dopracować
}

init();



function scrollToFormBottom(){
  $('html,body').animate({
    scrollTop: $("#showForm").offset().top
    }, 'slow');
}

function scrollToIndex(){
  $('#button-getStarted').click(function(){
    $('html,body').animate({
      scrollTop: $(".panel-body").offset().top-$(".navbar-fixed-top").height()
      }, 'slow');
  })
}

function resetStars(){
  for(var i=0; i<stars.length; i++){
      stars[i].innerHTML = '☆';
      stars[i].classList.remove('rate-hover');
  }
}

function hideHr() {
  $('hr:last-of-type').hide();
}

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    $(".nav a").each(function () {
        var href = $(this).attr('href');
        if (path === href) {
            $(this).closest('a').attr("id", 'active');
        }
    })
}

function dateDisplay(){
    var dateField = document.querySelectorAll('.date'),
        dateNow = new Date();
        // console.log(dateField[0].getAttribute('status'));
      for(var i=0; i<dateField.length; i++){
        if(dateField[i].getAttribute('status')){
          var dateCompare = dateNow.getDate() - dateField[i].innerText.slice(8, 10);
          dateField[i].removeAttribute('status');

          if(dateCompare <= 1){
              dateField[i].setAttribute('title', dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = 'Today at ' + dateField[i].innerText.slice(16, 21);
          }
          else if(dateCompare <= 2){
              dateField[i].setAttribute('title', dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = 'Yesterday at ' + dateField[i].innerText.slice(16, 21);
          }
          else{
              dateField[i].setAttribute('title', dateField[i].innerText.slice(4, 21));
              dateField[i].innerText = dateCompare + ' days ago';
          }
          $(dateField[i]).show(0);
      }
    }
}

function rate(){
    function piceofCode(i){
      stars[i].innerHTML = '&#x2605';
      stars[i].classList.add('rate-hover');
    }
    for(var i=0; i<stars.length; i++){
        stars[i].addEventListener('click', function(){
            clicked = this.getAttribute('value');
            document.querySelector("#rateNum").setAttribute('value', clicked);
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i)}
        })
        stars[i].addEventListener('mouseenter', function(){
            resetStars();
            var number = this.getAttribute('value');
            for(var i=0; i<number; i++){piceofCode(i)}
        })
        stars[i].addEventListener('mouseleave', function(){
            resetStars();
            for(var i=0; i<clicked; i++){piceofCode(i)}
        })
    }
}

function newCommentDisplay() {
    $('#button-sendOpinion').click(function(){
      var form = $('#formA'),
          data = form.serializeArray().reduce(function(obj, item) {
                   obj[item.name] = item.value;
                   return obj;
                 }, {}),
          numOfStars = data.rate,
          commentText = data.text,
          commentAvatar = data.avatar
          commentAuthor = data.currentuser;
          commentRating = '';
          for(var i=0; i<numOfStars; i++){
            commentRating += '<span>&#x2605</span>';
            }
      var commentTemplate = "<hr>" +
                            "  <div class=\"comment\" style=\"display: none;\">" +
                            "      <a class=\"avatar\">" +
                            "        <img src=\""+commentAvatar+"\"> <!-- trzeba bedzie zmienic -->" +
                            "      </a>" +
                            "      <div class=\"content\">" +
                            "        <a class=\"author\">"+commentAuthor+"<a>" +
                            "        <div class=\"metadata\">" +
                            "          <span  status =\"notFormated\" class=\"date\">"+Date()+"</span>" +
                            "        </div>" +
                            "        <button class=\"button-DeleteComment\" ><i class=\"remove icon\"></i></button>" +
                            "        <div class=\"starsRated\">" + commentRating +
                            "        </div>" +
                            "        <div class=\"text\">"+commentText+
                            "        </div>" +
                            "      </div>" +
                            "  </div>";
      $(commentTemplate).appendTo(".commentsContainer").show('normal');
      form.submit();
      form[0].reset();
      resetStars();
      scrollToFormBottom();
      clicked = 0;
      setTimeout(function(){
        window.stop()
      }, 1000);
      dateDisplay();
    })
  }

function addOpinionButtonAction() {
  $('#button-addOpinion').click(function(){

  $(this).hide(0);
  $('#showForm').show('slow');
  scrollToFormBottom();
  })
}

function navHideShowOnScroll() {
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('.navbar').outerHeight();
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
        $('.navbar').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.navbar').removeClass('nav-up').addClass('nav-down');
        }
      }
}
}
