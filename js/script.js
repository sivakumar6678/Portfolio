$(document).ready(function () {
    // Theme toggle button
    $('#theme-toggle').click(function () {
        $('body').toggleClass('light-mode');
        $('body').toggleClass('dark-mode');
    });

    // Set default mode based on system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkScheme) {
        $('body').addClass('dark-mode');
    } else {
        $('body').addClass('light-mode');
    }

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

// Ensure `typingState` is declared only once
const roles = ["Aspiring Full Stack Web Developer", "Tech Enthusiast", "LifeTime Learner"];
const typingState = {
    index: 0,
    letterIndex: 0,
    currentRole: '',
    isDeleting: false,
    typingInterval: null
};

const typingSpeed = 200; // Speed for typing
const deletingSpeed = 100; // Speed for deleting
const pauseTime = 1000; // Pause before starting deletion

function type() {
    // Clear any existing typing interval
    if (typingState.typingInterval) {
        clearTimeout(typingState.typingInterval);
    }

    const dynamicTextElement = document.getElementById('dynamic-text');
    if (!dynamicTextElement) return; // Exit if the element is not found

    const currentFullRole = roles[typingState.index];

    if (typingState.isDeleting) {
        typingState.currentRole = currentFullRole.substring(0, typingState.letterIndex--);
    } else {
        typingState.currentRole = currentFullRole.substring(0, typingState.letterIndex++);
    }

    dynamicTextElement.innerHTML = typingState.currentRole;

    // Adjust the typing/deleting speed
    let timeout = typingState.isDeleting ? deletingSpeed : typingSpeed;

    // If the entire role is typed, pause, then start deleting
    if (!typingState.isDeleting && typingState.letterIndex === currentFullRole.length) {
        timeout = pauseTime;
        typingState.isDeleting = true;
    }
    // If the role is fully deleted, switch to the next role
    else if (typingState.isDeleting && typingState.letterIndex < 0) {
        typingState.isDeleting = false;
        typingState.index = (typingState.index + 1) % roles.length;
        timeout = pauseTime;
    }

    typingState.typingInterval = setTimeout(type, timeout);
}
