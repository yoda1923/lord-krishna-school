// ==========================================
// VANILLA JAVASCRIPT - School Website
// ==========================================
// No jQuery - Pure vanilla JS only
// ==========================================

// ==========================================
// 1. HERO CAROUSEL (Auto-play, 6 slides, 5s interval)
// ==========================================

class HeroCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('prev-slide');
        this.nextBtn = document.getElementById('next-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (!this.track || this.totalSlides === 0) return;
        
        // Event listeners for buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Event listeners for indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause autoplay on hover
        this.track.parentElement?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.track.parentElement?.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch support for mobile
        this.addTouchSupport();
        
        // Start auto-play
        this.startAutoPlay();
    }
    
    showSlide(n) {
        // Wrap around
        if (n >= this.totalSlides) {
            this.currentSlide = 0;
        } else if (n < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else {
            this.currentSlide = n;
        }
        
        // Update carousel position
        const offset = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.resetAutoPlay();
    }
    
    goToSlide(n) {
        this.showSlide(n);
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.showSlide(this.currentSlide + 1);
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const carouselContainer = this.track.parentElement;
        
        carouselContainer?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carouselContainer?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        
        if (endX < startX - swipeThreshold) {
            this.nextSlide();
        } else if (endX > startX + swipeThreshold) {
            this.prevSlide();
        }
    }
}

// Initialize carousel on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeroCarousel();
    });
} else {
    new HeroCarousel();
}

// ==========================================
// 2. STICKY HEADER (Add "scrolled" class at 60px)
// ==========================================

class StickyHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.scrollThreshold = 60;
        
        if (!this.header) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }
    
    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// Initialize sticky header on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StickyHeader();
    });
} else {
    new StickyHeader();
}

// ==========================================
// 3. MOBILE HAMBURGER MENU
// ==========================================

class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navList = document.querySelector('.nav-list');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.hamburger || !this.navList) return;
        
        this.init();
    }
    
    init() {
        // Toggle menu on hamburger click
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when any nav link is clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navList.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', 
            this.navList.classList.contains('active') ? 'true' : 'false'
        );
    }
    
    openMenu() {
        this.navList.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
        this.navList.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }
}

// Initialize mobile menu on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileMenu();
    });
} else {
    new MobileMenu();
}

// ==========================================
// 4. SCROLL ANIMATIONS (IntersectionObserver)
// ==========================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observe all elements with "fade-up" class
        const fadeElements = document.querySelectorAll('.fade-up');
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize scroll animations on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ScrollAnimations();
    });
} else {
    new ScrollAnimations();
}

// ==========================================
// 5. FORM VALIDATION & HANDLING
// ==========================================

class FormHandler {
    constructor() {
        this.form = document.getElementById('enquiry-form');
        this.successMessage = document.getElementById('success-message');
        
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addRealTimeValidation();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        console.log('Form Data:', data);
        
        // Show success message
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(() => {
            this.form.reset();
            this.form.style.display = 'grid';
            this.successMessage.style.display = 'none';
        }, 3000);
    }
    
    validateForm() {
        const name = this.form.querySelector('[name="name"]');
        const email = this.form.querySelector('[name="email"]');
        const phone = this.form.querySelector('[name="phone"]');
        const classField = this.form.querySelector('[name="class"]');
        const subject = this.form.querySelector('[name="subject"]');
        const message = this.form.querySelector('[name="message"]');
        
        let isValid = true;
        
        // Name validation
        if (!name.value.trim() || name.value.trim().length < 3) {
            this.showFieldError(name, 'Name must be at least 3 characters');
            isValid = false;
        } else {
            this.clearFieldError(name);
        }
        
        // Email validation
        if (!this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError(email);
        }
        
        // Phone validation
        if (!this.isValidPhone(phone.value)) {
            this.showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        } else {
            this.clearFieldError(phone);
        }
        
        // Class validation
        if (!classField.value) {
            this.showFieldError(classField, 'Please select a class');
            isValid = false;
        } else {
            this.clearFieldError(classField);
        }
        
        // Subject validation
        if (!subject.value) {
            this.showFieldError(subject, 'Please select a subject');
            isValid = false;
        } else {
            this.clearFieldError(subject);
        }
        
        // Message validation
        if (!message.value.trim() || message.value.trim().length < 10) {
            this.showFieldError(message, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            this.clearFieldError(message);
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[0-9+\s\-()]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.style.borderColor = '#27ae60';
                }
            });
            
            input.addEventListener('focus', () => {
                input.style.borderColor = '';
            });
        });
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
    }
    
    clearFieldError(field) {
        field.style.borderColor = '#27ae60';
    }
}

// Initialize form handler on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FormHandler();
    });
} else {
    new FormHandler();
}

// ==========================================
// 6. BACK TO TOP BUTTON
// ==========================================

class BackToTopButton {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.scrollThreshold = 300;
        
        if (!this.button) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize back to top button on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BackToTopButton();
    });
} else {
    new BackToTopButton();
}

// ==========================================
// 7. ACTIVITY TABS
// ==========================================

class ActivityTabs {
    constructor() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        
        if (this.tabBtns.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleTabClick(btn));
            
            // Keyboard navigation
            btn.addEventListener('keydown', (e) => this.handleKeyboard(e, btn));
        });
    }
    
    handleTabClick(btn) {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        this.tabBtns.forEach(b => b.classList.remove('active'));
        this.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        btn.classList.add('active');
        const panel = document.getElementById(tabName);
        if (panel) {
            panel.classList.add('active');
        }
    }
    
    handleKeyboard(e, btn) {
        const btnArray = Array.from(this.tabBtns);
        const currentIndex = btnArray.indexOf(btn);
        let targetBtn = null;
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            targetBtn = btnArray[currentIndex === btnArray.length - 1 ? 0 : currentIndex + 1];
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            targetBtn = btnArray[currentIndex === 0 ? btnArray.length - 1 : currentIndex - 1];
        }
        
        if (targetBtn) {
            targetBtn.click();
            targetBtn.focus();
        }
    }
}

// Initialize activity tabs on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ActivityTabs();
    });
} else {
    new ActivityTabs();
}

// ==========================================
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    }
    
    handleClick(e, anchor) {
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize smooth scroll on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SmoothScroll();
    });
} else {
    new SmoothScroll();
}

// ==========================================
// 9. FLOATING ACTION BUTTONS
// ==========================================

class FloatingButtons {
    constructor() {
        this.init();
    }
    
    init() {
        this.createFloatingButtons();
    }
    
    createFloatingButtons() {
        // Check if floating buttons already exist
        if (document.querySelector('.floating-buttons')) {
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'floating-buttons';
        container.innerHTML = `
            <a href="tel:+911234567890" class="float-btn float-call" title="Call us" aria-label="Call us">
                <i class="fas fa-phone"></i>
                <span class="float-tooltip">Call Us</span>
            </a>
            <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" class="float-btn float-whatsapp" title="WhatsApp us" aria-label="WhatsApp us">
                <i class="fab fa-whatsapp"></i>
                <span class="float-tooltip">WhatsApp</span>
            </a>
        `;
        
        document.body.appendChild(container);
    }
}

// Initialize floating buttons on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingButtons();
    });
} else {
    new FloatingButtons();
}

// ==========================================
// 10. ANNOUNCEMENT TICKER
// ==========================================

class AnnouncementTicker {
    constructor() {
        this.init();
    }
    
    init() {
        this.createTicker();
    }
    
    createTicker() {
        // Check if ticker already exists
        if (document.querySelector('.announcement-ticker')) {
            return;
        }
        
        const ticker = document.createElement('div');
        ticker.className = 'announcement-ticker';
        ticker.innerHTML = `
            <div class="ticker-content">
                📢 Admissions Open for 2024-25! | 🏆 Excellence in Education | 📚 Explore our Academics | 🎯 Building Future Leaders
            </div>
        `;
        
        document.body.insertBefore(ticker, document.body.firstChild);
    }
}

// Initialize announcement ticker on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AnnouncementTicker();
    });
} else {
    new AnnouncementTicker();
}

// ==========================================
// 11. ACTIVE NAVIGATION HIGHLIGHTING
// ==========================================

class ActiveNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.navLinks.length === 0) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
        this.updateActiveLink(); // Initial call
    }
    
    updateActiveLink() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize active navigation on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ActiveNavigation();
    });
} else {
    new ActiveNavigation();
}

// ==========================================
// 12. UTILITY FUNCTIONS
// ==========================================

// Dynamic footer year
function updateFooterYear() {
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} Lord Krishna The School. All Rights Reserved.`;
    }
}

// Initialize footer year on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateFooterYear();
    });
} else {
    updateFooterYear();
}

// Console welcome message
console.log('%c Welcome to Lord Krishna The School! ', 
    'background: #0f2557; color: #c8922a; font-size: 14px; padding: 10px; border-radius: 5px; font-weight: bold;'
);
console.log('%c Built with ❤️ for educational excellence', 
    'background: #c8922a; color: #0f2557; font-size: 12px; padding: 8px; border-radius: 3px;'
);

// ==========================================
// END OF VANILLA JAVASCRIPT
// ==========================================
