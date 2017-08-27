(() => {
  
//Variables
  //Immutable
        //DOM Elements
  const stars = document.querySelectorAll('#rate span'),
        landpage = document.getElementById('landpage'),
        aboutUsButton = document.getElementById('aboutUsButton'),
        loginAlert = document.getElementById('loginAlert'),
        formNewComment = $('#formNewComment'),
        formNewCommentWrapper = document.getElementById('formNewCommentWrapper'),
        allComments = document.querySelectorAll('.panel--comments__comments-wrapper .comments-wrapper__comment'),
        
        //CSS Class names
        displayNone = 'display--none',
        visibilityVisible = 'visibility--visible',
        formNewCommentWrapperVisible = 'form-new-comment--wrapper--visible',
        rateByStarsHover = 'rate-by-stars--hover',
        halfVisibleComment = 'comments-wrapper__comment--half-visible',
        buttonActive = 'collapse__buttons--active',
        landpageVisible = 'landpage--visible',
        dropdownWrap = '.content__dropdown-wrapper',
        dropdownContent = '.dropdown-wrapper__menu',
        commentsWrapper = '#commentsWrapper',
        
        //Values
        months = [ '0', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca',
                   'sierpnia', 'września', 'października', 'listopada', 'grudnia',
        ],
        starsQuantity = stars.length;

  //Mutable
  let clickedStar = 0,
      allCommentsLen = allComments.length, //this value changes when user post a comment
      commentsExpanded = false,
      url = 'https://evening-hamlet-47726.herokuapp.com',
      allCommentsOriginalText = [],
      allDropdownMenus = $(dropdownContent);

      //getting copy of original comment text in order to use by function editComment
      for(let i=allComments.length-1; i>=0; i--) {
        allCommentsOriginalText.push(allComments[i].childNodes[3].childNodes[7].innerText.trim());
      }
      //Dev or Deploy? check
      if(/^http\:\/\/localhost/.test(window.location.href)){
        url = 'http://localhost:3000';
      }

//Classes
  class dateNow {
    constructor() {
      this.today = new Date();
      this.dd = this.today.getDate();
      this.mm = this.today.getMonth()+1;//January is 0!
      this.yyyy = this.today.getFullYear();
    }
    getDay() {
      if(this.dd<10) {
        this.dd = '0'+this.dd;
      }
      return this.dd;
    }
    getMonth() {
      if(this.mm<10) {
        this.mm = '0'+this.mm;
      }
      return this.mm;
    }
    getYear() {
      return this.yyyy;
    }
  }

//Functions Call
  partlyHideLongText();
  showWholeText();
  showAllComments();
  setNavigationForAboutUsButton();
  hideLandingPage();
  rateComment();
  dateFormat(document);
  showHideDropdownMenu();
  showNewCommentForm();
  postNewComment();
  destroyComment();
  editComment();

//Functions
  function partlyHideLongText() {
    for(let i=0; i<allCommentsLen; i++) {
      let textNode = allComments[i].childNodes[3].childNodes[7],
          inText = textNode.innerText.trim();

      if(inText.length>150) {
        let button = `<button class="show-whole-text" data-comIndex="${allCommentsLen-1-i}">...zobacz więcej</button>`;
        textNode.innerText = inText.slice(0, 150) + '(..)';
        textNode.insertAdjacentHTML('beforeend', button);
      }
    }
  }

  function showWholeText() {
    $(commentsWrapper).on('click', '.show-whole-text', function() {
      let comIndex = this.getAttribute('data-comIndex');
      this.parentNode.innerText = allCommentsOriginalText[comIndex];
    });
  }

  function showAllComments() {
    $(commentsWrapper).on('click', '.comments-wrapper__comment--half-visible', function() {
      let hiddenComs = document.querySelectorAll('.comments-wrapper__comment.display--none');
      this.classList.remove(halfVisibleComment);
      commentsExpanded = true;
      for(let i=0, len=hiddenComs.length; i<len; i++) {
        hiddenComs[i].classList.remove(displayNone);
      }
    });
  }

  function setNavigationForAboutUsButton() {
    aboutUsButton.addEventListener('click', function() {
      $(landpage).remove();
      this.classList.add(buttonActive);
    });
  }

  function hideLandingPage() {
    if(window.location.hash === '#about-us') {
      landpage.classList.remove(landpageVisible);
      $(landpage).remove();
    }

    landpage.addEventListener("transitionend", function() {
      $(landpage).remove();
    });

    $('#button-getStarted').one('click', function() {
      $(this).removeClass('pulse');
      landpage.classList.remove(landpageVisible);
      landpage.classList.add('landpage--hidden');
      aboutUsButton.classList.add(buttonActive);
    });
  }

  function rateComment() {
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

  function dateFormat(objective) {
    let dateFields = objective.querySelectorAll('.content__date'),
        //today
        toDate = new dateNow(),
        toDay = toDate.getDay(),
        toMonth = toDate.getMonth(),
        toYear = toDate.getYear();

    for(let i=0, len = dateFields.length; i<len; i++) {
      let comDate = new Date(dateFields[i].innerText),
          comMinutes = comDate.getMinutes(),
          comDay = comDate.getDate(),
          comMonth = comDate.getMonth() + 1,
          comYear = comDate.getFullYear(),
          dayComparison = toDay - comDay,
          comTime = `${comDate.getHours()}:${comMinutes<10?'0':''}${comMinutes}`;
      if(toYear == comYear) {
        if(toMonth == comMonth) {
          if(dayComparison === 0){
            dateFields[i].innerText = `Dziś o ${comTime}`;
          } else if(dayComparison === 1){
            dateFields[i].innerText = `Wczoraj o ${comTime}`;
          } else {
            dateFields[i].innerText = `${dayComparison} dni temu`;
          }
        } else {
          dateFields[i].innerText = `${comDay} ${months[comMonth]}`;
        }
      } else {
        dateFields[i].innerText = `${comDay} ${months[comMonth]} ${comYear}`;
      }
      $(dateFields[i]).show(0);
    }
  }

  function showHideDropdownMenu() {
    // show dropdown
    $(commentsWrapper).on('click', dropdownWrap, function() {
        
        let thisMenu = $(this).find(dropdownContent);
        allDropdownMenus.not(thisMenu).removeClass(visibilityVisible);
        thisMenu.toggleClass(visibilityVisible);
    });
    // hide dropdown
    $(document).on('click', (event) => {
      if (!$(event.target).closest(dropdownWrap).length) {
        allDropdownMenus.removeClass(visibilityVisible);
      }
    });
  }

  function showNewCommentForm() {
    let button = document.getElementById('button-addOpinion');
    button.addEventListener('click', function() {
      this.classList.add('visibility--hidden');
      formNewCommentWrapper.classList.add(formNewCommentWrapperVisible);
    });
  }

  function postNewComment() {
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
      url: url,
      data: data,
      success: (commentId) => {
                 data.commentId = commentId;
                 formNewComment[0].reset();
                 resetStars();
                 clickedStar = 0;
                 displayPostedComment(data);
                 allCommentsOriginalText.push(data.commentText);
                 allCommentsLen++;
                 allDropdownMenus = $(dropdownContent);
               },
      error: error,
    });
  }

  function displayPostedComment(data) {
    // console.log('dataL!!!!!', data);
    let commentRating = '',
        template = $('#commentHiddenTemplate').children().clone()[0],
        yellowBackground = 'comment__content--new',
        jsNewCommentClass = 'js-new-comment';
    for(let i=0; i<data.numOfStars; i++) {
      commentRating += '&#9733;';
    }
    template.getElementsByClassName('comment__content')[0].classList.add(yellowBackground, jsNewCommentClass);
    template.getElementsByTagName('img')[0].setAttribute('src', data.commentAvatar);
    template.getElementsByClassName('content__author')[0].innerText = data.commentAuthor;
    template.getElementsByClassName('content__rate')[0].innerHTML = commentRating;
    template.getElementsByClassName('content__text')[0].innerText = data.commentText;
    template.getElementsByClassName('content__date')[0].innerText = Date();
    let elem = template.getElementsByClassName('dropdown-wrapper__menu')[0];
        elem.setAttribute('data-commentId', data.commentId);
        elem.setAttribute('data-comIndex', allCommentsLen);
    dateFormat(template);

    $(template.outerHTML).prependTo(commentsWrapper).promise().done( () => {
      // console.log(allComments);
      //removes yellow background after couple of seconds
      setTimeout(() => {
        let jsNewCommentElement = document.getElementsByClassName(jsNewCommentClass);
        // console.log(jsNewCommentElement);
        if(jsNewCommentElement.length > 0) {
          jsNewCommentElement[jsNewCommentElement.length-1].classList.remove(yellowBackground, jsNewCommentClass);
        }
      }, 10000);
    });
  }

  function destroyComment() {
    $(commentsWrapper).on('click', '.button-DeleteComment', function() {
      // console.log('Delete button - Click!');
      let data = {
        'commentId': this.parentNode.getAttribute('data-commentId')
      };
      $.ajax({
        type: 'DELETE',
        url: url,
        data: data,
        success: () => {
          deleteComFromDOM(this);
          displayHiddenCom();
        },
        error: error,
        });
    
      function deleteComFromDOM(elem) {
        let comment = elem.parentNode.parentNode.parentNode;
        comment.parentNode.removeChild(comment);
      }

      function displayHiddenCom() {
        if(!commentsExpanded) {
          let halfVisibleCom = document.querySelector('.comments-wrapper__comment.comments-wrapper__comment--half-visible'),
              hiddenCom = document.querySelector('.comments-wrapper__comment.display--none');

          if(halfVisibleCom) {
            halfVisibleCom.classList.remove(halfVisibleComment);
            if(hiddenCom) {
              hiddenCom.classList.remove(displayNone);
              hiddenCom.classList.add(halfVisibleComment);
            }
          }
        }
      }
    });
  }

  function editComment() {
    let dropdownBtn = document.getElementsByClassName('dropdown-wrapper__button'),
        data = {};

    $(commentsWrapper).on('click', '.button-EditComment', function() {
      let comIndex = this.parentNode.getAttribute('data-comIndex'),
          editForm = `<form id='edit-form' class='content__edit-form'>
                        <textarea id='text-area' class='edit-form__textarea'>${allCommentsOriginalText[comIndex]}</textarea>
                        <div class='edit-form__buttons-container'>
                          <button type='button' id='buttonAccept' class='button button--small button--accept'>Zatwierdź</button>
                          <button type='button' id='buttonCancel' class='button button--small button--cancel'>Anuluj</button>
                        </div>
                      </form>`,
          textNode = this.parentNode.parentNode.parentNode.childNodes[3].childNodes[7];
      data.commentId = this.parentNode.getAttribute('data-commentId');
      // console.log('clickKK', textNode);

      textNode.innerHTML = editForm;
      acceptEvent();
      cancelEvent();
      showHideDropdownBtn(dropdownBtn, 'add');

      function acceptEvent() {
        let button = document.getElementById('buttonAccept');
        button.addEventListener('click', function() {
          // console.log('click');
          data.newText = document.getElementById('text-area').value;
          updateCommentToDb(data);
          showHideDropdownBtn(dropdownBtn, 'remove');
        });
      }

      function cancelEvent() {
        let button = document.getElementById('buttonCancel');
        button.addEventListener('click', function() {
          textNode.innerText = allCommentsOriginalText[comIndex];
          showHideDropdownBtn(dropdownBtn, 'remove');
          // console.log('click');
        });
      }

      function showHideDropdownBtn(element, action) {
        for(let i=0, len=element.length; i<len; i++) {
          if(action === 'add') {
            element[i].classList.add(displayNone);
          } else {
            element[i].classList.remove(displayNone);
          }
        }
      }

      function updateCommentToDb(data) {
        // console.log(data);
        $.ajax({
          type: 'PUT',
          url: url,
          data: data,
          success: () => { displayEditedComment(data.newText); },
          error: error,
        });
      }

      function displayEditedComment(newText) {
        textNode.innerText = newText;
        allCommentsOriginalText[comIndex] = newText;
      }
    });
  }

  function error(jqXHR, textStatus, errorThrown) {
    console.log('Error', jqXHR, textStatus, errorThrown);
  }
    
  function resetStars(){
    for(let i=0; i<starsQuantity; i++){
        stars[i].innerHTML = '&#9734;';
        stars[i].classList.remove(rateByStarsHover);
    }
  }
})();