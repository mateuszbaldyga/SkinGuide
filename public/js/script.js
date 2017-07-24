const stars = document.querySelectorAll(".rate span"),
      starsQuantity = stars.length,
      form = $("#comment-form"),
      landpic = $("#landpic"),
      main = $('main'),
      commentFormWrap = $('#comment-form-wrapper'),
      defaultNavbar = $('#nav'),
      mobileNavbar = $('#navbar-collapse'),
      months = [ 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca',
                 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
      ];

var clickedStar = 0,
    mobileNavIsCollapsed = true,
    path = window.location.pathname + window.location.search;

function init() {
  navHideShowOnScroll();
  collapseMobileNavbarOnClick()
  setNavigation();

  skipLandingPage();
  scrollLandingPage();

  rateComment();
  dateFormat(document);
  showHideDropdownMenu();

  addOpinionButtonAction();
  addFunctionPostComment();
  addFunctionDestroyComment();
  addFunctionEditComment();
} 

init();

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

function setNavigation() {
  $("nav ul li a").each(function () {
      let href = $(this).attr("href");//.split('?')[0];
      if (path === href) {
          $(this).closest("a").addClass('active');
      }
  });
}

function skipLandingPage(){
  if(path === '/?info') {
    scrollToObjective(main);
  }
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

function rateComment(){
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

function dateFormat(objective){
  let dateFields = objective.querySelectorAll(".date"),
      timestampNow = Date.now(),
      divider = 1000*60*60*24;
  for(let i=0, len = dateFields.length; i<len; i++){
    let commentDate = new Date(dateFields[i].innerText),
        commentMinutes = commentDate.getMinutes(),
        commentTime = `${commentDate.getHours()}:${commentMinutes<10?'0':''}${commentMinutes}`,
        commentTimestamp = commentDate.getTime(),
        dateComparison = Math.floor((timestampNow-commentTimestamp)/divider);
    if(dateComparison <= 1){
      dateFields[i].innerText = `Dziś o ${commentTime}`;
    }
    else if(dateComparison <= 2){
      dateFields[i].innerText = `Wczoraj o ${commentTime}`;
    }
    else if (dateComparison <= 30) {
      dateFields[i].innerText = `${dateComparison} dni temu`;
    }
    else {
      dateFields[i].innerText = `${commentDate.getDate()} ${months[commentDate.getMonth()]}`;
    }
    $(dateFields[i]).show(0);
  }
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

function addOpinionButtonAction() {
  $("#button-addOpinion").click(function(){
    $(this).fadeOut(100);
    $("#comment-form-wrapper").fadeIn(300);
    scrollToObjective(commentFormWrap);
  });
}

function addFunctionPostComment() {
  $("#button-sendOpinion").click(() => {
    let data = {
        "numOfStars": form.find('#rateNum').val(),
        "commentText": form.find('#text').val(),
        "commentAvatar": form.find('#avatar').val(),
        "commentAuthor": form.find('#currentuser').val()
        };
      // console.log(data);
    if(data.numOfStars && data.commentText){
      postCommentToDatabase(data);
    }
  });
}

function postCommentToDatabase(data) {
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
               displayPostedComment(data);
               scrollToObjective(commentFormWrap);
               addFunctionDestroyComment();
               addFunctionEditComment();
             },
    error: error,
  });
}

function displayPostedComment(data) {
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

function addFunctionDestroyComment(){
  let buttonDeleteComment = $(".button-DeleteComment");
  buttonDeleteComment.each(function(){
    $(this).on('click', () => {
    let data = {
      "commentId": $.trim($(this).parent().attr("data"))
    };
    // console.log('commentId: ', commentId);
    $.ajax({
      url: 'http://localhost:3000/',
      data: data,
      type: 'DELETE',
      success: () => {
        $(this).closest("div.comment").slideUp(400, function() {$(this).remove();});
      },
      error: error,
      });
    });
  });
}

function addFunctionEditComment(){
  let buttonEditComment = $(".button-EditComment"),
      btnToggleDropdown = $(document.querySelectorAll('.dropdown'));
  buttonEditComment.each(function(){
    $(this).on('click', () => {
      let data = {
            "commentId": $.trim($(this).parent().attr("data"))
          },

          commentContent = $(this).closest("div.content"),
          textDiv = commentContent.find('div.text'),
          oldCommentText = textDiv.text().trim(),
          editForm = `<form id="edit-form" class=edit-form>
                        <textarea id="text-area" class="text-area">${oldCommentText}</textarea>
                        <div class='buttons-container'>
                          <button type="button" id="buttonAccept" class="button btn-accept">Zatwierdź</button>
                          <button type="button" id="buttonCancel" class="button btn-cancel">Anuluj</button>
                        </div>
                      </form>`;
      
      btnToggleDropdown.fadeOut(100);
      textDiv.replaceWith(editForm).promise().done(() => {
        let editForm = commentContent.find('#edit-form');
        //button-accept
        commentContent.find('#buttonAccept').on('click', () => {
          data.editFormText = editForm.find('#text-area').val();
          let newTextDiv = textDiv.text(data.editFormText),
              dataForDisplay = {
                "editForm": editForm,
                "newTextDiv": newTextDiv,
                "btnToggleDropdown": btnToggleDropdown,
              };
          if(data.editFormText !== oldCommentText) {
            updateCommentToDatabase(data, dataForDisplay)
          } 
          // else {
          //   console.log('no change');
          // }
        });
        //button-cancel
        commentContent.find('#buttonCancel').on('click', () => {
          editForm.replaceWith(textDiv);
          btnToggleDropdown.fadeIn(100);
        });
      });
    });
  });
}

function updateCommentToDatabase(data, dataForDisplay) {
  $.ajax({
  type: 'PUT',
  url: 'http://localhost:3000/',
  data: data,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  success: () => {
    displayEditedComment(dataForDisplay);
  },
  error: error,
});
}

function displayEditedComment(dataForDisplay) {
  dataForDisplay.editForm.replaceWith(dataForDisplay.newTextDiv);
  dataForDisplay.btnToggleDropdown.fadeIn(100);
}

function error(jqXHR, textStatus, errorThrown) {
  console.log('Error');
}
  
function scrollToObjective(objective, duration=800){
  $('body,html').animate({
    scrollTop: objective.offset().top
    }, duration);
}

function resetStars(){
  for(let i=0; i<starsQuantity; i++){
      stars[i].innerHTML = "&#9734;";
      stars[i].classList.remove("rate-hover");
  }
}