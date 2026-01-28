/**
 * Jupython Register Page
 * Gère l'inscription des nouveaux utilisateurs
 */

class RegisterPage {
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
        const registerForm = document.querySelector('form');
        if (!registerForm) {
            console.warn('Formulaire d\'inscription non trouvé');
            return;
        }

        registerForm.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
    }

    /**
     * Gère la soumission du formulaire d'inscription
     */
    async handleRegisterSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const fullname = form.querySelector('input[name="fullname"]');
        const email = form.querySelector('input[name="email"]');
        const university = form.querySelector('input[name="university"]');
        const promotion = form.querySelector('input[name="promotion"]');
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm_password"]');
        const submitButton = form.querySelector('button[type="submit"]');

        // Validation
        let isValid = true;

        if (!fullname || !fullname.value.trim()) {
            this.showError(fullname, 'Nom complet requis');
            isValid = false;
        }

        if (!email || !this.isValidEmail(email.value)) {
            this.showError(email, 'Email invalide');
            isValid = false;
        }

        if (!university || !university.value.trim()) {
            this.showError(university, 'Université requise');
            isValid = false;
        }

        if (!password || password.value.length < 6) {
            this.showError(password, 'Mot de passe minimum 6 caractères');
            isValid = false;
        }

        if (!confirmPassword || password.value !== confirmPassword.value) {
            this.showError(confirmPassword, 'Les mots de passe ne correspondent pas');
            isValid = false;
        }

        if (!isValid) return;

        // Tentative d'inscription
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Inscription en cours...';

            const result = await api.register({
                username: email.value, // Utiliser l'email comme username par défaut
                fullname: fullname.value,
                email: email.value,
                university: university.value,
                promotion: promotion ? promotion.value : '',
                password: password.value
            });

            if (result && (result.user_id || result.id)) {
                this.showSuccess(form, 'Inscription réussie! ✅');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                this.showError(form, 'Erreur d\'inscription');
                submitButton.disabled = false;
                submitButton.textContent = 'S\'inscrire';
            }
        } catch (error) {
            console.error('Erreur inscription:', error);
            this.showError(form, error.message || 'Erreur lors de l\'inscription. Vérifiez vos données.');
            submitButton.disabled = false;
            submitButton.textContent = 'S\'inscrire';
        }
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
        const existing = element?.parentNode?.querySelector('.error-message');
        if (existing) existing.remove();

        if (element) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
            errorDiv.textContent = '❌ ' + message;
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
            element.classList.add('border-red-500');
        } else {
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

    /**
     * Nettoie les erreurs
     */
    clearError(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('border-red-500');
    }
}

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RegisterPage();
    });
} else {
    new RegisterPage();
}
