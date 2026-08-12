/* ==========================================================================
 * modo-historia.js — Módulo Modo Historia
 * Controla el progreso de capítulos narrativos SIN tocar las variables de la
 * plantilla del Modo Carrera. El estado de historia vive en
 * BL.estado.gameState.historia y la persistencia pasa por BL.core.
 * ========================================================================== */
(function () {
  'use strict';

  function historia() {
    return BL.estado.gameState.historia;
  }

  // Historia: obtener foto de personaje
  function getPersonajeFoto(nombre) {
    if (typeof PERSONAJES_HISTORIA !== 'undefined' && PERSONAJES_HISTORIA[nombre]) {
      return PERSONAJES_HISTORIA[nombre];
    }
    let p = null;
    if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        for (const j of PLANTILLAS_EQUIPO[key]) {
          if (nombre.toLowerCase().includes(j.nombre.split(' ')[0].toLowerCase()) || j.nombre.includes(nombre)) {
            p = j; break;
          }
        }
        if (p) break;
      }
    }
    return (p && p.foto) || '';
  }

  // Historia: menú de partidos
  function renderMenuHistoria() {
    const cap = MODO_HISTORIA[0];
    const hs = historia();
    let html = `<div class="bl-card"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">${cap.descripcion}</p></div><div style="display:flex;flex-direction:column;gap:8px;">`;

    cap.partidos.forEach((p, i) => {
      const done = hs.completados.includes(p.id);
      const blocked = i > 0 && !hs.completados.includes(cap.partidos[i - 1].id);
      const unlocked = !done && !blocked;
      let icon, cls, label;
      if (done) { icon = 'fa-check-circle'; cls = 'completado'; label = 'COMPLETADO'; }
      else if (blocked) { icon = 'fa-lock'; cls = 'bloqueado'; label = 'BLOQUEADO'; }
      else { icon = 'fa-play-circle'; cls = 'disponible'; label = 'DISPONIBLE'; }

      const delay = BL.util.animFila ? BL.util.animFila(i) : '';
      html += `<div class="historia-match ${cls} anim-fila"${delay} data-idx="${i}" ${unlocked ? 'onclick="iniciarPartido(' + i + ')"' : ''}>
        <div class="match-icon"><i class="fas ${icon}"></i></div>
        <div class="match-info">
          <span class="match-rival">${p.rival}</span>
          <span class="match-status">${label}</span>
        </div>
      </div>`;
    });

    html += '</div>';

    if (cap.partidos.every(p => hs.completados.includes(p.id))) {
      html += `<div class="bl-card" style="margin-top:12px;text-align:center;border-color:var(--gold-ego);">
        <h4 style="color:var(--gold-ego);">🏆 CAPÍTULO COMPLETADO</h4>
        <p style="font-size:0.8rem;color:var(--text-muted);">Has superado la Primera Selección. Nuevos desafíos te esperan.</p>
      </div>`;
    }

    document.getElementById('historia-content').innerHTML = html;
  }

  // Historia: renderizar diálogo
  function renderDialogoHistoria() {
    const cap = MODO_HISTORIA[0];
    const hs = historia();
    const partido = cap.partidos[hs.partidoActual];
    const dialogos = hs.dialogoTipo === 'pre' ? partido.dialogoPre : partido.dialogoPost;
    const idx = hs.dialogoIndex;
    const linea = dialogos[idx];
    const isLast = idx >= dialogos.length - 1;

    const foto = getPersonajeFoto(linea.personaje);
    const src = foto || 'assets/players/default.png';

    let html = `<div class="dialogo-scene">
      <div class="dialogo-avatar-wrap">
        <img src="${src}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${linea.personaje}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <span class="dialogo-nombre">${linea.personaje}</span>
      <div class="dialogo-bubble">
        <p>"${linea.texto}"</p>
      </div>`;

    if (!isLast) {
      html += `<button class="btn-bluelock btn-dialogo" onclick="avanzarDialogo()">SIGUIENTE <i class="fas fa-arrow-right"></i></button>`;
    } else if (hs.dialogoTipo === 'post') {
      html += `<button class="btn-bluelock btn-gold btn-dialogo" onclick="completarPartido()"><i class="fas fa-check"></i> CONTINUAR</button>`;
    } else {
      html += `<button class="btn-bluelock btn-gold btn-dialogo" onclick="mostrarModalPartido()"><i class="fas fa-fire"></i> JUGAR PARTIDO</button>`;
    }

    html += `</div>`;
    document.getElementById('historia-content').innerHTML = html;
  }

  // Historia: renderizar según estado
  window.renderHistoria = function () {
    if (typeof MODO_HISTORIA === 'undefined' || !MODO_HISTORIA.length) return;
    const cap = MODO_HISTORIA[0];
    document.getElementById('historia-cap-titulo').textContent = cap.titulo;

    if (historia().estado === 'dialogo') {
      renderDialogoHistoria();
    } else {
      renderMenuHistoria();
    }
  };

  // Historia: iniciar partido
  window.iniciarPartido = function (idx) {
    const hs = historia();
    hs.partidoActual = idx;
    hs.dialogoIndex = 0;
    hs.dialogoTipo = 'pre';
    hs.estado = 'dialogo';
    window.renderHistoria();
  };

  // Historia: avanzar diálogo
  window.avanzarDialogo = function () {
    historia().dialogoIndex++;
    window.renderHistoria();
  };

  // Historia: modal simular resultado
  window.mostrarModalPartido = function () {
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-futbol"></i> RESULTADO DEL PARTIDO';
    document.getElementById('modal-body').innerHTML = `
      <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px;">Selecciona el resultado del partido:</p>
      <button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;margin-bottom:8px;" onclick="simularPartido(true)">⚽ VICTORIA 3-1</button>
      <button class="btn-bluelock" style="width:100%;justify-content:center;border-color:var(--danger-red);" onclick="simularPartido(false)">💔 DERROTA 0-2</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
  };

  // Historia: procesar resultado
  window.simularPartido = function (victoria) {
    window.cerrarModal();
    if (victoria) {
      BL.estado.gameState.monedas += 200;
      const hs = historia();
      hs.dialogoIndex = 0;
      hs.dialogoTipo = 'post';
      renderDialogoHistoria();
    } else {
      window.mostrarModal('DERROTA', 'Has perdido el partido. Vuelve a intentarlo cuando estés listo.');
    }
  };

  // Historia: completar partido
  window.completarPartido = function () {
    const cap = MODO_HISTORIA[0];
    const hs = historia();
    const partido = cap.partidos[hs.partidoActual];
    if (!hs.completados.includes(partido.id)) {
      hs.completados.push(partido.id);
    }
    hs.estado = 'menu';
    window.guardarEstado();
    window.renderHistoria();
  };

  window.BL = window.BL || {};
  BL.historia = {
    renderHistoria: window.renderHistoria,
    iniciarPartido: window.iniciarPartido,
    avanzarDialogo: window.avanzarDialogo,
    mostrarModalPartido: window.mostrarModalPartido,
    simularPartido: window.simularPartido,
    completarPartido: window.completarPartido
  };
})();
