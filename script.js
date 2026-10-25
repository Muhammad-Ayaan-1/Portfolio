/**
 * AYN — Premium 2D Artist Portfolio
 * Pure Vanilla JavaScript (ES6+)
 * Zero dependencies / Zero frameworks
 * Features:
 *  - Light / Dark Theme Switcher with LocalStorage & OS Auto-Detection
 *  - Scroll Progress Indicator & Back-to-Top Button
 *  - Animated Milestone Counters on Scroll
 *  - Ambient Stardust Canvas Animation
 *  - 3D Interactive Card Tilt
 *  - Dynamic JSON-powered Artwork Gallery & Category Filters
 *  - Fullscreen Lightbox & Validated Contact Workflow
 */

(function () {
  'use strict';

  // State
  let allArtworks = [];
  let currentCategory = 'All Works';
  let lastActiveElement = null;

  // Contact form configuration
  const ARTIST_EMAIL = 'ayaanzakir12345@gmail.com';

  /* --------------------------------------------------------------------------
     1. DOM Ready Initialization
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    updateCopyrightYear();
    initializePreloader();
    initializeTheme();
    initializeNavigation();
    initializeHeroInteractions();
    initializeScrollEffects();
    initializeScrollAnimations();
    initializeAmbientParticles();
    initializeMouseEffects();
    initializeLightbox();
    initializeContactForm();
    loadArtworks();
  });

  /* --------------------------------------------------------------------------
     2. Creative Preloader Screen (3-4 Seconds Intro)
     "Welcome to the Ayaan's portfolio"
     -------------------------------------------------------------------------- */
  function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const barFill = document.getElementById('preloader-bar-fill');
    const counterEl = document.getElementById('preloader-counter');
    const statusMsg = document.getElementById('preloader-status-msg');
    const skipBtn = document.getElementById('preloader-skip-btn');

    if (!preloader) return;

    // Lock page scrolling while intro is playing
    document.body.classList.add('is-loading');

    const stages = [
      { max: 22, text: 'Preparing digital canvas...' },
      { max: 48, text: 'Inking character silhouettes & lineart...' },
      { max: 74, text: 'Rendering lighting passes & color schemes...' },
      { max: 92, text: 'Polishing portfolio showcase...' },
      { max: 100, text: "Welcome to Ayaan's portfolio!" }
    ];

    const totalDuration = 3400; // ~3.4 seconds (within 3/4 seconds range requested)
    const startTime = performance.now();
    let isFinished = false;
    let animId = null;

    function finishPreloader() {
      if (isFinished) return;
      isFinished = true;
      if (animId) cancelAnimationFrame(animId);

      if (barFill) barFill.style.width = '100%';
      if (counterEl) counterEl.textContent = '100%';
      if (statusMsg) statusMsg.textContent = "Welcome to Ayaan's portfolio!";

      setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');

        // Trigger reveal animations on hero elements
        const heroReveals = document.querySelectorAll('#home .reveal');
        heroReveals.forEach((el) => el.classList.add('is-revealed'));

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 350);
    }

    function step(now) {
      if (isFinished) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Smooth realistic ease-out curve
      const eased = 1 - Math.pow(1 - progress, 2.8);
      const currentVal = Math.min(100, Math.floor(eased * 100));

      if (barFill) barFill.style.width = `${currentVal}%`;
      if (counterEl) counterEl.textContent = `${currentVal}%`;

      // Update stage text
      for (let i = 0; i < stages.length; i++) {
        if (currentVal <= stages[i].max) {
          if (statusMsg && statusMsg.textContent !== stages[i].text) {
            statusMsg.textContent = stages[i].text;
          }
          break;
        }
      }

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        finishPreloader();
      }
    }

    animId = requestAnimationFrame(step);

    skipBtn?.addEventListener('click', () => {
      finishPreloader();
    });
  }

  /* --------------------------------------------------------------------------
     3. Hero Section Portrait Artwork Interactivity
     -------------------------------------------------------------------------- */
  function initializeHeroInteractions() {
    const heroTrigger = document.getElementById('hero-featured-art-trigger');
    if (!heroTrigger) return;

    const openFeaturedArtwork = () => {
      // Find featured portrait artwork (Celestial Valkyrie / ID 2 or first artwork)
      const target = allArtworks.find((a) => a.id === 2 || a.title.toLowerCase().includes('valkyrie') || a.image.includes('featured')) || allArtworks[0];
      if (target) {
        openLightbox(target, heroTrigger);
      }
    };

    heroTrigger.addEventListener('click', openFeaturedArtwork);
    heroTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFeaturedArtwork();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Copyright Year
     -------------------------------------------------------------------------- */
  function updateCopyrightYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* --------------------------------------------------------------------------
     3. Theme Switcher (Light / Dark Mode)
     -------------------------------------------------------------------------- */
  function initializeTheme() {
    const desktopToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    const mobileStatusText = document.getElementById('mobile-theme-status-text');
    const metaThemeColor = document.getElementById('meta-theme-color');

    // Get current theme from html attribute or storage
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (!currentTheme) {
      const savedTheme = localStorage.getItem('ayn_theme');
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = savedTheme ? savedTheme : (systemDark ? 'dark' : 'light');
    }

    // Apply theme state to DOM
    function applyTheme(theme, save = true) {
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);

      if (save) {
        try {
          localStorage.setItem('ayn_theme', theme);
        } catch (e) {}
      }

      // Update meta theme-color
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B131E' : '#FFFFFF');
      }

      // Update button labels & accessibility
      const isDark = theme === 'dark';
      if (desktopToggle) {
        desktopToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        desktopToggle.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      }

      if (mobileToggle) {
        mobileToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      }

      if (mobileStatusText) {
        mobileStatusText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
      }
    }

    applyTheme(currentTheme, false);

    // Toggle handler
    function toggleTheme() {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    }

    desktopToggle?.addEventListener('click', toggleTheme);
    mobileToggle?.addEventListener('click', toggleTheme);

    // Watch for OS theme changes if user hasn't explicitly saved a choice
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('ayn_theme')) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. Scroll Effects: Progress Bar, Back to Top, Stats Counter & Card Tilt
     -------------------------------------------------------------------------- */
  function initializeScrollEffects() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    // Smooth scroll progress & Back to Top visibility
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Update scroll progress bar
      if (progressBar && docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = `${progress}%`;
      }

      // Toggle Back-to-Top Button
      if (backToTopBtn) {
        if (scrollY > 380) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Back to top click action
    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Milestone Number Count-Up Animation on Scroll
    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip && 'IntersectionObserver' in window) {
      let animated = false;
      const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            obs.unobserve(entry.target);
            animateStatsNumbers();
          }
        });
      }, { threshold: 0.3 });

      statsObserver.observe(statsStrip);
    }

    function animateStatsNumbers() {
      const counters = document.querySelectorAll('.stat-count');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic: 1 - Math.pow(1 - progress, 3)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          counter.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    // Interactive 3D Card Tilt on Desktop Hover
    initializeCardTilt();
  }

  /**
   * Subtle 3D perspective tilt effect on artwork cards
   */
  function initializeCardTilt() {
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const grid = document.getElementById('artwork-grid');
    if (!grid) return;

    grid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.artwork-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit max tilt angle to +/- 6 degrees
      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px)`;
    });

    grid.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.artwork-card');
      if (card) {
        card.style.transform = '';
      }
    }, true);
  }

  /* --------------------------------------------------------------------------
     5. Ambient Stardust Particle Canvas
     -------------------------------------------------------------------------- */
  function initializeAmbientParticles() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let isTabVisible = true;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      const count = Math.min(32, Math.floor(width / 45));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          speedY: Math.random() * 0.35 + 0.1,
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.4 ? 'rgba(255, 183, 3, ' : 'rgba(142, 202, 230, ',
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    function render() {
      if (!isTabVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulseAngle += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseAngle));

        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }

      animationId = requestAnimationFrame(render);
    }

    render();

    // Pause when tab not visible to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabVisible = false;
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        isTabVisible = true;
        render();
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Navigation & Mobile Menu
     -------------------------------------------------------------------------- */
  function initializeNavigation() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll header background transition
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    const toggleMobileMenu = (forceClose = false) => {
      if (!menuToggle || !mobileDrawer) return;

      const shouldOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

      if (shouldOpen) {
        mobileDrawer.classList.add('open');
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      } else {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', () => toggleMobileMenu());
    }

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(true);
      });
    });

    // Close menu on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
        toggleMobileMenu(true);
        menuToggle?.focus();
      }
    });

    // Active Section Observer for Desktop Nav Links
    if ('IntersectionObserver' in window && sections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else if (href && href.startsWith('#')) {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach((sec) => sectionObserver.observe(sec));
    }
  }

  /* --------------------------------------------------------------------------
     7. JSON-Powered Artwork Gallery
     -------------------------------------------------------------------------- */
  async function loadArtworks() {
    const grid = document.getElementById('artwork-grid');
    if (!grid) return;

    renderGalleryLoading(grid);

    try {
      const response = await fetch('artworks.json', { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Failed to load artworks.json (HTTP status: ${response.status})`);
      }

      const rawData = await response.json();
      allArtworks = validateArtworkData(rawData);

      if (allArtworks.length === 0) {
        renderGalleryEmpty(grid);
        return;
      }

      createCategoryFilters(allArtworks);
      renderArtworks(allArtworks);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      renderGalleryError(grid, error.message);
    }
  }

  // Active lightbox state
  let currentLightboxArtwork = null;
  let currentLightboxImageIndex = 0;

  /**
   * Validates and sanitizes raw JSON data with full multi-image support
   */
  function validateArtworkData(data) {
    if (!Array.isArray(data)) {
      console.warn('Artwork data is not an array.');
      return [];
    }

    const seenIds = new Set();

    return data
      .filter((item) => item && typeof item === 'object')
      .map((item, index) => {
        let id = item.id;
        if (!id || seenIds.has(id)) {
          id = `artwork-${index + 1}`;
        }
        seenIds.add(id);

        // Normalize images array (support objects or string URLs)
        let imagesList = [];
        if (Array.isArray(item.images) && item.images.length > 0) {
          imagesList = item.images.map((imgItem, imgIndex) => {
            if (typeof imgItem === 'string') {
              return {
                url: imgItem.trim(),
                label: `Version ${imgIndex + 1}`,
                caption: ''
              };
            }
            return {
              url: String(imgItem.url || imgItem.image || '').trim(),
              label: String(imgItem.label || imgItem.title || (imgIndex === 0 ? 'Final Artwork' : `Process View ${imgIndex + 1}`)).trim(),
              caption: String(imgItem.caption || imgItem.description || '').trim()
            };
          }).filter((img) => img.url);
        }

        // Primary thumbnail
        const primaryImage = String(item.image || (imagesList.length > 0 ? imagesList[0].url : '')).trim();

        // If no images array was provided, generate single image entry
        if (imagesList.length === 0 && primaryImage) {
          imagesList = [{
            url: primaryImage,
            label: 'Final Artwork',
            caption: String(item.description || '').trim()
          }];
        }

        return {
          id: id,
          title: String(item.title || 'Untitled Artwork').trim(),
          description: String(item.description || 'No description provided.').trim(),
          type: String(item.type || 'Illustration').trim(),
          image: primaryImage,
          images: imagesList,
        };
      });
  }

  /**
   * Generates dynamic filter buttons based on unique types in JSON
   */
  function createCategoryFilters(artworks) {
    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;

    filterContainer.innerHTML = '';

    const typesSet = new Set();
    artworks.forEach((art) => {
      if (art.type) typesSet.add(art.type);
    });

    const categories = ['All Works', ...Array.from(typesSet)];

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn ${cat === currentCategory ? 'active' : ''}`;
      btn.textContent = cat;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat === currentCategory ? 'true' : 'false');

      btn.addEventListener('click', () => {
        currentCategory = cat;
        filterContainer.querySelectorAll('.filter-btn').forEach((b) => {
          const isActive = b.textContent === cat;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        filterArtworks(cat);
      });

      filterContainer.appendChild(btn);
    });
  }

  /**
   * Filters and renders matching artworks
   */
  function filterArtworks(category) {
    const filtered = category === 'All Works'
      ? allArtworks
      : allArtworks.filter((art) => art.type.toLowerCase() === category.toLowerCase());

    renderArtworks(filtered);
  }

  /**
   * Renders artwork cards into the grid using safe DOM methods
   */
  function renderArtworks(artworksToRender) {
    const grid = document.getElementById('artwork-grid');
    const countBadge = document.getElementById('gallery-count');
    if (!grid) return;

    if (countBadge) {
      countBadge.textContent = `Showing ${artworksToRender.length} of ${allArtworks.length} works`;
    }

    grid.innerHTML = '';

    if (artworksToRender.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'gallery-status-message';
      const heading = document.createElement('h3');
      heading.textContent = 'No artworks found in this category';
      const desc = document.createElement('p');
      desc.textContent = 'Try selecting another category or resetting the filter to All Works.';
      emptyMsg.appendChild(heading);
      emptyMsg.appendChild(desc);
      grid.appendChild(emptyMsg);
      return;
    }

    artworksToRender.forEach((artwork) => {
      const card = createArtworkCard(artwork);
      grid.appendChild(card);
    });
  }

  /**
   * Builds an individual artwork card using safe DOM creation
   * Auto-adjusts to image aspect ratio (no fixed crop)
   */
  function createArtworkCard(artwork) {
    const card = document.createElement('article');
    card.className = 'artwork-card reveal is-revealed';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${artwork.title} details`);

    // Thumbnail container
    const thumbWrapper = document.createElement('div');
    thumbWrapper.className = 'artwork-thumbnail-wrapper';

    // Multi-image badge if project contains multiple versions (e.g. Lineart + Final)
    if (artwork.images && artwork.images.length > 1) {
      const multiBadge = document.createElement('div');
      multiBadge.className = 'card-multi-badge';
      multiBadge.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m3 9 18-6"/><path d="m21 9-18 6"/></svg>
        <span>${artwork.images.length} Versions</span>
      `;
      thumbWrapper.appendChild(multiBadge);
    }

    // Image element - auto-adjusts to natural aspect ratio
    const img = document.createElement('img');
    img.className = 'artwork-thumbnail';
    img.alt = artwork.title;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';

    // Graceful error fallback
    img.onerror = () => {
      thumbWrapper.innerHTML = '';
      const fallback = createArtworkFallback(artwork.title);
      thumbWrapper.appendChild(fallback);
    };

    if (artwork.image) {
      img.src = artwork.image;
      thumbWrapper.appendChild(img);
    } else {
      thumbWrapper.appendChild(createArtworkFallback(artwork.title));
    }

    // Hover overlay & indicator
    const overlay = document.createElement('div');
    overlay.className = 'artwork-overlay';

    const indicator = document.createElement('span');
    indicator.className = 'view-indicator';
    indicator.textContent = (artwork.images && artwork.images.length > 1)
      ? 'View Art & Lineart'
      : 'View Artwork';

    indicator.insertAdjacentHTML(
      'beforeend',
      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left: 4px;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
    );

    overlay.appendChild(indicator);
    thumbWrapper.appendChild(overlay);

    // Meta details container
    const meta = document.createElement('div');
    meta.className = 'artwork-meta';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'artwork-type-label';
    typeLabel.textContent = artwork.type;

    const titleEl = document.createElement('h3');
    titleEl.className = 'artwork-card-title';
    titleEl.textContent = artwork.title;

    const descEl = document.createElement('p');
    descEl.className = 'artwork-card-desc';
    descEl.textContent = artwork.description;

    meta.appendChild(typeLabel);
    meta.appendChild(titleEl);
    meta.appendChild(descEl);

    card.appendChild(thumbWrapper);
    card.appendChild(meta);

    // Click & Keyboard interactions for Lightbox
    const triggerLightbox = () => {
      openLightbox(artwork, card);
    };

    card.addEventListener('click', triggerLightbox);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerLightbox();
      }
    });

    return card;
  }

  /**
   * Creates an artistic CSS fallback container when an image fails or is missing
   */
  function createArtworkFallback(title) {
    const container = document.createElement('div');
    container.className = 'artwork-fallback';

    container.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
      <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-dark);">${escapeHTML(title)}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Artwork preview unavailable</div>
    `;

    return container;
  }

  function renderGalleryLoading(grid) {
    grid.innerHTML = `
      <div class="gallery-status-message">
        <h3>Loading Gallery...</h3>
        <p>Curating the artist's visual collection from artworks.json</p>
      </div>
    `;
  }

  function renderGalleryEmpty(grid) {
    grid.innerHTML = `
      <div class="gallery-status-message">
        <h3>No Artworks Found</h3>
        <p>The artworks.json file does not currently contain any artwork entries.</p>
      </div>
    `;
  }

  function renderGalleryError(grid, errorMsg) {
    grid.innerHTML = `
      <div class="gallery-status-message">
        <h3>Unable to Load Artwork Data</h3>
        <p>${escapeHTML(errorMsg)}</p>
        <p style="font-size: 0.8125rem; color: var(--text-muted);">
          Note: If running locally without a web server, browsers may block JSON fetching via file://.
          Please use Live Server or host on any static hosting platform.
        </p>
        <button type="button" class="btn btn-secondary" id="retry-gallery-btn" style="margin-top: 1rem;">
          Retry Loading
        </button>
      </div>
    `;

    document.getElementById('retry-gallery-btn')?.addEventListener('click', () => {
      loadArtworks();
    });
  }

  /* --------------------------------------------------------------------------
     8. Fullscreen Multi-Image Lightbox Modal
     -------------------------------------------------------------------------- */
  function initializeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const backdrop = document.querySelector('.lightbox-backdrop');
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (!modal) return;

    const closeHandler = () => closeLightbox();

    closeBtn?.addEventListener('click', closeHandler);
    backdrop?.addEventListener('click', closeHandler);

    // Carousel navigation
    prevBtn?.addEventListener('click', () => {
      navigateLightboxImage(-1);
    });

    nextBtn?.addEventListener('click', () => {
      navigateLightboxImage(1);
    });

    // Keyboard support: Left/Right arrows for version switching, Escape to close
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightboxImage(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightboxImage(1);
      }
    });
  }

  function navigateLightboxImage(direction) {
    if (!currentLightboxArtwork || !currentLightboxArtwork.images || currentLightboxArtwork.images.length <= 1) return;

    const total = currentLightboxArtwork.images.length;
    currentLightboxImageIndex = (currentLightboxImageIndex + direction + total) % total;
    updateLightboxActiveView();
  }

  function selectLightboxVersion(index) {
    if (!currentLightboxArtwork || !currentLightboxArtwork.images || index < 0 || index >= currentLightboxArtwork.images.length) return;
    currentLightboxImageIndex = index;
    updateLightboxActiveView();
  }

  function openLightbox(artwork, triggerElement) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    lastActiveElement = triggerElement;
    currentLightboxArtwork = artwork;
    currentLightboxImageIndex = 0;

    const titleEl = modal.querySelector('.lightbox-title');
    const badgeEl = modal.querySelector('.lightbox-badge');
    const descEl = modal.querySelector('.lightbox-description');

    if (titleEl) titleEl.textContent = artwork.title;
    if (badgeEl) badgeEl.textContent = artwork.type;
    if (descEl) descEl.textContent = artwork.description;

    updateLightboxActiveView();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    const closeBtn = modal.querySelector('.lightbox-close-btn');
    closeBtn?.focus();
  }

  /**
   * Refreshes the active image, version pills, and thumbnail strip in the Lightbox
   */
  function updateLightboxActiveView() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || !currentLightboxArtwork) return;

    const images = currentLightboxArtwork.images || [];
    const activeItem = images[currentLightboxImageIndex] || {
      url: currentLightboxArtwork.image,
      label: 'Final Artwork',
      caption: currentLightboxArtwork.description
    };

    const imgEl = document.getElementById('lightbox-image');
    const counterEl = document.getElementById('lightbox-counter');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const versionPills = document.getElementById('lightbox-version-pills');
    const versionTag = document.getElementById('version-status-tag');
    const versionDesc = document.getElementById('version-status-desc');
    const processBlock = document.getElementById('lightbox-process-block');
    const thumbStrip = document.getElementById('lightbox-thumb-strip');

    // 1. Update Image with smooth transition
    if (imgEl) {
      imgEl.style.opacity = '0.3';
      imgEl.alt = `${currentLightboxArtwork.title} — ${activeItem.label}`;

      imgEl.onload = () => {
        imgEl.style.opacity = '1';
      };

      imgEl.onerror = () => {
        imgEl.style.opacity = '1';
      };

      imgEl.src = activeItem.url;
    }

    // 2. Counter & Navigation Arrows
    const isMultiImage = images.length > 1;

    if (counterEl) {
      counterEl.textContent = isMultiImage
        ? `${currentLightboxImageIndex + 1} of ${images.length}`
        : '1 of 1';
    }

    if (prevBtn) {
      prevBtn.classList.toggle('is-hidden', !isMultiImage);
    }
    if (nextBtn) {
      nextBtn.classList.toggle('is-hidden', !isMultiImage);
    }

    // 3. Version Tag & Description
    if (versionTag) {
      versionTag.textContent = activeItem.label || `Version ${currentLightboxImageIndex + 1}`;
    }

    if (versionDesc) {
      versionDesc.textContent = activeItem.caption || currentLightboxArtwork.description;
    }

    // 4. Version Switcher Pills Bar (below preview image)
    if (versionPills) {
      versionPills.innerHTML = '';
      if (isMultiImage) {
        versionPills.classList.remove('is-hidden');

        images.forEach((imgObj, idx) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = `lightbox-version-pill-btn ${idx === currentLightboxImageIndex ? 'active' : ''}`;
          const isLineArt = imgObj.label.toLowerCase().includes('line') || imgObj.label.toLowerCase().includes('sketch');
          const icon = isLineArt ? '✏️ ' : '✦ ';
          pill.innerHTML = `<span aria-hidden="true">${icon}</span><span>${escapeHTML(imgObj.label || `Version ${idx + 1}`)}</span>`;
          pill.setAttribute('role', 'tab');
          pill.setAttribute('aria-selected', idx === currentLightboxImageIndex ? 'true' : 'false');

          pill.addEventListener('click', () => {
            selectLightboxVersion(idx);
          });

          versionPills.appendChild(pill);
        });
      } else {
        versionPills.classList.add('is-hidden');
      }
    }

    // 5. Sidebar Process Thumbnails Strip
    if (processBlock && thumbStrip) {
      thumbStrip.innerHTML = '';
      if (isMultiImage) {
        processBlock.classList.remove('is-hidden');

        images.forEach((imgObj, idx) => {
          const thumbBtn = document.createElement('button');
          thumbBtn.type = 'button';
          thumbBtn.className = `lightbox-thumb-item ${idx === currentLightboxImageIndex ? 'active' : ''}`;
          thumbBtn.setAttribute('aria-label', `View ${imgObj.label}`);
          thumbBtn.title = imgObj.label;

          const thumbImg = document.createElement('img');
          thumbImg.src = imgObj.url;
          thumbImg.alt = imgObj.label;
          thumbImg.loading = 'lazy';

          thumbBtn.appendChild(thumbImg);

          thumbBtn.addEventListener('click', () => {
            selectLightboxVersion(idx);
          });

          thumbStrip.appendChild(thumbBtn);
        });
      } else {
        processBlock.classList.add('is-hidden');
      }
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    currentLightboxArtwork = null;

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  /* --------------------------------------------------------------------------
     9. Scroll-Based Reveal Animations
     -------------------------------------------------------------------------- */
  function initializeScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-revealed'));
    }
  }

  /* --------------------------------------------------------------------------
     10. Mouse-Following Glow Accent (Desktop only)
     -------------------------------------------------------------------------- */
  function initializeMouseEffects() {
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;

    let targetX = -999;
    let targetY = -999;
    let currentX = -999;
    let currentY = -999;
    let isMoving = false;
    let rafId = null;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!cursorGlow.classList.contains('active')) {
        cursorGlow.classList.add('active');
        currentX = targetX;
        currentY = targetY;
      }

      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updateGlowPosition);
      }
    }, { passive: true });

    function updateGlowPosition() {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);

      if (diffX > 0.1 || diffY > 0.1) {
        rafId = requestAnimationFrame(updateGlowPosition);
      } else {
        isMoving = false;
      }
    }

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     11. Contact Form & Mailto Workflow
     -------------------------------------------------------------------------- */
  function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const noticeEl = document.getElementById('form-notice');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.classList.add('is-invalid');
        isValid = false;
      } else {
        subjectInput.classList.remove('is-invalid');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('is-invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('is-invalid');
      }

      if (!isValid) return;

      const subject = `[AYN Portfolio Inquiry] ${subjectInput.value.trim()}`;
      const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`;
      const mailtoUrl = `mailto:${encodeURIComponent(ARTIST_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (noticeEl) {
        noticeEl.className = 'form-notice form-notice-info active';
        noticeEl.innerHTML = `
          <strong>Launching Email Client:</strong> A new email draft addressed to <strong>${ARTIST_EMAIL}</strong> has been prepared with your message. Please click <strong>Send</strong> in your mail application to complete delivery!
        `;
      }

      window.location.href = mailtoUrl;
    });

    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Helper Functions
     -------------------------------------------------------------------------- */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
