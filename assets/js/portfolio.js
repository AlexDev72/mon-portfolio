// assets/js/portfolio.js

// Gère le switch entre thème clair et sombre
function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if (!themeToggleBtn || !darkIcon || !lightIcon) {
        console.error('Theme toggle elements not found!');
        return;
    }

    // Check initial theme
    const storedTheme = localStorage.getItem('color-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }

    // Toggle on button click
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    }

    function enableLightMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    }
}

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

// Gère la modal pour afficher les images en grand
class ImageModal {
    constructor() {
        this.modal = document.getElementById('image-modal');
        this.modalImg = document.getElementById('modal-image');
        this.closeModal = document.getElementById('close-modal');
        this.prevBtn = document.getElementById('modal-prev');
        this.nextBtn = document.getElementById('modal-next');
        this.currentCarousel = null;
        this.currentIndex = 0;
        
        if (!this.modal || !this.modalImg || !this.closeModal) return;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Ouvrir la modal quand on clique sur une image
        document.querySelectorAll('[data-modal-image]').forEach(img => {
            img.addEventListener('click', (e) => {
                const carousel = e.target.closest('.carousel');
                
                if (carousel) {
                    // Cas d'un carrousel
                    this.currentCarousel = carousel.id;
                    this.currentIndex = Array.from(document.querySelectorAll(`#${this.currentCarousel} .carousel-item`)).findIndex(
                        item => item.contains(e.target)
                    );
                } else {
                    // Cas d'une image simple
                    this.currentCarousel = null;
                    this.currentIndex = 0;
                }
                
                this.openModal(e.target.dataset.modalImage);
            });
        });
        
        // Fermer la modal
        this.closeModal.addEventListener('click', () => this.close());
        
        // Navigation avec les flèches du clavier
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    this.close();
                } else if (e.key === 'ArrowLeft' && this.currentCarousel) {
                    this.prevImage();
                } else if (e.key === 'ArrowRight' && this.currentCarousel) {
                    this.nextImage();
                }
            }
        });
        
        // Boutons de navigation dans la modal
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevImage());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextImage());
        }
    }
    
    openModal(imageSrc) {
        console.log(imageSrc);
        this.modalImg.src = imageSrc;
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Gestion des boutons de navigation
        if (this.prevBtn && this.nextBtn) {
            if (this.currentCarousel) {
                const carousel = document.getElementById(this.currentCarousel);
                const items = carousel ? carousel.querySelectorAll('.carousel-item') : [];
                console.log('Nombre d\'images dans le carrousel:', items.length);
                if (items.length > 1) {
                    // Plusieurs images => afficher navigation
                    this.prevBtn.classList.remove('hidden');
                    this.nextBtn.classList.remove('hidden');
                } else {
                    // Seulement une image dans le carrousel
                    this.prevBtn.classList.add('hidden');
                    this.nextBtn.classList.add('hidden');
                }
            } else {
                // Pas de carrousel => cacher navigation
                this.prevBtn.classList.add('hidden');
                this.nextBtn.classList.add('hidden');
            }
        }
    }
    
    close() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        document.body.style.overflow = '';
        this.currentCarousel = null;
        this.currentIndex = 0;
    }
    
    prevImage() {
        if (!this.currentCarousel) return;
        
        const items = document.querySelectorAll(`#${this.currentCarousel} .carousel-item`);
        this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
        const newImage = items[this.currentIndex].querySelector('[data-modal-image]');
        this.modalImg.src = newImage.dataset.modalImage;
    }
    
    nextImage() {
        if (!this.currentCarousel) return;
        
        const items = document.querySelectorAll(`#${this.currentCarousel} .carousel-item`);
        this.currentIndex = (this.currentIndex + 1) % items.length;
        const newImage = items[this.currentIndex].querySelector('[data-modal-image]');
        this.modalImg.src = newImage.dataset.modalImage;
    }
}

// Lance tout quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Optionnel: Fermer le menu quand on clique sur un lien
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    setupThemeToggle();
    setupExperienceFilters();
    setupAlertCloseButtons();
    // Initialise les carrousels uniquement s'ils existent
    ['snake-carousel', 'miette-carousel'].forEach(id => {
        if (document.getElementById(id)) {
            new Carousel(id);
        }
    });
    
    // Initialise la modal d'images
    new ImageModal();
});

