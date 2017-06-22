var stars = document.querySelectorAll('.form > .rate > span');
var clicked = 0;

function init(){
  setNavigation();
  rate();
  newCommentDisplay();
  dateDisplay();
  hideHr();
}

init();

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    $(".nav a").each(function () {
        var href = $(this).attr('href');
        if (path === href) {
            $(this).closest('li').addClass('active');
        }
    })
}

function dateDisplay(){
    var dateField = document.querySelectorAll('.date'),
        dateNow = new Date();
        console.log(dateField[0].getAttribute('status'));
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

function resetStars(){
  for(var i=0; i<stars.length; i++){
      stars[i].innerHTML = '☆';
      stars[i].classList.remove('rate-active', 'rate-hover');
  }
}

function rate(){
    function piceofCode(i){
      stars[i].innerHTML = '&#x2605';
      stars[i].classList.add('rate-active');
    }
    for(var i=0; i<stars.length; i++){
        stars[i].addEventListener('click', function(){
            clicked = this.getAttribute('value');
            document.querySelector(".rateNum").setAttribute('value', clicked);
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
    $('.button').click(function(){
      var f = document.forms["formA"],
          commentRating = f.elements['rateNum'].value,
          commentText = f.elements['text'].value,
          starsHtml = '';
          for(var i=0; i<commentRating; i++){
            starsHtml += '<span>&#x2605</span>';
            }
      var commentTemplate = "<hr>" +                            "  <div class=\"comment\" style=\"display: none;\">" +
                            "      <a class=\"avatar\">" +
                            "        <img src=\"/images/default-avatar.jpg\"> <!-- trzeba bedzie zmienic -->" +
                            "      </a>" +
                            "      <div class=\"content\">" +
                            "        <a class=\"author\">MATI<a>" +
                            "        <div class=\"metadata\">" +
                            "          <span  status =\"notFormated\" class=\"date\">"+Date()+"</span>" +
                            "        </div>" +
                            "        <div class=\"rate rated rate-active\">" + starsHtml +
                            "        </div>" +
                            "        <div class=\"text\">"+commentText+
                            "        </div>" +
                            "      </div>" +
                            "  </div>";
      $(commentTemplate).appendTo(".commentsContainer").show('normal');
      document.forms[0].submit();
      document.forms[0].reset();
      resetStars();
      clicked = 0;
      setTimeout(function(){
        window.stop()
      }, 2000);
      dateDisplay();
    })
  }

function hideHr() {
  $('hr:last-of-type').hide();
}
