/**
 * Jupython Frontend Main Application
 * Gère la validation des formulaires et interactions globales
 */

class JupythonApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupNavigation();
    }

    /**
     * Scroll fluide pour les ancres
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Configure les validations des formulaires
     */
    setupFormValidation() {
        // Contact form - trouvé par la balise form et ses champs
        const contactForm = document.querySelector('form[action="/contact"]');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Autres formulaires login/register sont gérés par leurs fichiers .js spécifiques
    }

    /**
     * Gère la soumission du formulaire de contact
     */
    async handleContactSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');
        const submitButton = form.querySelector('button[type="submit"]');

        // Validation
        let isValid = true;

        if (!name || !name.value.trim()) {
            this.showError(name, 'Le nom est requis');
            isValid = false;
        }

        if (!email || !this.isValidEmail(email.value)) {
            this.showError(email, 'Email invalide');
            isValid = false;
        }

        if (!message || !message.value.trim()) {
            this.showError(message, 'Le message est requis');
            isValid = false;
        }

        if (!isValid) return;

        // Soumettre le formulaire
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            const result = await api.sendContact({
                name: name.value,
                email: email.value,
                subject: 'Message de contact Jupython',
                message: message.value
            });

            this.showSuccess(form, 'Message envoyé avec succès! ✅');
            form.reset();
            setTimeout(() => submitButton.disabled = false, 2000);
            submitButton.textContent = 'Envoyer';
        } catch (error) {
            console.error('Erreur envoi contact:', error);
            this.showError(form, 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer';
        }
    }

    /**
     * Gère la navigation
     */
    setupNavigation() {
        // Mettre à jour l'affichage du menu si utilisateur authentifié
        this.updateNavigationAuth();
    }

    /**
     * Met à jour le menu selon l'authentification
     */
    updateNavigationAuth() {
        const isAuth = api.isAuthenticated();
        const loginLinks = document.querySelectorAll('a[href*="login"]');

        // (à implémenter avec des boutons dynamiques si besoin)
    }

    /**
     * Valide un email
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Affiche une erreur
     */
    showError(element, message) {
        // Supprimer les messages existants
        const existing = element?.parentNode?.querySelector('.error-message');
        if (existing) existing.remove();

        if (element) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
            errorDiv.textContent = '❌ ' + message;
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
            element.classList.add('border-red-500');
        }
    }

    /**
     * Affiche un message de succès
     */
    showSuccess(element, message) {
        if (!element) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg mt-4';
        successDiv.textContent = message;
        element.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 5000);
    }

    /**
     * Nettoie les erreurs
     */
    clearError(element) {
        if (!element) return;
        const error = element.parentNode.querySelector('.error-message');
        if (error) error.remove();
        element.classList.remove('border-red-500');
    }

    /**
     * Configure les filtres pour les cours et classements
     */
    setupFilters() {
        this.setupCourseFilters();
        this.setupRankingFilters();
    }

    /**
     * Filtres de cours
     */
    setupCourseFilters() {
        const courseFilters = document.querySelectorAll('#courses-page select');
        if (courseFilters.length > 0) {
            courseFilters.forEach(filter => {
                filter.addEventListener('change', () => this.filterCourses());
            });
        }
    }

    /**
     * Filtres de classement
     */
    setupRankingFilters() {
        const rankingFilters = document.querySelectorAll('#rankings-page select');
        if (rankingFilters.length > 0) {
            rankingFilters.forEach(filter => {
                filter.addEventListener('change', () => this.filterRankings());
            });
        }
    }

    /**
     * Filtre les cours selon les critères sélectionnés
     */
    filterCourses() {
        const platformFilter = document.querySelector('#courses-page select:nth-child(1)').value;
        const domainFilter = document.querySelector('#courses-page select:nth-child(2)').value;
        const levelFilter = document.querySelector('#courses-page select:nth-child(3)').value;
        const typeFilter = document.querySelector('#courses-page select:nth-child(4)').value;

        const courses = document.querySelectorAll('#courses-page .course-card');

        courses.forEach(course => {
            let show = true;

            if (platformFilter && !course.dataset.platform.includes(platformFilter)) {
                show = false;
            }
            if (domainFilter && !course.dataset.domain.includes(domainFilter)) {
                show = false;
            }
            if (levelFilter && course.dataset.level !== levelFilter) {
                show = false;
            }
            if (typeFilter && course.dataset.type !== typeFilter) {
                show = false;
            }

            course.style.display = show ? 'block' : 'none';
        });
    }

    /**
     * Filtre les classements selon les critères sélectionnés
     */
    filterRankings() {
        const platformFilter = document.querySelector('#rankings-page select:nth-child(1)').value;
        const universityFilter = document.querySelector('#rankings-page select:nth-child(2)').value;
        const levelFilter = document.querySelector('#rankings-page select:nth-child(3)').value;

        const rows = document.querySelectorAll('#rankings-page tbody tr');

        rows.forEach(row => {
            let show = true;

            if (platformFilter && !row.dataset.platform.includes(platformFilter)) {
                show = false;
            }
            if (universityFilter && row.cells[3].textContent !== universityFilter) {
                show = false;
            }
            if (levelFilter && row.dataset.level !== levelFilter) {
                show = false;
            }

            row.style.display = show ? 'table-row' : 'none';
        });
    }

    /**
     * Configure le feedback des formulaires
     */
    setupFormFeedback() {
        // Add loading states and feedback for forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function () {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Envoi en cours...';
                }
            });
        });
    }
}

// Initialiser l'app au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new JupythonApp();
    });
} else {
    new JupythonApp();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
