const smallPhotos = document.getElementsByClassName('gallery__thumbnail'),
      photosAmount = smallPhotos.length,
      bigPhotos = document.getElementsByClassName('gallery__container--hidden'),
      nextButton = document.getElementsByClassName('nextButton'),
      prevButton = document.getElementsByClassName('prevButton'),
      body = document.body;

var curPic;

function init() {
  magnifyPhoto();
}

init();

function magnifyPhoto() {
  for(let i=0; i<photosAmount; i++) {
    smallPhotos[i].addEventListener("click", function() {
      bigPhotos[i].classList.add('gallery__container--visible');
      curPic = i;
      // console.log('1', curPic);
      closePhoto();
      anotherPhotoOnButtonClick(nextButton, 'next');
      anotherPhotoOnButtonClick(prevButton, 'prev');
      anotherPhotoOnKeyPress();
    });
    setBackgroundPhoto(i);
  }
}

function closePhoto() {
  let container = document.getElementsByClassName('gallery__container--visible')[0];
  container.addEventListener('click', (e) => {
    if (container !== e.target) return;
    bigPhotos[curPic].classList.remove('gallery__container--visible');
  });
}

function setBackgroundPhoto(photoNum) {
  smallPhotos[photoNum].style.backgroundImage = `url('/images/gallery/gallery${photoNum}.jpeg')`;
}

function anotherPhotoOnButtonClick(button, which) {
  $(button[curPic]).off().on('click', function() {
    bigPhotos[curPic].classList.remove('gallery__container--visible');
    if(which == 'next') {
      curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
      // console.log('2', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      closePhoto();
      anotherPhotoOnButtonClick(nextButton, 'next');
      anotherPhotoOnButtonClick(prevButton, 'prev');
    } else {
      curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
      // console.log('3', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      closePhoto();
      anotherPhotoOnButtonClick(nextButton, 'next');
      anotherPhotoOnButtonClick(prevButton, 'prev');
    }
  });
}

function anotherPhotoOnKeyPress() {
  $(document).off().on('keyup', (event) => {
    let keyName = event.key;
    bigPhotos[curPic].classList.remove('gallery__container--visible');
    if(keyName === 'ArrowRight') {
      curPic = curPic+1 >= photosAmount ? 0 : curPic+1;
      // console.log('4', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      closePhoto();
      anotherPhotoOnButtonClick(nextButton, 'next');
      anotherPhotoOnButtonClick(prevButton, 'prev');
      anotherPhotoOnKeyPress()
    }
    else if(keyName === 'ArrowLeft') {
      curPic = curPic-1 <= -1 ? photosAmount-1 : curPic-1;
      // console.log('5', curPic);
      bigPhotos[curPic].classList.add('gallery__container--visible');
      closePhoto();
      anotherPhotoOnButtonClick(nextButton, 'next');
      anotherPhotoOnButtonClick(prevButton, 'prev');
      anotherPhotoOnKeyPress()
    }
  });
}
