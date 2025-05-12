/**
 * Portfolio Website JavaScript
 * Author: C Siva Kumar
 * Version: 2.0
 * Optimized for performance and maintainability
 */

$(document).ready(function () {
    // Initialize theme based on saved preference or system preference
    initializeTheme();
    
    // Theme toggle button event handlers for all theme switches
    $('.input__check').on('change', function() {
        toggleTheme();
    });
    
    // Ensure all theme toggles stay in sync
    $(document).on('themeChanged', function(e, isDark) {
        $('.input__check').prop('checked', isDark);
    });
    
    // Ensure navbar is properly initialized
    $('.navbar-collapse').collapse({toggle: false});

    // Load all content sections on page load
    const sections = [
        { file: 'about.html', target: '#about' },
        { file: 'skills.html', target: '#skills' },
        { file: 'projects.html', target: '#projects' },
        { file: 'experience.html', target: '#experience' },
        { file: 'certify.html', target: '#certify' },
        { file: 'passionandint.html', target: '#passionandint' }
    ];
    
    sections.forEach(section => loadContent(section.file, section.target));
    
    // Modern navbar menu toggle
    $('#menuToggle').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('#navMenu').toggleClass('active');
        $('body').toggleClass('menu-open');
    });
    
    // Close menu when clicking the close button
    $('#navClose').on('click', function(e) {
        e.preventDefault();
        $('#menuToggle').removeClass('active');
        $('#navMenu').removeClass('active');
        $('body').removeClass('menu-open');
    });
    
    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#navMenu, #menuToggle').length && $('#navMenu').hasClass('active')) {
            $('#menuToggle').removeClass('active');
            $('#navMenu').removeClass('active');
            $('body').removeClass('menu-open');
        }
    });

    // Navigation links click handler
    $('.nav-link').on('click', function (event) {
        event.preventDefault();
        const target = $(this).attr('href');
        const file = $(this).data('file');

        // Load content and scroll to section
        loadContent(file, target);
        scrollToSection(target);

        // Close mobile menu if open
        if ($('#navMenu').hasClass('active')) {
            $('#menuToggle').removeClass('active');
            $('#navMenu').removeClass('active');
            $('body').removeClass('menu-open');
        }
    });

    // Initialize typing animation
    type();
});

/**
 * Loads content into a target element via AJAX
 * @param {string} file - The HTML file to load
 * @param {string} target - The selector for the target element
 */
function loadContent(file, target) {
    $.ajax({
        url: file,
        method: 'GET',
        success: function (data) {
            $(target).html(data);
            
            // Initialize any collapse elements
            $(target).find('.collapse').collapse({ toggle: false });
            
            // Reinitialize typing effect for about section
            if (target === '#about') {
                type();
            }
        },
        error: function (xhr, status, error) {
            console.error('Failed to load content:', status, error);
            $(target).html('<p>Error loading content. Please try again later.</p>');
        }
    });
}

/**
 * Scrolls smoothly to a section
 * @param {string} target - The selector for the target element
 */
function scrollToSection(target) {
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 800);
}

/**
 * Creates a typing effect for text elements
 * @param {string} elementId - The ID of the element to apply the effect to
 * @param {Array} rolesList - List of strings to cycle through
 * @param {Object} options - Configuration options
 */
function createTypingEffect(elementId, rolesList, options = {}) {
    const defaults = {
        typingSpeed: 150,
        deletingSpeed: 80,
        pauseTime: 1500,
        startDelay: 1000
    };
    
    const settings = { ...defaults, ...options };
    
    const state = {
        index: 0,
        charIndex: 0,
        isDeleting: false,
        typingInterval: null
    };
    
    function typeEffect() {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentRole = rolesList[state.index];
        let typingDelay;
        
        if (state.isDeleting) {
            // Deleting text
            element.textContent = currentRole.substring(0, state.charIndex - 1);
            state.charIndex--;
            typingDelay = settings.deletingSpeed;
        } else {
            // Typing text
            element.textContent = currentRole.substring(0, state.charIndex + 1);
            state.charIndex++;
            typingDelay = settings.typingSpeed;
        }
        
        // Handle state transitions
        if (!state.isDeleting && state.charIndex === currentRole.length) {
            // Word complete, start deleting after pause
            state.isDeleting = true;
            typingDelay = settings.pauseTime;
        } else if (state.isDeleting && state.charIndex === 0) {
            // Deletion complete, move to next word
            state.isDeleting = false;
            state.index = (state.index + 1) % rolesList.length;
            typingDelay = settings.pauseTime / 3;
        }
        
        state.typingInterval = setTimeout(typeEffect, typingDelay);
    }
    
    // Start the typing effect with a delay
    setTimeout(typeEffect, settings.startDelay);
    
    return {
        stop: function() {
            if (state.typingInterval) {
                clearTimeout(state.typingInterval);
            }
        }
    };
}

// Default roles for the main page
const mainPageRoles = ["Aspiring Full Stack Web Developer", "Tech Enthusiast", "LifeTime Learner"];

/**
 * Initializes the typing effect with default settings
 */
function type() {
    createTypingEffect('dynamic-text', mainPageRoles, {
        typingSpeed: 200,
        deletingSpeed: 100,
        pauseTime: 1000
    });
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.contains('light-mode');
    
    if (isLight) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        // Trigger custom event for theme change
        $(document).trigger('themeChanged', [true]);
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        // Trigger custom event for theme change
        $(document).trigger('themeChanged', [false]);
    }
    
    console.log('Theme toggled to:', isLight ? 'dark' : 'light');
}

/**
 * Initializes the theme based on user preference or system settings
 */
function initializeTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = currentTheme === 'dark' || (!currentTheme && prefersDark);
    
    if (shouldBeDark) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    
    // Update all checkbox toggles
    $('.input__check').prop('checked', shouldBeDark);
    
    // Trigger custom event for theme initialization
    setTimeout(() => {
        $(document).trigger('themeChanged', [shouldBeDark]);
    }, 100);
    
    console.log('Theme initialized to:', shouldBeDark ? 'dark' : 'light');
}
