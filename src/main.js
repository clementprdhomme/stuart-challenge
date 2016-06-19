/* Cache for the DOM elements */
var mobileMenuButton = document.querySelector('.js-mobile-menu');
var mobileDrawer     = document.querySelector('.js-mobile-drawer');
var menuDropdowns    = document.querySelectorAll('.js-menu-dropdown');
var lazyLoadedImgs   = document.querySelectorAll('img[data-src]');

/* Methods*/
function toggleMobileMenu() {
  mobileDrawer.classList.toggle('-opened');
}

function toggleDropdownMenu(e) {
  if(e.currentTarget !== e.target) return;
  e.currentTarget.querySelector('ul').classList.toggle('-opened');
}

function showImage(e) {
  var image = e.currentTarget;
  image.removeAttribute('data-src');
  image.classList.add('-loaded');
  console.log('loaded!');
}

/* Event listeners */
mobileMenuButton.addEventListener('click', toggleMobileMenu);
Array.prototype.slice.call(menuDropdowns).forEach(function(menuDropdown) {
  menuDropdown.addEventListener('click', toggleDropdownMenu);
});
Array.prototype.slice.call(lazyLoadedImgs).forEach(function(lazyLoadedImg) {
  lazyLoadedImg.addEventListener('load', showImage);
});

/* General code */
Array.prototype.slice.call(lazyLoadedImgs).forEach(function(lazyLoadedImg) {
  lazyLoadedImg.src = lazyLoadedImg.getAttribute('data-src');
});
