function initAll() {
    var menuButton = document.querySelector(".david-navbutton");
    var navMenu = document.querySelector(".david-navbar");
    
    
    menuButton.addEventListener('click', function () {
        
        if (navMenu.classList.contains('david-navbar--open')) {
            this.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('david-navbar--open');
        } else {
            navMenu.classList.add('david-navbar--open');
            this.setAttribute('aria-expanded', 'true');
        }
    });
}