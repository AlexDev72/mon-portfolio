// assets/js/portfolio.js

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if (!themeToggleBtn || !darkIcon || !lightIcon) return;

    // Vérifie le thème stocké ou la préférence système
    if (localStorage.getItem('color-theme') === 'dark' || (!localStorage.getItem('color-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }

    // Gestion du clic
    themeToggleBtn.addEventListener('click', function() {
        lightIcon.classList.toggle('hidden');
        darkIcon.classList.toggle('hidden');
        
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
}

function setupExperienceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const proItems = document.querySelectorAll('.pro-item');
    const formationItems = document.querySelectorAll('.formation-item');
    const gridContainer = document.querySelector('#experience .grid');

    if (!filterButtons.length || !gridContainer) return;

    function filterItems(filter) {
        let visibleItems = 0;
        
        // Gestion de la visibilité des éléments
        proItems.forEach(item => {
            if (filter === 'all' || filter === 'pro') {
                item.classList.remove('hidden');
                visibleItems++;
            } else {
                item.classList.add('hidden');
            }
        });

        formationItems.forEach(item => {
            if (filter === 'all' || filter === 'formation') {
                item.classList.remove('hidden');
                visibleItems++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Adaptation de la grille
        gridContainer.classList.toggle('md:grid-cols-1', visibleItems === 1);
        gridContainer.classList.toggle('md:grid-cols-2', visibleItems !== 1);

        // Mise à jour des styles des boutons (seulement les backgrounds)
        filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('bg-primary', isActive);
            btn.classList.toggle('bg-gray-200', !isActive);
            btn.classList.toggle('dark:bg-gray-600', !isActive);
        });
    }

    // Ajout des écouteurs d'événements
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterItems(button.dataset.filter);
        });
    });

    // Initialisation
    filterItems('all');
}

function setupAlertCloseButtons() {
    document.addEventListener('click', function(e) {
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
}

function setupCarousels() {
    const carousels = document.querySelectorAll('.swiper');
    if (!carousels.length || typeof Swiper === 'undefined') return;

    carousels.forEach(container => {
        new Swiper(container, {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // Debug
            on: {
                init: function() {
                    console.log('Swiper initialized', container);
                },
                error: function(e) {
                    console.error('Swiper error', e);
                }
            }
        });
    });
}

// Initialisation unique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupExperienceFilters();
    setupAlertCloseButtons();
    setupCarousels();
});