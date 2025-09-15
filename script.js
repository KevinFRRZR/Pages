/*=============== RESTAURANT WEBSITE JAVASCRIPT ===============*/

'use strict';

// ===== NAVBAR FUNCTIONALITY =====
class NavigationController {
    constructor() {
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.header = document.getElementById('header');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleActiveLink();
        this.handleScrollHeader();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.showMenu());
        }
        
        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.hideMenu());
        }
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hideMenu();
                this.setActiveLink(link);
            });
        });
        
        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScrollHeader();
            this.handleActiveLink();
        });
    }
    
    showMenu() {
        if (this.navMenu) {
            this.navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    handleScrollHeader() {
        const scrollY = window.pageYOffset;
        
        if (scrollY >= 50) {
            this.header?.classList.add('scroll-header');
        } else {
            this.header?.classList.remove('scroll-header');
        }
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active-link'));
        activeLink.classList.add('active-link');
    }
    
    handleActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active-link');
            } else {
                navLink?.classList.remove('active-link');
            }
        });
    }
}

// ===== MENU TABS FUNCTIONALITY =====
class MenuController {
    constructor() {
        this.menuTabs = document.querySelectorAll('.menu__tab');
        this.menuContents = document.querySelectorAll('.menu__content');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.menuTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.switchTab(tab, index);
            });
        });
    }
    
    switchTab(activeTab, activeIndex) {
        // Remove active class from all tabs and contents
        this.menuTabs.forEach(tab => tab.classList.remove('active'));
        this.menuContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        activeTab.classList.add('active');
        
        // Show corresponding content
        const targetId = activeTab.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

// ===== FORM VALIDATION & SUBMISSION =====
class FormController {
    constructor() {
        this.reservationForm = document.getElementById('reservation-form');
        this.contactForm = document.getElementById('contact-form');
        this.newsletterForm = document.getElementById('newsletter-form');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupDateRestrictions();
    }
    
    bindEvents() {
        if (this.reservationForm) {
            this.reservationForm.addEventListener('submit', (e) => this.handleReservationSubmit(e));
        }
        
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
        
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }
    
    setupDateRestrictions() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            // Set minimum date to today
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            dateInput.min = todayString;
            
            // Set maximum date to 3 months from today
            const maxDate = new Date(today);
            maxDate.setMonth(maxDate.getMonth() + 3);
            const maxDateString = maxDate.toISOString().split('T')[0];
            dateInput.max = maxDateString;
        }
    }
    
    validateReservationForm(formData) {
        const errors = [];
        
        // Required field validation
        if (!formData.get('name')?.trim()) {
            errors.push('Le nom est requis');
        }
        
        if (!formData.get('email')?.trim()) {
            errors.push('L\'email est requis');
        } else if (!this.isValidEmail(formData.get('email'))) {
            errors.push('Format d\'email invalide');
        }
        
        if (!formData.get('phone')?.trim()) {
            errors.push('Le téléphone est requis');
        }
        
        if (!formData.get('date')) {
            errors.push('La date est requise');
        }
        
        if (!formData.get('time')) {
            errors.push('L\'heure est requise');
        }
        
        if (!formData.get('guests')) {
            errors.push('Le nombre de personnes est requis');
        }
        
        // Date validation
        const selectedDate = new Date(formData.get('date'));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('La date ne peut pas être dans le passé');
        }
        
        // Time validation based on day
        const dayOfWeek = selectedDate.getDay();
        const selectedTime = formData.get('time');
        
        if (dayOfWeek === 0) { // Sunday
            const validSundayTimes = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
            if (!validSundayTimes.includes(selectedTime)) {
                errors.push('Heure non disponible pour le dimanche');
            }
        }
        
        return errors;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    handleReservationSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.reservationForm);
        const errors = this.validateReservationForm(formData);
        
        if (errors.length > 0) {
            this.showFormErrors(errors);
            return;
        }
        
        this.showFormLoading(this.reservationForm);
        
        // Simulate API call
        setTimeout(() => {
            this.showFormSuccess('Votre réservation a été enregistrée avec succès ! Nous vous confirmerons par email dans les plus brefs délais.');
            this.reservationForm.reset();
            this.hideFormLoading(this.reservationForm);
        }, 2000);
    }
    
    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        
        if (!formData.get('name')?.trim() || !formData.get('email')?.trim() || !formData.get('message')?.trim()) {
            this.showFormErrors(['Veuillez remplir tous les champs requis']);
            return;
        }
        
        if (!this.isValidEmail(formData.get('email'))) {
            this.showFormErrors(['Format d\'email invalide']);
            return;
        }
        
        this.showFormLoading(this.contactForm);
        
        setTimeout(() => {
            this.showFormSuccess('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            this.contactForm.reset();
            this.hideFormLoading(this.contactForm);
        }, 2000);
    }
    
    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.newsletterForm);
        const email = formData.get('email');
        
        if (!email?.trim()) {
            this.showFormErrors(['L\'email est requis'], this.newsletterForm);
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showFormErrors(['Format d\'email invalide'], this.newsletterForm);
            return;
        }
        
        this.showFormLoading(this.newsletterForm);
        
        setTimeout(() => {
            this.showFormSuccess('Merci ! Vous êtes maintenant abonné à notre newsletter.', this.newsletterForm);
            this.newsletterForm.reset();
            this.hideFormLoading(this.newsletterForm);
        }, 1500);
    }
    
    showFormErrors(errors, form = null) {
        this.clearFormMessages(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-errors';
        errorDiv.style.cssText = `
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        `;
        
        errorDiv.innerHTML = '<ul style="margin: 0; padding-left: 1.5rem;">' + 
            errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
        
        const targetForm = form || this.reservationForm;
        targetForm.insertBefore(errorDiv, targetForm.firstChild);
        
        // Scroll to form
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showFormSuccess(message, form = null) {
        this.clearFormMessages(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: #efe;
            border: 1px solid #cfc;
            color: #363;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        `;
        
        successDiv.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>${message}`;
        
        const targetForm = form || this.reservationForm;
        targetForm.insertBefore(successDiv, targetForm.firstChild);
        
        // Auto-remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
        
        // Scroll to form
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        }
    }
    
    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            
            if (form === this.reservationForm) {
                submitBtn.innerHTML = 'Confirmer la Réservation';
            } else if (form === this.contactForm) {
                submitBtn.innerHTML = 'Envoyer le Message';
            } else if (form === this.newsletterForm) {
                submitBtn.innerHTML = 'S\'abonner';
            }
        }
    }
    
    clearFormMessages(form = null) {
        const targetForm = form || this.reservationForm;
        const existingMessages = targetForm.querySelectorAll('.form-errors, .form-success');
        existingMessages.forEach(msg => msg.remove());
    }
}

// ===== SCROLL TO TOP FUNCTIONALITY =====
class ScrollController {
    constructor() {
        this.scrollTopBtn = document.getElementById('scroll-top');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScrollTop();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScrollTop());
        
        if (this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
        }
    }
    
    handleScrollTop() {
        const scrollY = window.pageYOffset;
        
        if (scrollY >= 500) {
            this.scrollTopBtn?.classList.add('show');
        } else {
            this.scrollTopBtn?.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
class SmoothScrollController {
    constructor() {
        this.anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }
    
    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#' || !href) return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            e.preventDefault();
            
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class AnimationController {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
            this.observeElements();
        }
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
    }
    
    observeElements() {
        const animatedElements = document.querySelectorAll(`
            .service__card,
            .menu__category,
            .specialty__card,
            .value__item,
            .contact__card,
            .location__card
        `);
        
        animatedElements.forEach((el, index) => {
            // Set initial styles
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            this.observer.observe(el);
        });
    }
}

// ===== LAZY LOADING FOR IMAGES =====
class LazyLoadController {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.createImageObserver();
        } else {
            this.loadAllImages();
        }
    }
    
    createImageObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });
        
        this.images.forEach(img => imageObserver.observe(img));
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        img.src = src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
    }
    
    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceController {
    constructor() {
        this.init();
    }
    
    init() {
        this.preloadCriticalImages();
        this.optimizeScrollPerformance();
    }
    
    preloadCriticalImages() {
        const criticalImages = [
            'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    optimizeScrollPerformance() {
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-dependent operations here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu?.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    document.body.style.overflow = '';
                    
                    // Return focus to menu toggle
                    const navToggle = document.getElementById('nav-toggle');
                    navToggle?.focus();
                }
            }
        });
    }
    
    setupAriaLabels() {
        // Add aria-labels to interactive elements
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Appeler le restaurant');
            }
        });
        
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Envoyer un email');
            }
        });
    }
    
    setupFocusManagement() {
        // Skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Aller au contenu principal';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: var(--white);
            padding: 8px;
            border-radius: 4px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main landmark
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main';
        }
    }
}

// ===== ERROR HANDLING =====
class ErrorHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupGlobalErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.logError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.logError(e.reason);
        });
    }
    
    logError(error) {
        // In a real application, you would send this to your error reporting service
        const errorData = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // For now, just log to console
        console.log('Error logged:', errorData);
    }
}

// ===== APPLICATION INITIALIZATION =====
class RestaurantApp {
    constructor() {
        this.controllers = [];
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeControllers());
        } else {
            this.initializeControllers();
        }
    }
    
    initializeControllers() {
        try {
            // Initialize all controllers
            this.controllers.push(new NavigationController());
            this.controllers.push(new MenuController());
            this.controllers.push(new FormController());
            this.controllers.push(new ScrollController());
            this.controllers.push(new SmoothScrollController());
            this.controllers.push(new AnimationController());
            this.controllers.push(new LazyLoadController());
            this.controllers.push(new PerformanceController());
            this.controllers.push(new AccessibilityController());
            this.controllers.push(new ErrorHandler());
            
            console.log('Restaurant website initialized successfully');
        } catch (error) {
            console.error('Error initializing restaurant website:', error);
        }
    }
}

// Initialize the application
const restaurantApp = new RestaurantApp();
