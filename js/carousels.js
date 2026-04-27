/**
 * IPR RKI — Swiper carousels auto init
 *
 * Rules:
 * - books: max 4 slides visible
 * - methodology: max 3 slides visible
 * - others: max 5 slides visible
 */
(function () {
  function getCarouselBaseClass(swiperEl) {
    if (!swiperEl || !swiperEl.classList) return null;
    for (var i = 0; i < swiperEl.classList.length; i++) {
      var cls = swiperEl.classList.item(i);
      if (!cls || cls === 'swiper') continue;
      if (cls.endsWith('-carousel')) return cls;
    }
    return null;
  }

  function getCarouselType(swiperEl) {
    if (!swiperEl) return 'other';

    if (swiperEl.classList.contains('books-carousel')) return 'books';

    // Try to infer from surrounding section, if exists
    var section = swiperEl.closest('[data-section]');
    if (section) {
      var s = section.getAttribute('data-section');
      if (s === 'books') return 'books';
      if (s === 'methodology') return 'methodology';
    }

    // Fallback: infer from class names
    if (swiperEl.className && String(swiperEl.className).indexOf('method') !== -1) return 'methodology';

    return 'other';
  }

  function getMaxVisibleByType(type) {
    if (type === 'books') return 4;
    if (type === 'methodology') return 2;
    return 3;
  }

  function buildBreakpoints(maxVisible) {
    // Baseline responsive behavior, capped by maxVisible.
    var bp = {
      320: { slidesPerView: 1, spaceBetween: 16 },
      640: { slidesPerView: Math.min(2, maxVisible), spaceBetween: 20 },
      1024: { slidesPerView: Math.min(3, maxVisible), spaceBetween: 20 },
      1280: { slidesPerView: Math.min(4, maxVisible), spaceBetween: 20 },
    };

    // For wide screens allow up to 5 when requested.
    if (maxVisible >= 5) {
      bp[1536] = { slidesPerView: 5, spaceBetween: 20 };
    }

    return bp;
  }

  function initOneCarousel(swiperEl) {
    if (!swiperEl || swiperEl.swiper) return;
    if (typeof Swiper === 'undefined') return;

    var base = getCarouselBaseClass(swiperEl);
    if (!base) return;

    var type = getCarouselType(swiperEl);
    var maxVisible = getMaxVisibleByType(type);

    // Find navigation buttons near this carousel.
    var shell = swiperEl.closest('.' + base + '-shell') || swiperEl.parentElement;
    var nextEl = null;
    var prevEl = null;
    if (shell && shell.querySelector) {
      nextEl = shell.querySelector('.' + base + '-next');
      prevEl = shell.querySelector('.' + base + '-prev');
    }

    // Fallback to global selectors (works for current markup).
    if (!nextEl) nextEl = document.querySelector('.' + base + '-next');
    if (!prevEl) prevEl = document.querySelector('.' + base + '-prev');

    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: nextEl && prevEl ? { nextEl: nextEl, prevEl: prevEl } : undefined,
      breakpoints: buildBreakpoints(maxVisible),
    });
  }

  function initAllCarousels(root) {
    var scope = root || document;
    var swipers = scope.querySelectorAll('.swiper');
    if (!swipers || !swipers.length) return;

    for (var i = 0; i < swipers.length; i++) {
      initOneCarousel(swipers[i]);
    }
  }

  // Expose for manual re-init if needed (e.g. dynamic content).
  window.IPRInitCarousels = initAllCarousels;

  document.addEventListener('DOMContentLoaded', function () {
    initAllCarousels(document);
  });
})();

