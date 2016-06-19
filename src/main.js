/* Cache for the DOM elements */
var mobileMenuButton = document.querySelector('.js-mobile-menu');
var mobileDrawer     = document.querySelector('.js-mobile-drawer');
var menuDropdowns    = document.querySelectorAll('.js-menu-dropdown');
var lazyLoadedImgs   = document.querySelectorAll('img[data-src]');
var lazyLoadedVideos = document.querySelectorAll('video[data-src]');

/* Global variables */
var openDropdowns = [];

/* Methods*/
function toggleMobileMenu() {
  mobileDrawer.classList.toggle('-opened');
}

function toggleDropdownMenu(e) {
  if(e.currentTarget !== e.target) return;
  var dropdown = e.currentTarget.querySelector('ul');
  var opened = dropdown.classList.toggle('-opened');

  if(opened) {
    openDropdowns.push(dropdown);
    e.stopPropagation();
  } else {
    var index = openDropdowns.indexOf(dropdown);
    if(!!~index) openDropdowns.splice(index, 1);
  }
}

function closeDropdowns() {
  openDropdowns.forEach(function(dropdown) {
    dropdown.classList.remove('-opened');
  });
  openDropdowns = [];
}

function showImage(e) {
  var image = e.currentTarget;
  image.removeAttribute('data-src');
  image.classList.add('-loaded');
}

/* Event listeners */
mobileMenuButton.addEventListener('click', toggleMobileMenu);

Array.prototype.slice.call(menuDropdowns).forEach(function(menuDropdown) {
  menuDropdown.addEventListener('click', toggleDropdownMenu);
});

Array.prototype.slice.call(lazyLoadedImgs).forEach(function(lazyLoadedImg) {
  lazyLoadedImg.addEventListener('load', showImage);
});

document.body.addEventListener('click', closeDropdowns);

/* General code */
Array.prototype.slice.call(lazyLoadedImgs).forEach(function(lazyLoadedImg) {
  lazyLoadedImg.src = lazyLoadedImg.getAttribute('data-src');
});

Array.prototype.slice.call(lazyLoadedVideos).forEach(function(lazyLoadedVideo) {
  if(window.innerWidth >= 768) {
    lazyLoadedVideo.src = lazyLoadedVideo.getAttribute('data-src');
    if(lazyLoadedVideo.getAttribute('data-autoplay') !== null) {
      lazyLoadedVideo.load();
      lazyLoadedVideo.addEventListener('canplaythrough', function() {
        lazyLoadedVideo.classList.add('-loaded');
        lazyLoadedVideo.play();
      });
    }
  }
});
