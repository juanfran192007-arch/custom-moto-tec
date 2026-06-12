// ============================================================
// CUSTOM MOTO-TEC — JavaScript Personalización
// ============================================================

var selections = {};

function showCat(cat, btn) {
  document.querySelectorAll('.options-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.cat-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  document.getElementById('panel-' + cat).classList.add('active');
  btn.classList.add('active');
}

function toggleOpt(card, name, price) {
  if (selections[name]) {
    delete selections[name];
    card.classList.remove('selected');
  } else {
    selections[name] = price;
    card.classList.add('selected');
  }
  renderSummary();
}

function renderSummary() {
  var list  = document.getElementById('summary-list');
  var keys  = Object.keys(selections);
  var total = 0;

  if (keys.length === 0) {
    list.innerHTML = '<li class="summary-empty">— Ninguna opción seleccionada aún —</li>';
  } else {
    list.innerHTML = keys.map(function (k) {
      total += selections[k];
      return '<li class="summary-item">' +
        '<span class="summary-item-name">' + k + '</span>' +
        '<span class="summary-item-price">+ ' + Number(selections[k]).toLocaleString('es-ES') + ' €</span>' +
        '</li>';
    }).join('');
  }

  total = Object.values(selections).reduce(function (a, b) { return a + b; }, 0);
  document.getElementById('summary-total').textContent = total.toLocaleString('es-ES') + ' €';

  // Guardar para el configurador
  try {
    sessionStorage.setItem('cmt_extras', JSON.stringify(selections));
    sessionStorage.setItem('cmt_extras_total', total);
  } catch (e) {}
}
