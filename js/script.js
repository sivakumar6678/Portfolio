const roles = ["C Siva Kumar", "Aspiring Full Stack Web Developer", "Tech Enthusiast", "Lifelong Learner"];
let index = 0;
let letterIndex = 0;
let currentRole = '';
let isDeleting = false;
const typingSpeed = 100; // Speed for typing
const deletingSpeed = 50; // Speed for deleting
const pauseTime = 1000; // Pause before starting deletion

function type() {
    const dynamicTextElement = document.getElementById('dynamic-text');
    if (!dynamicTextElement) return; // Exit if the element is not found

    const currentFullRole = roles[index];
    
    if (isDeleting) {
        currentRole = currentFullRole.substring(0, letterIndex--);
    } else {
        currentRole = currentFullRole.substring(0, letterIndex++);
    }

    dynamicTextElement.innerHTML = currentRole;

    if (!isDeleting && letterIndex === currentFullRole.length) {
        setTimeout(() => isDeleting = true, pauseTime); // Pause before deleting
    } else if (isDeleting && letterIndex < 0) {
        isDeleting = false;
        index = (index + 1) % roles.length;
        setTimeout(type, pauseTime); // Pause before starting next role
    }

    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    type();
});