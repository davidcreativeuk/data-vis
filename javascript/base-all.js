function initAll() {
    var menuButton = document.querySelector(".base-navbutton");
    var navMenu = document.querySelector(".base-navbar");
    
    
    menuButton.addEventListener('click', function () {
        
        if (navMenu.classList.contains('base-navbar--open')) {
            this.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('base-navbar--open');
        } else {
            navMenu.classList.add('base-navbar--open');
            this.setAttribute('aria-expanded', 'true');
        }
    });
}