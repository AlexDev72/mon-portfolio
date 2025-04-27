// assets/js/portfolio.js

// Gère le switch entre thème clair et sombre
const setupThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if (!themeToggleBtn || !darkIcon || !lightIcon) return;

    // Applique le thème en fonction du localStorage ou des préférences système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('color-theme');

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }

    // Clic sur le bouton => toggle le thème
    themeToggleBtn.addEventListener('click', () => {
        lightIcon.classList.toggle('hidden');
        darkIcon.classList.toggle('hidden');

        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
    });
};

// Gère les filtres d'expériences (pro et formation)
const setupExperienceFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const proItems = document.querySelectorAll('.pro-item');
    const formationItems = document.querySelectorAll('.formation-item');
    const gridContainer = document.querySelector('#experience .grid');

    if (!filterButtons.length || !gridContainer) return;

    const filterItems = (filter) => {
        let visibleItems = 0;

        // Affiche ou masque les expériences pro
        proItems.forEach(item => {
            if (filter === 'all' || filter === 'pro') {
                item.classList.remove('hidden');
                visibleItems++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Affiche ou masque les formations
        formationItems.forEach(item => {
            if (filter === 'all' || filter === 'formation') {
                item.classList.remove('hidden');
                visibleItems++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Ajuste la grille en fonction du nombre d'items visibles
        gridContainer.classList.toggle('md:grid-cols-1', visibleItems === 1);
        gridContainer.classList.toggle('md:grid-cols-2', visibleItems !== 1);

        // Met à jour le style actif des boutons
        filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('bg-primary', isActive);
            btn.classList.toggle('bg-gray-200', !isActive);
            btn.classList.toggle('dark:bg-gray-600', !isActive);
        });
    };

    // Ajoute les écouteurs sur chaque bouton
    filterButtons.forEach(button => {
        button.addEventListener('click', () => filterItems(button.dataset.filter));
    });

    // Charge tout au départ
    filterItems('all');
};

// Permet de fermer les alertes en cliquant dessus
const setupAlertCloseButtons = () => {
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-alert');
        if (closeBtn) {
            const alert = closeBtn.closest('.bg-green-500, .bg-red-500');
            if (alert) {
                alert.style.transition = 'opacity 0.3s';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }
        }
    });
};

// Gère un carrousel basique (pas d'auto-rotation)
class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = this.container?.querySelectorAll('.carousel-item') || [];
        this.currentIndex = 0;

        if (!this.container || !this.items.length) return;

        this.showItem(this.currentIndex);
        this.setupControls();
    }

    // Affiche uniquement l'item actuel
    showItem(index) {
        this.items.forEach((item, i) => {
            item.classList.toggle('opacity-100', i === index);
            item.classList.toggle('opacity-0', i !== index);
        });
    }

    // Passe à l'item précédent
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showItem(this.currentIndex);
    }

    // Passe à l'item suivant
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.showItem(this.currentIndex);
    }

    // Lie les boutons "précédent" et "suivant" aux méthodes
    setupControls() {
        const baseId = this.container.id.replace('-carousel', '');
        const prevBtns = document.querySelectorAll(`[data-carousel="${baseId}"].carousel-prev`);
        const nextBtns = document.querySelectorAll(`[data-carousel="${baseId}"].carousel-next`);

        prevBtns.forEach(btn => btn.addEventListener('click', () => this.prev()));
        nextBtns.forEach(btn => btn.addEventListener('click', () => this.next()));
    }
}

// Lance tout quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupExperienceFilters();
    setupAlertCloseButtons();

    // Initialise les carrousels uniquement s'ils existent
    ['snake-carousel', 'miette-carousel'].forEach(id => {
        if (document.getElementById(id)) {
            new Carousel(id);
        }
    });
});
