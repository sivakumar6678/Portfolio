$(document).ready(function () {
    // Initialize theme based on saved preference or system preference
    initializeTheme();
    
    // Theme toggle button (for main page)
    $('#theme-toggle').click(function () {
        toggleTheme();
    });

    function loadContent(file, target) {
        $.ajax({
            url: file,
            method: 'GET',
            success: function (data) {
                $(target).html(data);
                
                $(target).find('.collapse').collapse({ toggle: false });                // Reinitialize typing effect after content is loaded
                if (target === '#about') {
                    type(); // Start the typing animation for the #about section
                }
            },
            error: function (xhr, status, error) {
                console.error('Failed to load content:', status, error);
                $(target).html('<p>Error loading content.</p>');
            }
        });
    }

    // Load all content on page load
    loadContent('skills.html', '#skills');
    loadContent('about.html', '#about');
    loadContent('certify.html', '#certify');
    loadContent('projects.html', '#projects');
    loadContent('passionandint.html', '#passionandint');
    loadContent('experience.html', '#experience');

    // Toggle between hamburger and "X" icon
    $('.navbar-toggler').on('click', function () {
        // Check if the navbar is already expanded
        if ($('.navbar-collapse').hasClass('show')) {
            // Change to hamburger icon
            $(this).find('i').removeClass('fa-times').addClass('fa-bars');
        } else {
            // Change to "X" icon
            $(this).find('i').removeClass('fa-bars').addClass('fa-times');
        }
    });

    // Event handler for navigation links
    $('.nav-link').on('click', function (event) {
        event.preventDefault();
        var target = $(this).attr('href');
        var file = $(this).data('file');

        // Load content into the target section
        loadContent(file, target);

        // Scroll to the section
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000); // Adjust the duration as needed

        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-collapse').collapse('hide');
            $('.navbar-toggler').find('i').removeClass('fa-times').addClass('fa-bars'); // Reset to hamburger icon
        }
    });

    // Initialize typing animation only once when the page loads
    type();
});

// Shared typing effect function that can be used across pages
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
        
        // If word is complete, start deleting after delay
        if (!state.isDeleting && state.charIndex === currentRole.length) {
            state.isDeleting = true;
            typingDelay = settings.pauseTime;
        } 
        // If deletion is complete, move to next word
        else if (state.isDeleting && state.charIndex === 0) {
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

// Initialize typing effect when called
function type() {
    createTypingEffect('dynamic-text', mainPageRoles, {
        typingSpeed: 200,
        deletingSpeed: 100,
        pauseTime: 1000
    });
}

// Shared theme functions
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('light-mode');
    
    if (isDark) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

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
    
    // If there's a checkbox toggle, update its state
    const toggleSwitch = document.querySelector('#checkbox');
    if (toggleSwitch) {
        toggleSwitch.checked = shouldBeDark;
    }
}
