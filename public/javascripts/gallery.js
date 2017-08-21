var initGallery = (function() {

//Variables
  //Immutable
        //DOM Elements
  const smallPhotos = document.getElementsByClassName('gallery__thumbnail'),
        bigPhotos = document.getElementsByClassName('gallery__fullphoto'),
        nextButton = document.getElementsByClassName('buttons__next-btn'),
        prevButton = document.getElementsByClassName('buttons__prev-btn'),
        closeButton = document.getElementsByClassName('image__close-btn'),
        
        //CSS Class names
        bigPhotoVisible = 'gallery__fullphoto--visible',

        //Values
        photosAmount = smallPhotos.length;
        
  //Mutable
  let curPic;

//Functions Call
  magnifyPhoto();

//Functions
  function magnifyPhoto() {
    for(let i=0; i<photosAmount; i++) {
      smallPhotos[i].addEventListener('click', function() {
        bigPhotos[i].classList.add(bigPhotoVisible);
        curPic = i;
        setUpFunctionality();
        // console.log('1', curPic);
      });
    }
  }

  function setUpFunctionality() {
    closePhotoByOutsideClick();
    closePhotoByButtonClick();
    anotherPhotoOnButtonClick(nextButton, 'next');
    anotherPhotoOnButtonClick(prevButton, 'prev');
    anotherPhotoOnKeyPress();
  }

  function closePhotoByOutsideClick() {
    let container = document.getElementsByClassName(bigPhotoVisible)[0];
    $(container).off().on('click', (e) => {
      if (container !== e.target) return;
      // console.log('7');
      bigPhotos[curPic].classList.remove(bigPhotoVisible);
    });
  }

  function closePhotoByButtonClick() {
    $(closeButton[curPic]).off().on('click', () => {
      // console.log('6');
      bigPhotos[curPic].classList.remove(bigPhotoVisible);
    })
  }

  function anotherPhotoOnButtonClick(button, which) {
    $(button[curPic]).off().on('click', function() {
      bigPhotos[curPic].classList.remove(bigPhotoVisible);
      if(which == 'next') {
        curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
        // console.log('2', curPic);
        bigPhotos[curPic].classList.add(bigPhotoVisible);
        setUpFunctionality();
      } else {
        curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
        // console.log('3', curPic);
        bigPhotos[curPic].classList.add(bigPhotoVisible);
        setUpFunctionality();
      }
    });
  }

  function anotherPhotoOnKeyPress() {
    $(document).off().on('keydown', (event) => {
      let keyName = event.key;
      // console.log(keyName);
      bigPhotos[curPic].classList.remove(bigPhotoVisible);
      if(keyName === 'ArrowRight' || keyName === 'Right') {
        // console.log('4', curPic);
        curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
        bigPhotos[curPic].classList.add(bigPhotoVisible);
        setUpFunctionality();
      }
      else if(keyName === 'ArrowLeft' || keyName === 'Left') {
        // console.log('5', curPic);
        curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
        bigPhotos[curPic].classList.add(bigPhotoVisible);
        setUpFunctionality();
      } else {
        return;
      }
    });
  }
})();