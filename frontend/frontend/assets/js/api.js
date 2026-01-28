/**
 * Jupython API Client - Version 2.0
 * Gère la communication entre le frontend et le backend Django
 * 
 * Utilisation:
 *   const formations = await api.getFormations();
 *   const ranking = await api.getRanking();
 *   await api.login(username, password);
 *   await api.logout();
 */

class ApiClient {
    constructor() {
        // URL du backend - à ajuster selon l'environnement
        this.baseURL = 'http://127.0.0.1:8000/api';
        this.token = localStorage.getItem('access_token');
    }

    /**
     * Effectue une requête HTTP générique
     * @param {string} endpoint - Le endpoint API (/formations/, /ranking/, etc)
     * @param {object} options - Options fetch (method, body, headers, etc)
     * @returns {Promise} Réponse JSON
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = { ...(options.headers || {}) };

        // Ajouter le token JWT si authentifié
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        headers['Content-Type'] = 'application/json';

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Si token expiré (401), rediriger vers login
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                this.token = null;

                // Rediriger vers login si pas déjà sur la page
                if (!window.location.pathname.includes('login.html')) {
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('/academy/')) {
                        window.location.href = 'login.html';
                    } else {
                        window.location.href = 'academy/login.html';
                    }
                }
                return null;
            }

            // Si erreur serveur
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}`;
                throw new Error(errorMsg);
            }

            // Pas de contenu à retourner (204 No Content)
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    /**
     * ========== FORMATIONS ==========
     */

    async getFormations(filters = {}) {
        try {
            let endpoint = '/formations/';
            if (Object.keys(filters).length > 0) {
                endpoint += '?' + new URLSearchParams(filters).toString();
            }
            return await this.request(endpoint);
        } catch (error) {
            console.error('Erreur chargement formations:', error);
            return [];
        }
    }

    async getFormation(id) {
        try {
            return await this.request(`/formations/${id}/`);
        } catch (error) {
            console.error(`Erreur chargement formation ${id}:`, error);
            return null;
        }
    }

    /**
     * ========== CLASSEMENTS ==========
     */

    async getRanking(filters = {}) {
        try {
            let endpoint = '/ranking/';
            if (Object.keys(filters).length > 0) {
                endpoint += '?' + new URLSearchParams(filters).toString();
            }
            return await this.request(endpoint);
        } catch (error) {
            console.error('Erreur chargement ranking:', error);
            return [];
        }
    }

    /**
     * ========== AUTHENTIFICATION ==========
     */

    async register(userData) {
        try {
            const result = await this.request('/accounts/register/', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return result;
        } catch (error) {
            console.error('Erreur inscription:', error);
            throw error;
        }
    }

    async login(username, password) {
        try {
            const data = await this.request('/accounts/login/', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (data && data.access) {
                this.token = data.access;
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            }

            return data;
        } catch (error) {
            console.error('Erreur connexion:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
                await this.request('/accounts/logout/', {
                    method: 'POST',
                    body: JSON.stringify({ refresh })
                });
            }
        } catch (error) {
            console.error('Erreur déconnexion:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            this.token = null;
        }
    }

    async getProfile() {
        try {
            return await this.request('/accounts/profile/');
        } catch (error) {
            console.error('Erreur chargement profil:', error);
            return null;
        }
    }

    async updateProfile(data) {
        try {
            return await this.request('/accounts/profile/', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            throw error;
        }
    }

    /**
     * ========== CONTACT ==========
     */

    async sendContact(contactData) {
        try {
            return await this.request('/contact/', {
                method: 'POST',
                body: JSON.stringify(contactData)
            });
        } catch (error) {
            console.error('Erreur envoi message:', error);
            throw error;
        }
    }

    /**
     * ========== PROJETS ==========
     */

    async getProjects(filters = {}) {
        try {
            let endpoint = '/projects/';
            if (Object.keys(filters).length > 0) {
                endpoint += '?' + new URLSearchParams(filters).toString();
            }
            return await this.request(endpoint);
        } catch (error) {
            console.error('Erreur chargement projets:', error);
            return [];
        }
    }

    /**
     * ========== INSCRIPTIONS ==========
     */

    async enrollCourse(formationId) {
        try {
            return await this.request('/enrollments/enroll/', {
                method: 'POST',
                body: JSON.stringify({ formation_id: formationId })
            });
        } catch (error) {
            console.error('Erreur inscription formation:', error);
            throw error;
        }
    }

    async getMyEnrollments() {
        try {
            return await this.request('/enrollments/my/');
        } catch (error) {
            console.error('Erreur chargement inscriptions:', error);
            return [];
        }
    }

    /**
     * ========== UTILITAIRES ==========
     */

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getCurrentUsername() {
        const user = this.getUser();
        return user ? user.username : null;
    }
}

// Instance globale du client API
const api = new ApiClient();
