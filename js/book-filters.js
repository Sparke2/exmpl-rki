/**
 * IPR РКИ — Book Filters
 * Динамическое меню фильтров с селектами (SlimSelect)
 * При смене категории меню перестраивается
 */

(function () {
  'use strict';

  const CATEGORIES = [
    { id: 'textbooks', label: 'Учебники и учебные пособия' },
    { id: 'bilingual', label: 'Русский язык для билингвов' },
    { id: 'testing', label: 'Подготовка к тестированию' },
    { id: 'specialty', label: 'Язык специальности' },
    { id: 'methodical', label: 'Методическая литература' },
    { id: 'fiction', label: 'Художественная литература' },
    { id: 'dictionaries', label: 'Словари' }
  ];

  const CATEGORY_FIELDS = {
    textbooks: [
      { type: 'select', key: 'level', label: 'Уровень владения' },
      { type: 'checkboxes', key: 'materials', label: 'Дополнительные материалы', options: [
        { value: 'audio', label: 'Аудио' },
        { value: 'video', label: 'Видео' }
      ]},
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'theme', label: 'Тематика' },
      { type: 'select', key: 'holidays', label: 'Праздники и памятные даты' },
      { type: 'select', key: 'section', label: 'Раздел' },
      { type: 'select', key: 'intermediary', label: 'Язык-посредник' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    bilingual: [
      { type: 'checkboxes', key: 'materials', label: 'Дополнительные материалы', options: [
        { value: 'audio', label: 'Аудио' },
        { value: 'video', label: 'Видео' }
      ]},
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'theme', label: 'Тематика' },
      { type: 'select', key: 'holidays', label: 'Праздники и памятные даты' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    testing: [
      { type: 'select', key: 'level', label: 'Уровень владения' },
      { type: 'checkboxes', key: 'materials', label: 'Дополнительные материалы', options: [
        { value: 'audio', label: 'Аудио' },
        { value: 'video', label: 'Видео' }
      ]},
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'testing_type', label: 'Тип тестирования' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    specialty: [
      { type: 'select', key: 'level', label: 'Уровень владения' },
      { type: 'checkboxes', key: 'materials', label: 'Дополнительные материалы', options: [
        { value: 'audio', label: 'Аудио' },
        { value: 'video', label: 'Видео' }
      ]},
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'theme', label: 'Тематика' },
      { type: 'select', key: 'intermediary', label: 'Язык-посредник' },
      { type: 'select', key: 'spec_profile', label: 'Профиль языка специальности' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    methodical: [
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'theme', label: 'Тематика' },
      { type: 'select', key: 'holidays', label: 'Праздники и памятные даты' },
      { type: 'select', key: 'type', label: 'Тип' },
      { type: 'select', key: 'topic', label: 'Тема' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    fiction: [
      { type: 'select', key: 'level', label: 'Уровень владения' },
      { type: 'checkboxes', key: 'for_kids', label: 'Дополнительно', options: [
        { value: 'kids', label: 'Для детей' }
      ]},
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ],
    dictionaries: [
      { type: 'select', key: 'grammar', label: 'Грамматика' },
      { type: 'select', key: 'type', label: 'Тип' },
      { type: 'select', key: 'translation_lang', label: 'Язык перевода' },
      { type: 'yearRange', key: 'year', label: 'Год' },
      { type: 'select', key: 'publisher', label: 'Издательство' }
    ]
  };

  const TEST_OPTIONS = {
    level: [
      { value: 'a1', text: 'А1 — элементарный' },
      { value: 'a2', text: 'А2 — базовый' },
      { value: 'b1', text: 'В1 — I сертификационный' }
    ],
    grammar: [
      { value: 'verb', text: 'Вид глагола (НСВ и СВ)' },
      { value: 'motion', text: 'Глаголы движения' },
      { value: 'nominative', text: 'Именительный падеж' }
    ],
    theme: [
      { value: 'phonetics', text: 'Фонетика, графика и орфография' },
      { value: 'self', text: 'О себе. Внешность, характер' },
      { value: 'things', text: 'Мои вещи. Одежда и обувь' }
    ],
    holidays: [
      { value: 'ny', text: 'Новый год' },
      { value: 'maslenitsa', text: 'Масленица' },
      { value: 'tatiana', text: 'Татьянин день' }
    ],
    section: [
      { value: 's1', text: 'Раздел 1' },
      { value: 's2', text: 'Раздел 2' },
      { value: 's3', text: 'Раздел 3' }
    ],
    intermediary: [
      { value: 'en', text: 'Английский' },
      { value: 'de', text: 'Немецкий' },
      { value: 'fr', text: 'Французский' }
    ],
    testing_type: [
      { value: 't1', text: 'ТРКИ' },
      { value: 't2', text: 'ТЭУ' },
      { value: 't3', text: 'ТБУ' }
    ],
    spec_profile: [
      { value: 'eng', text: 'Инженерно-технический профиль' },
      { value: 'science', text: 'Естественно-научный профиль' },
      { value: 'med', text: 'Медико-биологический профиль' }
    ],
    type: [
      { value: 't1', text: 'Тип 1' },
      { value: 't2', text: 'Тип 2' },
      { value: 't3', text: 'Тип 3' }
    ],
    topic: [
      { value: 'top1', text: 'Тема 1' },
      { value: 'top2', text: 'Тема 2' },
      { value: 'top3', text: 'Тема 3' }
    ],
    translation_lang: [
      { value: 'en', text: 'Английский' },
      { value: 'de', text: 'Немецкий' },
      { value: 'fr', text: 'Французский' }
    ],
    publisher: [
      { value: 'zlatoust', text: 'Златоуст' },
      { value: 'rki', text: 'Русский язык. Курсы' },
      { value: 'other', text: 'Другое издательство' }
    ]
  };

  function getYearOptions() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    const options = [];
    for (let y = 1970; y <= endYear; y++) {
      options.push({ value: String(y), text: String(y) });
    }
    return options.reverse();
  }

  const yearOptions = getYearOptions();
  const dynamicSlimSelectInstances = [];

  function destroyDynamicSlimSelectInstances() {
    dynamicSlimSelectInstances.forEach(ss => {
      if (ss && ss.destroy) ss.destroy();
    });
    dynamicSlimSelectInstances.length = 0;
  }

  function initSlimSelect(el, options, track) {
    if (typeof SlimSelect === 'undefined') return null;
    const opts = Object.assign({
      showSearch: false,
      allowDeselect: true,
      searchingText: '',
      searchText: 'Нет результатов',
      ajax: undefined
    }, options || {});
    const ss = new SlimSelect({ select: el, ...opts });
    if (track !== false) dynamicSlimSelectInstances.push(ss);
    return ss;
  }

  function renderDynamicFields(container, categoryId) {
    const fields = CATEGORY_FIELDS[categoryId];
    if (!fields || !fields.length) return;

    fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'book-filters-group';

      const label = document.createElement('label');
      label.className = 'book-filters-label';
      label.textContent = field.label;
      group.appendChild(label);

      if (field.type === 'select') {
        const wrap = document.createElement('div');
        wrap.className = 'book-filters-select';
        const select = document.createElement('select');
        select.dataset.key = field.key;
        const opts = TEST_OPTIONS[field.key] || [];
        select.innerHTML = '<option value="" data-placeholder="true">Выберите из списка</option>';
        opts.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o.value;
          opt.textContent = o.text;
          select.appendChild(opt);
        });
        wrap.appendChild(select);
        group.appendChild(wrap);
        container.appendChild(group);
        return;
      }

      if (field.type === 'yearRange') {
        const yearWrap = document.createElement('div');
        yearWrap.className = 'book-filters-year';
        ['year_from', 'year_to'].forEach((id, i) => {
          const wrap = document.createElement('div');
          wrap.className = 'book-filters-select';
          const select = document.createElement('select');
          select.dataset.key = id;
          select.dataset.placeholder = i === 0 ? 'От' : 'До';
          select.innerHTML = `<option value="" data-placeholder="true">${i === 0 ? 'От' : 'До'}</option>`;
          yearOptions.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.value;
            opt.textContent = o.text;
            select.appendChild(opt);
          });
          wrap.appendChild(select);
          yearWrap.appendChild(wrap);
        });
        group.appendChild(yearWrap);
        container.appendChild(group);
        return;
      }

      if (field.type === 'checkboxes') {
        const cbWrap = document.createElement('div');
        cbWrap.className = 'book-filters-checkboxes';
        (field.options || []).forEach(opt => {
          const labelEl = document.createElement('label');
          labelEl.className = 'book-filters-checkbox';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = field.key;
          input.value = opt.value;
          labelEl.appendChild(input);
          labelEl.appendChild(document.createTextNode(opt.label));
          cbWrap.appendChild(labelEl);
        });
        group.appendChild(cbWrap);
        container.appendChild(group);
      }
    });
  }

  function initSelectsInContainer(container) {
    const selects = container.querySelectorAll('select');
    selects.forEach(select => {
      const ph = select.dataset.placeholder || select.querySelector('option[value=""]')?.textContent || 'Выберите из списка';
      initSlimSelect(select, { placeholder: ph });
    });
  }

  function rebuildDynamicFilters(categoryId) {
    const container = document.getElementById('book-filters-dynamic');
    if (!container) return;

    destroyDynamicSlimSelectInstances();
    container.innerHTML = '';

    const fieldsCategoryId = categoryId || 'textbooks';
    renderDynamicFields(container, fieldsCategoryId);
    initSelectsInContainer(container);
  }

  function renderCategoryButtons(container, selectedId) {
    container.innerHTML = '';
    const toShow = selectedId
      ? CATEGORIES.filter(c => c.id === selectedId)
      : CATEGORIES;

    toShow.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'book-filters-category-btn' + (selectedId === cat.id ? ' is-selected' : '');
      btn.dataset.categoryId = cat.id;
      const textSpan = document.createElement('span');
      textSpan.className = 'book-filters-category-btn-text';
      textSpan.textContent = cat.label;
      btn.appendChild(textSpan);

      if (selectedId === cat.id) {
        const x = document.createElement('span');
        x.className = 'book-filters-category-clear';
        x.setAttribute('aria-label', 'Снять выбор');
        x.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<path d="M16.8608 5.13623L5.13318 16.8639" stroke="#ADADAD" stroke-width="1.5" stroke-linecap="round"/>\n' +
            '<path d="M16.8667 16.8638L5.13903 5.1361" stroke="#ADADAD" stroke-width="1.5" stroke-linecap="round"/>\n' +
            '</svg>\n';
        x.addEventListener('click', function (e) {
          e.stopPropagation();
          setSelectedCategory(null);
        });
        btn.appendChild(x);
      }

      btn.addEventListener('click', function (e) {
        if (e.target.closest('.book-filters-category-clear')) return;
        setSelectedCategory(selectedId === cat.id ? null : cat.id);
      });

      container.appendChild(btn);
    });
  }

  let selectedCategoryId = null;

  function setSelectedCategory(categoryId) {
    selectedCategoryId = categoryId;
    const container = document.getElementById('book-filters-categories');
    if (container) renderCategoryButtons(container, categoryId);
    rebuildDynamicFilters(categoryId || null);
  }

  function init() {
    const categoriesContainer = document.getElementById('book-filters-categories');
    const dynamicContainer = document.getElementById('book-filters-dynamic');
    if (!categoriesContainer || !dynamicContainer) return;

    renderCategoryButtons(categoriesContainer, null);
    rebuildDynamicFilters(null);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
