/* ==========================================================================
 * tienda-ego.js — Módulo Tienda de Ego
 * Gestiona el inventario de la tienda y las compras, descontando Yenes del
 * objeto de guardado de forma aislada a través de BL.core (única puerta a
 * localStorage). No toca datos del Modo Carrera ni de la plantilla.
 * ========================================================================== */
(function () {
  'use strict';

  window.renderTienda = function () {
    const grid = document.getElementById('shop-grid');
    if (!grid || typeof BLUE_LOCK_DATABASE === 'undefined') return;
    grid.innerHTML = '';
    BLUE_LOCK_DATABASE.tiendaItems.forEach(item => {
      grid.innerHTML += `
        <div class="shop-item">
          <h4>${item.nombre}</h4>
          <p>${item.desc}</p>
          <div class="price-tag">🪙 ${item.precio}</div>
          <button class="btn-bluelock" style="padding:6px; font-size:0.8rem;" onclick="comprarItem('${item.id}', ${item.precio})">Comprar</button>
        </div>
      `;
    });
  };

  window.comprarItem = function (itemId, precio) {
    const data = BL.core.cargarPartida();
    const monedas = data && typeof data.monedas === 'number'
      ? data.monedas
      : BL.estado.gameState.monedas;

    if (monedas < precio) {
      window.mostrarModal("MONEDAS INSUFICIENTES", "Necesitas ganar más partidos para obtener monedas de Ego.");
      return;
    }

    const nuevoSaldo = monedas - precio;
    if (data) {
      data.monedas = nuevoSaldo;
      BL.core.guardarPartida(data);
    }
    BL.estado.gameState.monedas = nuevoSaldo;
    if (BL.util.actualizarMonedasUI) BL.util.actualizarMonedasUI();

    window.mostrarModal("¡COMPRA REALIZADA!", "Has adquirido el objeto con éxito. Listo para la batalla.");
  };

  window.BL = window.BL || {};
  BL.tienda = {
    renderTienda: window.renderTienda,
    comprarItem: window.comprarItem
  };
})();
