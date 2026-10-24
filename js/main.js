/* ============================================
   Bag Balaji Enterprises - Main JavaScript
   Herbal Products Supplier & Trader
   Vijaypur, District Sheopur, MP, India
   ============================================ */

'use strict';

// ============================================
// 1. DOM Elements Cache
// ============================================
const DOM = {
  preloader: document.querySelector('.preloader'),
  navbar: document.querySelector('.navbar'),
  hamburger: document.querySelector('.hamburger'),
  navMenu: document.querySelector('.nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  backToTop: document.querySelector('.back-to-top'),
  contactForm: document.getElementById('contactForm'),
  testimonialTrack: document.querySelector('.testimonial-track'),
  testimonialDots: document.querySelectorAll('.testimonial-dot'),
  statNumbers: document.querySelectorAll('.stat-number'),
  sections: document.querySelectorAll('section[id]'),
  enquireButtons: document.querySelectorAll('.btn-enquire'),
  modalOverlay: document.querySelector('.modal-overlay'),
  modalClose: document.querySelector('.modal-close'),
};

// Phone number for WhatsApp
const WHATSAPP_NUMBER = '916264263058';


// ============================================
// 2. Preloader - Hide after page load
// ============================================
function initPreloader() {
  const hide = () => {
    setTimeout(() => {
      if (DOM.preloader) {
        DOM.preloader.classList.add('loaded');
      }
    }, 300);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Fallback: hide preloader within 2 seconds max
    setTimeout(hide, 2000);
  }
}


// ============================================
// 3. Mobile Menu Toggle
// ============================================
function initMobileMenu() {
  if (!DOM.hamburger || !DOM.navMenu) return;

  // Toggle hamburger and menu
  DOM.hamburger.addEventListener('click', () => {
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
    document.body.style.overflow = DOM.navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      DOM.hamburger.classList.remove('active');
      DOM.navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      DOM.navMenu.classList.contains('active') &&
      !DOM.navMenu.contains(e.target) &&
      !DOM.hamburger.contains(e.target)
    ) {
      DOM.hamburger.classList.remove('active');
      DOM.navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}


// ============================================
// 4. Smooth Scroll to Sections
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
      const topBar = document.querySelector('.top-bar');
      const topBarHeight = topBar ? topBar.offsetHeight : 0;
      const offset = navbarHeight + topBarHeight;

      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}


// ============================================
// 5. Scroll Animations (IntersectionObserver)
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in'
  );

  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}


// ============================================
// 6. Counter Animation for Stats
// ============================================
function animateCounter(element, target, suffix = '') {
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for smooth deceleration
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

function initCounterAnimation() {
  const statsSection = document.querySelector('.about-stats');
  if (!statsSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        DOM.statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          animateCounter(stat, target, suffix);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}


// ============================================
// 7. Sticky Navbar with Shadow & Auto-hide
// ============================================
function initStickyNavbar() {
  if (!DOM.navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const scrollThreshold = 100;
  const hideThreshold = 300; // Only auto-hide after scrolling this much
  const isMobile = () => window.innerWidth <= 992;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class for shadow effect
    if (currentScrollY > scrollThreshold) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }

    // Auto-hide on scroll down, show on scroll up (mobile only)
    if (isMobile() && currentScrollY > hideThreshold) {
      if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
        // Scrolling down - hide navbar
        DOM.navbar.classList.add('hidden');
      } else if (lastScrollY - currentScrollY > 5) {
        // Scrolling up - show navbar
        DOM.navbar.classList.remove('hidden');
      }
    } else {
      DOM.navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}


// ============================================
// 8. Back to Top Button
// ============================================
function initBackToTop() {
  if (!DOM.backToTop) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      DOM.backToTop.classList.add('visible');
    } else {
      DOM.backToTop.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top on click
  DOM.backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// ============================================
// 9. Active Nav Link Highlighting on Scroll
// ============================================
function initActiveNavHighlight() {
  if (DOM.sections.length === 0 || DOM.navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');

        DOM.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  DOM.sections.forEach(section => observer.observe(section));
}


// ============================================
// 10. Contact Form Validation & WhatsApp Redirect
// ============================================
function initContactForm() {
  if (!DOM.contactForm) return;

  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form fields
    const name = DOM.contactForm.querySelector('#name');
    const email = DOM.contactForm.querySelector('#email');
    const phone = DOM.contactForm.querySelector('#phone');
    const message = DOM.contactForm.querySelector('#message');

    let isValid = true;

    // Reset previous errors
    DOM.contactForm.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });

    // Validate Name
    if (!name || !name.value.trim()) {
      showFieldError(name, 'Please enter your name');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      showFieldError(name, 'Name must be at least 2 characters');
      isValid = false;
    }

    // Validate Email
    if (email && email.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Validate Phone
    if (!phone || !phone.value.trim()) {
      showFieldError(phone, 'Please enter your phone number');
      isValid = false;
    } else {
      const phoneRegex = /^[+]?[\d\s-]{8,15}$/;
      if (!phoneRegex.test(phone.value.trim())) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
      }
    }

    // Validate Message
    if (!message || !message.value.trim()) {
      showFieldError(message, 'Please enter your message');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showFieldError(message, 'Message must be at least 10 characters');
      isValid = false;
    }

    // If valid, redirect to WhatsApp
    if (isValid) {
      const productSelect = DOM.contactForm.querySelector('#productInterest');
      const selectedProduct = productSelect && productSelect.value && !productSelect.value.startsWith('--')
        ? productSelect.value
        : 'General Inquiry';

      const whatsappMessage = encodeURIComponent(
        `Hello Bag Balaji Enterprises! 🌿\n\n` +
        `*Name:* ${name.value.trim()}\n` +
        `*Phone:* ${phone.value.trim()}\n` +
        `*Email:* ${email && email.value.trim() ? email.value.trim() : 'N/A'}\n` +
        `*Product Interest:* ${selectedProduct}\n\n` +
        `*Requirements / Message:*\n${message.value.trim()}`
      );

      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      window.open(whatsappURL, '_blank');

      // Reset form
      DOM.contactForm.reset();
    }
  });

  // Remove error state on input
  DOM.contactForm.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

/**
 * Show validation error for a form field
 * @param {HTMLElement} field - The input element
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
  if (!field) return;
  const group = field.closest('.form-group');
  if (!group) return;

  group.classList.add('error');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
  }
}


// ============================================
// 11. Testimonial Slider
// ============================================
function initTestimonialSlider() {
  if (!DOM.testimonialTrack || DOM.testimonialDots.length === 0) return;

  const cards = DOM.testimonialTrack.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentSlide = 0;
  let autoPlayInterval;
  const autoPlayDelay = 5000; // 5 seconds

  /**
   * Go to a specific slide
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    // Wrap around
    if (index >= cards.length) index = 0;
    if (index < 0) index = cards.length - 1;

    currentSlide = index;
    DOM.testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    DOM.testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Dot click navigation
  DOM.testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
  });

  /**
   * Start auto-play
   */
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, autoPlayDelay);
  }

  /**
   * Reset auto-play timer (used when user manually navigates)
   */
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause auto-play on hover
  const sliderContainer = DOM.testimonialTrack.closest('.testimonial-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  }

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        goToSlide(currentSlide + 1);
      } else {
        // Swiped right - previous slide
        goToSlide(currentSlide - 1);
      }
      resetAutoPlay();
    }
  }

  // Initialize first slide and start auto-play
  goToSlide(0);
  startAutoPlay();
}


// ============================================
// 12. Dynamic Product Catalog & Live Price Rendering
// ============================================
function renderProductCatalog() {
  const grid = document.getElementById('productsGrid');
  if (!grid || typeof ProductPriceStore === 'undefined') return;

  const products = ProductPriceStore.getProducts();

  // Generate cards
  grid.innerHTML = products.map((prod, index) => {
    const formattedPrice = Number(prod.price).toLocaleString('en-IN');
    return `
      <article class="product-card fade-in" data-id="${prod.id}">
        <div class="product-image">
          <div class="placeholder-img" style="background: ${prod.gradient};">${prod.emoji}</div>
          <span class="product-badge">${prod.badge}</span>
        </div>
        <div class="product-body">
          <h3>${prod.name}</h3>
          <p style="font-style: italic; color: var(--color-primary); font-size: 0.85rem; margin-top: -6px; margin-bottom: 8px;">${prod.botanical}</p>

          <!-- Real-Time Wholesale Price Display -->
          <div class="product-price-box">
            <div class="price-left">
              <span class="price-currency">₹</span>
              <span class="price-amount">${formattedPrice}</span>
              <span class="price-unit"> / ${prod.unit}</span>
            </div>
            <span class="price-badge-tag">Wholesale Rate</span>
          </div>

          <p>${prod.description}</p>
          <div style="margin-bottom: 15px; font-size: 0.82rem; color: var(--color-text-light); line-height: 1.6;">
            <div>🏷️ <strong>MOQ:</strong> ${prod.moq}</div>
            <div>📅 <strong>Shelf Life:</strong> ${prod.shelfLife}</div>
            <div>📦 <strong>Packaging:</strong> ${prod.packaging}</div>
          </div>
          <div class="product-footer">
            <button class="btn-enquire" data-product="${prod.name}" data-price="${formattedPrice}" data-unit="${prod.unit}">💬 Enquire</button>
            <button class="btn-details" data-id="${prod.id}" aria-label="View ${prod.name} Details">Details</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Update contact form product dropdown with live prices
  const select = document.getElementById('productInterest');
  if (select) {
    const currentValue = select.value;
    select.innerHTML = `
      <option value="General Inquiry">-- Select Product (Optional) --</option>
      ${products.map(p => `
        <option value="${p.name} (₹${Number(p.price).toLocaleString('en-IN')}/${p.unit})">
          ${p.name} — ₹${Number(p.price).toLocaleString('en-IN')}/${p.unit}
        </option>
      `).join('')}
      <option value="Multiple Products / Custom Inquiry">Multiple Products / Custom Inquiry</option>
    `;
    if (currentValue) select.value = currentValue;
  }

  // Trigger animations for newly rendered elements
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}


// ============================================
// 13. Product Enquiry via WhatsApp (with Live Price)
// ============================================
function initProductEnquiry() {
  document.addEventListener('click', (e) => {
    const enquireBtn = e.target.closest('.btn-enquire');
    if (!enquireBtn) return;

    const productName = enquireBtn.getAttribute('data-product') || 'Herbal Product';
    const productPrice = enquireBtn.getAttribute('data-price') || '';
    const productUnit = enquireBtn.getAttribute('data-unit') || 'kg';

    const priceText = productPrice ? ` (listed at ₹${productPrice}/${productUnit} on your website)` : '';

    const whatsappMessage = encodeURIComponent(
      `Hello Bag Balaji Enterprises! 🌿\n\n` +
      `I am interested in ordering/inquiring about *${productName}*${priceText}.\n\n` +
      `Could you please share more details about:\n` +
      `• Available wholesale quantity & dispatch timeline\n` +
      `• Freight/delivery to our location\n` +
      `• Sample or quality report availability\n\n` +
      `Thank you!`
    );

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
  });
}


// ============================================
// 14. Product Detail Modal (with Price & MOQ Estimates)
// ============================================
function initProductModal() {
  document.addEventListener('click', (e) => {
    const detailsBtn = e.target.closest('.btn-details');
    if (!detailsBtn || !DOM.modalOverlay) return;

    const prodId = detailsBtn.getAttribute('data-id');
    const products = typeof ProductPriceStore !== 'undefined' ? ProductPriceStore.getProducts() : [];
    const prod = products.find(p => p.id === prodId);

    if (!prod) return;

    const formattedPrice = Number(prod.price).toLocaleString('en-IN');
    const numericMoq = parseInt(prod.moq, 10) || 1;
    const estMoqCost = (prod.price * numericMoq).toLocaleString('en-IN');

    const modalHeader = DOM.modalOverlay.querySelector('.modal-header h3');
    const modalBody = DOM.modalOverlay.querySelector('.modal-body');
    const modalEnquireBtn = DOM.modalOverlay.querySelector('.btn-enquire');

    if (modalHeader) {
      modalHeader.textContent = prod.name;
    }

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-image" style="background: ${prod.gradient}; font-size: 5rem;">${prod.emoji}</div>
        <h4>${prod.name}</h4>
        <p style="font-style: italic; color: var(--color-primary); font-size: 0.95rem; margin-top: -4px; margin-bottom: 12px;">Botanical Name: ${prod.botanical}</p>

        <!-- Price Highlight in Modal -->
        <div class="modal-price-highlight">
          <div>
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-text-light); font-weight: 600;">Current Wholesale Rate</div>
            <div class="modal-price-val">₹${formattedPrice} <span style="font-size: 0.9rem; font-weight: 500; color: var(--color-text-light);">/ ${prod.unit}</span></div>
          </div>
          <div class="modal-moq-est" style="text-align: right;">
            <div><strong>MOQ:</strong> ${prod.moq}</div>
            <div style="color: var(--color-primary); font-weight: 600;">Est. Order: ~₹${estMoqCost}</div>
          </div>
        </div>

        <p>${prod.description}</p>

        <div style="background: var(--color-bg-light); padding: 14px; border-radius: var(--radius-md); font-size: 0.88rem; line-height: 1.8; margin-top: 15px;">
          <div>📦 <strong>Packaging Available:</strong> ${prod.packaging}</div>
          <div>📅 <strong>Shelf Life:</strong> ${prod.shelfLife} (Store in dry, cool conditions)</div>
          <div>🌱 <strong>Origin &amp; Purity:</strong> 100% Naturally Dried, Free from Additives &amp; Colors</div>
          <div>🚚 <strong>Dispatch Location:</strong> Vijaypur, Sheopur (Madhya Pradesh) • Pan India Delivery</div>
        </div>
      `;
    }

    if (modalEnquireBtn) {
      modalEnquireBtn.setAttribute('data-product', prod.name);
      modalEnquireBtn.setAttribute('data-price', formattedPrice);
      modalEnquireBtn.setAttribute('data-unit', prod.unit);
      modalEnquireBtn.textContent = `💬 Inquire for ${prod.name} on WhatsApp`;
    }

    DOM.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal handlers
  if (DOM.modalClose) {
    DOM.modalClose.addEventListener('click', closeModal);
  }

  if (DOM.modalOverlay) {
    DOM.modalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    if (DOM.modalOverlay) {
      DOM.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}


// ============================================
// 15. Owner Product & Price Management System
// ============================================
function initPriceManager() {
  const overlay = document.getElementById('adminModalOverlay');
  const closeBtn = document.getElementById('closeAdminModal');
  const pinForm = document.getElementById('adminPinForm');
  const pinInput = document.getElementById('adminPinInput');
  const pinError = document.getElementById('pinErrorMsg');
  const pinView = document.getElementById('adminPinView');
  const dashView = document.getElementById('adminDashView');
  const formView = document.getElementById('adminFormView');
  const footer = document.getElementById('adminModalFooter');
  const productList = document.getElementById('adminProductList');
  const countBadge = document.getElementById('adminProductCount');
  const savePricesBtn = document.getElementById('btnSavePrices');
  const resetBtn = document.getElementById('btnResetPrices');
  const downloadBtn = document.getElementById('btnDownloadConfig');
  const changePinBtn = document.getElementById('btnChangePin');
  const openAddBtn = document.getElementById('btnOpenAddProduct');
  const cancelEditBtn = document.getElementById('btnCancelEdit');
  const cancelFormBtn = document.getElementById('btnCancelForm');
  const productEditForm = document.getElementById('productEditForm');
  const toast = document.getElementById('priceToast');

  if (!overlay) return;

  let isAuthenticated = false;

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function openAdmin() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!isAuthenticated) {
      pinView.style.display = 'block';
      dashView.classList.remove('active');
      if (formView) formView.classList.remove('active');
      footer.style.display = 'none';
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 200);
      }
      if (pinError) pinError.textContent = '';
    } else {
      showDashboardView();
    }
  }

  function closeAdmin() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showDashboardView() {
    pinView.style.display = 'none';
    if (formView) formView.classList.remove('active');
    dashView.classList.add('active');
    footer.style.display = 'flex';
    renderAdminProducts();
  }

  function showFormView(title) {
    pinView.style.display = 'none';
    dashView.classList.remove('active');
    footer.style.display = 'none';
    if (formView) {
      formView.classList.add('active');
      const heading = document.getElementById('formViewHeading');
      if (heading && title) heading.textContent = title;
    }
  }

  // Bind opening buttons
  ['openPriceManagerBtn', 'openPriceManagerTop', 'openPriceManagerFooter'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdmin();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeAdmin);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAdmin();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeAdmin();
  });

  // PIN Form submission
  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pinInput.value.trim();
      const actualPin = ProductStore.getPin();

      if (entered === actualPin) {
        isAuthenticated = true;
        showDashboardView();
      } else {
        pinError.textContent = '❌ Incorrect PIN. Please try again.';
        pinInput.select();
      }
    });
  }

  // Populate Admin product rows with Edit & Delete options
  function renderAdminProducts() {
    if (!productList) return;
    const products = ProductStore.getProducts();

    if (countBadge) {
      countBadge.textContent = `${products.length} Botanical Products`;
    }

    if (products.length === 0) {
      productList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--color-text-muted);">
          <p style="font-size: 2rem; margin-bottom: 8px;">📦</p>
          <p>No products in your catalog. Click "➕ Add New Product" to add one!</p>
        </div>
      `;
      return;
    }

    productList.innerHTML = products.map(prod => `
      <div class="admin-product-row" data-id="${prod.id}">
        <div class="admin-prod-info">
          <div class="admin-prod-emoji" style="background: ${prod.gradient};">${prod.emoji}</div>
          <div class="admin-prod-names">
            <strong>${prod.name}</strong>
            <span>${prod.botanical || 'Natural Botanical'} • MOQ: ${prod.moq || 'N/A'}</span>
          </div>
        </div>

        <div class="admin-product-controls">
          <div class="admin-price-input-wrap">
            <span class="admin-price-prefix">₹</span>
            <input type="number" class="admin-price-input" data-id="${prod.id}" value="${prod.price}" min="1" step="10">
            <span class="admin-price-unit">/ ${prod.unit || 'kg'}</span>
          </div>
          <button type="button" class="btn-row-action btn-row-edit" data-id="${prod.id}" title="Edit product details">✏️ Edit</button>
          <button type="button" class="btn-row-action btn-row-delete" data-id="${prod.id}" title="Delete product">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  // Handle Edit & Delete button clicks inside product list
  if (productList) {
    productList.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-row-edit');
      const deleteBtn = e.target.closest('.btn-row-delete');

      // Edit Product
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const products = ProductStore.getProducts();
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        // Fill form
        document.getElementById('editProductId').value = prod.id;
        document.getElementById('prodName').value = prod.name;
        document.getElementById('prodBotanical').value = prod.botanical || '';
        document.getElementById('prodPrice').value = prod.price;
        document.getElementById('prodUnit').value = prod.unit || 'kg';
        document.getElementById('prodBadge').value = prod.badge || '';
        document.getElementById('prodMoq').value = prod.moq || '';
        document.getElementById('prodShelfLife').value = prod.shelfLife || '';
        document.getElementById('prodPackaging').value = prod.packaging || '';
        document.getElementById('prodDesc').value = prod.description || '';

        // Emoji & Gradient selection
        setEmojiValue(prod.emoji || '🌿');
        setGradientValue(prod.gradient || 'linear-gradient(135deg, #43a047, #1b5e20)');

        showFormView(`✏️ Edit: ${prod.name}`);
      }

      // Delete Product
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const products = ProductStore.getProducts();
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        if (confirm(`Are you sure you want to delete "${prod.name}" from your website catalog?`)) {
          ProductStore.deleteProduct(id);
          renderProductCatalog();
          renderAdminProducts();
          showToast(`🗑️ "${prod.name}" deleted from catalog.`);
        }
      }
    });
  }

  // Open Add Product Form
  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      if (productEditForm) productEditForm.reset();
      document.getElementById('editProductId').value = '';
      setEmojiValue('🌿');
      setGradientValue('linear-gradient(135deg, #43a047, #1b5e20)');
      showFormView('➕ Add New Botanical Product');
    });
  }

  // Cancel form view
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', showDashboardView);
  if (cancelFormBtn) cancelFormBtn.addEventListener('click', showDashboardView);

  // Emoji picker logic
  const emojiPicker = document.getElementById('emojiPicker');
  function setEmojiValue(emoji) {
    const input = document.getElementById('prodEmoji');
    if (input) input.value = emoji;
    if (emojiPicker) {
      emojiPicker.querySelectorAll('.emoji-pill').forEach(btn => {
        btn.classList.toggle('selected', btn.getAttribute('data-emoji') === emoji);
      });
    }
  }

  if (emojiPicker) {
    emojiPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('.emoji-pill');
      if (btn) {
        const emoji = btn.getAttribute('data-emoji');
        setEmojiValue(emoji);
      }
    });
  }

  // Gradient swatch logic
  const gradientPicker = document.getElementById('gradientPicker');
  function setGradientValue(gradient) {
    const input = document.getElementById('prodGradient');
    if (input) input.value = gradient;
    if (gradientPicker) {
      gradientPicker.querySelectorAll('.gradient-swatch').forEach(btn => {
        btn.classList.toggle('selected', btn.getAttribute('data-gradient') === gradient);
      });
    }
  }

  if (gradientPicker) {
    gradientPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('.gradient-swatch');
      if (btn) {
        const grad = btn.getAttribute('data-gradient');
        setGradientValue(grad);
      }
    });
  }

  // Product Add / Edit Form submission
  if (productEditForm) {
    productEditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = document.getElementById('editProductId').value.trim();
      const name = document.getElementById('prodName').value.trim();
      const botanical = document.getElementById('prodBotanical').value.trim();
      const price = Number(document.getElementById('prodPrice').value);
      const unit = document.getElementById('prodUnit').value;
      const badge = document.getElementById('prodBadge').value.trim() || 'Wholesale';
      const moq = document.getElementById('prodMoq').value.trim() || '5 kg';
      const shelfLife = document.getElementById('prodShelfLife').value.trim() || '24 Months';
      const packaging = document.getElementById('prodPackaging').value.trim() || '10kg / 25kg Bags';
      const emoji = document.getElementById('prodEmoji').value || '🌿';
      const gradient = document.getElementById('prodGradient').value || 'linear-gradient(135deg, #43a047, #1b5e20)';
      const description = document.getElementById('prodDesc').value.trim();

      if (!name || isNaN(price) || price <= 0 || !description) {
        alert('Please fill in the product name, price, and description.');
        return;
      }

      const productPayload = {
        id: editId || ('prod-' + Date.now()),
        name,
        botanical,
        emoji,
        gradient,
        badge,
        price,
        unit,
        moq,
        shelfLife,
        packaging,
        description
      };

      if (editId) {
        ProductStore.updateProduct(productPayload);
        showToast(`✅ "${name}" updated successfully!`);
      } else {
        ProductStore.addProduct(productPayload);
        showToast(`✅ "${name}" added to catalog!`);
      }

      renderProductCatalog();
      showDashboardView();
    });
  }

  // Save live price inputs
  if (savePricesBtn) {
    savePricesBtn.addEventListener('click', () => {
      const inputs = productList.querySelectorAll('.admin-price-input');
      const newPriceMap = {};

      inputs.forEach(input => {
        const id = input.getAttribute('data-id');
        const val = Number(input.value);
        if (id && !isNaN(val) && val > 0) {
          newPriceMap[id] = val;
        }
      });

      ProductStore.updatePrices(newPriceMap);
      renderProductCatalog();
      closeAdmin();
      showToast('✅ Product prices updated successfully on your website!');
    });
  }

  // Reset to default catalog
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all products and prices back to the default catalog? Any custom products you added will be removed.')) {
        ProductStore.resetToDefaults();
        renderAdminProducts();
        renderProductCatalog();
        showToast('🔄 Catalog reset to default products & prices.');
      }
    });
  }

  // Change PIN
  if (changePinBtn) {
    changePinBtn.addEventListener('click', () => {
      const newPin = prompt('Enter a new 4 to 8 digit Owner PIN:');
      if (newPin && newPin.trim().length >= 4) {
        ProductStore.setPin(newPin);
        alert('✅ Your Owner PIN has been updated successfully!');
      } else if (newPin !== null) {
        alert('⚠️ PIN must be at least 4 digits long.');
      }
    });
  }

  // Download updated products-data.js file
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const products = ProductStore.getProducts();
      const fileContent = `/**
 * ====================================================================
 * Bag Balaji Enterprises - Products & Pricing Data
 * Generated on: ${new Date().toLocaleDateString('en-IN')}
 * ====================================================================
 */

const DEFAULT_PRODUCTS = ${JSON.stringify(products, null, 2)};

const ProductStore = {
  STORAGE_PRODUCTS_KEY: 'bag_balaji_custom_products',
  STORAGE_PRICES_KEY: 'bag_balaji_product_prices',
  PIN_KEY: 'bag_balaji_admin_pin',
  DEFAULT_PIN: '${ProductStore.getPin()}',

  getProducts() {
    try {
      const custom = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading products:', e);
    }
    return DEFAULT_PRODUCTS.map(p => ({ ...p }));
  },

  saveAllProducts(productsArray) {
    try {
      localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(productsArray));
      return true;
    } catch (e) {
      return false;
    }
  },

  addProduct(newProduct) {
    const list = this.getProducts();
    if (!newProduct.id) newProduct.id = 'product-' + Date.now();
    list.push(newProduct);
    return this.saveAllProducts(list);
  },

  updateProduct(updatedProduct) {
    let list = this.getProducts();
    list = list.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p);
    return this.saveAllProducts(list);
  },

  deleteProduct(productId) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== productId);
    return this.saveAllProducts(list);
  },

  updatePrices(priceMap) {
    let list = this.getProducts();
    list = list.map(p => {
      if (typeof priceMap[p.id] !== 'undefined') {
        return { ...p, price: Number(priceMap[p.id]) };
      }
      return p;
    });
    return this.saveAllProducts(list);
  },

  resetToDefaults() {
    try {
      localStorage.removeItem(this.STORAGE_PRODUCTS_KEY);
      localStorage.removeItem(this.STORAGE_PRICES_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  getPin() {
    return localStorage.getItem(this.PIN_KEY) || this.DEFAULT_PIN;
  },

  setPin(newPin) {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(this.PIN_KEY, newPin.trim());
    return true;
  }
};

const ProductPriceStore = ProductStore;
`;

      const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('⬇️ Downloaded updated products-data.js');
    });
  }
}


// ============================================
// 16. Year Auto-update in Footer
// ============================================
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


// ============================================
// 17. Keyboard Accessibility Enhancements
// ============================================
function initAccessibility() {
  if (DOM.hamburger) {
    DOM.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    DOM.hamburger.setAttribute('aria-expanded', 'false');

    DOM.hamburger.addEventListener('click', () => {
      const isOpen = DOM.navMenu?.classList.contains('active');
      DOM.hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.navMenu?.classList.contains('active')) {
      DOM.hamburger?.click();
    }
  });
}


// ============================================
// 18. Lazy Background Images (Performance)
// ============================================
function initLazyBackgrounds() {
  const lazyBgElements = document.querySelectorAll('[data-bg]');
  if (lazyBgElements.length === 0) return;

  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bgUrl = entry.target.getAttribute('data-bg');
        if (bgUrl) {
          entry.target.style.backgroundImage = `url(${bgUrl})`;
          entry.target.classList.add('bg-loaded');
        }
        bgObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  lazyBgElements.forEach(el => bgObserver.observe(el));
}


// ============================================
// 19. Initialize Everything
// ============================================
function init() {
  initPreloader();
  initMobileMenu();
  initSmoothScroll();
  initCounterAnimation();
  initStickyNavbar();
  initBackToTop();
  initActiveNavHighlight();
  initContactForm();
  initTestimonialSlider();

  // Price & Catalog Systems
  renderProductCatalog();
  initProductEnquiry();
  initProductModal();
  initPriceManager();

  initFooterYear();
  initAccessibility();
  initLazyBackgrounds();
  initScrollAnimations();

  console.log('🌿 Bag Balaji Enterprises - Website & Price Manager Initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
