// About page specific JavaScript
// Basic interactivity for about page

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        // Add any about page specific functionality here
        this.setupTimelineAnimation();
    }

    // Setup timeline animation (if needed)
    setupTimelineAnimation() {
        // Add fade-in animations for timeline items
        const timelineItems = document.querySelectorAll('.bg-gray-800.rounded-xl');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
