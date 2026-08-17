/* ==========================================================================
 * modo-historia.js — Módulo Modo Historia
 * Controla el progreso de capítulos narrativos SIN tocar las variables de la
 * plantilla del Modo Carrera. El estado de historia vive en
 * BL.estado.gameState.historia y la persistencia pasa por BL.core.
 *
 * Soporta dos formatos de capítulo:
 *  - Legacy: { partidos: [{ id, rival, dialogoPre, dialogoPost }] }
 *  - Escenas: { numero, titulo, valorBanda, escenas: [{ tipo: dialogo|decision|partido_simulador }] }
 * ========================================================================== */
(function () {
  'use strict';

  function historia() {
    return BL.estado.gameState.historia;
  }

  // Estado defensivo frente a partidas guardadas con el esquema antiguo
  function histDef() {
    const hs = historia();
    if (typeof hs.capActual !== 'number') hs.capActual = 0;
    if (!Array.isArray(hs.capCompletados)) hs.capCompletados = [];
    if (typeof hs.escenaActual !== 'string' && hs.escenaActual !== null) hs.escenaActual = null;
    if (typeof hs.periodicoIndex !== 'number') hs.periodicoIndex = 0;
    if (!hs.stats || typeof hs.stats !== 'object') hs.stats = { ego: 0, moral: 0, inspiracion: 0 };
    if (!Array.isArray(hs.completados)) hs.completados = [];
    if (typeof hs.dialogoIndex !== 'number') hs.dialogoIndex = 0;
    if (typeof hs.dialogoTipo !== 'string') hs.dialogoTipo = 'pre';
    if (typeof hs.estado !== 'string') hs.estado = 'menu';
    return hs;
  }

  function escaparAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

  function botonVolverLista() {
    if (typeof MODO_HISTORIA !== 'undefined' && MODO_HISTORIA.length > 1) {
      return `<button class="btn-bluelock btn-back-caps" onclick="volverListaCapitulos()"><i class="fas fa-arrow-left"></i> CAPÍTULOS</button>`;
    }
    return '';
  }

  // ===== SELECCIÓN DE CAPÍTULOS =====
  function renderSelectorCapitulos() {
    const hs = histDef();
    let html = `<div class="bl-card"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">Selecciona un capítulo. Cada capítulo sigue el índice del manga con sus propias escenas interactivas.</p></div><div style="display:flex;flex-direction:column;gap:8px;">`;

    MODO_HISTORIA.forEach((cap, i) => {
      const done = hs.capCompletados.includes(cap.id);
      const blocked = i > 0 && !hs.capCompletados.includes(MODO_HISTORIA[i - 1].id);
      const unlocked = !done && !blocked;
      let icon, cls, label;
      if (done) { icon = 'fa-check-circle'; cls = 'completado'; label = 'COMPLETADO'; }
      else if (blocked) { icon = 'fa-lock'; cls = 'bloqueado'; label = 'BLOQUEADO'; }
      else { icon = 'fa-play-circle'; cls = 'disponible'; label = 'DISPONIBLE'; }

      const num = cap.numero ? ('CAPÍTULO ' + cap.numero) : ('CAPÍTULO ' + (i + 1));
      const banda = cap.valorBanda ? `<span class="historia-banda">${cap.valorBanda}</span>` : '';
      const delay = BL.util.animFila ? BL.util.animFila(i) : '';
      html += `<div class="historia-match ${cls} anim-fila"${delay} data-idx="${i}" ${unlocked ? 'onclick="seleccionarCapitulo(' + i + ')"' : ''}>
        <div class="match-icon"><i class="fas ${icon}"></i></div>
        <div class="match-info">
          <span class="match-rival">${num} - ${cap.titulo || ''}</span>
          ${banda}
          <span class="match-status">${label}</span>
        </div>
      </div>`;
    });

    html += '</div>';
    document.getElementById('historia-content').innerHTML = html;
  }

  window.seleccionarCapitulo = function (idx) {
    const hs = histDef();
    hs.capActual = idx;
    const cap = MODO_HISTORIA[idx];
    if (cap && cap.periodico) {
      hs.periodicoIndex = 0;
      hs.estado = 'periodico';
    } else if (cap && cap.escenas) {
      hs.estado = 'menu_cap';
    } else if (cap && cap.partidos) {
      // Formato legacy: saltar directamente al primer partido disponible
      const firstIdx = cap.partidos.findIndex(p => !hs.completados.includes(p.id));
      const target = firstIdx === -1 ? 0 : firstIdx;
      hs.partidoActual = target;
      hs.dialogoIndex = 0;
      hs.dialogoTipo = 'pre';
      // Intro de periódico solo al empezar el capítulo (primer partido sin jugar)
      if (target === 0 && cap.periodico) {
        hs.estado = 'periodico';
      } else {
        hs.estado = 'dialogo';
      }
    }
    window.renderHistoria();
  };

  window.volverListaCapitulos = function () {
    histDef().estado = 'menu';
    window.renderHistoria();
  };

  // ===== CABECERA DEL CAPÍTULO =====
  function renderCabecera(titulo) {
    const el = document.getElementById('historia-cap-titulo');
    if (el) el.textContent = titulo;
  }

  function tituloCabecera(cap) {
    if (!cap) return 'MODO HISTORIA';
    if (cap.numero) return 'CAPÍTULO ' + cap.numero + ' - ' + cap.titulo;
    return cap.titulo || 'MODO HISTORIA';
  }

  // ===== MENÚ DEL CAPÍTULO (formato escenas) =====
  function renderMenuEscenas(cap) {
    const hs = histDef();
    const done = hs.capCompletados.includes(cap.id);
    let html = `<div class="bl-card"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">${cap.descripcion}</p></div>`;

    if (done) {
      html += `<div class="bl-card" style="margin-top:12px;text-align:center;border-color:var(--gold-ego);">
        <h4 style="color:var(--gold-ego);">🏆 CAPÍTULO COMPLETADO</h4>
        <p style="font-size:0.8rem;color:var(--text-muted);">Ego: ${hs.stats.ego || 0} · Moral: ${hs.stats.moral || 0} · Inspiración: ${hs.stats.inspiracion || 0}</p>
        <button class="btn-bluelock" style="margin-top:10px;justify-content:center;width:100%;" onclick="iniciarCapitulo()"><i class="fas fa-redo"></i> REPETIR CAPÍTULO</button>
      </div>`;
    } else {
      html += `<button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;margin-top:12px;" onclick="iniciarCapitulo()"><i class="fas fa-play"></i> INICIAR CAPÍTULO</button>`;
    }

    html += botonVolverLista();
    document.getElementById('historia-content').innerHTML = html;
  }

  window.iniciarCapitulo = function () {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
    if (!cap || !cap.escenas || !cap.escenas.length) return;
    hs.stats = { ego: 0, moral: 0, inspiracion: 0 };
    hs.escenaActual = cap.escenas[0].id;
    hs.estado = 'escena';
    window.renderHistoria();
  };

  // ===== RENDER DE ESCENA =====
  function renderEscena(cap, esc) {
    let html = '';

    if (esc.tipo === 'dialogo') {
      const per = esc.personaje;
      if (per && typeof per === 'object' && per.sprite_url) {
        // Estructura cerrada: sprite centrado + caja de diálogo
        const caja = esc.caja_dialogo || {};
        html = `<div class="escena-dialogo-cerrada">
          <div class="sprite-personaje">
            <img src="${escaparAttr(per.sprite_url)}" onerror="this.onerror=null;this.style.display='none'" alt="${escaparAttr(caja.nombre_mostrado || '')}">
          </div>
          <div class="caja-dialogo-cerrada">
            <div class="caja-nombre">${escaparAttr(caja.nombre_mostrado || '')}</div>
            <div class="caja-texto">${escaparAttr(caja.texto || '')}</div>
          </div>`;
        if (esc.fin === 'continuara') {
          html += `<button class="btn-bluelock btn-gold btn-dialogo periodico-continuar" onclick="finalizarContinuara()">CONTINUAR <i class="fas fa-arrow-right"></i></button>`;
        } else if (esc.siguiente_id) {
          html += `<button class="btn-bluelock btn-dialogo periodico-continuar" onclick="siguienteEscena('${esc.siguiente_id}')">SIGUIENTE <i class="fas fa-arrow-right"></i></button>`;
        } else {
          html += `<button class="btn-bluelock btn-gold btn-dialogo periodico-continuar" onclick="completarCapitulo()"><i class="fas fa-check"></i> FINALIZAR CAPÍTULO</button>`;
        }
        html += `</div>`;
      } else {
        // Fallback formato simple: avatar circular + burbuja
        const foto = getPersonajeFoto(esc.personaje);
        const src = foto || 'assets/players/default.png';
        html = `<div class="dialogo-scene">
          <div class="dialogo-avatar-wrap">
            <img src="${src}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${escaparAttr(esc.personaje)}">
            <i class="fas fa-user plantilla-avatar-fallback"></i>
          </div>
          <span class="dialogo-nombre">${esc.personaje}</span>
          <div class="dialogo-bubble">
            <p>"${escaparAttr(esc.texto)}"</p>
          </div>`;
        if (esc.siguiente_id) {
          html += `<button class="btn-bluelock btn-dialogo" onclick="siguienteEscena('${esc.siguiente_id}')">SIGUIENTE <i class="fas fa-arrow-right"></i></button>`;
        } else {
          html += `<button class="btn-bluelock btn-gold btn-dialogo" onclick="completarCapitulo()"><i class="fas fa-check"></i> FINALIZAR CAPÍTULO</button>`;
        }
        html += `</div>`;
      }

    } else if (esc.tipo === 'decision') {
      html = `<div class="escena-decision">
        <p class="escena-texto">"${escaparAttr(esc.texto)}"</p>
        <div class="decision-opciones">`;
      (esc.opciones || []).forEach(op => {
        const efJson = op.efectos ? escaparAttr(JSON.stringify(op.efectos)) : '';
        html += `<button class="decision-option" onclick="elegirOpcion('${op.siguiente_id || ''}','${efJson}')">
          <i class="fas fa-chevron-right"></i>
          <span>${escaparAttr(op.texto)}</span>
        </button>`;
      });
      html += `</div></div>`;

    } else if (esc.tipo === 'partido_simulador') {
      html = `<div class="escena-partido">
        <p class="escena-texto">"${escaparAttr(esc.texto)}"</p>
        <div class="escena-partido-rival"><i class="fas fa-futbol"></i> ${esc.rival || 'PARTIDO'}</div>
        <button class="btn-bluelock btn-gold btn-dialogo" onclick="mostrarModalPartidoEscena('${esc.id}')"><i class="fas fa-fire"></i> JUGAR PARTIDO</button>
      </div>`;
    }

    document.getElementById('historia-content').innerHTML = html;
  }

  window.siguienteEscena = function (nextId) {
    const hs = histDef();
    if (nextId) hs.escenaActual = nextId;
    hs.estado = 'escena';
    window.renderHistoria();
  };

  window.elegirOpcion = function (nextId, efJson) {
    const hs = histDef();
    if (efJson) {
      try {
        const e = JSON.parse(efJson);
        Object.keys(e).forEach(k => {
          hs.stats[k] = (hs.stats[k] || 0) + e[k];
        });
      } catch (err) { /* noop */ }
    }
    if (nextId) hs.escenaActual = nextId;
    hs.estado = 'escena';
    window.renderHistoria();
  };

  window.mostrarModalPartidoEscena = function (sceneId) {
    const hs = histDef();
    hs.escenaActual = sceneId;
    hs.estado = 'escena';
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-futbol"></i> RESULTADO DEL PARTIDO';
    document.getElementById('modal-body').innerHTML = `
      <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px;">Selecciona el resultado del partido:</p>
      <button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;margin-bottom:8px;" onclick="simularPartidoEscena(true)">⚽ VICTORIA 3-1</button>
      <button class="btn-bluelock" style="width:100%;justify-content:center;border-color:var(--danger-red);" onclick="simularPartidoEscena(false)">💔 DERROTA 0-2</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
  };

  window.simularPartidoEscena = function (victoria) {
    window.cerrarModal();
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
    if (!cap || !cap.escenas) { window.renderHistoria(); return; }
    const esc = cap.escenas.find(e => e.id === hs.escenaActual);
    const destino = victoria ? (esc.victoria_id || null) : (esc.derrota_id || null);
    if (victoria) {
      hs.stats.ego = (hs.stats.ego || 0) + 15;
    } else {
      hs.stats.ego = (hs.stats.ego || 0) - 10;
    }
    hs.estado = 'escena';
    if (destino) {
      hs.escenaActual = destino;
      window.renderHistoria();
    } else {
      window.completarCapitulo();
    }
  };

  window.completarCapitulo = function () {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
    if (cap && !hs.capCompletados.includes(cap.id)) hs.capCompletados.push(cap.id);
    hs.estado = 'menu';
    hs.escenaActual = null;
    window.guardarEstado();
    window.renderHistoria();
  };

  // ===== FORMATO LEGACY (partidos con diálogos pre/post) =====
  function renderMenuHistoria() {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
    if (!cap) return;
    let html = `<div class="bl-card"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">${cap.descripcion || ''}</p></div><div style="display:flex;flex-direction:column;gap:8px;">`;

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

    html += botonVolverLista();
    document.getElementById('historia-content').innerHTML = html;
  }

  function renderDialogoHistoria() {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
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

  // ===== INTRO DE TEXTO CON FADE (intros de capítulo) =====
  function renderPeriodico(cap) {
    const hs = histDef();
    const lineas = Array.isArray(cap.periodico) ? cap.periodico : [];
    const texto = lineas[hs.periodicoIndex] || '';
    const esUltima = hs.periodicoIndex >= lineas.length - 1;

    const html = `<div class="periodico-wrap">
      <div class="periodico-simple">
        <div id="periodico-linea" class="periodico-linea fade-in">${escaparAttr(texto)}</div>
      </div>
      <button class="btn-bluelock btn-gold btn-dialogo periodico-continuar" onclick="continuarPeriodico()">CONTINUAR <i class="fas fa-arrow-right"></i></button>
    </div>`;
    document.getElementById('historia-content').innerHTML = html;
    const el = document.getElementById('periodico-linea');
    if (el) setTimeout(function () { el.classList.remove('fade-in'); }, 20);
  }

  window.continuarPeriodico = function () {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
    const lineas = (cap && Array.isArray(cap.periodico)) ? cap.periodico : [];
    const el = document.getElementById('periodico-linea');
    const finalizar = function () {
      if (hs.periodicoIndex >= lineas.length - 1) {
        if (cap && cap.escenas && cap.escenas.length) {
          hs.escenaActual = cap.escenas[0].id;
          hs.estado = 'escena';
        } else {
          hs.estado = 'continuara';
        }
      } else {
        hs.periodicoIndex++;
      }
      window.renderHistoria();
    };
    if (el) {
      el.classList.add('fade-out');
      setTimeout(finalizar, 400);
    } else {
      finalizar();
    }
  };

  window.finalizarContinuara = function () {
    histDef().estado = 'continuara';
    window.renderHistoria();
  };

  // ===== PANTALLA "CONTINUARÁ" (provisional mientras se dicta la historia) =====
  function renderContinuara() {
    const html = `<div class="continuara-screen">
      <h3 class="continuara-titulo">CONTINUARÁ…</h3>
      <p class="continuara-texto">La historia continúa pronto.</p>
      <button class="btn-bluelock btn-back-caps" onclick="volverListaCapitulos()"><i class="fas fa-arrow-left"></i> CAPÍTULOS</button>
    </div>`;
    document.getElementById('historia-content').innerHTML = html;
  }

  // ===== RENDER PRINCIPAL =====
  window.renderHistoria = function () {
    if (typeof MODO_HISTORIA === 'undefined' || !MODO_HISTORIA.length) return;
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual] || MODO_HISTORIA[0];

    // Reanudar escena a mitad (formato escenas)
    if (hs.estado === 'escena' && cap && cap.escenas && hs.escenaActual) {
      const esc = cap.escenas.find(e => e.id === hs.escenaActual);
      if (esc) { renderCabecera(tituloCabecera(cap)); renderEscena(cap, esc); return; }
      hs.estado = 'menu_cap';
    }
    // Pantalla "CONTINUARÁ" (provisional)
    if (hs.estado === 'continuara' && cap) {
      renderCabecera(tituloCabecera(cap));
      renderContinuara();
      return;
    }
    // Intro de texto con fade (cap.periodico)
    if (hs.estado === 'periodico' && cap && cap.periodico) {
      renderCabecera(tituloCabecera(cap));
      renderPeriodico(cap);
      return;
    }
    // Reanudar diálogo (formato legacy)
    if (hs.estado === 'dialogo' && cap && cap.partidos) {
      renderCabecera(tituloCabecera(cap));
      renderDialogoHistoria();
      return;
    }
    // Menú de un capítulo concreto
    if (hs.estado === 'menu_cap' && cap) {
      renderCabecera(tituloCabecera(cap));
      if (cap.escenas) { renderMenuEscenas(cap); return; }
      renderMenuHistoria();
      return;
    }
    // Por defecto: lista de capítulos
    renderCabecera('CAPÍTULOS');
    renderSelectorCapitulos();
  };

  window.iniciarPartido = function (idx) {
    const hs = histDef();
    hs.partidoActual = idx;
    hs.dialogoIndex = 0;
    hs.dialogoTipo = 'pre';
    hs.estado = 'dialogo';
    window.renderHistoria();
  };

  window.avanzarDialogo = function () {
    const hs = histDef();
    hs.dialogoIndex++;
    window.renderHistoria();
  };

  window.mostrarModalPartido = function () {
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-futbol"></i> RESULTADO DEL PARTIDO';
    document.getElementById('modal-body').innerHTML = `
      <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px;">Selecciona el resultado del partido:</p>
      <button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;margin-bottom:8px;" onclick="simularPartido(true)">⚽ VICTORIA 3-1</button>
      <button class="btn-bluelock" style="width:100%;justify-content:center;border-color:var(--danger-red);" onclick="simularPartido(false)">💔 DERROTA 0-2</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
  };

  window.simularPartido = function (victoria) {
    window.cerrarModal();
    if (victoria) {
      BL.estado.gameState.monedas += 200;
      const hs = histDef();
      hs.dialogoIndex = 0;
      hs.dialogoTipo = 'post';
      renderDialogoHistoria();
    } else {
      window.mostrarModal('DERROTA', 'Has perdido el partido. Vuelve a intentarlo cuando estés listo.');
    }
  };

  window.completarPartido = function () {
    const hs = histDef();
    const cap = MODO_HISTORIA[hs.capActual];
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
    seleccionarCapitulo: window.seleccionarCapitulo,
    volverListaCapitulos: window.volverListaCapitulos,
    iniciarCapitulo: window.iniciarCapitulo,
    siguienteEscena: window.siguienteEscena,
    elegirOpcion: window.elegirOpcion,
    mostrarModalPartidoEscena: window.mostrarModalPartidoEscena,
    simularPartidoEscena: window.simularPartidoEscena,
    completarCapitulo: window.completarCapitulo,
    iniciarPartido: window.iniciarPartido,
    avanzarDialogo: window.avanzarDialogo,
    mostrarModalPartido: window.mostrarModalPartido,
    simularPartido: window.simularPartido,
    completarPartido: window.completarPartido,
    continuarPeriodico: window.continuarPeriodico
  };
})();
