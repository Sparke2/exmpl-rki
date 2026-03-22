/**
 * Копирование DOI в буфер обмена по клику на кнопку с иконкой.
 */
(function () {
    'use strict';

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
        document.querySelectorAll('.doi-copy-btn[data-doi]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var doi = btn.getAttribute('data-doi');
                if (!doi) {
                    return;
                }
                copyToClipboard(doi).catch(function () {});
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
