const stars = document.querySelectorAll(".rate span"),
      starsQuantity = stars.length,
      form = $("#comment-form"),
      landpic = $("#landpic"),
      main = $('main'),
      commentFormWrap = $('#comment-form-wrapper'),
      defaultNavbar = $('#nav'),
      mobileNavbar = $('#navbar-collapse');

var clickedStar = 0,
    mobileNavIsCollapsed = true,
    path = window.location.pathname + window.location.search;

function init() {
  setNavigation();
  rate();
  addFunctionPostComment();
  dateFormat(document);
  addOpinionButtonAction();
  scrollLandingPage();
  skipLandingPage();
  addFunctionDestroyComment();
  addFunctionEditComment();
  showHideDropdownMenu();
  collapseMobileNavbarOnClick()
  navHideShowOnScroll(); //trzeba dopracować
} 

init();

function collapseMobileNavbarOnClick() {
  var duration = 300;
  $('#navbar-toggle').click( function() {
    $(this).children().toggleClass('open');
    if(mobileNavIsCollapsed) {
      mobileNavbar.slideDown(duration);
      mobileNavIsCollapsed = false;
    } else {
      mobileNavbar.slideUp(duration).promise().done(() => {
        mobileNavbar.removeAttr("style");
      });
      mobileNavIsCollapsed = true;
    }
  });
}

function scrollToObjective(objective, duration=800){
  $('body,html').animate({
    scrollTop: objective.offset().top
    }, duration);
}

function scrollLandingPage(){
  $("#button-getStarted").on("click", () => {
    scrollToObjective(main)
  });
   if(path === '/') {
    $(window).one("scroll", () => {
      scrollToObjective(main)
    });
  }
}

function skipLandingPage(){
  if(path === '/?info') {
    // landpic.hide();
    scrollToObjective(main);
  }
}

function resetStars(){
  for(let i=0; i<starsQuantity; i++){
      stars[i].innerHTML = "&#9734;";
      stars[i].classList.remove("rate-hover");
  }
}

function setNavigation() {
  $("nav ul li a").each(function () {
      let href = $(this).attr("href");//.split('?')[0];
      if (path === href) {
          $(this).closest("a").addClass('active');
      }
  });
}

function dateFormat(objective){
    let dateFields = objective.querySelectorAll(".date"),
        dateNow = new Date();
      for(let i=0, len = dateFields.length; i<len; i++){
          let dateComment = new Date(dateFields[i].innerText),
              dateComparison = dateNow.getDate() - dateComment.getDate(),
              commentMinutes = dateComment.getMinutes(),
              commentTime = `${dateComment.getHours()}:${commentMinutes<10?'0':''}${commentMinutes}`;
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
function addFunctionPostComment() {
    $("#button-sendOpinion").click(() => {
      let data = {
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
    url: 'http://localhost:3000/',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    success: (commentId) => {
               data.commentId = commentId;
               form[0].reset();
               resetStars();
               clickedStar = 0;
               displayComment(data);
               scrollToObjective(commentFormWrap);
               addFunctionDestroyComment();
               addFunctionEditComment();
             },
    error: error,
  });
}

function addFunctionEditComment(){
  let buttonEditComment = $(".button-EditComment"),
      btnToggleDropdown = $(document.querySelectorAll('.dropdown'));
  buttonEditComment.each(function(){
    $(this).on('click', () => {
      let commentId = {
            "commentId": $.trim($(this).parent().attr("data"))
          },
          commentContent = $(this).closest("div.content"),
          textDiv = commentContent.find('div.text'),
          editForm = `<form id="edit-form" class=edit-form>
                        <textarea id="text-area" class="text-area">${textDiv.text().trim()}</textarea>
                        <div class='buttons-container'>
                          <button type="button" id="buttonCancel" class="button btn-cancel">Anuluj</button>
                          <button type="button" id="buttonAccept" class="button btn-accept">Zatwierdź</button>
                        </div>
                      </form>`;
      btnToggleDropdown.fadeOut(100);
      textDiv.replaceWith(editForm).promise().done(() => {
        let editForm = commentContent.find('#edit-form');
            // editFormText = form.find('#text-area').val()
            
        commentContent.find('#buttonAccept').on('click', () => {
          let editFormText = editForm.find('#text-area').val(),
              newTextDiv = textDiv.text(editFormText);
          editForm.replaceWith(newTextDiv);
          btnToggleDropdown.fadeIn(100);
        });
        //button-cancel
        commentContent.find('#buttonCancel').on('click', () => {
          editForm.replaceWith(textDiv);
          btnToggleDropdown.fadeIn(100);
        });
      });
    });
  });

    // $.ajax({
    //   url: 'http://localhost:3000/',
    //   data: commentId,
    //   type: 'PUT', //variable
    //   success: () => {
    //     $(this).parents("div.comment").hide("normal", function() {$(this).remove();});
    //   },
    //   error: error,
    // });
}

function addFunctionDestroyComment(){
  let buttonDeleteComment = $(".button-DeleteComment");
  buttonDeleteComment.each(function(){
    $(this).on('click', () => {
    let commentId = {
      "commentId": $.trim($(this).parent().attr("data"))
    };
    console.log('commentId: ', commentId);
    $.ajax({
      url: 'http://localhost:3000/',
      data: commentId,
      type: 'DELETE',
      success: () => {
        $(this).closest("div.comment").slideUp(400, function() {$(this).remove();});
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
  // console.log('dataL!!!!!', data);
  let commentRating = "",
      template = $(document.getElementsByClassName("comment")[0]).clone()[0];
  for(let i=0; i<data.numOfStars; i++) {
    commentRating += "&#9733;";
  }
  template.getElementsByTagName("img")[0].setAttribute("src", data.commentAvatar);
  template.getElementsByClassName("author")[0].innerText = data.commentAuthor;
  template.getElementsByClassName("starsRated")[0].innerHTML = commentRating;
  template.getElementsByClassName("text")[0].innerText = data.commentText;
  template.getElementsByClassName("date")[0].innerText = Date();
  $(template.getElementsByClassName("button-DeleteComment")[0]).parent().attr("data", data.commentId);
  dateFormat(template);
  $(template.outerHTML).appendTo("#comments-wrapper").hide(0, function(){
    $(this).show("normal");
  });
  showHideDropdownMenu(document.querySelectorAll('.dropdown'));
}

function showHideDropdownMenu(objective) {
  // show dropdown
  let commentDropdown = (!objective) ? $(document.querySelectorAll('.dropdown')):$(objective),
      allDropdownMenus = commentDropdown.find('.dropdown-menu'),
      duration = 150;
  commentDropdown.each( function() {
    $(this).off().on('click', () => {
      let thisMenu = $(this).find('.dropdown-menu');
      allDropdownMenus.not(thisMenu).slideUp(duration);
      thisMenu.slideToggle(duration);

    });
  });
  // hide dropdown
  $(document).on('click', (event) => {
    if (!$(event.target).closest('.dropdown').length) {
      allDropdownMenus.slideUp(duration);
    }
  });
}

function rate(){
    function piceofCode(i){
      stars[i].innerHTML = "&#9733;";
      stars[i].classList.add("rate-hover");
    }
    for(var i=0; i<starsQuantity; i++){
        stars[i].addEventListener("click", function(){
            clickedStar = this.getAttribute("value");
            document.querySelector("#rateNum").setAttribute("value", clickedStar);
            resetStars();
            for(let i=0; i<clickedStar; i++){piceofCode(i);}
        });
        stars[i].addEventListener("mouseenter", function(){
            resetStars();
            for(let i=0; i<this.getAttribute("value"); i++){piceofCode(i);}
        });
        stars[i].addEventListener("mouseleave", () => {
            resetStars();
            for(let i=0; i<clickedStar; i++){piceofCode(i);}
        });
    }
}

function addOpinionButtonAction() {
  $("#button-addOpinion").click(function(){
    $(this).fadeOut(200);
    // $("#comment-form-wrapper").show("normal");
    $("#comment-form-wrapper").fadeIn("normal");
    scrollToObjective(commentFormWrap);
  });
}

function navHideShowOnScroll() {
  let didScroll,
      lastScrollTop,
      duration = 200,
      navbarHeight = defaultNavbar.outerHeight();
  $(window).scroll( () => {
    didScroll = true;
  });
  setInterval( () => {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 300);
  function hasScrolled() {
    let st = $(window).scrollTop();
    if (st > lastScrollTop && st > navbarHeight){
      defaultNavbar.animate({top: -navbarHeight}, duration);
      if(!mobileNavIsCollapsed) {
        mobileNavbar.fadeOut('fast').promise().done(() => {
          mobileNavbar.removeAttr("style");
        });
      }
      lastScrollTop = st;
    } else if(st + $(window).height() < $(document).height()) {
      defaultNavbar.animate({top: '0'}, duration);
      if(!mobileNavIsCollapsed) {
        mobileNavbar.fadeIn('fast');
      }
      lastScrollTop = st;
    }
  }
}