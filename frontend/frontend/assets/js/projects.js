// Projects page specific JavaScript
// Projects display with API integration

class ProjectsPage {
    constructor() {
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.renderProjects();
        this.setupProjectLinks();
    }

    // Load projects from API
    async loadProjects() {
        try {
            const data = await api.getProjects();
            this.projects = data.results || data; // Handle pagination if present
        } catch (error) {
            console.error('Failed to load projects:', error);
            // Fallback to static data or show error message
            this.showError('Unable to load projects. Please try again later.');
        }
    }

    // Render projects dynamically
    renderProjects() {
        const container = document.querySelector('#projects-page .grid');
        if (!container) return;

        container.innerHTML = ''; // Clear existing content

        if (this.projects.length === 0) {
            this.showNoProjects();
            return;
        }

        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    // Create project card element
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-xl p-6 text-white hover:transform hover:scale-105 transition-all duration-300';

        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-blue-400 bg-blue-900 px-2 py-1 rounded">${project.category || 'Category'}</span>
                <span class="text-sm text-gray-400">${project.date || 'Date'}</span>
            </div>
            <h3 class="text-xl font-bold mb-3">${project.title || 'Project Title'}</h3>
            <p class="text-gray-300 mb-4">${project.description || 'Project description'}</p>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-400">By:</span>
                    <span class="text-sm font-medium">${project.author || 'Author'}</span>
                </div>
                <a href="${project.url || '#'}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">View Project</a>
            </div>
        `;

        return card;
    }

    // Show no projects message
    showNoProjects() {
        const container = document.querySelector('#projects-page .grid');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                    <p class="text-gray-400">Projects will be displayed here once they are added to the platform.</p>
                </div>
            `;
        }
    }

    // Setup project links (if needed)
    setupProjectLinks() {
        // Add hover effects or click handlers for project cards
        const projectCards = document.querySelectorAll('.bg-gray-800.rounded-xl');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.transition = 'transform 0.2s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Show error message
    showError(message) {
        const container = document.querySelector('#projects-page .grid');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <div class="text-red-500 mb-4">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <p class="text-gray-600">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsPage();
});
