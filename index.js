// Initialize AOS (Animate On Scroll) Library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });
});

// Mobile Menu Toggle Functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background Change on Scroll
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateHeader, { passive: true });

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

// Button Click Handlers
const ctaButton = document.querySelector('.cta-button');
const contactButton = document.querySelector('.contact-button');

if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

if (contactButton) {
    contactButton.addEventListener('click', function() {
        // You can customize this action - could open a modal, redirect to contact form, etc.
        alert('Contact functionality can be customized here!');
    });
}

// Intersection Observer for Fade-in Animations (backup for AOS)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Portfolio Item Hover Effects Enhancement
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading Animation (optional)
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Refresh AOS after page load to ensure proper initialization
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledHeaderUpdate = throttle(updateHeader, 16);
const throttledNavHighlight = throttle(highlightActiveNavLink, 16);

window.removeEventListener('scroll', updateHeader);
window.removeEventListener('scroll', highlightActiveNavLink);
window.addEventListener('scroll', throttledHeaderUpdate, { passive: true });
window.addEventListener('scroll', throttledNavHighlight, { passive: true });

// Smooth Number Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number with + sign
        const displayValue = Math.floor(current);
        element.textContent = `+${displayValue}`;
        
        // Add subtle pulse effect when reaching target
        if (current === target) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.transition = 'transform 0.3s ease';
            }, 200);
        }
    }, 16);
}

// Initialize counter animations when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            
            spans.forEach((span, index) => {
                const text = span.textContent.trim();
                const number = parseInt(text.replace('+', ''));
                
                if (!isNaN(number)) {
                    // Clear the initial text
                    span.textContent = '+0';
                    
                    // Start animation with delay for staggered effect
                    setTimeout(() => {
                        animateCounter(span, number, 2000);
                    }, index * 200 + 1800); // Sync with CSS animation delay
                }
            });
            
            // Disconnect observer after animation starts
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
});

// Observe the stats container
const statsContainer = document.querySelector('.about-container-stats');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}

// Enhanced hover effects for stats
const statItems = document.querySelectorAll('.about-container-stats div');
statItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const span = this.querySelector('span');
        if (span) {
            span.style.transform = 'scale(1.05) rotate(2deg)';
            span.style.color = '#14A800';
            span.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const span = this.querySelector('span');
        if (span) {
            span.style.transform = 'scale(1) rotate(0deg)';
            span.style.color = '#2B2B2B';
            span.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
});

// Smooth text reveal animation for about section
const aboutTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, {
    threshold: 0.2
});

// Observe about section elements
const aboutElements = document.querySelectorAll('.about-container p, .about-container h2');
aboutElements.forEach(el => {
    aboutTextObserver.observe(el);
});

// Console log for development
console.log('Portfolio JavaScript loaded successfully!');
console.log('AOS Animation Library integrated');
console.log('Mobile menu functionality active');
console.log('Smooth scrolling enabled');
console.log('Counter animations initialized');

// Falling Animation for Experience Tags
const experienceTagsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Find all experience tags within the observed container
            const experienceTags = entry.target.querySelectorAll('.experience-tag.animate-fall-init');
            
            // Animation variations to choose from
            const animationTypes = ['animate-fall-center', 'animate-fall-left', 'animate-fall-right'];
            
            // Trigger the falling animation for each tag with random timing and variation
            experienceTags.forEach((tag, index) => {
                // Generate random delay between 100ms and 2000ms
                const randomDelay = Math.random() * 1900 + 100;
                
                // Randomly select an animation type
                const randomAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
                
                // Apply the animation with random delay
                setTimeout(() => {
                    tag.classList.remove('animate-fall-init');
                    tag.classList.add(randomAnimationType);
                    
                    // Add a slight random horizontal starting position for more variety
                    const randomOffset = (Math.random() - 0.5) * 20; // -10px to +10px
                    tag.style.setProperty('--random-offset', `${randomOffset}px`);
                    
                    console.log(`Tag "${tag.textContent}" falling with ${randomAnimationType} after ${randomDelay}ms delay`);
                }, randomDelay);
            });
            
            // Disconnect observer after animation starts
            experienceTagsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully in view
});

// Observe the experience tags container
const experienceTagsContainer = document.querySelector('#experience-tags-container');
if (experienceTagsContainer) {
    experienceTagsObserver.observe(experienceTagsContainer);
    console.log('Falling animation initialized for experience tags');
}

// Sticky Gallery Scroll Animation
class StickyGallery {
    constructor() {
        this.galleryContainer = document.querySelector('.sticky-gallery-container');
        this.galleryImages = document.querySelectorAll('.gallery-image');
        this.totalImages = this.galleryImages.length;
        
        if (this.galleryContainer && this.galleryImages.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Set all images to initial hidden state
        this.galleryImages.forEach((image, index) => {
            image.classList.remove('active', 'inactive');
        });
        
        // Activate first image
        this.galleryImages[0].classList.add('active');
        
        // Bind scroll handler
        this.boundScrollHandler = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.boundScrollHandler, { passive: true });
        
        console.log(`Sticky gallery initialized with ${this.totalImages} images`);
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const containerRect = this.galleryContainer.getBoundingClientRect();
        const containerTop = scrollTop + containerRect.top;
        const containerHeight = this.galleryContainer.offsetHeight;
        
        // Calculate scroll progress within the container
        const scrollProgress = (scrollTop - containerTop) / (containerHeight - window.innerHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // Calculate which image should be active based on scroll progress
        // Adjust progression to be more responsive with shorter scroll distance
        const adjustedProgress = Math.pow(clampedProgress, 0.8); // Slightly ease the progression
        const imageIndex = Math.floor(adjustedProgress * this.totalImages);
        const activeIndex = Math.min(imageIndex, this.totalImages - 1);
        
        // Update active image
        this.updateActiveImage(activeIndex);
    }
    
    updateActiveImage(newActiveIndex) {
        // Update all images based on their relationship to the active image
        this.galleryImages.forEach((image, index) => {
            // Remove all classes first
            image.classList.remove('active', 'inactive');
            
            if (index === newActiveIndex) {
                // This is the active image - animate it to center
                image.classList.add('active');
            } else if (index < newActiveIndex) {
                // This image has already been shown - move it to background stack
                image.classList.add('inactive');
            }
            // Images with index > newActiveIndex stay in their initial off-screen position
        });
        
        console.log(`Image ${newActiveIndex + 1} is now active`);
    }
    
    destroy() {
        if (this.boundScrollHandler) {
            window.removeEventListener('scroll', this.boundScrollHandler);
        }
    }
}

// Initialize the sticky gallery
document.addEventListener('DOMContentLoaded', function() {
    const stickyGallery = new StickyGallery();
});

// Full Screen Carousel Animation
class FullScreenCarousel {
    constructor() {
        this.carouselContainer = document.querySelector('.carousel-container');
        this.carouselSlides = document.querySelectorAll('.carousel-slide');
        this.carouselSection = document.querySelector('.carousel-section');
        this.secondSlide = this.carouselSlides[1]; // The slide that will move up
        
        if (this.carouselContainer && this.carouselSlides.length >= 2) {
            this.init();
        }
    }
    
    init() {
        // Bind scroll handler with throttling
        this.boundScrollHandler = this.throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', this.boundScrollHandler, { passive: true });
        
        console.log('Full screen carousel initialized');
    }
    
    handleScroll() {
        if (!this.carouselSection || !this.secondSlide) return;
        
        const scrollTop = window.pageYOffset;
        const sectionRect = this.carouselSection.getBoundingClientRect();
        const sectionTop = scrollTop + sectionRect.top;
        const sectionHeight = this.carouselSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within the carousel section
        const scrollProgress = Math.max(0, Math.min(1, 
            (scrollTop - sectionTop) / (sectionHeight - viewportHeight)
        ));
        
        // Move the second slide up based on scroll progress
        // 0 = fully below (100%), 1 = fully up (0%)
        const translateY = (1 - scrollProgress) * 100;
        this.secondSlide.style.transform = `translateY(${translateY}%)`;
    }
    
    // Throttle function to improve performance
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    destroy() {
        if (this.boundScrollHandler) {
            window.removeEventListener('scroll', this.boundScrollHandler);
        }
    }
}

// Initialize the full screen carousel
document.addEventListener('DOMContentLoaded', function() {
    const fullScreenCarousel = new FullScreenCarousel();
});

// Footer Animation Controller
class FooterAnimations {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.footerTagline = document.querySelector('.footer-tagline h2');
        this.footerCta = document.querySelector('.footer-cta');
        this.footerRight = document.querySelector('.footer-right');
        this.footerLinks = document.querySelectorAll('.footer-link');
        this.footerBottom = document.querySelector('.footer-bottom');
        this.footerBrand = document.querySelector('.footer-brand h1');
        this.footerCopyright = document.querySelector('.footer-copyright p');
        
        this.animationsTriggered = false;
        
        if (this.footer) {
            this.init();
        }
    }
    
    init() {
        // Set up intersection observer for footer
        this.setupFooterObserver();
        console.log('Footer animations initialized');
    }
    
    setupFooterObserver() {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animationsTriggered) {
                    this.animationsTriggered = true;
                    this.triggerFooterAnimations();
                    // Disconnect after first trigger to prevent re-animations
                    footerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        footerObserver.observe(this.footer);
    }
    
    triggerFooterAnimations() {
        // Start with footer slide up
        this.footer.classList.add('animate-footer');
        
        // Stagger the animations with delays
        setTimeout(() => this.startTypewriterEffect(), 600);
        setTimeout(() => this.animateCta(), 1200);
        setTimeout(() => this.animateRightSection(), 1800);
        setTimeout(() => this.animateLinks(), 2200);
        setTimeout(() => this.animateBottom(), 2800);
        setTimeout(() => this.animateBrand(), 3200);
        setTimeout(() => this.animateCopyright(), 3800);
        
        console.log('Footer animations sequence started');
    }
    
    startTypewriterEffect() {
        if (this.footerTagline) {
            // Ensure element is visible first
            this.footerTagline.style.opacity = '1';
            this.footerTagline.style.transform = 'translateY(0)';
            
            // Add typewriter classes
            this.footerTagline.classList.add('typewriter-ready');
            
            // After animation completes, switch to complete class
            setTimeout(() => {
                this.footerTagline.classList.remove('typewriter-ready');
                this.footerTagline.classList.add('typewriter-complete');
                console.log('Typewriter effect completed');
            }, 4000);
            
            console.log('Typewriter effect started');
        }
    }
    
    animateCta() {
        if (this.footerCta) {
            this.footerCta.classList.add('animate-cta');
            console.log('CTA animation started');
        }
    }
    
    animateRightSection() {
        if (this.footerRight) {
            this.footerRight.classList.add('animate-right');
            console.log('Right section animation started');
        }
    }
    
    animateLinks() {
        this.footerLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('animate-link');
                console.log(`Link ${index + 1} animation started`);
            }, index * 200);
        });
    }
    
    animateBottom() {
        if (this.footerBottom) {
            this.footerBottom.classList.add('animate-bottom');
            console.log('Bottom section animation started');
        }
    }
    
    animateBrand() {
        if (this.footerBrand) {
            this.footerBrand.classList.add('animate-brand');
            console.log('Brand animation started');
        }
    }
    
    animateCopyright() {
        if (this.footerCopyright) {
            this.footerCopyright.classList.add('animate-copyright');
            console.log('Copyright animation started');
        }
    }
}

// Enhanced Typewriter Effect with more control
class TypewriterEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            speed: options.speed || 100,
            deleteSpeed: options.deleteSpeed || 50,
            pauseTime: options.pauseTime || 2000,
            cursor: options.cursor || '|',
            cursorColor: options.cursorColor || '#CFDA5B',
            loop: options.loop || false,
            ...options
        };
        
        this.currentText = '';
        this.currentIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }
    
    start() {
        this.element.style.borderRight = `3px solid ${this.options.cursorColor}`;
        this.type();
    }
    
    type() {
        const fullText = this.text;
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentIndex + 1);
            this.currentIndex++;
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.options.speed;
        
        if (this.isDeleting) {
            typeSpeed = this.options.deleteSpeed;
        }
        
        if (!this.isDeleting && this.currentText === fullText) {
            if (this.options.loop) {
                typeSpeed = this.options.pauseTime;
                this.isDeleting = true;
            } else {
                // Remove cursor when done (if not looping)
                setTimeout(() => {
                    this.element.style.borderRight = 'none';
                }, 1000);
                return;
            }
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = 0;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Advanced Footer Hover Effects
class FooterHoverEffects {
    constructor() {
        this.footerLinks = document.querySelectorAll('.footer-link');
        this.footerBrand = document.querySelector('.footer-brand h1');
        
        this.init();
    }
    
    init() {
        this.setupLinkHovers();
        this.setupBrandHover();
        console.log('Footer hover effects initialized');
    }
    
    setupLinkHovers() {
        this.footerLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
                this.addGlowEffect(e.target);
            });
            
            link.addEventListener('mouseleave', (e) => {
                this.removeGlowEffect(e.target);
            });
        });
    }
    
    setupBrandHover() {
        if (this.footerBrand) {
            this.footerBrand.addEventListener('mouseenter', () => {
                this.footerBrand.style.transform = 'scale(1.05) rotate(2deg)';
                this.footerBrand.style.filter = 'drop-shadow(0 0 40px rgba(207, 218, 91, 0.8))';
            });
            
            this.footerBrand.addEventListener('mouseleave', () => {
                this.footerBrand.style.transform = 'scale(1) rotate(0deg)';
                this.footerBrand.style.filter = 'drop-shadow(0 0 30px rgba(207, 218, 91, 0.6))';
            });
        }
    }
    
    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(207, 218, 91, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = `${x - 10}px`;
        ripple.style.top = `${y - 10}px`;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    addGlowEffect(element) {
        element.style.boxShadow = '0 0 20px rgba(207, 218, 91, 0.5)';
        element.style.borderRadius = '8px';
    }
    
    removeGlowEffect(element) {
        element.style.boxShadow = 'none';
        element.style.borderRadius = '0';
    }
}

// Add ripple animation to CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Footer Particle System
class FooterParticles {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.particles = [];
        this.animationId = null;
        
        if (this.footer) {
            this.init();
        }
    }
    
    init() {
        this.createParticles();
        this.animate();
        console.log('Footer particle system initialized');
    }
    
    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = {
                x: Math.random() * this.footer.offsetWidth,
                y: Math.random() * this.footer.offsetHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                element: this.createParticleElement()
            };
            
            this.particles.push(particle);
            this.footer.appendChild(particle.element);
        }
    }
    
    createParticleElement() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.background = 'rgba(207, 218, 91, 0.3)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        return particle;
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.footer.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.footer.offsetHeight) {
                particle.vy *= -1;
            }
            
            // Update element position
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.width = `${particle.size}px`;
            particle.element.style.height = `${particle.size}px`;
            particle.element.style.opacity = particle.opacity;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
    }
}

// Initialize all footer animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize footer animations
    const footerAnimations = new FooterAnimations();
    
    // Initialize hover effects
    const footerHoverEffects = new FooterHoverEffects();
    
    // Initialize particle system (optional - can be disabled for performance)
    // const footerParticles = new FooterParticles();
    
    console.log('All footer animation systems initialized');
});

// Add smooth scroll behavior to footer links
document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // You can add actual navigation logic here
        console.log(`Footer link clicked: ${this.textContent}`);
    });
});
