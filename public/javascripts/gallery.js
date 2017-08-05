const smallPhotos = document.getElementsByClassName('gallery__thumbnail'),
      bigPhotos = document.getElementsByClassName('gallery__container--hidden'),
      nextButton = document.getElementsByClassName('nextButton'),
      prevButton = document.getElementsByClassName('prevButton'),
      body = document.body;

var currentPhoto;
      

function init() {
  magnifyPhoto();
  anotherPhotoOnButtonClick(nextButton, 'next');
  anotherPhotoOnButtonClick(prevButton, 'prev');
}

init();

function magnifyPhoto() {
  for(let i=0, len=smallPhotos.length; i<len; i++) {
    smallPhotos[i].addEventListener("click", function() {
      bigPhotos[i].classList.add('gallery__container--visible');
      closePhoto(i);
      currentPhoto = i;
    });
    setBackgroundPhoto(i);
  }
}

function closePhoto(photoNum) {
  let container = document.getElementsByClassName('gallery__container--visible')[0];
  container.addEventListener('click', (e) => {
    if (container !== e.target) return;
    bigPhotos[photoNum].classList.remove('gallery__container--visible');
  });
}

function setBackgroundPhoto(photoNum) {
  smallPhotos[photoNum].style.backgroundImage = `url('/images/gallery/gallery${photoNum}.jpeg')`;
}

function anotherPhotoOnButtonClick(button, which) {
  for(let i=0, len=button.length; i<len; i++) {
    button[i].addEventListener('click', function() {
      bigPhotos[i].classList.remove('gallery__container--visible');
      if(which == 'next') {
        let photoNum = i+1 >= len ? 0 : i+1;
        bigPhotos[photoNum].classList.add('gallery__container--visible');
        closePhoto(photoNum);
      } else {
        let photoNum = i-1 <= -1 ? len-1 : i-1;
        bigPhotos[photoNum].classList.add('gallery__container--visible');
        closePhoto(photoNum);
      }
    });
  }
}

function anotherPhotoOnKeyPress(photoNum, len) {
document.addEventListener('keydown', (event) => {
  let keyName = event.key;
  console.log(keyName);
  bigPhotos[photoNum].classList.remove('gallery__container--visible');
  if(keyName === 'ArrowRight') {
    let newPhotoNum = photoNum+1 >= len ? 0 : photoNum+1;
        bigPhotos[newPhotoNum].classList.add('gallery__container--visible');
        anotherPhotoOnKeyPress(newPhotoNum, len);
  }
  else if(keyName === 'ArrowLeft') {
let newPhotoNum = photoNum-1 <= -1 ? len-1 : photoNum-1;
        bigPhotos[newPhotoNum].classList.add('gallery__container--visible');
        anotherPhotoOnKeyPress(newPhotoNum, len);
  }
});
}
