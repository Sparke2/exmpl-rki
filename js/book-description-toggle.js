/**
 * Сворачивание описания до 3 строк и кнопка «Читать полностью» / «Свернуть».
 */
(function () {
    'use strict';

    var textEl = document.getElementById('book-description-text');
    var toggleBtn = document.getElementById('book-description-toggle');

    if (!textEl || !toggleBtn) {
        return;
    }

    var LABEL_EXPAND = 'Читать полностью';
    var LABEL_COLLAPSE = 'Свернуть';

    function textOverflowsWhenCollapsed() {
        if (!textEl.classList.contains('is-collapsed')) {
            textEl.classList.add('is-collapsed');
        }
        var overflows = textEl.scrollHeight > textEl.clientHeight;
        return overflows;
    }

    function init() {
        if (!textOverflowsWhenCollapsed()) {
            textEl.classList.remove('is-collapsed');
            toggleBtn.hidden = true;
            return;
        }

        toggleBtn.hidden = false;
        toggleBtn.textContent = LABEL_EXPAND;
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function () {
        var collapsed = textEl.classList.toggle('is-collapsed');
        toggleBtn.textContent = collapsed ? LABEL_EXPAND : LABEL_COLLAPSE;
        toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
