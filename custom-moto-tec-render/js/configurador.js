// ============================================================
// CUSTOM MOTO-TEC — JavaScript Configurador
// ============================================================

var motorSeleccion = null;

// ── Stepper ──
function updateStepper(step) {
  for (var i = 1; i <= 3; i++) {
    var el = document.getElementById('step-ind-' + i);
    el.classList.remove('active', 'done');
    if (i < step)  el.classList.add('done');
    if (i === step) el.classList.add('active');
  }
  var pct = step === 1 ? 33 : step === 2 ? 66 : 100;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function showStep(step) {
  document.querySelectorAll('.step-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  document.getElementById('panel-step-' + step).classList.add('active');
  updateStepper(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Validaciones ──
function validateStep1() {
  var campos = ['f-nombre','f-apellidos','f-dni','f-nacimiento',
                'f-email','f-telefono','f-matricula','f-carnet',
                'f-marca','f-modelo','f-anio'];
  var ok = true;

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    el.classList.remove('error');
    if (!el.value.trim()) { el.classList.add('error'); ok = false; }
  });

  if (!document.getElementById('rgpd-check').checked) {
    alert('⚠ Debe aceptar la Política de Privacidad para continuar.');
    return false;
  }

  var email = document.getElementById('f-email').value;
  if (ok && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('f-email').classList.add('error');
    alert('⚠ El correo electrónico no tiene un formato válido.');
    return false;
  }

  if (!ok) alert('⚠ Por favor, complete todos los campos obligatorios marcados con *');
  return ok;
}

function validateStep2() {
  if (!motorSeleccion) {
    alert('⚠ Por favor, seleccione una tecnología de motor.');
    return false;
  }
  return true;
}

// ── Navegación entre pasos ──
function goStep(step) {
  if (step === 2 && !validateStep1()) return;
  if (step === 3 && !validateStep2()) return;
  if (step === 3) buildBudget();
  showStep(step);
}

// ── Selección de motor ──
function selectMotor(op) {
  motorSeleccion = op;
  var cardA = document.getElementById('mc-a');
  var cardB = document.getElementById('mc-b');
  cardA.className = 'motor-card' + (op === 'A' ? ' sel-a' : '');
  cardB.className = 'motor-card' + (op === 'B' ? ' sel-b' : '');
}

// ── Cargar extras de personalización ──
function loadExtras() {
  try {
    var raw = sessionStorage.getItem('cmt_extras');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function showExtrasPreview() {
  var extras = loadExtras();
  var keys   = Object.keys(extras);
  var wrap   = document.getElementById('extras-preview');
  var list   = document.getElementById('extras-list');
  if (!wrap) return;

  if (keys.length === 0) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'block';
  list.innerHTML = keys.map(function (k) {
    return '<div style="display:flex;justify-content:space-between;padding:.3rem 0;' +
           'border-bottom:1px solid rgba(0,212,255,.06);font-size:13px;">' +
           '<span style="color:var(--c-silver)">' + k + '</span>' +
           '<span style="font-family:var(--font-mono);color:var(--c-blue)">+ ' +
           Number(extras[k]).toLocaleString('es-ES') + ' €</span></div>';
  }).join('');
}

// ── Construir presupuesto ──
function buildBudget() {
  var nombre    = document.getElementById('f-nombre').value.trim();
  var apellidos = document.getElementById('f-apellidos').value.trim();
  var dni       = document.getElementById('f-dni').value.trim().toUpperCase();
  var email     = document.getElementById('f-email').value.trim();
  var matricula = document.getElementById('f-matricula').value.trim().toUpperCase();
  var carnet    = document.getElementById('f-carnet').value.trim().toUpperCase();
  var marca     = document.getElementById('f-marca').value.trim();
  var modelo    = document.getElementById('f-modelo').value.trim();

  var motorPrecio = motorSeleccion === 'A' ? 37500 : 63000;
  var motorNombre = motorSeleccion === 'A' ? 'Combustión Racing' : 'Proyecto Hidrógeno 2040';

  var extras      = loadExtras();
  var extrasTotal = Object.values(extras).reduce(function (a, b) { return a + b; }, 0);
  var total       = motorPrecio + extrasTotal;

  document.getElementById('b-client').textContent =
    'Estimado ' + nombre + ' ' + apellidos + ' · DNI: ' + dni;
  document.getElementById('b-moto').textContent =
    '// ' + marca + ' ' + modelo + ' · Matrícula: ' + matricula + ' · Carnet: ' + carnet;

  var breakdown = '<div class="bline">' +
    '<span class="bline-label">Motor: ' + motorNombre + '</span>' +
    '<span class="bline-val">' + motorPrecio.toLocaleString('es-ES') + ' €</span></div>';

  Object.keys(extras).forEach(function (k) {
    breakdown += '<div class="bline">' +
      '<span class="bline-label">↳ ' + k + '</span>' +
      '<span class="bline-val">+ ' + Number(extras[k]).toLocaleString('es-ES') + ' €</span></div>';
  });

  document.getElementById('b-breakdown').innerHTML = breakdown;
  document.getElementById('b-total').textContent = total.toLocaleString('es-ES') + ' €';

  var vlan = document.getElementById('b-vlan');
  if (vlan) vlan.style.display = motorSeleccion === 'B' ? 'block' : 'none';

  var ref = 'REF-CMT-' + Date.now().toString(36).toUpperCase() +
            ' · ZONA FRANCA BARBATE · ' + new Date().toLocaleDateString('es-ES');
  document.getElementById('b-ref').textContent = '// ' + ref;
}

// ── Envío ──
function enviarPresupuesto() {
  document.getElementById('sent-msg').style.display = 'block';
  var bd = document.getElementById('budget-display');
  if (bd) bd.style.opacity = '.5';
}

// ── Reiniciar ──
function reiniciar() {
  document.querySelectorAll('.cmt-form-input, textarea').forEach(function (el) {
    el.value = '';
    el.classList.remove('error');
  });
  var rgpd = document.getElementById('rgpd-check');
  if (rgpd) rgpd.checked = false;
  motorSeleccion = null;
  var cardA = document.getElementById('mc-a');
  var cardB = document.getElementById('mc-b');
  if (cardA) cardA.className = 'motor-card';
  if (cardB) cardB.className = 'motor-card';
  var sentMsg = document.getElementById('sent-msg');
  if (sentMsg) sentMsg.style.display = 'none';
  var bd = document.getElementById('budget-display');
  if (bd) bd.style.opacity = '1';
  try {
    sessionStorage.removeItem('cmt_extras');
    sessionStorage.removeItem('cmt_extras_total');
  } catch (e) {}
  showStep(1);
}

// ── Inicio ──
document.addEventListener('DOMContentLoaded', function () {
  showExtrasPreview();
  updateStepper(1);
});
