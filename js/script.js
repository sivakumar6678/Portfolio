const roles = ["Aspiring Full Stack Web Developer ", "Tech Enthusiast ", "LifeTime Learner "];
let index = 0;
let letterIndex = 0;
let currentRole = '';
let isDeleting = false;
const typingSpeed = 200; // Speed for typing
const deletingSpeed = 100; // Speed for deleting
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

    // Adjust the typing/deleting speed
    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    // If the entire role is typed, pause, then start deleting
    if (!isDeleting && letterIndex === currentFullRole.length) {
        timeout = pauseTime;
        isDeleting = true;
    }
    // If the role is fully deleted, switch to the next role
    else if (isDeleting && letterIndex < 0) {
        isDeleting = false;
        index = (index + 1) % roles.length;
        timeout = pauseTime;
    }

    setTimeout(type, timeout);
}

document.addEventListener('DOMContentLoaded', () => {
    type();
});
