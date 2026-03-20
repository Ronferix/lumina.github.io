/**
 * Plenitud - Página Equipo: scroll del hero y botón "Leer más"
 */
(function () {
    'use strict';

    var scrollIndicator = document.querySelector('.team-hero .scroll-indicator');
    if (scrollIndicator) {
        var target = document.querySelector('#equipo-intro');
        scrollIndicator.addEventListener('click', function () {
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    document.querySelectorAll('.team-member-more-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = this.getAttribute('data-more');
            var block = document.getElementById('team-more-' + id);
            if (!block) return;
            var isOpen = !block.hidden;
            block.hidden = isOpen;
            btn.setAttribute('aria-expanded', !isOpen);
            btn.textContent = isOpen ? 'Leer más' : 'Menos';
        });
    });
})();
