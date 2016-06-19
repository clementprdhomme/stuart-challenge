/* Cache for the DOM elements */
var mobileMenuButton = document.querySelector('.js-mobile-menu');
var mobileDrawer     = document.querySelector('.js-mobile-drawer');
var menuDropdowns    = document.querySelectorAll('.js-menu-dropdown');

/* Methods*/
function toggleMobileMenu() {
  mobileDrawer.classList.toggle('-opened');
}

function toggleDropdownMenu(e) {
  if(e.currentTarget !== e.target) return;
  e.currentTarget.querySelector('ul').classList.toggle('-opened');
}

/* Event listeners */
mobileMenuButton.addEventListener('click', toggleMobileMenu);
Array.prototype.slice.call(menuDropdowns).forEach(function(menuDropdown) {
  menuDropdown.addEventListener('click', toggleDropdownMenu);
});
