/**
 * Mobile Menu - Amélioration du responsive design
 */

class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        // Créer le bouton menu mobile si pas de nav mobile
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const header = document.querySelector('header');
        if (!header) return;

        // Vérifier si le menu mobile existe déjà
        const existingToggle = header.querySelector('[data-mobile-menu-toggle]');
        if (existingToggle) return;

        // Créer le bouton hamburger
        const nav = header.querySelector('nav');
        if (!nav) return;

        const toggle = document.createElement('button');
        toggle.setAttribute('data-mobile-menu-toggle', 'true');
        toggle.className = 'md:hidden flex flex-col gap-1 focus:outline-none';
        toggle.innerHTML = `
            <span class="w-6 h-0.5 bg-white transition-transform"></span>
            <span class="w-6 h-0.5 bg-white transition-opacity"></span>
            <span class="w-6 h-0.5 bg-white transition-transform"></span>
        `;

        // Insérer avant la nav
        nav.parentNode.insertBefore(toggle, nav);

        // Rendre le nav responsif
        nav.classList.add('hidden', 'absolute', 'top-full', 'left-0', 'right-0', 'bg-gray-900', 'flex-col', 'p-4', 'gap-2', 'md:flex', 'md:flex-row', 'md:position-static', 'md:bg-transparent', 'md:p-0', 'md:gap-6');
        nav.id = 'mobile-nav';

        // Ajouter le listener
        toggle.addEventListener('click', () => this.toggleMenu());
    }

    toggleMenu() {
        const nav = document.getElementById('mobile-nav');
        const toggle = document.querySelector('[data-mobile-menu-toggle]');
        
        if (nav.classList.contains('hidden')) {
            nav.classList.remove('hidden');
            nav.classList.add('flex');
            toggle.classList.add('active');
        } else {
            nav.classList.add('hidden');
            nav.classList.remove('flex');
            toggle.classList.remove('active');
        }
    }
}

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileMenu();
    });
} else {
    new MobileMenu();
}
