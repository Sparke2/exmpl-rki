/**
 * IPR РКИ — Main JavaScript
 * Handles: scroll arrows, filter pill toggling, interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // 0. CATALOG OVERLAY — open/close
  // ============================
  const btnCatalog = document.querySelector('.btn-catalog');
  const catalogOverlay = document.getElementById('catalog-overlay');
  const catalogOverlayClose = document.querySelector('.catalog-overlay-close');

  function closeCatalog() {
    if (!catalogOverlay || !btnCatalog) return;
    catalogOverlay.classList.remove('is-open');
    btnCatalog.classList.remove('is-open');
    btnCatalog.setAttribute('aria-expanded', 'false');
    catalogOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openCatalog() {
    if (!catalogOverlay || !btnCatalog) return;
    catalogOverlay.classList.add('is-open');
    btnCatalog.classList.add('is-open');
    btnCatalog.setAttribute('aria-expanded', 'true');
    catalogOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function toggleCatalog() {
    if (!catalogOverlay || !btnCatalog) return;
    const isOpen = catalogOverlay.classList.toggle('is-open');
    btnCatalog.classList.toggle('is-open', isOpen);
    btnCatalog.setAttribute('aria-expanded', isOpen);
    catalogOverlay.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (btnCatalog && catalogOverlay) {
    btnCatalog.addEventListener('click', () => toggleCatalog());
  }

  if (catalogOverlayClose && catalogOverlay) {
    catalogOverlayClose.addEventListener('click', () => closeCatalog());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && catalogOverlay?.classList.contains('is-open')) {
      closeCatalog();
    }
  });

  // ============================
  // 1. FILTER PILLS — toggle active
  // ============================
  const filterPills = document.querySelectorAll('.filter-pill');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Remove active from all
      filterPills.forEach(p => p.classList.remove('active'));
      // Set clicked as active
      pill.classList.add('active');

      // Get filter value
      const filter = pill.dataset.filter;

      // Show/hide sections based on filter
      const sections = document.querySelectorAll('.content-section');
      sections.forEach(section => {
        if (filter === 'all') {
          section.style.display = '';
        } else {
          section.style.display = section.dataset.section === filter ? '' : 'none';
        }
      });
    });
  });

  // ============================
  // 2. SCROLL ARROWS — horizontal scroll
  // ============================
  const scrollContainers = document.querySelectorAll('.scroll-container');

  scrollContainers.forEach(container => {
    const scrollRow = container.querySelector('.scroll-row');
    const arrowRight = container.querySelector('.scroll-arrow--right');
    const arrowLeft = container.querySelector('.scroll-arrow--left');

    if (arrowRight) {
      arrowRight.addEventListener('click', () => {
        const cardWidth = scrollRow.querySelector('.material-card')?.offsetWidth || 200;
        const gap = parseInt(getComputedStyle(scrollRow).gap) || 16;
        scrollRow.scrollBy({
          left: (cardWidth + gap) * 2,
          behavior: 'smooth'
        });
      });
    }

    if (arrowLeft) {
      arrowLeft.addEventListener('click', () => {
        const cardWidth = scrollRow.querySelector('.material-card')?.offsetWidth || 200;
        const gap = parseInt(getComputedStyle(scrollRow).gap) || 16;
        scrollRow.scrollBy({
          left: -((cardWidth + gap) * 2),
          behavior: 'smooth'
        });
      });
    }

    // Show/hide arrows based on scroll position
    if (scrollRow) {
      const updateArrows = () => {
        const maxScroll = scrollRow.scrollWidth - scrollRow.clientWidth;

        if (arrowLeft) {
          arrowLeft.style.opacity = scrollRow.scrollLeft > 10 ? '1' : '0';
          arrowLeft.style.pointerEvents = scrollRow.scrollLeft > 10 ? 'auto' : 'none';
        }

        if (arrowRight) {
          const isEnd = scrollRow.scrollLeft >= maxScroll - 10;
          arrowRight.style.opacity = isEnd ? '0' : '1';
          arrowRight.style.pointerEvents = isEnd ? 'none' : 'auto';
        }
      };

      scrollRow.addEventListener('scroll', updateArrows, { passive: true });

      // Initial check
      updateArrows();

      // Recheck on window resize
      window.addEventListener('resize', updateArrows, { passive: true });
    }
  });

  // ============================
  // 3. SEARCH — basic interaction
  // ============================
  const searchInput = document.querySelector('.search-input-wrap input');
  const searchBtn = document.querySelector('.btn-search');

  if (searchBtn && searchInput) {
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        // Visual feedback
        searchBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          searchBtn.style.transform = '';
        }, 150);
      }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // ============================
  // 4. CARD HOVER — subtle lift
  // ============================
  const cards = document.querySelectorAll('.material-card');
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.style.transition = 'box-shadow 0.25s ease, transform 0.25s ease';

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================
  // 5. CONTENT-TYPE ICONS in card footers
  // ============================
  const typeIconMap = {
    books: 'type-book.svg',
    worksheets: 'type-edit.svg',
    tests: 'type-calendar.svg',
    interactives: 'type-interactive.svg',
    materials: 'type-games.svg',
    methodology: 'type-documents.svg',
    lexicon: 'type-book.svg'
  };

  Object.entries(typeIconMap).forEach(([section, icon]) => {
    const sectionEl = document.querySelector(`[data-section="${section}"]`);
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.card-footer').forEach(footer => {
      const img = document.createElement('img');
      img.src = `img/icons/${icon}`;
      img.className = 'type-icon';
      img.width = 28;
      img.height = 28;
      img.alt = '';
      footer.insertBefore(img, footer.firstChild);
    });
  });

  // ============================
  // 6. STAR TOGGLE (favorite)
  // ============================
  const stars = document.querySelectorAll('.card-star');
  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = star.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src');
      if (src.includes('star-fill')) {
        img.setAttribute('src', 'img/icons/star.svg');
      } else {
        img.setAttribute('src', 'img/icons/star-fill.svg');
      }
    });
  });

});
