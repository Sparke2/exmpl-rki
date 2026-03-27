/**
 * Inline share block (no modal).
 * Reuses the same share URL + copy logic as share-modal.js.
 *
 * Markup:
 *   <div data-share-inline> ... <a data-share-action="vk|ok|tg|copy"> ... </a> ... </div>
 * Optional:
 *   data-share-url="https://example.com"
 */
(function () {
  'use strict';

  function showCopiedInline(target) {
    var label = target.querySelector('.news-detail-share-label');
    if (!label) return;

    if (!target.dataset.originalLabelHtml) {
      target.dataset.originalLabelHtml = label.innerHTML;
    }

    label.textContent = 'Ссылка скопирована';
    target.classList.add('is-copied');

    window.clearTimeout(target.__labelTimer);
    target.__labelTimer = window.setTimeout(function () {
      label.innerHTML = target.dataset.originalLabelHtml || 'Копировать<br>ссылку';
      target.classList.remove('is-copied');
    }, 1800);
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

  function getShareUrl(service, rawUrl) {
    var url = encodeURIComponent(rawUrl);
    var text = encodeURIComponent(document.title || '');
    switch (service) {
      case 'vk':
        return 'https://vk.com/share.php?url=' + url + '&title=' + text;
      case 'ok':
        return 'https://connect.ok.ru/offer?url=' + url;
      case 'tg':
        return 'https://t.me/share/url?url=' + url + '&text=' + text;
      default:
        return rawUrl;
    }
  }

  function initBlock(block) {
    var shareUrl = block.getAttribute('data-share-url') || window.location.href;

    var vk = block.querySelector('[data-share-action="vk"]');
    var ok = block.querySelector('[data-share-action="ok"]');
    var tg = block.querySelector('[data-share-action="tg"]');
    if (vk) vk.href = getShareUrl('vk', shareUrl);
    if (ok) ok.href = getShareUrl('ok', shareUrl);
    if (tg) tg.href = getShareUrl('tg', shareUrl);

    block.addEventListener('click', function (e) {
      var target = e.target.closest('[data-share-action]');
      if (!target) return;
      if (target.getAttribute('data-share-action') !== 'copy') return;

      e.preventDefault();
      copyToClipboard(shareUrl)
        .then(function () {
          showCopiedInline(target);
        })
        .catch(function () {});
    });
  }

  function init() {
    document.querySelectorAll('[data-share-inline]').forEach(initBlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

