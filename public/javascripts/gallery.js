const smallPhotos = document.getElementsByClassName('gallery__thumbnail'),
      photosAmount = smallPhotos.length,
      bigPhotos = document.getElementsByClassName('gallery__container--hidden'),
      nextButton = document.getElementsByClassName('nextButton'),
      prevButton = document.getElementsByClassName('prevButton'),
      closeButton = document.getElementsByClassName('container__closeButton'),
      body = document.body;

var curPic,
    mobileViewport = window.matchMedia("screen and (max-width: 500px)");

function init() {
  setBackgroundPhoto();
  if(mobileViewport.matches) {
    //viewport <= 500px
    mobileViewport.addListener((mq) => {
      if(mq.matches) {
        return;
      } else {
        magnifyPhoto();
      }
    });
  } 
  else {
    // viewport > 500px
    magnifyPhoto();
    // anotherPhotoOnKeyPress();
  }
}

init();

function setBackgroundPhoto(photoNum) {
  for(let i=0; i<photosAmount; i++) {
    smallPhotos[i].style.backgroundImage = `url('/images/gallery/gallery${i}-450w-compressor.jpeg')`;
  }
}

function magnifyPhoto() {
  for(let i=0; i<photosAmount; i++) {
    smallPhotos[i].addEventListener("click", function() {
      bigPhotos[i].classList.add('gallery__container--visible');
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
  let container = document.getElementsByClassName('gallery__container--visible')[0];
  $(container).off().on('click', (e) => {
    if (container !== e.target) return;
    // console.log('7');
    bigPhotos[curPic].classList.remove('gallery__container--visible');
  });
}

function closePhotoByButtonClick() {
  $(closeButton[curPic]).off().on('click', () => {
    // console.log('6');
    bigPhotos[curPic].classList.remove('gallery__container--visible');
  })
}

function anotherPhotoOnButtonClick(button, which) {
  $(button[curPic]).off().on('click', function() {
    bigPhotos[curPic].classList.remove('gallery__container--visible');
    if(which == 'next') {
      curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
      // console.log('2', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      setUpFunctionality();
    } else {
      curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
      // console.log('3', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      setUpFunctionality();
    }
  });
}

function anotherPhotoOnKeyPress() {
  $(document).off().on('keyup', (event) => {
    let keyName = event.key;
    bigPhotos[curPic].classList.remove('gallery__container--visible');
    if(keyName === 'ArrowRight') {
      // console.log('4', curPic);
      curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
      bigPhotos[curPic].classList.add('gallery__container--visible');
      setUpFunctionality();
    }
    else if(keyName === 'ArrowLeft') {
      // console.log('5', curPic);
      curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
      bigPhotos[curPic].classList.add('gallery__container--visible');
      setUpFunctionality();
    }
  });
}
