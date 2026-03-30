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
  // Collection Date Picker — календарь в фильтр-баре
  // ============================
  (function() {
    var btn = document.getElementById('collection-date-picker-btn');
    var dropdown = document.getElementById('collection-date-picker-dropdown');
    var textEl = document.querySelector('.collection-date-picker-text');
    if (!btn || !dropdown || !textEl) return;

    var MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    var today = new Date();
    var state = { year: today.getFullYear(), month: today.getMonth() };
    var selected = { start: null, end: null };

    function pad2(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function normalizeDate(d) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function formatDateForButton(d) {
      return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear() + ' г.';
    }

    function updateButtonText() {
      if (!selected.start && !selected.end) return;

      btn.classList.add('has-value');
      if (selected.start && selected.end) {
        textEl.textContent = formatDateForButton(selected.start) + ' — ' + formatDateForButton(selected.end);
      } else if (selected.start && !selected.end) {
        textEl.textContent = formatDateForButton(selected.start) + ' — …';
      }
    }

    function isSameDay(a, b) {
      if (!a || !b) return false;
      return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
    }

    function inRange(d) {
      if (!selected.start || !selected.end) return false;
      var t = d.getTime();
      return t >= selected.start.getTime() && t <= selected.end.getTime();
    }

    function renderCalendar() {
      var first = new Date(state.year, state.month, 1);
      var last = new Date(state.year, state.month + 1, 0);
      var start = (first.getDay() + 6) % 7;
      var prevLast = new Date(state.year, state.month, 0).getDate();

      var html = '<div class="collection-date-picker-calendar">';
      html += '<div class="calendar-header">';
      html += '<button type="button" class="calendar-nav date-picker-prev" aria-label="Предыдущий месяц"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2"/></svg></button>';
      html += '<span class="calendar-month-year">' + MONTHS_RU[state.month] + ' ' + state.year + ' г.</span>';
      html += '<button type="button" class="calendar-nav date-picker-next" aria-label="Следующий месяц"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/></svg></button>';
      html += '</div>';
      html += '<div class="calendar-weekdays"><span>пн</span><span>вт</span><span>ср</span><span>чт</span><span>пт</span><span>сб</span><span>вс</span></div>';
      html += '<div class="calendar-days" data-year="' + state.year + '" data-month="' + state.month + '">';

      for (var i = 0; i < start; i++) {
        html += '<span class="calendar-day calendar-day--other">' + (prevLast - start + i + 1) + '</span>';
      }
      for (var d = 1; d <= last.getDate(); d++) {
        var dateObj = new Date(state.year, state.month, d);
        var cls = 'calendar-day calendar-day--selectable';

        if (inRange(dateObj)) cls += ' calendar-day--in-range';
        if (isSameDay(dateObj, selected.start)) cls += ' calendar-day--range-start';
        if (isSameDay(dateObj, selected.end)) cls += ' calendar-day--range-end';

        html += '<span class="' + cls + '" data-day="' + d + '" data-date="' + dateObj.toISOString() + '">' + d + '</span>';
      }
      var total = start + last.getDate();
      var nextCount = total % 7 ? 7 - (total % 7) : 0;
      for (var j = 1; j <= nextCount; j++) {
        html += '<span class="calendar-day calendar-day--other">' + j + '</span>';
      }
      html += '</div></div>';
      dropdown.innerHTML = html;

      dropdown.querySelector('.date-picker-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        state.month--;
        if (state.month < 0) { state.month = 11; state.year--; }
        renderCalendar();
      });
      dropdown.querySelector('.date-picker-next').addEventListener('click', function(e) {
        e.stopPropagation();
        state.month++;
        if (state.month > 11) { state.month = 0; state.year++; }
        renderCalendar();
      });
      dropdown.querySelectorAll('.calendar-day--selectable').forEach(function(dayEl) {
        dayEl.addEventListener('click', function(e) {
          e.stopPropagation();
          var d = parseInt(dayEl.dataset.day, 10);
          var sel = normalizeDate(new Date(state.year, state.month, d));

          if (!selected.start || (selected.start && selected.end)) {
            selected.start = sel;
            selected.end = null;
            updateButtonText();
            renderCalendar();
            return;
          }

          selected.end = sel;
          if (selected.end.getTime() < selected.start.getTime()) {
            var tmp = selected.start;
            selected.start = selected.end;
            selected.end = tmp;
          }

          updateButtonText();
          renderCalendar();
          closeDropdown();

          console.log('[calendar] selected range:', {
            start: selected.start,
            end: selected.end,
            text: formatDateForButton(selected.start) + ' — ' + formatDateForButton(selected.end)
          });
        });
      });
    }

    function openDropdown() {
      if (!dropdown.querySelector('.collection-date-picker-calendar')) renderCalendar();
      dropdown.classList.add('is-open');
      dropdown.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropdown.classList.remove('is-open');
      dropdown.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
      if (dropdown.classList.contains('is-open')) closeDropdown();
      else openDropdown();
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleDropdown();
    });

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) closeDropdown();
    });
  })();

  // ============================
  // News & Events tabs — переключение на странице news.html
  // ============================
  (function () {
    var pills = document.querySelectorAll('.tab-pill');
    var items = document.querySelectorAll('.news-item[data-news-type]');
    if (!pills.length || !items.length) return;

    function applyFilter(filter) {
      items.forEach(function (el) {
        var type = el.getAttribute('data-news-type');
        var show = filter === 'all' || type === filter;
        el.style.display = show ? '' : 'none';
      });
      console.log('[tabs] active tab:', filter);
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        applyFilter(filter);
      });
    });

    var initiallyActive = document.querySelector('.tab-pill.active')?.getAttribute('data-filter') || 'all';
    applyFilter(initiallyActive);
  })();

  // ============================
  // Collection tags: скрыть «Показать все», если меньше 2 строк
  // ============================
  const tagsWrap = document.querySelector('.collection-tags-wrap');
  const tagsContainer = document.querySelector('.collection-tags');
  const tagsToggle = document.querySelector('.collection-tags-toggle');

  function updateTagsToggleVisibility() {
    if (!tagsWrap || !tagsContainer || !tagsToggle) return;
    var clone = tagsContainer.cloneNode(true);
    var containerWidth = tagsContainer.offsetWidth;
    clone.style.cssText = 'position:absolute;left:-9999px;top:0;max-height:none;visibility:hidden;width:' + containerWidth + 'px;';
    clone.id = '';
    document.body.appendChild(clone);
    var naturalHeight = clone.offsetHeight;
    document.body.removeChild(clone);
    var twoRowsPx = 112;
    if (naturalHeight <= twoRowsPx) {
      tagsToggle.style.display = 'none';
    } else {
      tagsToggle.style.display = '';
    }
  }

  if (tagsWrap && tagsToggle) {
    requestAnimationFrame(function () {
      updateTagsToggleVisibility();
    });
    window.addEventListener('resize', updateTagsToggleVisibility);
  }

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

  // ============================
  // LEXICON WORD CARDS — play audio
  // ============================
  var lexiconWordCards = document.querySelectorAll('.lexicon-word-card[data-audio-src]');
  if (lexiconWordCards && lexiconWordCards.length) {
    var audioEl = new Audio();
    audioEl.preload = 'metadata';
    audioEl.volume = 1;
    var currentCard = null;

    function formatDuration(sec) {
      if (!isFinite(sec) || sec < 0) return '0:00';
      var totalSeconds = Math.floor(sec);
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;
      var padded = seconds < 10 ? '0' + seconds : String(seconds);
      return minutes + ':' + padded;
    }

    function setCardDuration(card) {
      if (!card) return;
      var durationEl = card.querySelector('.lexicon-word-card__duration');
      if (!durationEl) return;
      durationEl.textContent = formatDuration(audioEl.duration);
    }

    function setPlayingUI(card, playing) {
      if (!card) return;
      var playIcon = card.querySelector('.lexicon-word-card__play-icon');
      var pauseIcon = card.querySelector('.lexicon-word-card__pause-icon');
      if (playIcon) playIcon.hidden = !!playing;
      if (pauseIcon) pauseIcon.hidden = !playing;

      card.classList.toggle('is-playing', playing);

      // Accessibility: update button label to match state.
      var btn = card.querySelector('.lexicon-word-card__play');
      if (btn) {
        btn.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
        btn.setAttribute('title', playing ? 'Пауза' : 'Воспроизвести');
      }
    }

    audioEl.addEventListener('loadedmetadata', function () {
      if (!currentCard) return;
      setCardDuration(currentCard);
    });

    audioEl.addEventListener('play', function () {
      if (!currentCard) return;
      setPlayingUI(currentCard, true);
    });

    audioEl.addEventListener('pause', function () {
      if (!currentCard) return;
      setPlayingUI(currentCard, false);
    });

    audioEl.addEventListener('ended', function () {
      if (currentCard) setPlayingUI(currentCard, false);
      currentCard = null;
    });

    lexiconWordCards.forEach(function (card) {
      var playBtn = card.querySelector('.lexicon-word-card__play');
      if (!playBtn) return;

      playBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var src = card.getAttribute('data-audio-src');
        if (!src) return;

        // If another card was playing — stop previous + reset.
        if (currentCard && currentCard !== card) {
          audioEl.pause();
          audioEl.currentTime = 0;
          setPlayingUI(currentCard, false);
        }

        currentCard = card;

        var currentSrc = audioEl.currentSrc || audioEl.src;

        // Same card: toggle play/pause.
        if (currentSrc === src) {
          if (audioEl.paused) {
            audioEl.play().catch(function () {});
          } else {
            audioEl.pause();
          }
          return;
        }

        // New src: load + play from start.
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.src = src;
        audioEl.load();
        audioEl.play().catch(function () {});
      });

      // Toggle full translation
      var toggleBtn = card.querySelector('.lexicon-word-card__toggle');
      var toggleLabel = toggleBtn ? toggleBtn.querySelector('.lexicon-word-card__toggle-label') : null;

      if (toggleBtn && toggleLabel) {
        toggleBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var expanded = !card.classList.contains('is-expanded');
          card.classList.toggle('is-expanded', expanded);
          toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          toggleLabel.textContent = expanded ? 'Скрыть' : 'Еще';
        });
      }
    });
  }
});
