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

});
