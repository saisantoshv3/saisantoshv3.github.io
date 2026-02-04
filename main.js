// Typing Effect
const roles = ["Lead Data Research @ Dataful.in", "Data Analysis", "Public Policy",];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingTextElement = document.getElementById('typing-text');

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at the end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Reveal on Scroll
const revealElements = document.querySelectorAll('.reveal');

function reveal() {
    revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

// Initialize
window.addEventListener('scroll', reveal);
document.addEventListener('DOMContentLoaded', () => {
    type();
    reveal(); // Initial check
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
