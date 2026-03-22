/**
 * Переключение между табами (Библиографическая запись, Связанные материалы и т.д.).
 */
(function () {
    'use strict';

    function init() {
        var tablist = document.querySelector('.book-tabs[role="tablist"]');
        var panels = document.querySelectorAll('.book-tab-panel');
        if (!tablist || !panels.length) {
            return;
        }

        var tabs = tablist.querySelectorAll('.book-tab[role="tab"]');

        function showPanel(tabId) {
            tabs.forEach(function (tab) {
                var selected = tab.getAttribute('data-tab') === tabId;
                tab.classList.toggle('active', selected);
                tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            });
            panels.forEach(function (panel) {
                var visible = panel.getAttribute('data-tab') === tabId;
                panel.classList.toggle('is-active', visible);
                panel.hidden = !visible;
            });
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                showPanel(tab.getAttribute('data-tab'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
