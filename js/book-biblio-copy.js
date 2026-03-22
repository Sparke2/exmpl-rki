/**
 * Копирование текста библиографической записи в буфер обмена.
 */
(function () {
    'use strict';

    var SOURCE_ID = 'biblio-record-text';
    var BTN_ID = 'biblio-copy-btn';

    function copyToClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                var ok = document.execCommand('copy');
                document.body.removeChild(ta);
                ok ? resolve() : reject(new Error('copy failed'));
            } catch (e) {
                document.body.removeChild(ta);
                reject(e);
            }
        });
    }

    function init() {
        var source = document.getElementById(SOURCE_ID);
        var btn = document.getElementById(BTN_ID);
        if (!source || !btn) {
            return;
        }

        var COOLDOWN_MS = 10000;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (btn.disabled) {
                return;
            }
            var text = (source.innerText || source.textContent || '').trim();
            if (!text) {
                return;
            }
            copyToClipboard(text).then(function () {
                btn.disabled = true;
                setTimeout(function () {
                    btn.disabled = false;
                }, COOLDOWN_MS);
            }).catch(function () {});
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
