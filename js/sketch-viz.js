const canvas = document.createElement('canvas');
canvas.id = 'sketch-viz';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

// Configuration
const PARTICLE_COUNT = 50;
const STROKE_COLOR = '#2b2b2b'; // Graphite
const ACCENT_COLORS = ['#fff01f', '#ff2a6d', '#05d9e8'];

// Resize handler
function resize() {
    width = window.innerWidth;
    height = 200; // Height of the footer area
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'fixed';
    canvas.style.bottom = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1'; // Behind content but visible
    initParticles();
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = Math.random() * 100;
        this.color = Math.random() > 0.9 ? ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)] : STROKE_COLOR;
        this.width = Math.random() * 2 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3); // Draw a tail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    // Fade out effect for "sketchy" trails
    ctx.fillStyle = 'rgba(253, 251, 247, 0.2)'; // Paper color with opacity
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
