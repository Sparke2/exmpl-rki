/**
 * Модальное окно для неавторизованных пользователей (при нажатии «Читать»).
 */
(function () {
    'use strict';

    function closeModal() {
        var modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    function init() {
        var modal = document.getElementById('auth-modal');
        if (!modal) return;

        var closeBtn = modal.querySelector('.auth-modal__close');
        var backdrop = modal.querySelector('.auth-modal__backdrop');
        var cancelBtn = modal.querySelector('.auth-modal__btn--cancel');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
        });

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
