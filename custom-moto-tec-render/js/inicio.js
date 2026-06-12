// ============================================================
// CUSTOM MOTO-TEC — JavaScript Página de Inicio
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // Contador animado para las estadísticas
  function animateCounter(el, target, suffix) {
    var start = 0;
    var duration = 2000;
    var step = Math.ceil(target / (duration / 16));
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = '+' + start + (suffix || '');
    }, 16);
  }

  // Observador para activar contadores cuando son visibles
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { observer.observe(el); });

  // Animación de entrada para las tarjetas de servicio
  var cards = document.querySelectorAll('.service-card');
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
    cardObserver.observe(card);
  });
});
