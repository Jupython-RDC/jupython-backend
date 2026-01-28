/**
 * Jupython Courses Page
 * Gère l'affichage et le filtrage des formations
 */

class CoursesPage {
    constructor() {
        this.courses = [];
        this.init();
    }

    async init() {
        try {
            await this.loadCourses();
        } catch (error) {
            console.warn('Erreur chargement API, utilisation données statiques:', error);
            this.courses = this.getStaticCourses();
        }

        this.setupFilters();
        this.displayCourses(this.courses);
    }

    /**
     * Charge les formations depuis l'API
     */
    async loadCourses() {
        try {
            // ✅ Utilisation correcte de l'API client
            const data = await api.getFormations();
            this.courses = Array.isArray(data) ? data : (data.results || []);
            return;
        } catch (error) {
            console.error('Erreur API formations:', error);
            throw error;
        }
    }

    /**
     * Données statiques si l'API ne fonctionne pas
     */
    getStaticCourses() {
        return [
            {
                id: 1,
                title: 'Introduction to Cybersecurity',
                platform: 'Cisco',
                domain: 'Cybersécurité',
                level: 'Débutant',
                type: 'Vidéos',
                duration: '15 heures',
                description: 'Apprentissage des concepts fondamentaux de la cybersécurité',
                link: 'https://www.netacad.com/',
                is_free: true
            },
            {
                id: 2,
                title: 'Python pour débutants',
                platform: 'Udemy',
                domain: 'Programmation',
                level: 'Débutant',
                type: 'Cours interactifs',
                duration: '20 heures',
                description: 'Apprendre Python depuis zéro',
                link: 'https://www.udemy.com/',
                is_free: true
            },
            {
                id: 3,
                title: 'Azure Fundamentals',
                platform: 'Microsoft Learn',
                domain: 'Cloud',
                level: 'Débutant',
                type: 'Certificats',
                duration: '8 heures',
                description: 'Les bases de Microsoft Azure',
                link: 'https://learn.microsoft.com/fr-fr/training/',
                is_free: true
            },
            {
                id: 4,
                title: 'Réseaux informatiques',
                platform: 'Cisco',
                domain: 'Réseau',
                level: 'Intermédiaire',
                type: 'Vidéos',
                duration: '30 heures',
                description: 'Maîtriser les réseaux informatiques',
                link: 'https://www.netacad.com/',
                is_free: true
            },
            {
                id: 5,
                title: 'Machine Learning avec Python',
                platform: 'Coursera',
                domain: 'IA',
                level: 'Avancé',
                type: 'Cours interactifs',
                duration: '40 heures',
                description: 'Approfondir le machine learning',
                link: 'https://www.coursera.org/',
                is_free: true
            },
            {
                id: 6,
                title: 'Web Development Bootcamp',
                platform: 'Udemy',
                domain: 'Dev Web',
                level: 'Débutant',
                type: 'Cours interactifs',
                duration: '50 heures',
                description: 'Devenir développeur web complet',
                link: 'https://www.udemy.com/',
                is_free: false
            }
        ];
    }

    /**
     * Configure les filtres
     */
    setupFilters() {
        // Sélecteurs de filtres
        const filters = document.querySelectorAll('select');

        if (filters.length < 2) {
            console.warn('Nombre insuffisant de filtres trouvés');
            return;
        }

        // Ajouter les écouteurs d'événements
        filters.forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });
    }

    /**
     * Applique les filtres
     */
    applyFilters() {
        const selects = document.querySelectorAll('select');

        let platform = '';
        let domain = '';
        let category = '';
        let level = '';
        let type = '';

        // Récupérer les valeurs des sélects
        if (selects[1]) platform = selects[1].value;
        if (selects[2]) domain = selects[2].value;
        if (selects[3]) category = selects[3].value;
        if (selects[4]) level = selects[4].value;
        if (selects[5]) type = selects[5].value;

        // Filtrer les cours
        const filtered = this.courses.filter(course => {
            if (platform && platform !== 'Plateforme' && course.platform !== platform) return false;
            if (domain && domain !== 'Domaine' && course.domain !== domain) return false;
            if (level && level !== 'Niveau' && course.level !== level) return false;
            if (type && type !== 'Type' && course.type !== type) return false;
            return true;
        });

        this.displayCourses(filtered);
    }

    /**
     * Affiche les cours dans le DOM
     */
    displayCourses(courses) {
        const container = document.querySelector('.grid:last-of-type');
        if (!container) {
            console.warn('Conteneur de cours non trouvé');
            return;
        }

        // Garder les cartes existantes (cartes statiques) et ajouter les dynamiques
        const existingCards = container.querySelectorAll('div:not(.course-card)').length;

        // Supprimer uniquement les cartes dynamiques (class='course-card')
        document.querySelectorAll('.course-card').forEach(card => {
            if (card.getAttribute('data-platform')) {
                card.remove();
            }
        });

        // Si aucun résultat après filtre
        if (courses.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'col-span-full text-center py-8';
            noResults.innerHTML = '<p class="text-gray-400">Aucun cours ne correspond à vos critères.</p>';
            container.appendChild(noResults);
            return;
        }

        // Ajouter les cartes de cours
        courses.forEach(course => {
            const card = this.createCourseCard(course);
            container.appendChild(card);
        });
    }

    /**
     * Crée une carte de cours
     */
    createCourseCard(course) {
        const div = document.createElement('div');
        div.className = 'bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col course-card';
        div.setAttribute('data-platform', course.platform);
        div.setAttribute('data-domain', course.domain);
        div.setAttribute('data-level', course.level);
        div.setAttribute('data-type', course.type);

        const badge = course.is_free
            ? '<span class="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 w-max">Gratuit</span>'
            : '<span class="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 w-max">Payant</span>';

        div.innerHTML = `
            <h3 class="font-bold text-lg mb-1">${course.title}</h3>
            <div class="text-gray-400 text-sm mb-1">Plateforme : ${course.platform}</div>
            <div class="text-gray-400 text-sm mb-1">Domaine : ${course.domain}</div>
            <div class="text-gray-400 text-sm mb-1">Niveau : ${course.level}</div>
            <div class="text-gray-400 text-sm mb-1">Type : ${course.type}</div>
            <div class="text-gray-400 text-sm mb-1">Durée : ${course.duration || 'N/A'}</div>
            <p class="text-gray-400 text-sm mb-2">${course.description || ''}</p>
            ${badge}
            <div class="flex gap-2 mt-2">
                <a href="${course.link}" target="_blank" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">Voir la formation</a>
                <button onclick="api.enrollCourse(${course.id})" class="bg-gray-700 hover:bg-gray-600 text-orange-300 font-semibold px-4 py-2 rounded-lg transition text-sm">S'inscrire</button>
            </div>
        `;

        return div;
    }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CoursesPage();
    });
} else {
    new CoursesPage();
}
