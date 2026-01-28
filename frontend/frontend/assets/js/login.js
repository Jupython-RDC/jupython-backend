/**
 * Jupython Login Page
 * Gère la connexion des utilisateurs
 */

class LoginPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
    }

    /**
     * Configure la validation du formulaire
     */
    setupFormValidation() {
        const loginForm = document.querySelector('form');
        if (!loginForm) {
            console.warn('Formulaire de connexion non trouvé');
            return;
        }

        loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    }

    /**
     * Gère la soumission du formulaire de connexion
     */
    async handleLoginSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const username = form.querySelector('input[name="username"]') || form.querySelector('input[type="email"]');
        const password = form.querySelector('input[name="password"]') || form.querySelector('input[type="password"]');
        const submitButton = form.querySelector('button[type="submit"]');

        // Validation
        let isValid = true;

        if (!username || !username.value.trim()) {
            this.showError(username, 'Nom d\'utilisateur ou email requis');
            isValid = false;
        }

        if (!password || !password.value.trim()) {
            this.showError(password, 'Mot de passe requis');
            isValid = false;
        }

        if (!isValid) return;

        // Tentative de connexion
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Connexion en cours...';

            // ✅ Utilisation correcte de l'API client
            const result = await api.login(username.value, password.value);

            if (result && result.access) {
                this.showSuccess(form, 'Connexion réussie! ✅');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                this.showError(form, 'Erreur de connexion');
                submitButton.disabled = false;
                submitButton.textContent = 'Se connecter';
            }
        } catch (error) {
            console.error('Erreur connexion:', error);
            this.showError(form, 'Identifiants invalides ou erreur serveur');
            submitButton.disabled = false;
            submitButton.textContent = 'Se connecter';
        }
    }

    /**
     * Affiche une erreur
     */
    showError(element, message) {
        const existing = element?.parentNode?.querySelector('.error-message');
        if (existing) existing.remove();

        if (element) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
            errorDiv.textContent = '❌ ' + message;
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
            element.classList.add('border-red-500');
        } else {
            // Afficher comme message d'erreur du formulaire
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4';
            errorDiv.textContent = message;
            document.querySelector('form').insertBefore(errorDiv, document.querySelector('form').firstChild);
        }
    }

    /**
     * Affiche un message de succès
     */
    showSuccess(element, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg mt-4';
        successDiv.textContent = message;
        element.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LoginPage();
    });
} else {
    new LoginPage();
}
