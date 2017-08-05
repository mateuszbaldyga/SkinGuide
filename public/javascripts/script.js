const defaultNavbar = document.getElementById('nav'),
      mobileNavbar = document.getElementById('nav__collapse');
      

var mobileNavIsCollapsed = true,
    path = window.location.pathname + window.location.hash;

function init() {
  navHideShowOnScroll();
  collapseMobileNavbarOnClick()
  setNavigation();
  setNavigationForAboutUsButton();
} 

init();

function navHideShowOnScroll() {
  let lastScrollTop = 0,
      nowScrollTop;
  window.addEventListener('scroll', () => {
    toggleNav();
  });

  function toggleNav() {
    nowScrollTop = window.scrollY;
    if (nowScrollTop > lastScrollTop){
      defaultNavbar.classList.add('nav--hidden');
      mobileNavbar.classList.remove('container__collapse--visible');
    } else {
      defaultNavbar.classList.remove('nav--hidden');
      mobileNavbar.classList.add('container__collapse--visible');
    }
    lastScrollTop = nowScrollTop;
  }
}

function collapseMobileNavbarOnClick() {
  document.getElementById('nav__hamburger').addEventListener('click', function() {
    this.classList.toggle('container__hamburger--open');
    if(mobileNavIsCollapsed) {
      mobileNavbar.classList.add('container__collapse--visible');
      mobileNavIsCollapsed = false;
    } else {
      mobileNavbar.classList.remove('container__collapse--visible');
      mobileNavIsCollapsed = true;
    }
  });
}

function setNavigation() {
  $("#nav__buttons li a").each(function () {
      let path = window.location.pathname + window.location.hash,
          href = $(this).attr("href");
      if (path == href) {
          $(this).addClass('collapse__buttons--active');
      }
  });
}

function setNavigationForAboutUsButton() {
  aboutUsButton.addEventListener('click', function() {
    this.classList.add('collapse__buttons--active')
  });
}

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}