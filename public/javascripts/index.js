const stars = document.querySelectorAll('#rate span'),
      starsQuantity = stars.length,
      // form = $('#comment-form'),
      landpage = document.getElementById('landpage'),
      aboutUsButton = document.getElementById('aboutUsButton'),
      loginAlert = document.getElementById('loginAlert'),
      formNewComment = $('#formNewComment'),
      formNewCommentWrapper = document.getElementById('formNewCommentWrapper'),
      months = [ 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca',
                 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
      ],

      //class_names:
      formNewCommentWrapperVisible = 'form-new-comment--wrapper--visible',
      rateByStars = 'rate-by-stars',
      rateByStarsHover = 'rate-by-stars--hover';


var clickedStar = 0;
landpageIsHidden = false;

function init() {
  setNavigationForAboutUsButton();

  hideLandingPage();
  landpageIsHiddenIsTRUE();

  rateComment();
  dateFormat(document);
  showHideDropdownMenu();

  addOpinionButtonAction();
  addFunctionPostComment();
  addFunctionDestroyComment();
  addFunctionEditComment();
} 

init();

function setNavigationForAboutUsButton() {
  aboutUsButton.addEventListener('click', function() {
    landpage.remove();
    landpageIsHidden = true;
    this.classList.add('collapse__buttons--active')
  });
}

function hideLandingPage(){
  landpage.addEventListener("transitionend", function() {
    this.remove();
    landpageIsHidden = true;
  });
  $('#button-getStarted').one('click', function() {
    $(this).removeClass('pulse');
    landpage.classList.add('landpage--hidden');
    aboutUsButton.classList.add('collapse__buttons--active');
  });
}

function landpageIsHiddenIsTRUE() {
  if(window.location.hash === '#about-us') {
    landpageIsHidden = true;
  }
}

function rateComment(){
    function piceofCode(i){
      stars[i].innerHTML = '&#9733;';
      stars[i].classList.add(rateByStarsHover);
    }
    for(let i=0; i<starsQuantity; i++){
        stars[i].addEventListener('click', function(){
            clickedStar = this.getAttribute('value');
            document.querySelector('#rateNum').setAttribute('value', clickedStar);
            resetStars();
            for(let i=0; i<clickedStar; i++){piceofCode(i);}
        });
        stars[i].addEventListener('mouseenter', function(){
            resetStars();
            for(let i=0; i<this.getAttribute('value'); i++){piceofCode(i);}
        });
        stars[i].addEventListener('mouseleave', () => {
            resetStars();
            for(let i=0; i<clickedStar; i++){piceofCode(i);}
        });
    }
}

function dateFormat(objective){
  let dateFields = objective.querySelectorAll('.content__date'),
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
  let commentDropdown = (!objective) ? $(document.querySelectorAll('.content__dropdown-wrapper')):$(objective),
      allDropdownMenus = commentDropdown.find('.dropdown-wrapper__menu');
  commentDropdown.each( function() {
    $(this).off().on('click', () => {
      let thisMenu = $(this).find('.dropdown-wrapper__menu');
      allDropdownMenus.not(thisMenu).removeClass('visibility--visible');
      thisMenu.toggleClass('visibility--visible');
    });
  });
  // hide dropdown
  $(document).on('click', (event) => {
    if (!$(event.target).closest('.content__dropdown-wrapper').length) {
      allDropdownMenus.removeClass('visibility--visible');
    }
  });
}

function addOpinionButtonAction() {
  let button = document.getElementById('button-addOpinion');
  button.addEventListener('click', function() {
    this.classList.add('visibility--hidden');
    formNewCommentWrapper.classList.add(formNewCommentWrapperVisible);
  });
}

function addFunctionPostComment() {
  $('#button-sendOpinion').click(() => {
    let data = {
        'numOfStars': formNewComment.find('#rateNum').val(),
        'commentText': formNewComment.find('#text').val(),
        'commentAvatar': formNewComment.find('#avatar').val(),
        'commentAuthor': formNewComment.find('#currentuser').val()
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
    // url: 'http://localhost:3000/',
    url: 'https://evening-hamlet-47726.herokuapp.com/',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    success: (commentId) => {
               data.commentId = commentId;
               formNewComment[0].reset();
               resetStars();
               clickedStar = 0;
               displayPostedComment(data);
               addFunctionDestroyComment();
               addFunctionEditComment();
             },
    error: error,
  });
}

function displayPostedComment(data) {
  // console.log('dataL!!!!!', data);
  let commentRating = '',
      template = $('#commentHiddenTemplate').children().clone()[0];
  for(let i=0; i<data.numOfStars; i++) {
    commentRating += '&#9733;';
  }
  template.getElementsByTagName('img')[0].setAttribute('src', data.commentAvatar);
  template.getElementsByClassName('content__author')[0].innerText = data.commentAuthor;
  template.getElementsByClassName('content__rate')[0].innerHTML = commentRating;
  template.getElementsByClassName('content__text')[0].innerText = data.commentText;
  template.getElementsByClassName('content__date')[0].innerText = Date();
  $(template.getElementsByClassName('button-DeleteComment')[0]).parent().attr('data', data.commentId);
  dateFormat(template);
  $(template.outerHTML).appendTo('#commentsWrapper')
  showHideDropdownMenu(document.querySelectorAll('.content__dropdown-wrapper'));
}

function addFunctionDestroyComment(){
  let buttonDeleteComment = $('.button-DeleteComment');
  buttonDeleteComment.each(function(){
    $(this).on('click', () => {
    let data = {
      'commentId': $.trim($(this).parent().attr('data'))
    };
    // console.log('commentId: ', commentId);
    $.ajax({
      // url: 'http://localhost:3000/',
      url: 'https://evening-hamlet-47726.herokuapp.com',
      data: data,
      type: 'DELETE',
      success: () => {
        $(this).closest('.comments-wrapper__comment').remove();
      },
      error: error,
      });
    });
  });
}

function addFunctionEditComment() {
  let buttonEditComment = $('.button-EditComment'),
      btnToggleDropdown = $(document.querySelectorAll('.dropdown-wrapper__button'));

  buttonEditComment.each(function(){
    $(this).on('click', () => {
      let data = {
            'commentId': $(this).parent().attr('data')
          },
          commentContent = $(this).closest('div.comments-wrapper__comment'),
          textDiv = commentContent.find('div.content__text'),
          oldCommentText = textDiv.text().trim(),
          editForm = `<form id='edit-form' class='content__edit-form'>
                        <textarea id='text-area' class='edit-form__textarea'>${oldCommentText}</textarea>
                        <div class='edit-form__buttons-container'>
                          <button type='button' id='buttonAccept' class='button button--small button--accept'>Zatwierdź</button>
                          <button type='button' id='buttonCancel' class='button button--small button--cancel'>Anuluj</button>
                        </div>
                      </form>`;
                      
      btnToggleDropdown.addClass('display--none');
      textDiv.replaceWith(editForm).promise().done( () => {
        let editForm = commentContent.find('#edit-form');
        //button-accept
        commentContent.find('#buttonAccept').on('click', () => {
          data.editFormText = editForm.find('#text-area').val();
          let newTextDiv = textDiv.text(data.editFormText),
              dataForDisplay = {
                'editForm': editForm,
                'newTextDiv': newTextDiv,
                'btnToggleDropdown': btnToggleDropdown,
              };
          if(data.editFormText !== oldCommentText) {
            updateCommentToDatabase(data, dataForDisplay)
          } 
        });
        //button-cancel
        commentContent.find('#buttonCancel').on('click', () => {
          editForm.replaceWith(textDiv);
          btnToggleDropdown.removeClass('display--none');
        });
      });
    });
  });
}

function updateCommentToDatabase(data, dataForDisplay) {
  $.ajax({
  type: 'PUT',
  // url: 'http://localhost:3000/',
  url: 'https://evening-hamlet-47726.herokuapp.com',
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
  dataForDisplay.btnToggleDropdown.removeClass('display--none');
}

function error(jqXHR, textStatus, errorThrown) {
  console.log('Error');
}
  
function resetStars(){
  for(let i=0; i<starsQuantity; i++){
      stars[i].innerHTML = '&#9734;';
      stars[i].classList.remove(rateByStarsHover);
  }
}