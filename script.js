// --- Mobile Navigation ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const bars = document.querySelectorAll('.bar');
    if (navLinks.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-6px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// --- 3D Tilt Effect for Cards ---
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Reduced tilt for smoother reading experience on big cards
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// --- Three.js Cool Interactive Background ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// We create a deeper perspective for a grander feel
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = window.innerWidth > 768 ? 2000 : 800; // More particles on desktop
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread them very wide to cover the long scrolling page
    posArray[i] = (Math.random() - 0.5) * 150;
    // Y spread
    posArray[i+1] = (Math.random() - 0.5) * 150;
    // Z spread
    posArray[i+2] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.02;
    particlesMesh.rotation.x = elapsedTime * 0.01;

    targetX = mouseX * 0.0005;
    targetY = mouseY * 0.0005;
    
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Parallax effect with scroll
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.005;

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(5, 5, 5, 0.95)';
        nav.style.padding = '1rem 5%';
    } else {
        nav.style.background = 'rgba(5, 5, 5, 0.8)';
        nav.style.padding = '1.5rem 5%';
    }
});

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    // Desktop - Full animations
    gsap.from(".navbar", { y: -100, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".glitch", { opacity: 0, y: -50, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".subtitle", { opacity: 0, y: -20, duration: 1, delay: 0.5, ease: "power3.out" });
    gsap.from(".hero-btns", { opacity: 0, y: 30, duration: 1, delay: 0.8, ease: "power3.out" });
    gsap.from(".scroll-indicator", { opacity: 0, duration: 1, delay: 1.2 });

    gsap.from(".about-text", { scrollTrigger: { trigger: ".about-section", start: "top 75%" }, opacity: 0, x: -50, duration: 1 });
    gsap.from(".stat-box", { scrollTrigger: { trigger: ".stats-grid", start: "top 80%" }, opacity: 0, y: 30, duration: 0.8, stagger: 0.2 });
    gsap.from(".founder-card", { scrollTrigger: { trigger: ".founders-section", start: "top 75%" }, opacity: 0, y: 50, duration: 1, stagger: 0.3, ease: "power3.out" });
    gsap.from(".expertise-card", { scrollTrigger: { trigger: ".expertise-section", start: "top 80%" }, opacity: 0, scale: 0.9, y: 40, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" });
    gsap.from(".company-card", { scrollTrigger: { trigger: ".companies-section", start: "top 75%" }, opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.15, ease: "power2.out" });
    gsap.from(".contact-form", { scrollTrigger: { trigger: ".contact-section", start: "top 75%" }, opacity: 0, y: 50, duration: 1, ease: "power3.out" });
});

mm.add("(max-width: 768px)", () => {
    // Mobile - Optimized animations (less stagger, no scales, simpler transforms)
    gsap.from(".navbar", { y: -50, opacity: 0, duration: 0.8, ease: "power2.out" });
    gsap.from(".glitch", { opacity: 0, y: -20, duration: 0.8, delay: 0.1, ease: "power2.out" });
    gsap.from(".subtitle", { opacity: 0, y: -10, duration: 0.8, delay: 0.3, ease: "power2.out" });
    gsap.from(".hero-btns", { opacity: 0, y: 20, duration: 0.8, delay: 0.5, ease: "power2.out" });
    
    gsap.from(".about-text", { scrollTrigger: { trigger: ".about-section", start: "top 85%" }, opacity: 0, y: 30, duration: 0.8 });
    gsap.from(".stat-box", { scrollTrigger: { trigger: ".stats-grid", start: "top 85%" }, opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });
    gsap.from(".founder-card", { scrollTrigger: { trigger: ".founders-section", start: "top 85%" }, opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power2.out" });
    gsap.from(".expertise-card", { scrollTrigger: { trigger: ".expertise-section", start: "top 85%" }, opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });
    gsap.from(".company-card", { scrollTrigger: { trigger: ".companies-section", start: "top 85%" }, opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });
    gsap.from(".contact-form", { scrollTrigger: { trigger: ".contact-section", start: "top 85%" }, opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
});
