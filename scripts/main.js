/* ============================================
   IMI - Interactive Musical Instruments
   Main JavaScript
   ============================================ */

// ============================================
// MOBILE HAMBURGER MENU
// Toggles mobile navigation menu
// ============================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// MARKET CARD TOGGLE HANDLER
// Handles expanding/collapsing market opportunity cards
// ============================================

function toggleMarket(card) {
    const allCards = document.querySelectorAll('.market-card');
    const isActive = card.classList.contains('active');

    allCards.forEach(c => c.classList.remove('active'));

    if (!isActive) {
        card.classList.add('active');
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ============================================
// BIO CARD TOGGLE HANDLER
// Handles expanding/collapsing inventor bio section
// ============================================

function toggleBio(card) {
    const isActive = card.classList.contains('active');
    const content = card.querySelector('.bio-content');
    const icon = card.querySelector('.expand-icon');

    if (isActive) {
        card.classList.remove('active');
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        card.classList.add('active');
        content.style.maxHeight = '3000px';
        icon.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ============================================
// VIDEO PLAY BUTTON HANDLER
// Handles playing YouTube video when button is clicked
// ============================================

document.getElementById('play-button').addEventListener('click', function() {
    const overlay = document.getElementById('play-button-overlay');
    const iframe = document.getElementById('youtube-iframe');
    const videoContainer = document.querySelector('.video-container');
    const logo = document.getElementById('video-logo');

    // Hide the button overlay and logo
    overlay.style.display = 'none';
    logo.style.display = 'none';

    // Show and play the video
    iframe.style.display = 'block';
    iframe.src = iframe.src + '&autoplay=1';

    // Scroll to center the video after a brief delay (allows video to render)
    setTimeout(() => {
        const videoRect = videoContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const videoCenter = videoRect.top + window.pageYOffset + (videoRect.height / 2);
        const scrollToPosition = videoCenter - (viewportHeight / 2);

        window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
        });
    }, 100);
});

// ============================================
// SMOOTH SCROLLING
// Enables smooth scroll behavior for anchor links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" (logo to top)
        if (href === '#' || href === '#top') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        // For section links, let CSS scroll-padding-top handle the offset
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// FADE-IN ANIMATIONS
// Uses Intersection Observer API for scroll-triggered animations
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .philosophy-card, .feature-box, .market-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});
