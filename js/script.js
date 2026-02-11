/**
 * Portfolio Website JavaScript (Vanilla)
 * Author: C Siva Kumar
 * Version: 3.0 (Modernized)
 * Optimized for performance: No jQuery, IntersectionObserver, Throttling
 */

document.addEventListener('DOMContentLoaded', () => {
    init();
});

// State management
const state = {
    loadedSections: new Set(),
};

/**
 * Initialize application components
 */
async function init() {
    initializeTheme();
    await loadAllSections();
    setupMobileMenu();
    setupHighlighting();
    setupSpotlight();
    setupSkillFilter(); // Ensure skill filter is setup if skills loaded
}

/**
 * Load all content sections
 */
async function loadAllSections() {
    const sections = [
        { file: 'about.html', targetId: 'about' },
        { file: 'skills.html', targetId: 'skills' },
        { file: 'featured_projects.html', targetId: 'projects' },
        { file: 'experience.html', targetId: 'experience' },
        { file: 'certify.html', targetId: 'certify' },
        { file: 'passionandint.html', targetId: 'passionandint' },
        { file: 'contact.html', targetId: 'contact' }
    ];

    const loadPromises = sections.map(section => loadContent(section.file, section.targetId));
    await Promise.allSettled(loadPromises);
}

/**
 * Loads content via Fetch API
 */
async function loadContent(file, targetId) {
    // If already loaded, skip
    if (state.loadedSections.has(targetId)) return;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);

        const html = await response.text();
        targetElement.innerHTML = html;
        state.loadedSections.add(targetId);

        // Post-load initializations
        if (targetId === 'about') {
            typeEffect();
        } else if (targetId === 'skills') {
            setupSkillFilter();
        } else if (targetId === 'passionandint') {
            setupSpotlight();
        }

        // Initialize Bootstrap tooltips/popovers if any in the new content
        // (Assuming Bootstrap 5 global init might be needed if using them, 
        //  but standard components like cards don't strictly need JS init)

    } catch (error) {
        console.error(`[Portfolio] Error loading ${file}:`, error);
        targetElement.innerHTML = `<div class="text-center p-5 text-danger">Failed to load content. Please refresh.</div>`;
    }
}

/**
 * Setup Mobile Menu Toggle
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        document.body.classList.toggle('menu-open', isOpen);
        // Accessibility
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (isOpen) {
            // Move focus into the menu
            setTimeout(() => {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 120);
        } else {
            menuToggle.focus();
        }
    };

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        // Accessibility cleanup
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        // Return focus to menu toggle for keyboard users
        setTimeout(() => menuToggle.focus(), 0);
    };

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            // Smooth scroll handled by CSS scroll-behavior: smooth or basic logic
            // But since we are using anchors to IDs, it should work natively if IDs exist
        });
    });

    // Close on Escape key when menu is open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close mobile menu when resized to desktop
    window.addEventListener('resize', () => {
        const desktopBreakpoint = 992;
        if (window.innerWidth >= desktopBreakpoint && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * Scroll Highlighting using IntersectionObserver
 */
/**
 * Scroll Highlighting using IntersectionObserver
 */
function setupHighlighting() {
    // Observe the wrapper divs that have the IDs matching nav links
    // These are the containers like <div id="about">, <div id="skills">, etc.
    const sectionIds = ['about', 'skills', 'projects', 'experience', 'certify', 'passionandint', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);

    // Also grab nav links to update
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of section is visible
        rootMargin: "-10% 0px -40% 0px" // Adjusted to catch sections earlier but keep focus reasonable
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the ID of the visible section
                const id = entry.target.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });

                // Find matching link
                // Handle special case for 'passionandint' matching 'Beyond Coding' link if needed, 
                // but usually href="#passionandint" checks out.
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.setAttribute('aria-current', 'page');
                    // Optional: Update URL hash without scrolling
                    // history.replaceState(null, null, `#${id}`);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Circular Progress Bar
    window.addEventListener('scroll', throttle(updateCircularProgress, 20));
}

/**
 * Update Circular Scroll Progress (Optimized)
 */
function updateCircularProgress() {
    const circularProgressBar = document.getElementById('circularProgress');
    const circularContainer = document.querySelector('.circular-progress-container');
    const navbar = document.querySelector('.header'); // Navbar class update

    if (!circularProgressBar) return;

    const scrollPosition = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    // Show/Hide Navbar background and Progress
    if (scrollPosition > 50) {
        navbar?.classList.add('scrolled');
        circularContainer?.classList.add('visible');
    } else {
        navbar?.classList.remove('scrolled');
        circularContainer?.classList.remove('visible');
    }

    const circumference = 283; // 2 * PI * 45
    const dashOffset = circumference - (circumference * scrollPercentage / 100);

    circularProgressBar.style.strokeDashoffset = dashOffset;
}

/**
 * Typing Effect for About Section
 */
function typeEffect() {
    const element = document.getElementById('dynamic-text');
    if (!element) return;

    const roles = ["Python Full Stack", "Django Developer", "Angular & React", "Scalable Web Solutions"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
            typeSpeed = 50;
        } else {
            charIndex++;
            typeSpeed = 100;
        }

        element.textContent = currentRole.substring(0, charIndex);

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}


/**
 * Theme Toggle Logic
 */
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default to dark mode if no preference saved, or if system prefers dark
    const shouldBeDark = currentTheme === 'dark' || (!currentTheme && prefersDark);

    if (shouldBeDark) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        document.body.classList.add('light-mode');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    });

}

/**
 * Skills Filter Logic
 */
function setupSkillFilter() {
    const filterButtons = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!filterButtons.length || !skillCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Reset animation
                card.classList.remove('animate__animated', 'animate__fadeInUp');
                // Trigger reflow to restart animation on next add
                void card.offsetWidth;

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('d-none');
                    card.classList.add('animate__animated', 'animate__fadeInUp');
                } else {
                    card.classList.add('d-none');
                }
            });
        });
    });
}

/**
 * Utility: Throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Spotlight Effect for Bento Cards
 */
function setupSpotlight() {
    const cards = document.querySelectorAll('.bento-card[data-spotlight]');

    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
