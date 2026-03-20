/**
 * Plenitud Center - Comportamiento principal
 * Separación de capas: solo lógica e interacción
 */

(function () {
    'use strict';

    const LOADER_DELAY_MS = 1500;
    const NAV_SCROLL_THRESHOLD = 100;
    const REVEAL_THRESHOLD = 0.1;
    const REVEAL_ROOT_MARGIN = '0px 0px -50px 0px';
    const PARALLAX_FACTOR = 0.5;

    /**
     * Oculta el loader cuando la página ha cargado
     */
    function initLoader() {
        window.addEventListener('load', function () {
            setTimeout(function () {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('hidden');
                }
            }, LOADER_DELAY_MS);
        });
    }

    /**
     * Aplica clase 'scrolled' al nav al hacer scroll
     */
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > NAV_SCROLL_THRESHOLD) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /**
     * Activa animaciones reveal cuando los elementos entran en viewport
     */
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: REVEAL_THRESHOLD,
            rootMargin: REVEAL_ROOT_MARGIN
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /**
     * Scroll suave para enlaces internos (#...)
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Efecto parallax suave en el fondo del hero
     */
    function initHeroParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;

        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = 'scale(1.1) translateY(' + (scrolled * PARALLAX_FACTOR) + 'px)';
        });
    }

    /**
     * Scroll suave al hacer clic en el indicador "Descubrir"
     */
    function initScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        const introSection = document.getElementById('intro');
        if (!indicator || !introSection) return;

        indicator.addEventListener('click', function () {
            introSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /**
     * Menú hamburguesa para móvil
     * El overlay (#mobileMenu) es hijo directo de <body>, completamente fuera
     * del stacking context de mix-blend-mode del nav.
     */
    function initMobileMenu() {
        var toggle = document.getElementById('navToggle');
        var header = document.querySelector('header');
        var menu = document.getElementById('mobileMenu');
        if (!toggle || !header) return;

        function closeMenu() {
            header.classList.remove('nav-open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            if (menu) {
                menu.classList.remove('is-open');
                menu.setAttribute('aria-hidden', 'true');
            }
        }

        toggle.addEventListener('click', function () {
            var isOpen = header.classList.toggle('nav-open');
            toggle.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
            if (menu) {
                menu.classList.toggle('is-open', isOpen);
                menu.setAttribute('aria-hidden', String(!isOpen));
            }
        });

        if (menu) {
            menu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });
        }
    }

    /**
     * Dropdown selector de idioma en el nav.
     * El panel usa position:fixed para escapar el stacking context
     * de mix-blend-mode del nav en desktop.
     */
    function initLangDropdown() {
        var dropdown = document.getElementById('langDropdown');
        if (!dropdown) return;

        var currentBtn = dropdown.querySelector('.lang-current');
        var panel = dropdown.querySelector('.lang-options');

        function openPanel() {
            var rect = currentBtn.getBoundingClientRect();
            panel.style.top = (rect.bottom + 6) + 'px';
            panel.style.left = rect.left + 'px';
            dropdown.classList.add('open');
            currentBtn.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            dropdown.classList.remove('open');
            currentBtn.setAttribute('aria-expanded', 'false');
        }

        currentBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.contains('open') ? closePanel() : openPanel();
        });

        dropdown.querySelectorAll('.lang-option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lang = this.getAttribute('data-lang');
                if (window.luminaI18n) window.luminaI18n.setLang(lang);
                closePanel();
            });
        });

        document.addEventListener('click', function () {
            closePanel();
        });
    }

    /**
     * Anima contadores numéricos cuando entran al viewport
     */
    function initCounterAnimation() {
        var counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-target'), 10);
                var prefix = el.getAttribute('data-prefix') || '';
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 1600;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = Math.min((timestamp - start) / duration, 1);
                    var ease = 1 - Math.pow(1 - progress, 3);
                    var current = Math.round(ease * target);
                    el.textContent = prefix + current.toLocaleString('es-MX') + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                }

                requestAnimationFrame(step);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    /**
     * Inicializa todos los módulos
     */
    function init() {
        initLoader();
        initNavbarScroll();
        initRevealAnimations();
        initSmoothScroll();
        initHeroParallax();
        initScrollIndicator();
        initMobileMenu();
        initLangDropdown();
        initCounterAnimation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
