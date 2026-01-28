/**
 * Jupython Rankings Page
 * Gère l'affichage du classement avec filtres
 */

class RankingsPage {
    constructor() {
        this.ranking = [];
        this.init();
    }

    async init() {
        // Charger les classements depuis l'API ou données statiques
        await this.loadRanking();
        this.setupFilters();
        this.displayRanking(this.ranking);
    }

    /**
     * Charge les classements depuis l'API
     */
    async loadRanking() {
        try {
            // ✅ Utilisation correcte de l'API client
            this.ranking = await api.getRanking();
            if (!Array.isArray(this.ranking)) {
                this.ranking = [];
            }
        } catch (error) {
            console.error('Erreur chargement ranking:', error);
            // Fallback avec données statiques de test
            this.ranking = this.getStaticRanking();
        }
    }

    /**
     * Données statiques de secours
     */
    getStaticRanking() {
        return [
            { username: 'Fatou', university: 'Université A', score: 240, level: 'Expert', platform: 'Coursera' },
            { username: 'Jean', university: 'Université B', score: 185, level: 'Advanced', platform: 'Udemy' },
            { username: 'Marie', university: 'Université A', score: 175, level: 'Advanced', platform: 'OpenClassrooms' },
            { username: 'Pierre', university: 'Université C', score: 150, level: 'Intermediate', platform: 'Cisco' },
            { username: 'Sophie', university: 'Université B', score: 120, level: 'Beginner', platform: 'IBM' },
        ];
    }

    /**
     * Configure les filtres de classement
     */
    setupFilters() {
        const filterContainer = document.getElementById('rankings-page');
        if (!filterContainer) {
            console.warn('Élément #rankings-page non trouvé');
            return;
        }

        const selects = filterContainer.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });
    }

    /**
     * Applique les filtres
     */
    applyFilters() {
        const filterContainer = document.getElementById('rankings-page');
        const selects = filterContainer.querySelectorAll('select');

        const platformFilter = selects[0]?.value || '';
        const universityFilter = selects[1]?.value || '';
        const levelFilter = selects[2]?.value || '';

        let filtered = this.ranking.filter(row => {
            if (platformFilter && platformFilter !== 'Plateforme') {
                if (!row.platform || !row.platform.includes(platformFilter)) {
                    return false;
                }
            }
            if (universityFilter && universityFilter !== 'Université') {
                if (!row.university || row.university !== universityFilter) {
                    return false;
                }
            }
            if (levelFilter && levelFilter !== 'Niveau') {
                if (!row.level || row.level !== levelFilter) {
                    return false;
                }
            }
            return true;
        });

        this.displayRanking(filtered);
    }

    /**
     * Affiche le classement
     */
    displayRanking(data) {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-400 py-4">Aucun résultat</td></tr>';
            return;
        }

        data.forEach((user, index) => {
            const badge = this.getBadge(user.score);
            const row = `
                <tr class="border-b border-gray-700 hover:bg-gray-700/30 transition">
                    <td class="px-6 py-4"><div class="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">${index + 1}</div></td>
                    <td class="px-6 py-4 text-white font-semibold">${user.username || 'N/A'}</td>
                    <td class="px-6 py-4 text-gray-300">${user.university || 'N/A'}</td>
                    <td class="px-6 py-4 text-white font-bold text-lg">${user.score || 0}</td>
                    <td class="px-6 py-4"><span class="bg-orange-300 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">${badge}</span></td>
                    <td class="px-6 py-4"><a href="academy/profile.html" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition text-center text-sm">Voir profil</a></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    /**
     * Détermine le badge
     */
    getBadge(score) {
        if (score >= 200) return '⭐ Expert';
        if (score >= 150) return '🎯 Advanced';
        if (score >= 100) return '📈 Intermediate';
        return '🌱 Beginner';
    }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RankingsPage();
    });
} else {
    new RankingsPage();
}
