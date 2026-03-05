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
  // 1. FILTER PILLS — toggle active + tab panels
  // ============================
  const filterPills = document.querySelectorAll('.filter-pill');
  const tabPanels = document.querySelectorAll('.new-tab-panel');
  const newCarouselInstances = {};

  function initNewCarousel(panel) {
    const swiperEl = panel.querySelector('.new-carousel');
    if (!swiperEl || swiperEl.swiper) return;
    const key = panel.dataset.tab;

    const isMethodology = key === 'methodology';
    newCarouselInstances[key] = new Swiper(swiperEl, {
      slidesPerView: isMethodology ? 3 : 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: swiperEl.querySelector('.new-carousel-next'),
        prevEl: swiperEl.querySelector('.new-carousel-prev'),
      },
      breakpoints: isMethodology
        ? {
            320:  { slidesPerView: 1, spaceBetween: 16 },
            640:  { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }
        : {
            320:  { slidesPerView: 1, spaceBetween: 16 },
            640:  { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          },
    });
  }

  const activePanel = document.querySelector('.new-tab-panel.active');
  if (activePanel) initNewCarousel(activePanel);

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      tabPanels.forEach(panel => {
        if (panel.dataset.tab === filter) {
          panel.classList.add('active');
          initNewCarousel(panel);
          if (newCarouselInstances[filter]) {
            newCarouselInstances[filter].update();
          }
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ============================
  // Footer: раскрывающиеся Каталог / Коллекции
  // ============================
  document.querySelectorAll('.footer-dropdown .footer-link--toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var dropdown = toggle.closest('.footer-dropdown');
      if (!dropdown) return;
      var isOpen = dropdown.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  // ============================
  // SWIPER CAROUSEL — карусель для книг
  // ============================
  const booksCarousel = new Swiper('.books-carousel', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
      nextEl: '.books-carousel .swiper-button-next',
      prevEl: '.books-carousel .swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  // ============================
  // SWIPER CAROUSEL — карусель новостей
  // ============================
  const eventsCarousel = new Swiper('.events-carousel', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '.events-carousel-next',
      prevEl: '.events-carousel-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  // ============================
  // SWIPER CAROUSEL — карусель грамматики
  // ============================
  const grammarCarousel = new Swiper('.grammar-carousel', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '.grammar-carousel-next',
      prevEl: '.grammar-carousel-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  // ============================
  // SWIPER CAROUSEL — карусель языка специальности
  // ============================
  const specialtyCarousel = new Swiper('.specialty-carousel', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '.specialty-carousel-next',
      prevEl: '.specialty-carousel-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  // ============================
  // SWIPER CAROUSEL — карусель тематики
  // ============================
  const themCarousel = new Swiper('.them-carousel', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '.them-carousel-next',
      prevEl: '.them-carousel-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  // ============================
  // SWIPER CAROUSEL — карусель праздничных дат
  // ============================
  const dateCarousel = new Swiper('.date-carousel', {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: '.date-carousel-next',
      prevEl: '.date-carousel-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});
