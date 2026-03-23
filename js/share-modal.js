/**
 * Переиспользуемый компонент «Поделиться» (кнопка + модальное окно).
 *
 * Подключение:
 *   <link rel="stylesheet" href="css/share-modal.css">
 *   <script src="js/share-modal.js"></script>
 *
 * Использование:
 *   Любой элемент с атрибутом data-share-btn откроет модальное окно.
 *   Можно передать URL через data-share-url, иначе берётся window.location.href.
 *
 *   <button type="button" data-share-btn>Поделиться</button>
 *   <button type="button" data-share-btn data-share-url="https://example.com">Поделиться</button>
 */
(function () {
    'use strict';

    var MODAL_ID = 'share-modal';
    var modalEl = null;
    var currentShareUrl = '';

    function getBasePath() {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src && src.indexOf('share-modal.js') !== -1) {
                return src.replace(/js\/share-modal\.js.*$/, '');
            }
        }
        return '';
    }

    function buildModalHTML(basePath) {
        return '' +
            '<div class="share-modal" id="' + MODAL_ID + '" aria-hidden="true" role="dialog" aria-labelledby="share-modal-title" aria-modal="true">' +
                '<div class="share-modal__backdrop"></div>' +
                '<div class="share-modal__box">' +
                    '<div class="share-modal__header">' +
                        '<h2 class="share-modal__title" id="share-modal-title">Поделиться</h2>' +
                        '<button type="button" class="share-modal__close" aria-label="Закрыть">' +
                            '<img src="' + basePath + 'img/icons/cross.svg" width="28" height="28" alt="" aria-hidden="true">' +
                        '</button>' +
                    '</div>' +
                    '<div class="share-modal__body">' +
                        '<a href="#" class="share-modal__item share-modal__item--copy" data-share-action="copy" aria-label="Копировать ссылку">' +
                            '<span class="share-modal__icon share-modal__icon--copy">' +
                                '<img src="' + basePath + 'img/icons/copy-biblio.svg" width="24" height="24" alt="">' +
                            '</span>' +
                            '<span class="share-modal__label">Копировать<br>ссылку</span>' +
                        '</a>' +
                        '<a href="#" class="share-modal__item" data-share-action="vk" target="_blank" rel="noopener noreferrer" aria-label="Поделиться во Вконтакте">' +
                            '<span class="share-modal__icon share-modal__icon--social"><img src="' + basePath + 'img/icons/social/vk2.svg" width="48" height="48" alt=""></span>' +
                            '<span class="share-modal__label">Вконтакте</span>' +
                        '</a>' +
                        '<a href="#" class="share-modal__item" data-share-action="ok" target="_blank" rel="noopener noreferrer" aria-label="Поделиться в Одноклассниках">' +
                            '<span class="share-modal__icon share-modal__icon--social"><img src="' + basePath + 'img/icons/social/ok.svg" width="48" height="48" alt=""></span>' +
                            '<span class="share-modal__label">Одноклассники</span>' +
                        '</a>' +
                        '<a href="#" class="share-modal__item" data-share-action="tg" target="_blank" rel="noopener noreferrer" aria-label="Поделиться в Telegram">' +
                            '<span class="share-modal__icon share-modal__icon--social"><img src="' + basePath + 'img/icons/social/tg2.svg" width="48" height="48" alt=""></span>' +
                            '<span class="share-modal__label">Telegram</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

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

    function getShareUrl(service) {
        var url = encodeURIComponent(currentShareUrl);
        var text = encodeURIComponent(document.title || '');
        switch (service) {
            case 'vk':
                return 'https://vk.com/share.php?url=' + url + '&title=' + text;
            case 'ok':
                return 'https://connect.ok.ru/offer?url=' + url;
            case 'tg':
                return 'https://t.me/share/url?url=' + url + '&text=' + text;
            default:
                return currentShareUrl;
        }
    }

    function ensureModal() {
        modalEl = document.getElementById(MODAL_ID);
        if (!modalEl) {
            var basePath = getBasePath();
            var wrapper = document.createElement('div');
            wrapper.innerHTML = buildModalHTML(basePath);
            modalEl = wrapper.firstChild;
            document.body.appendChild(modalEl);
        }
        return modalEl;
    }

    function updateLinks() {
        if (!modalEl) return;
        var vk = modalEl.querySelector('[data-share-action="vk"]');
        var ok = modalEl.querySelector('[data-share-action="ok"]');
        var tg = modalEl.querySelector('[data-share-action="tg"]');
        if (vk) vk.href = getShareUrl('vk');
        if (ok) ok.href = getShareUrl('ok');
        if (tg) tg.href = getShareUrl('tg');
    }

    function openModal(shareUrl) {
        currentShareUrl = shareUrl || window.location.href;
        ensureModal();
        updateLinks();
        modalEl.classList.add('is-open');
        modalEl.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (modalEl) {
            modalEl.classList.remove('is-open');
            modalEl.setAttribute('aria-hidden', 'true');
        }
    }

    function init() {
        ensureModal();

        modalEl.addEventListener('click', function (e) {
            var target = e.target.closest('[data-share-action]');

            if (e.target.closest('.share-modal__close') || e.target.closest('.share-modal__backdrop')) {
                e.preventDefault();
                closeModal();
                return;
            }

            if (target && target.getAttribute('data-share-action') === 'copy') {
                e.preventDefault();
                copyToClipboard(currentShareUrl).catch(function () {});
                closeModal();
            }
        });

        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-share-btn]');
            if (trigger) {
                e.preventDefault();
                var url = trigger.getAttribute('data-share-url') || window.location.href;
                openModal(url);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ShareModal = {
        open: openModal,
        close: closeModal
    };
})();
