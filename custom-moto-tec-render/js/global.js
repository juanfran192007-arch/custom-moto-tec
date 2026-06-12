// Menú hamburger móvil
function toggleNav() {
  var links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}

// Cerrar menú al hacer clic en un enlace
document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('.cmt-nav-links a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      var nav = document.getElementById('nav-links');
      if (nav) nav.classList.remove('open');
    });
  });
});