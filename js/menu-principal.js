/* ==========================================================================
 * menu-principal.js — Módulo Menú Principal
 * Controla el renderizado del menú de inicio, la lectura del panel de
 * Ajustes (SFX) y la lista de Logros. La persistencia de ajustes pasa por
 * BL.core; el estado de audio compartido vive en BL.estado.audio.
 * ========================================================================== */
(function () {
  'use strict';

  function audio() {
    return BL.estado.audio;
  }

  function actualizarEstadoBloquesSfx() {
    document.querySelectorAll('.sfx-bloque').forEach(bloque => {
      const items = bloque.querySelectorAll('.sfx-item');
      const algunActivo = [...items].some(item => {
        const key = item.dataset.sfx;
        return audio().sfxIndividuales[key] !== false;
      });
      bloque.classList.toggle('sfx-bloque-sin-activos', items.length > 0 && !algunActivo);
    });
  }

  window.cambiarSfxActivados = function (activado) {
    audio().sfxActivados = !!activado;
    BL.core.guardarAjuste('bl_sfx_activados', activado);
    if (!audio().sfxActivados && audio().sfxReproduciendose) {
      window.detenerSFX(audio().sfxReproduciendose);
    }
    const cont = document.getElementById('contenedor-sfx');
    if (cont) {
      cont.classList.toggle('sfx-disabled', !activado);
      cont.querySelectorAll('.sfx-item').forEach(item => {
        const key = item.dataset.sfx;
        const individual = audio().sfxIndividuales[key] !== false;
        const usable = activado && individual;
        const input = item.querySelector('.sfx-toggle');
        const play = item.querySelector('.sfx-btn.reproducir');
        const stop = item.querySelector('.sfx-btn.parar');
        if (input) input.disabled = !activado;
        if (play) play.disabled = !usable;
        if (stop) stop.disabled = !usable;
      });
    }
  };

  window.toggleSfxIndividual = function (nombreSonido, activado) {
    audio().sfxIndividuales[nombreSonido] = !!activado;
    BL.core.guardarAjuste('bl_sfx_individuales', audio().sfxIndividuales);
    if (!audio().sfxIndividuales[nombreSonido] && audio().sfxReproduciendose === nombreSonido) {
      window.detenerSFX(nombreSonido);
    }
    const item = document.querySelector(`#contenedor-sfx .sfx-item[data-sfx="${nombreSonido}"]`);
    if (!item) {
      window.renderListaSFX();
      return;
    }
    const wrap = item.querySelector('.sfx-toggle-wrap');
    const input = item.querySelector('.sfx-toggle');
    const play = item.querySelector('.sfx-btn.reproducir');
    const stop = item.querySelector('.sfx-btn.parar');
    const master = audio().sfxActivados;
    const individual = audio().sfxIndividuales[nombreSonido] !== false;
    if (wrap) wrap.classList.toggle('on', individual);
    if (wrap) wrap.classList.toggle('off', !individual);
    if (input) input.checked = individual;
    if (play) play.disabled = !(master && individual);
    if (stop) stop.disabled = !(master && individual);
    actualizarEstadoBloquesSfx();
  };

  window.renderListaSFX = function () {
    const cont = document.getElementById('contenedor-sfx');
    if (!cont) return;
    const master = audio().sfxActivados;
    const bloques = [
      { titulo: 'Gestión y Oficina (Modo Carrera)', icono: 'fas fa-briefcase', claves: ['inspiration', 'intellect', 'push_forward', 'bedroom'] },
      { titulo: 'Momentos de Partido (Dinámica)', icono: 'fas fa-futbol', claves: ['partido', 'ego', 'emergency', 'last_chance', 'awakening'] },
      { titulo: 'Estados del Marcador', icono: 'fas fa-chart-line', claves: ['puzzle', 'despair', 'tema'] },
      { titulo: 'Efectos de Sonido Cortos (SFX)', icono: 'fas fa-volume-high', claves: ['silbato_arbitro', 'gol', 'arma_ego'] }
    ];
    const items = bloques.map(b => {
      const filas = b.claves
        .filter(key => audio().sonidosSFX[key])
        .map(key => {
          const s = audio().sonidosSFX[key];
          const individual = audio().sfxIndividuales[key] !== false;
          return `
        <div class="sfx-item" data-sfx="${key}">
          <span class="sfx-nombre">${s.nombre}</span>
          <div class="sfx-botones">
            <label class="sfx-toggle-wrap ${individual ? 'on' : 'off'}">
              <input type="checkbox" class="sfx-toggle" onchange="toggleSfxIndividual('${key}', this.checked)" ${individual ? 'checked' : ''} ${master ? '' : 'disabled'}>
              <span class="sfx-toggle-slider"></span>
            </label>
            <button class="sfx-btn reproducir" onclick="reproducirSFX('${key}')" ${master && individual ? '' : 'disabled'}><i class="fas fa-play"></i></button>
            <button class="sfx-btn parar" onclick="detenerSFX('${key}')" ${master && individual ? '' : 'disabled'}><i class="fas fa-stop"></i></button>
          </div>
        </div>`;
        }).join('');
      return `<div class="sfx-bloque">
        <button class="sfx-bloque-summary" onclick="toggleSfxBloque(this)"><i class="${b.icono}"></i><span class="sfx-bloque-titulo">${b.titulo}</span></button>
        <div class="sfx-bloque-contenido">${filas}</div>
      </div>`;
    }).join('');
    cont.className = master ? 'sfx-lista' : 'sfx-lista sfx-disabled';
    cont.innerHTML = items;
    actualizarEstadoBloquesSfx();
  };

  window.toggleSfxBloque = function (btn) {
    const b = btn.closest('.sfx-bloque');
    if (!b) return;
    b.classList.toggle('open');
    btn.setAttribute('aria-expanded', b.classList.contains('open'));
  };

  // Renderizar Logros
  window.renderLogros = function () {
    const grid = document.getElementById('achievements-grid');
    if (!grid || typeof BLUE_LOCK_DATABASE === 'undefined') return;
    grid.innerHTML = '';
    BLUE_LOCK_DATABASE.logros.forEach(logro => {
      grid.innerHTML += `
        <div class="achievement-card">
          <h4>${logro.nombre}</h4>
          <p>${logro.desc}</p>
          <div class="price-tag"> Recompensa: 💎 ${logro.recompensa}</div>
          <span style="font-size:0.75rem; color:${logro.completado ? '#00f3ff' : '#888'}">
            ${logro.completado ? '<i class="fas fa-check-circle"></i> COMPLETADO' : '<i class="fas fa-lock"></i> BLOQUEADO'}
          </span>
        </div>
      `;
    });
  };

  // Render del menú de inicio: refleja el estado de ajustes en la UI
  window.renderMenuPrincipal = function () {
    const cb = document.getElementById('checkbox-sfx');
    if (cb) cb.checked = audio().sfxActivados;
    if (document.getElementById('contenedor-sfx')) window.renderListaSFX();
  };

  window.BL = window.BL || {};
  BL.menu = {
    renderMenuPrincipal: window.renderMenuPrincipal,
    renderLogros: window.renderLogros,
    renderListaSFX: window.renderListaSFX,
    cambiarSfxActivados: window.cambiarSfxActivados,
    toggleSfxIndividual: window.toggleSfxIndividual,
    toggleSfxBloque: window.toggleSfxBloque
  };
})();
