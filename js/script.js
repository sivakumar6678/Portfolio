const roles = ["Sivakumar", "Aspiring Web Developer", "Tech Enthusiast", "Lifelong Learner"];
let index = 0;
let letterIndex = 0;
let currentRole = '';
let isDeleting = false;
const dynamicTextElement = document.getElementById('dynamic-text');

function type() {
    const currentFullRole = roles[index];
    if (isDeleting) {
        currentRole = currentFullRole.substring(0, letterIndex--);
    } else {
        currentRole = currentFullRole.substring(0, letterIndex++);
    }

    dynamicTextElement.innerHTML = currentRole;

    if (!isDeleting && letterIndex === currentFullRole.length) {
        setTimeout(() => isDeleting = true, 1000); // Pause before deleting
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        index = (index + 1) % roles.length;
    }

    setTimeout(type, isDeleting ? 50 : 100); // Faster when deleting
}

document.addEventListener("DOMContentLoaded", type);
