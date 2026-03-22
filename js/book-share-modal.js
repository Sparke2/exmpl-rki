/**
 * Модальное окно «Поделиться» и копирование ссылки.
 */
(function () {
    'use strict';

    var shareUrl = typeof window.location !== 'undefined' ? window.location.href : '';

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
        var url = encodeURIComponent(shareUrl);
        var text = encodeURIComponent(document.title || '');
        switch (service) {
            case 'vk':
                return 'https://vk.com/share.php?url=' + url + '&title=' + text;
            case 'ok':
                return 'https://connect.ok.ru/offer?url=' + url;
            case 'tg':
                return 'https://t.me/share/url?url=' + url + '&text=' + text;
            default:
                return shareUrl;
        }
    }

    function openModal() {
        var modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal() {
        var modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    function init() {
        var shareBtn = document.getElementById('share-btn');
        var modal = document.getElementById('share-modal');
        if (!modal) return;
        var closeBtn = modal.querySelector('.share-modal__close');
        var backdrop = modal.querySelector('.share-modal__backdrop');
        var copyLink = document.getElementById('share-copy');
        var vkLink = document.getElementById('share-vk');
        var okLink = document.getElementById('share-ok');
        var tgLink = document.getElementById('share-tg');

        if (shareBtn) {
            shareBtn.addEventListener('click', function (e) {
                e.preventDefault();
                shareUrl = window.location.href;
                openModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeModal);
        }

        if (copyLink) {
            copyLink.addEventListener('click', function (e) {
                e.preventDefault();
                copyToClipboard(shareUrl).catch(function () {});
                closeModal();
            });
        }

        if (vkLink) {
            vkLink.href = getShareUrl('vk');
        }
        if (okLink) {
            okLink.href = getShareUrl('ok');
        }
        if (tgLink) {
            tgLink.href = getShareUrl('tg');
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
