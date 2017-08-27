(() => {
//Variables
  //Immutable
        //DOM Elements
  const defaultNavbar = document.getElementById('nav'),
        mobileNavbar = document.getElementById('nav__collapse'),
        
        //CSS Class names
        navHidden = 'nav--hidden',
        mobileNavVisible = 'container__collapse--visible';

  //Mutable
  let mobileNavIsCollapsed = true;

//Functions Call
  navHideShowOnScroll();
  collapseMobileNavbarOnClick();
  setNavigation();

//Functions
  function navHideShowOnScroll() {
    let lastScrollTop = 0,
        delta = 10,
        nowScrollTop;
      window.addEventListener('scroll', () => {
        // console.log('scrolled');
        if(mobileNavIsCollapsed) {
          toggleNav();
        }
      });

    function toggleNav() {
      nowScrollTop = window.pageYOffset;
      if(Math.abs(lastScrollTop - nowScrollTop) <= delta) {
        return;
      }
      // console.log(nowScrollTop);
      if (nowScrollTop - delta > lastScrollTop){
        defaultNavbar.classList.add(navHidden);
      } else {
        defaultNavbar.classList.remove(navHidden);
      }
      lastScrollTop = nowScrollTop;
    }
  }

  function collapseMobileNavbarOnClick() {
    document.getElementById('nav__hamburger').addEventListener('click', function() {
      this.classList.toggle('container__hamburger--open');
      if(mobileNavIsCollapsed) {
        mobileNavbar.classList.add(mobileNavVisible);
        mobileNavIsCollapsed = false;
      } else {
        mobileNavbar.classList.remove(mobileNavVisible);
        mobileNavIsCollapsed = true;
      }
    });
  }

  function setNavigation() {
    $('#nav__buttons li a').each(function () {
        let path = window.location.pathname + window.location.hash,
            href = $(this).attr('href');
        if (path === href) {
            $(this).addClass('collapse__buttons--active');
        }
    });
  }
})();