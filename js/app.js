// LÓGICA PRINCIPAL DEL MENÚ Y NAVEGACIÓN DE BLUE LOCK MANAGER

document.addEventListener('DOMContentLoaded', () => {
  console.log("Blue Lock Manager Engine initialized.");

  // App State
  let gameState = {
    monedas: 1000,
    gemas: 50,
    partidaGuardada: false,
    datosPartida: null,
    historia: {
      partidoActual: 0,
      completados: [],
      estado: "menu",
      dialogoIndex: 0,
      dialogoTipo: "pre"
    }
  };

  let plantillaSort = { by: 'posicion', asc: true };
  let plantillaVista = 'info';
  let clasificacionPaisesAbiertos = new Set();
  const POS_ORDER = { POR:0, DFC:1, LI:2, LD:3, CAI:4, CAD:5, MCD:6, MC:7, MCO:8, MI:9, MD:10, EI:11, ED:12, SD:13, DC:14 };

  // ===== ESTADO DE TEMPORADA (MODO CARRERA MANAGER) =====
  function generarCalendarioRoundRobin(ids) {
    const equipos = ids.slice();
    if (equipos.length % 2 === 1) equipos.push(null);
    const jornadas = [];
    const n = equipos.length;
    for (let r = 0; r < n - 1; r++) {
      const pares = [];
      for (let i = 0; i < n / 2; i++) {
        const a = equipos[i];
        const b = equipos[n - 1 - i];
        if (a !== null && b !== null) {
          const local = (r % 2 === 0) ? a : b;
          const visit = (r % 2 === 0) ? b : a;
          pares.push([local, visit]);
        }
      }
      jornadas.push(pares);
      equipos.splice(1, 0, equipos.pop());
    }
    const vuelta = jornadas.map(j => j.map(([l, v]) => [v, l]));
    return jornadas.concat(vuelta);
  }

  function getLigaDeManager(data) {
    if (!data?.manager?.equipo || typeof NEO_EQUIPOS === 'undefined') return null;
    const eq = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
    if (!eq) return null;
    if (typeof CONFIG_PAISES === 'undefined') return null;
    for (const pais of CONFIG_PAISES) {
      for (const liga of pais.ligas) {
        if (liga.equipos.some(e => e.id === eq.id)) return liga;
      }
    }
    return null;
  }

  function getTemporada(data) {
    if (!data.manager.temporada) {
      data.manager.temporada = { jornadaActual: 0, calendario: {}, clasificacion: {}, partidosJugados: [], estaminaNPC: {} };
    }
    const t = data.manager.temporada;
    if (typeof t.jornadaActual !== 'number') t.jornadaActual = 0;
    if (!t.calendario) t.calendario = {};
    if (!t.clasificacion) t.clasificacion = {};
    if (!t.partidosJugados) t.partidosJugados = [];
    if (!t.estaminaNPC) t.estaminaNPC = {};
    const liga = getLigaDeManager(data);
    if (liga && !t.calendario[liga.nombre]) {
      t.calendario[liga.nombre] = generarCalendarioRoundRobin(liga.equipos.map(e => e.id));
      liga.equipos.forEach(e => {
        if (!t.clasificacion[e.id]) t.clasificacion[e.id] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 };
      });
    }
    return { temporada: t, liga };
  }

  function getPlantillaPorNombre(nombreEquipo) {
    return getPlantillaEquipo(nombreEquipo);
  }

  function calcularTeamGrl(nombreEquipo) {
    const plantilla = getPlantillaPorNombre(nombreEquipo);
    if (plantilla && plantilla.length) {
      const sum = plantilla.reduce((a, p) => {
        const grl = calcularGrlJugador(p);
        const est = p.estamina ?? 100;
        const factor = est < 50 ? 0.85 : 1;
        return a + grl * factor;
      }, 0);
      return sum / plantilla.length;
    }
    const eq = typeof NEO_EQUIPOS !== 'undefined' ? NEO_EQUIPOS.find(e => e.name === nombreEquipo) : null;
    return eq?.grl ?? 60;
  }

  // ===== ESTAMINA (MODO CARRERA MANAGER) =====
  const ESTAMINA_MAX = 100;

  function teamIdPorNombre(nombre) {
    if (typeof NEO_EQUIPOS === 'undefined' || !nombre) return null;
    const eq = NEO_EQUIPOS.find(e => e.name === nombre);
    return eq ? eq.id : null;
  }

  function esEquipoManager(data, teamId) {
    const miEq = teamIdPorNombre(data?.manager?.equipo);
    return !!(miEq && teamId === miEq);
  }

  function leerEstamina(jug, teamId) {
    if (!jug || !jug.id) return ESTAMINA_MAX;
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return jug.estamina ?? ESTAMINA_MAX;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return jug.estamina ?? ESTAMINA_MAX;
      if (esEquipoManager(data, teamId)) {
        return data.manager.estamina?.[jug.id] ?? jug.estamina ?? ESTAMINA_MAX;
      }
      return data.manager.temporada?.estaminaNPC?.[teamId]?.[jug.id] ?? jug.estamina ?? ESTAMINA_MAX;
    } catch (e) {
      return jug.estamina ?? ESTAMINA_MAX;
    }
  }

  function aplicarEstamina(jug, teamId) {
    if (!jug || !jug.id) return jug;
    jug.estamina = leerEstamina(jug, teamId);
    return jug;
  }

  function guardarEstaminaEnData(data, jugId, teamId, valor) {
    const v = Math.max(0, Math.min(ESTAMINA_MAX, valor));
    if (esEquipoManager(data, teamId)) {
      if (!data.manager.estamina) data.manager.estamina = {};
      data.manager.estamina[jugId] = v;
    } else {
      if (!data.manager.temporada) data.manager.temporada = {};
      if (!data.manager.temporada.estaminaNPC) data.manager.temporada.estaminaNPC = {};
      if (!data.manager.temporada.estaminaNPC[teamId]) data.manager.temporada.estaminaNPC[teamId] = {};
      data.manager.temporada.estaminaNPC[teamId][jugId] = v;
    }
  }

  function descontarEstaminaPartido(data, jugId, teamId) {
    const actual = (esEquipoManager(data, teamId)
      ? (data.manager.estamina?.[jugId] ?? ESTAMINA_MAX)
      : (data.manager.temporada?.estaminaNPC?.[teamId]?.[jugId] ?? ESTAMINA_MAX));
    const perdida = 15 + Math.floor(Math.random() * 11);
    guardarEstaminaEnData(data, jugId, teamId, actual - perdida);
  }

  function onceIdsNPC(teamId) {
    if (typeof PLANTILLAS_EQUIPO === 'undefined') return [];
    const plantilla = PLANTILLAS_EQUIPO[teamId] || [];
    const eq = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.id === teamId) : null;
    const formacion = eq?.formation || '4-3-3';
    return elegirMejorOnce(plantilla, formacion).once;
  }

  function descontarEstaminaEquipoNPC(data, teamId) {
    const ids = onceIdsNPC(teamId);
    ids.forEach(id => descontarEstaminaPartido(data, id, teamId));
  }

  function onceIdsDeManager(data) {
    const t = data.manager.tactica;
    return (t && Array.isArray(t.once)) ? t.once : [];
  }

  function recuperarJugadores(data, jugadosIds, descansoIds) {
    [jugadosIds, descansoIds].forEach((arr, i) => {
      (arr || []).forEach(id => {
        if (!id) return;
        const actual = data.manager.estamina?.[id] ?? ESTAMINA_MAX;
        const ganancia = i === 0 ? 12 : 35;
        data.manager.estamina = data.manager.estamina || {};
        data.manager.estamina[id] = Math.min(ESTAMINA_MAX, actual + ganancia);
      });
    });
  }

  window.aplicarRecuperacionJornada = function (data) {
    if (!data?.manager) return;
    if (!data.manager.estamina) data.manager.estamina = {};
    const jugados = onceIdsDeManager(data);
    const plantilla = getPlantillaPorNombre(data.manager.equipo);
    const descanso = plantilla.map(p => p.id).filter(id => !jugados.includes(id));
    recuperarJugadores(data, jugados, descanso);

    const t = data.manager.temporada;
    if (t?.estaminaNPC) {
      Object.keys(t.estaminaNPC).forEach(teamId => {
        const ids = Object.keys(t.estaminaNPC[teamId]);
        ids.forEach((id, i) => {
          const ganancia = i < 11 ? 12 : 35;
          t.estaminaNPC[teamId][id] = Math.min(ESTAMINA_MAX, t.estaminaNPC[teamId][id] + ganancia);
        });
      });
    }
  };

  // ===== BANDEJA DE ENTRADA =====
  let estadoBuzon = { mensajes: [] };

  function getBuzon(data) {
    if (!data?.manager) return estadoBuzon;
    if (!data.manager.buzon) data.manager.buzon = { mensajes: [] };
    if (!Array.isArray(data.manager.buzon.mensajes)) data.manager.buzon.mensajes = [];
    estadoBuzon = data.manager.buzon;
    return estadoBuzon;
  }

  function mensajeEgoBienvenida(equipoNombre) {
    const pseudo = { manager: { equipo: equipoNombre } };
    const liga = getLigaDeManager(pseudo);
    const ligaNombre = liga?.nombre || 'la competición';
    return {
      id: 'm' + Date.now(),
      remitente: 'Jinpachi Ego',
      asunto: `Bienvenido a la ${ligaNombre}`,
      cuerpo: `Manager: comienza la temporada en la ${ligaNombre}. Al frente de ${equipoNombre || 'tu equipo'}, tu trabajo será gestionar la plantilla, elegir el once y llevar al club a lo más alto. La competición ya está en marcha.`,
      leido: false,
      jornada: 0,
      tipo: 'info'
    };
  }

  window.generarAlertasBuzon = function (data) {
    if (!data?.manager) return;
    const buzon = getBuzon(data);
    const jugadoresBajos = [];
    Object.keys(data.manager.estamina || {}).forEach(id => {
      if ((data.manager.estamina[id] ?? 100) < 50) {
        const jug = getJugador(id, data.manager.equipo);
        if (jug) jugadoresBajos.push({ id, nombre: jug.nombre, estamina: data.manager.estamina[id] });
      }
    });
    if (jugadoresBajos.length === 0) return;

    const nombres = jugadoresBajos.map(j => `${j.nombre} (${j.estamina})`).join(', ');
    const jornada = data.manager.temporada?.jornadaActual ?? 0;
    buzon.mensajes.push({
      id: 'm' + Date.now() + Math.floor(Math.random() * 1000),
      remitente: 'Cuerpo Médico',
      asunto: 'Alerta: jugadores fatigados',
      cuerpo: `Tras el último partido, los siguientes jugadores han bajado de 50 de estamina y corren peligro de lesión o bajada de stats: ${nombres}. Considera rotar la alineación.`,
      leido: false,
      jornada,
      tipo: 'medico'
    });
    data.manager.buzon = buzon;
  };

  window.actualizarBuzonBadge = function () {
    const badge = document.getElementById('buzon-badge');
    if (!badge) return;
    const noLeidos = (estadoBuzon?.mensajes || []).filter(m => !m.leido).length;
    badge.textContent = String(noLeidos);
    badge.style.display = noLeidos > 0 ? 'flex' : 'none';
  };

  window.abrirMensaje = function (id) {
    const buzon = estadoBuzon;
    const msg = (buzon?.mensajes || []).find(m => m.id === id);
    if (!msg) return;
    if (!msg.leido) {
      msg.leido = true;
      try {
        const saved = localStorage.getItem('blue_lock_save');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.manager) {
            data.manager.buzon = buzon;
            localStorage.setItem('blue_lock_save', JSON.stringify(data));
            sincronizarSlotActivo();
          }
        }
      } catch (e) { /* noop */ }
      actualizarBuzonBadge();
    }
    const detalle = document.getElementById('buzon-detalle');
    const lista = document.getElementById('buzon-lista');
    if (lista) lista.style.display = 'none';
    if (detalle) {
      detalle.style.display = 'block';
      detalle.innerHTML = `
        <div class="buzon-detalle-card">
          <div class="buzon-detalle-remitente">DE: ${msg.remitente}</div>
          <div class="buzon-detalle-asunto">${msg.asunto}</div>
          <div class="buzon-detalle-meta">Jornada ${msg.jornada} · ${msg.tipo === 'medico' ? '🚨 Alerta' : '📋 Información'}</div>
          <div class="buzon-detalle-cuerpo">${msg.cuerpo}</div>
          <button class="btn-bluelock" style="width:100%;justify-content:center;margin-top:10px;" onclick="volverListaBuzon()"><i class="fas fa-arrow-left"></i> VOLVER A LA BANDEJA</button>
        </div>`;
    }
  };

  window.volverListaBuzon = function () {
    const lista = document.getElementById('buzon-lista');
    const detalle = document.getElementById('buzon-detalle');
    if (lista) lista.style.display = 'flex';
    if (detalle) detalle.style.display = 'none';
    renderBuzon();
  };

  window.renderBuzon = function () {
    const cont = document.getElementById('buzon-lista');
    if (!cont) return;
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.manager) getBuzon(data);
      }
    } catch (e) { /* noop */ }
    const detalle = document.getElementById('buzon-detalle');
    if (detalle) detalle.style.display = 'none';
    cont.style.display = 'flex';

    const mensajes = [...(estadoBuzon?.mensajes || [])].sort((a, b) => {
      const na = a.leido ? 1 : 0;
      const nb = b.leido ? 1 : 0;
      if (na !== nb) return na - nb;
      return 0;
    });

    if (mensajes.length === 0) {
      cont.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No tienes mensajes.</p>';
      actualizarBuzonBadge();
      return;
    }

    cont.innerHTML = mensajes.map(m => `
      <div class="buzon-msg ${m.leido ? 'leido' : 'no-leido'}" onclick="abrirMensaje('${m.id}')">
        <div class="buzon-msg-remitente">${m.remitente} ${m.leido ? '' : '<span class="buzon-dot"></span>'}</div>
        <div class="buzon-msg-asunto">${m.asunto}</div>
        <div class="buzon-msg-meta">Jornada ${m.jornada} · ${m.tipo}</div>
      </div>`).join('');
    actualizarBuzonBadge();
  };

  // Cargar Guardado Previsto
  function cargarEstado() {
    const saved = localStorage.getItem('blue_lock_save') || localStorage.getItem('bl_manager_save');

    // Ocultar los continuar por defecto (el de manager siempre visible: abre el selector de slots)
    ['btn-continuar-jugador', 'btn-continuar-historia'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const btnManager = document.getElementById('btn-continuar-manager');
    if (btnManager) btnManager.style.display = 'flex';

    if (saved) {
      try {
        const data = JSON.parse(saved);
        gameState.datosPartida = data;
        gameState.partidaGuardada = true;
        if (data.historia) gameState.historia = data.historia;

        if (data.tipo === 'jugador') {
          const btn = document.getElementById('btn-continuar-jugador');
          if (btn) btn.style.display = 'flex';
        } else if (data.tipo !== 'manager') {
          const btn = document.getElementById('btn-continuar-historia');
          if (btn) btn.style.display = 'flex';
        }
      } catch (e) {
        console.error("Error al cargar partida", e);
      }
    }
    sincronizarSlotActivo();
    actualizarMonedasUI();
  }

  function actualizarMonedasUI() {
    document.getElementById('user-coins').innerText = gameState.monedas;
    document.getElementById('user-gems').innerText = gameState.gemas;
  }

  // ===== SLOTS DE GUARDADO (MODO CARRERA) =====
  const MAX_SLOTS = 3;
  const SLOTS_KEY = 'bl_manager_slots';
  const ACTIVE_SLOT_KEY = 'bl_manager_active';

  function getManagerSlots() {
    try {
      const raw = localStorage.getItem(SLOTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveManagerSlots(slots) {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }

  function nuevoSlotId() {
    return 's' + Date.now() + Math.floor(Math.random() * 1000);
  }

  function sincronizarSlotActivo() {
    try {
      const activeId = localStorage.getItem(ACTIVE_SLOT_KEY);
      if (!activeId) return;
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return;
      const slots = getManagerSlots();
      const idx = slots.findIndex(s => s.slotId === activeId);
      if (idx === -1) return;
      slots[idx].data = data;
      slots[idx].equipo = data.manager.equipo;
      slots[idx].semana = data.manager.semana || 0;
      slots[idx].fechaGuardado = new Date().toISOString();
      saveManagerSlots(slots);
    } catch (e) {
      console.error('Error al sincronizar slot', e);
    }
  }

  // Cargar Países en formulario Jugador
  function cargarPaisesUI() {
    const select = document.getElementById('select-pais');
    if (!select || typeof CONFIG_PAISES === 'undefined') return;
    select.innerHTML = '';
    CONFIG_PAISES.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const ligas = p.ligas.map(l => l.nombre).join(', ');
      opt.textContent = `${p.bandera} ${p.nombre} (${ligas})`;
      select.appendChild(opt);
    });
  }

  let tsState = { equipoId: null, equipoNombre: '' };
  let previewPlantillaData = null;

  window.tsInit = function () {
    tsState = { equipoId: null, equipoNombre: '' };
    const nombreInput = document.getElementById('input-nombre-manager');
    if (nombreInput) nombreInput.value = '';
    document.getElementById('ts-selected-name').style.display = 'none';
    actualizarEstadoIniciarCarrera();
    renderPaisesLista();
  };

  function actualizarEstadoIniciarCarrera() {
    const btn = document.getElementById('btn-submit-manager');
    if (!btn) return;
    const nombre = (document.getElementById('input-nombre-manager')?.value || '').trim();
    btn.disabled = !(nombre && tsState.equipoId);
  }

  function renderPaisesLista() {
    const cont = document.getElementById('ts-selector-arbol');
    cont.innerHTML = '';
    if (typeof CONFIG_PAISES === 'undefined' || CONFIG_PAISES.length === 0) return;
    CONFIG_PAISES.forEach(pais => {
      const totalEq = pais.ligas.reduce((a, l) => a + l.equipos.length, 0);
      const section = document.createElement('div');
      section.className = 'ts-pais';
      section.innerHTML = `
        <div class="ts-pais-header" onclick="tsSeleccionarPais('${pais.id}')">
          <span class="ts-pais-bandera">${pais.bandera}</span>
          <span class="ts-pais-nombre">${pais.nombre}</span>
          <span class="ts-pais-count">${totalEq} equipos</span>
          <span class="ts-pais-chevron"><i class="fas fa-chevron-right"></i></span>
        </div>`;
      cont.appendChild(section);
    });
  }

  window.tsSeleccionarPais = function (paisId) {
    const pais = (typeof CONFIG_PAISES !== 'undefined' && CONFIG_PAISES.length)
      ? CONFIG_PAISES.find(p => p.id === paisId) : null;
    if (!pais) return;
    document.getElementById('ts-pais-titulo').textContent = `${pais.bandera} ${pais.nombre}`;
    const totalEq = pais.ligas.reduce((a, l) => a + l.equipos.length, 0);
    document.getElementById('ts-pais-sub').textContent = `${pais.ligas.length} ${pais.ligas.length === 1 ? 'liga' : 'ligas'} · ${totalEq} ${totalEq === 1 ? 'equipo' : 'equipos'}`;
    const cont = document.getElementById('ts-ligas-container');
    cont.innerHTML = pais.ligas.map(liga => `
      <div class="ts-liga">
        <div class="ts-liga-header">⚽ ${liga.nombre} <span class="ts-liga-count">${liga.equipos.length}</span></div>
        <div class="ts-grid">${liga.equipos.map(eq => cardEquipoHtml(eq)).join('')}</div>
      </div>`).join('');
    showScreen('screen-pais-ligas');
  };

  function estrellasTexto(stars) {
    const n = Number(stars) || 0;
    const enteras = Math.floor(n);
    const media = (n % 1) >= 0.5;
    return '⭐'.repeat(enteras) + (media ? '½' : '');
  }

  function cardEquipoHtml(eq) {
    const escudoHtml = eq.escudo
      ? `<img src="${eq.escudo}" class="ts-emblem-img" onerror="this.onerror=null;this.style.display='none'" alt="${eq.name}">`
      : htmlEscudoEquipo(eq.name);
    const grl = typeof eq.grl === 'number' ? `GRL ${eq.grl}` : '';
    const stars = estrellasTexto(eq.stars);
    return `<div class="ts-card ts-equipo ${tsState.equipoId === eq.id ? 'selected' : ''}" onclick="tsSeleccionarEquipo('${eq.id}')">
      <span class="ts-emblem">${escudoHtml}</span>
      <span class="ts-name">${eq.name}</span>
      <span class="ts-meta">${stars} ${formatearYenes(eq.budget || 0)}</span>
      ${grl ? `<span class="ts-grl">${grl}</span>` : ''}
      <button type="button" class="ts-ver-plantilla" onclick="event.stopPropagation(); tsVerPlantilla('${eq.id}')"><i class="fas fa-users"></i> VER PLANTILLA</button>
    </div>`;
  }

  window.tsSeleccionarEquipo = function (equipoId) {
    const eq = NEO_EQUIPOS.find(e => e.id === equipoId);
    if (!eq) return;
    tsState.equipoId = eq.id;
    tsState.equipoNombre = eq.name;
    document.querySelectorAll('.ts-card.ts-equipo').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`.ts-card.ts-equipo[onclick*="'${equipoId}'"]`);
    if (card) card.classList.add('selected');
    const grl = typeof eq.grl === 'number' ? ` · GRL ${eq.grl}` : '';
    document.getElementById('ts-equipo-label').textContent = `${eq.name}${grl} ${formatearYenes(eq.budget)} ${estrellasTexto(eq.stars)}`;
    document.getElementById('ts-selected-name').style.display = 'block';
    actualizarEstadoIniciarCarrera();
  };

  window.tsVerPlantilla = function (equipoId) {
    const eq = NEO_EQUIPOS.find(e => e.id === equipoId);
    if (!eq) return;
    abrirPlantillaEquipo(eq.name, getPlantillaEquipo(eq.name));
  };

  window.verPlantillaClasificacion = function (teamId) {
    const nombre = nombreEquipoPorId(teamId);
    const plantilla = getPlantillaEquipo(nombre);
    abrirPlantillaEquipo(nombre, plantilla);
  };

  function abrirPlantillaEquipo(nombre, plantilla) {
    document.getElementById('plantilla-titulo').textContent = 'PLANTILLA';
    document.getElementById('plantilla-equipo').textContent = nombre;
    document.getElementById('plantilla-tabs').style.display = '';
    document.getElementById('plantilla-sort-bar').style.display = '';

    if (!plantilla || plantilla.length === 0) {
      previewPlantillaData = null;
      document.getElementById('plantilla-grid').innerHTML =
        '<p style="text-align:center;color:var(--text-muted);padding:20px;">Plantilla no disponible para este equipo.</p>';
      showScreen('screen-plantilla');
      return;
    }

    previewPlantillaData = plantilla;
    plantillaSort = { by: 'posicion', asc: true };
    plantillaVista = 'info';
    document.querySelectorAll('.plantilla-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.vista === 'info');
    });
    renderPlantillaSortBar();
    renderPlantillaContent();

    showScreen('screen-plantilla');
  }

  window.limpiarPlantillaPreview = function () {
    previewPlantillaData = null;
    document.getElementById('plantilla-sort-bar').style.display = '';
    document.getElementById('plantilla-tabs').style.display = '';
    document.getElementById('plantilla-grid').innerHTML = '';
  };

  let navHistory = [];
  function activarPantalla(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
  }

  window.showScreen = function (screenId) {
    const current = document.querySelector('.screen.active');
    if (current && current.id !== screenId) {
      navHistory.push(current.id);
    }
    activarPantalla(screenId);
  };

  window.goBack = function () {
    const prev = navHistory.pop();
    activarPantalla(prev && document.getElementById(prev) ? prev : 'screen-main');
  };

  // Renderizar Tienda
  function renderTienda() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
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
  }

  // Renderizar Logros
  function renderLogros() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
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
  }

  // Comprar en Tienda
  window.comprarItem = function (itemId, precio) {
    if (gameState.monedas >= precio) {
      gameState.monedas -= precio;
      actualizarMonedasUI();
      mostrarModal("¡COMPRA REALIZADA!", "Has adquirido el objeto con éxito. Listo para la batalla.");
    } else {
      mostrarModal("MONEDAS INSUFICIENTES", "Necesitas ganar más partidos para obtener monedas de Ego.");
    }
  };

  // Modal Generic Helper
  window.mostrarModal = function (titulo, mensaje) {
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-body').innerText = mensaje;
    document.getElementById('modal-overlay').classList.add('active');
  };

  window.cerrarModal = function () {
    document.getElementById('modal-overlay').classList.remove('active');
  };

  window.mostrarFormJugador = function () {
    document.getElementById('cj-menu').style.display = 'none';
    document.getElementById('cj-form').style.display = 'flex';
  };

  window.volverMenuJugador = function () {
    const form = document.getElementById('cj-form');
    if (form.style.display === 'flex') {
      form.style.display = 'none';
      document.getElementById('cj-menu').style.display = 'flex';
    } else {
      goBack();
    }
  };

  window.mostrarFormManager = function () {
    document.getElementById('mm-menu').style.display = 'none';
    document.getElementById('mm-form').style.display = 'flex';
    tsInit();
  };

  window.volverMenuManager = function () {
    const form = document.getElementById('mm-form');
    if (form.style.display === 'flex') {
      form.style.display = 'none';
      document.getElementById('mm-menu').style.display = 'flex';
    } else {
      goBack();
    }
  };

  window.mostrarSlotsManager = function () {
    sincronizarSlotActivo();
    const slots = getManagerSlots();
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-save"></i> CARGAR PARTIDA';

    if (slots.length === 0) {
      document.getElementById('modal-body').innerHTML = `
        <p style="text-align:center;padding:20px 0;color:var(--text-muted);">
          No hay partidas guardadas actualmente.
        </p>`;
      document.getElementById('modal-overlay').classList.add('active');
      return;
    }

    const activeId = localStorage.getItem(ACTIVE_SLOT_KEY);
    let html = '';
    slots.forEach((slot, i) => {
      const fecha = slot.fechaGuardado ? new Date(slot.fechaGuardado) : (slot.fechaCreacion ? new Date(slot.fechaCreacion) : null);
      const fechaTxt = fecha ? fecha.toLocaleString('es-ES') : '—';
      const semana = typeof slot.semana === 'number' ? slot.semana : (slot.data?.manager?.semana || 0);
      const activo = slot.slotId === activeId;
      html += `<div class="slot-card">
        <div class="slot-info">
          <span class="slot-equipo">${slot.equipo || '—'}</span>
          <span class="slot-meta">Semana ${semana} · Guardado: ${fechaTxt}</span>
          ${activo ? `<span class="slot-tag-activo">EN CURSO</span>` : ''}
        </div>
        <div class="slot-actions">
          <button class="slot-btn-load" onclick="cargarSlot('${slot.slotId}')"><i class="fas fa-play"></i> CARGAR</button>
          <button class="slot-btn-delete" onclick="eliminarSlot('${slot.slotId}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    });

    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
  };

  window.cargarSlot = function (slotId) {
    sincronizarSlotActivo();
    const slots = getManagerSlots();
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot || !slot.data) {
      mostrarModal('ERROR', 'No se pudo cargar la partida.');
      return;
    }
    localStorage.setItem('blue_lock_save', JSON.stringify(slot.data));
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
    cerrarModal();
    cargarEstado();
    renderHub();
    showScreen('screen-hub');
  };

  window.eliminarSlot = function (slotId) {
    let slots = getManagerSlots();
    const eraActivo = localStorage.getItem(ACTIVE_SLOT_KEY) === slotId;
    slots = slots.filter(s => s.slotId !== slotId);
    saveManagerSlots(slots);
    if (eraActivo) {
      localStorage.removeItem(ACTIVE_SLOT_KEY);
      const current = localStorage.getItem('blue_lock_save');
      if (current) {
        try {
          const d = JSON.parse(current);
          if (d.tipo === 'manager') localStorage.removeItem('blue_lock_save');
        } catch (e) { /* noop */ }
      }
    }
    mostrarSlotsManager();
  };

  // Reproductor de Audio
  const DEFAULT_VOLUME = 0.15;
  const themeAudio = document.getElementById('theme-audio');
  const playBtn = document.getElementById('btn-play-theme');
  const playIcon = document.getElementById('play-icon');
  const timeDisplay = document.getElementById('audio-time');
  const progressFill = document.getElementById('progress-fill');
  const progressBar = document.querySelector('.audio-progress-bar');
  const volSlider = document.getElementById('volume-slider');
  const volPct = document.getElementById('vol-pct');
  const volIcon = document.getElementById('vol-icon');

  const goalSound = document.getElementById('goal-sound');

  let isPlaying = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTime() {
    const current = formatTime(themeAudio.currentTime);
    const total = formatTime(themeAudio.duration);
    timeDisplay.textContent = `${current} / ${total}`;
    const pct = themeAudio.duration ? (themeAudio.currentTime / themeAudio.duration) * 100 : 0;
    progressFill.style.width = `${pct}%`;
  }

  function setVolume(value) {
    themeAudio.volume = value;
    goalSound.volume = value;
    volSlider.value = value;
    const pct = Math.round(value * 100);
    volPct.textContent = `${pct}%`;
    if (value === 0) {
      volIcon.className = 'fas fa-volume-xmark';
    } else if (value < 0.5) {
      volIcon.className = 'fas fa-volume-low';
    } else {
      volIcon.className = 'fas fa-volume-high';
    }
    localStorage.setItem('bl_theme_volume', value);
  }

  window.reprobarGol = function () {
    goalSound.currentTime = 0;
    goalSound.play().catch(() => {});
  };

  // Restaurar volumen guardado o usar default bajo
  const savedVolume = localStorage.getItem('bl_theme_volume');
  setVolume(savedVolume !== null ? parseFloat(savedVolume) : DEFAULT_VOLUME);

  volSlider.addEventListener('input', function () {
    setVolume(parseFloat(this.value));
  });

  // Autoplay al cargar (si el navegador lo permite y el usuario no lo pausó antes)
  if (localStorage.getItem('bl_theme_autoplay') !== 'false') {
    themeAudio.play().catch(() => {
      document.querySelector('.menu-buttons').addEventListener('click', function initOnClick() {
        themeAudio.play();
        this.removeEventListener('click', initOnClick);
      }, { once: true });
    });
  }

  playBtn.addEventListener('click', function () {
    if (isPlaying) {
      themeAudio.pause();
      localStorage.setItem('bl_theme_autoplay', 'false');
    } else {
      themeAudio.play();
      localStorage.setItem('bl_theme_autoplay', 'true');
    }
  });

  themeAudio.addEventListener('play', () => {
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
  });

  themeAudio.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.className = 'fas fa-play';
  });

  themeAudio.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    progressFill.style.width = '0%';
    timeDisplay.textContent = '0:00 / 0:00';
  });

  themeAudio.addEventListener('timeupdate', updateTime);

  themeAudio.addEventListener('loadedmetadata', updateTime);

  progressBar.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    themeAudio.currentTime = pct * themeAudio.duration;
  });

  // Renderizar Hub desde blue_lock_save
  window.renderHub = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    gameState.monedas = data.monedas ?? gameState.monedas;
    gameState.gemas = data.gemas ?? gameState.gemas;
    actualizarMonedasUI();
    if (data.manager?.buzon) getBuzon(data);
    actualizarBuzonBadge();

    document.getElementById('hub-nombre').textContent = data.jugador?.nombre || data.manager?.nombre || '—';
    document.getElementById('hub-equipo').textContent = data.jugador ? data.jugador.pais : data.manager?.equipo || '—';

    const rolEl = document.getElementById('hub-rol');
    const statsEl = document.getElementById('hub-stats');

    if (data.tipo === 'jugador' && data.jugador) {
      rolEl.textContent = 'JUGADOR';
      const j = data.jugador;
      const btnPlantilla = document.getElementById('hub-btn-plantilla');
      if (btnPlantilla) {
        const span = btnPlantilla.querySelector('span');
        if (span) span.textContent = 'MI EGOÍSTA';
      }
      statsEl.innerHTML = `
        <span><i class="fas fa-futbol"></i> Tiro: ${j.stats.tiro}</span>
        <span><i class="fas fa-bullseye"></i> Pase: ${j.stats.pase}</span>
        <span><i class="fas fa-bolt"></i> Regate: ${j.stats.regate}</span>
        <span><i class="fas fa-eye"></i> Visión: ${j.stats.vision}</span>
      `;
    } else if (data.tipo === 'manager' && data.manager) {
      rolEl.textContent = 'MANAGER';
      const btnPlantilla = document.getElementById('hub-btn-plantilla');
      if (btnPlantilla) {
        const span = btnPlantilla.querySelector('span');
        if (span) span.textContent = 'PLANTILLA';
      }
      const m = data.manager;
      const presupuesto = typeof m.presupuesto === 'number' ? m.presupuesto : (NEO_EQUIPOS.find(e => e.name === m.equipo)?.budget ?? 0);
      const numJug = getPlantillaEquipo(m.equipo).length;
      const semana = m.semana || 0;
      statsEl.innerHTML = `
        <span><i class="fas fa-coins"></i> Presupuesto: ${formatearYenes(presupuesto)}</span>
        <span><i class="fas fa-users"></i> Plantilla: ${numJug} jug.</span>
        <span><i class="fas fa-calendar-week"></i> Semana: ${semana}</span>
        <span><i class="fas fa-store"></i> Fichajes: ${(m.fichajes || []).length}</span>
      `;
    }
  };

  // Guardar estado actual (monedas, gemas) en blue_lock_save
  window.guardarEstado = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    data.monedas = gameState.monedas;
    data.gemas = gameState.gemas;
    data.historia = gameState.historia;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    sincronizarSlotActivo();
  };

  // Plantilla
  window.renderPlantilla = function () {
    plantillaSort = { by: 'posicion', asc: true };
    plantillaVista = 'info';

    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const grid = document.getElementById('plantilla-grid');

    if (data.tipo === 'jugador' && data.jugador) {
      // Modo Jugador: ficha grande "Mi Egoísta"
      document.getElementById('plantilla-tabs').style.display = 'none';
      document.getElementById('plantilla-sort-bar').style.display = 'none';
      document.getElementById('plantilla-titulo').textContent = 'MI EGOÍSTA';
      document.getElementById('plantilla-equipo').textContent = '';
      const j = data.jugador;
      const jugCard = {
        id: 'jugador',
        nombre: j.nombre,
        foto: '',
        posicion: j.posicion,
        posicionSec: '—',
        edad: '—',
        instituto: '—',
        nacionalidad: '—',
        bandera: '',
        pie: '—',
        tiro: j.stats.tiro,
        pase: j.stats.pase,
        regate: j.stats.regate,
        defensa: j.stats.defensa || 40,
        pac: j.stats.pac || 65,
        phy: j.stats.phy || 60,
        grl: j.stats.grl || Math.round((j.stats.tiro + j.stats.pase + j.stats.regate + (j.stats.defensa || 40) + 65 + 60) / 6)
      };
      grid.innerHTML = renderizarFichaGrandeJugador(jugCard);
      return;
    }

    if (data.tipo !== 'manager' || !data.manager) return;
    // Modo Manager: tabs + sort bar + lista
    document.getElementById('plantilla-tabs').style.display = '';
    document.getElementById('plantilla-sort-bar').style.display = '';
    document.getElementById('plantilla-titulo').textContent = 'PLANTILLA';
    document.getElementById('plantilla-equipo').textContent = data.manager.equipo;
    renderPlantillaSortBar();
    renderPlantillaContent();
  };

  window.cambiarVistaPlantilla = function (vista) {
    plantillaVista = vista;
    document.querySelectorAll('.plantilla-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.vista === vista);
    });
    renderPlantillaSortBar();
    renderPlantillaContent();
  };

  function renderPlantillaSortBar() {
    const bar = document.getElementById('plantilla-sort-bar');
    const infoCriteria = [
      { key: 'posicion', label: 'POSICIÓN' },
      { key: 'grl', label: 'GRL' },
      { key: 'nombre', label: 'NOMBRE' },
      { key: 'nacionalidad', label: 'NACIONALIDAD' },
      { key: 'edad', label: 'EDAD' }
    ];
    const statsCriteria = [
      { key: 'grl', label: 'GRL' },
      { key: 'nombre', label: 'NOMBRE' },
      { key: 'pac', label: 'PAC' },
      { key: 'tiro', label: 'SHO' },
      { key: 'pase', label: 'PAS' },
      { key: 'regate', label: 'DRI' },
      { key: 'defensa', label: 'DEF' },
      { key: 'phy', label: 'PHY' }
    ];
    const criteria = plantillaVista === 'stats' ? statsCriteria : infoCriteria;
    let html = '<div class="sort-bar"><span class="sort-label">ORDENAR:</span>';
    criteria.forEach(c => {
      const active = plantillaSort.by === c.key;
      const arrow = active ? (plantillaSort.asc ? ' ▲' : ' ▼') : '';
      html += `<button class="sort-btn ${active ? 'active' : ''}" onclick="ordenarPlantilla('${c.key}')">${c.label}${arrow}</button>`;
    });
    html += '</div>';
    bar.innerHTML = html;
  }

  window.ordenarPlantilla = function (by) {
    if (plantillaSort.by === by) {
      plantillaSort.asc = !plantillaSort.asc;
    } else {
      plantillaSort.by = by;
      plantillaSort.asc = by === 'nombre' || by === 'nacionalidad';
    }
    renderPlantillaSortBar();
    renderPlantillaContent();
  };

  function calcularGrlJugador(jug) {
    if (!jug) return 0;
    if (jug.grl) return jug.grl;
    if (jug.posicion === 'POR') {
      return Math.round(((jug.div || 60) + (jug.han || 60) + (jug.kic || 60) + (jug.ref || 60) + (jug.spd || 60) + (jug.pos || 60)) / 6);
    }
    return Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
  }

  function statOrdenable(jug, key) {
    if (jug.posicion === 'POR') {
      const map = { pac: 'spd', defensa: 'div', phy: 'ref', tiro: 'kic', pase: 'kic', regate: null };
      const k = map[key] ?? key;
      return k ? (jug[k] ?? 0) : 0;
    }
    return jug[key] ?? 0;
  }

  function renderPlantillaContent() {
    let jugadores;
    const grid = document.getElementById('plantilla-grid');
    if (previewPlantillaData) {
      jugadores = [...previewPlantillaData];
    } else {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return;
      document.getElementById('plantilla-equipo').textContent = data.manager.equipo;
      jugadores = getPlantillaEquipo(data.manager.equipo);
    }
    jugadores.sort((a, b) => {
      let va, vb;
      if (plantillaSort.by === 'posicion') {
        va = String(POS_ORDER[a.posicion] ?? 99).padStart(3, '0') + a.nombre;
        vb = String(POS_ORDER[b.posicion] ?? 99).padStart(3, '0') + b.nombre;
      } else if (plantillaSort.by === 'nombre' || plantillaSort.by === 'nacionalidad') {
        va = (a[plantillaSort.by] || '').toLowerCase(); vb = (b[plantillaSort.by] || '').toLowerCase();
      } else if (plantillaSort.by === 'grl') {
        va = calcularGrlJugador(a); vb = calcularGrlJugador(b);
      } else {
        va = statOrdenable(a, plantillaSort.by);
        vb = statOrdenable(b, plantillaSort.by);
      }
      if (typeof va === 'string') return plantillaSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
      return plantillaSort.asc ? va - vb : vb - va;
    });

    const fila = plantillaVista === 'stats' ? renderizarFilaStats : renderizarFilaInfo;
    grid.innerHTML = '';
    jugadores.forEach(p => {
      grid.innerHTML += `<div class="plantilla-card-wrapper" onclick="abrirFichaJugador('${p.id}')">
        ${fila(p)}
      </div>`;
    });
  }

  // ===== MODO CARRERA: ENTRENAMIENTO MANUAL (1 VEZ POR SEMANA) =====
  window.getXPRequired = function (statValue) {
    if (statValue < 70) return 50;
    if (statValue < 80) return 100;
    if (statValue < 90) return 200;
    return 400;
  };

  window.getEnfoqueStats = function (posicion) {
    const DEF = ['DFC', 'LD', 'LI', 'CAD', 'CAI'];
    const MED = ['MCD', 'MC', 'MCO', 'MI', 'MD'];
    if (posicion === 'POR') return ['div', 'ref'];
    if (DEF.includes(posicion)) return ['def', 'pac'];
    if (MED.includes(posicion)) return ['pas', 'dri'];
    return ['sho', 'dri'];
  };

  window.calcularXPGanada = function (jug) {
    const edad = jug?.edad || 20;
    return edad < 20 ? Math.floor(Math.random() * 16) + 15 : Math.floor(Math.random() * 11) + 10;
  };

  function getEntrenamientoData() {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return null;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return null;
    if (!data.manager.entrenamiento) data.manager.entrenamiento = {};
    if (typeof data.manager.semana !== 'number') data.manager.semana = 0;
    return data;
  }

  window.entrenadoEstaSemana = function () {
    const data = getEntrenamientoData();
    return data ? data.manager.entrenadoSemana === true : false;
  };

  window.marcarEntrenado = function () {
    const data = getEntrenamientoData();
    if (!data) return;
    data.manager.entrenadoSemana = true;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
  };

  window.avanzarSemana = function () {
    const data = getEntrenamientoData();
    if (!data) return;
    data.manager.semana += 1;
    data.manager.entrenadoSemana = false;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
  };

  window.aplicarEntrenamientoManual = function (items) {
    const data = getEntrenamientoData();
    if (!data) return null;
    const semana = data.manager.semana;
    const resultado = { semana, jugadores: [] };

    items.forEach(it => {
      const jug = it.jug;
      if (!jug || !jug.id) return;
      const rec = data.manager.entrenamiento[jug.id] || { xp: {}, stats: {} };
      const xpBase = calcularXPGanada(jug);
      const item = {
        id: jug.id,
        nombre: jug.nombre,
        posicion: jug.posicion,
        foto: jug.foto || 'assets/players/default.png',
        xp: {},
        subidas: []
      };

      (it.stats || []).forEach(stat => {
        if (!rec.xp[stat]) rec.xp[stat] = 0;
        rec.xp[stat] += xpBase;
        item.xp[stat] = (item.xp[stat] || 0) + xpBase;

        let valorActual = typeof rec.stats[stat] === 'number' ? rec.stats[stat] : (jug.stats?.[stat] ?? 60);
        let req = getXPRequired(valorActual);
        while (rec.xp[stat] >= req) {
          rec.xp[stat] -= req;
          valorActual += 1;
          rec.stats[stat] = valorActual;
          item.subidas.push({ stat, antes: valorActual - 1, despues: valorActual });
          req = getXPRequired(valorActual);
        }
      });

      const statsBase = jug.stats || {};
      if (jug.posicion === 'POR') {
        const div = typeof rec.stats.div === 'number' ? rec.stats.div : (statsBase.div ?? 60);
        const han = typeof rec.stats.han === 'number' ? rec.stats.han : (statsBase.han ?? 60);
        const kic = typeof rec.stats.kic === 'number' ? rec.stats.kic : (statsBase.kic ?? 60);
        const ref = typeof rec.stats.ref === 'number' ? rec.stats.ref : (statsBase.ref ?? 60);
        const spd = typeof rec.stats.spd === 'number' ? rec.stats.spd : (statsBase.spd ?? 60);
        const pos = typeof rec.stats.pos === 'number' ? rec.stats.pos : (statsBase.pos ?? 60);
        rec.grl = Math.round((div + han + kic + ref + spd + pos) / 6);
      } else {
        const pac = typeof rec.stats.pac === 'number' ? rec.stats.pac : (statsBase.pac ?? 60);
        const sho = typeof rec.stats.sho === 'number' ? rec.stats.sho : (statsBase.sho ?? 60);
        const pas = typeof rec.stats.pas === 'number' ? rec.stats.pas : (statsBase.pas ?? 60);
        const dri = typeof rec.stats.dri === 'number' ? rec.stats.dri : (statsBase.dri ?? 60);
        const def = typeof rec.stats.def === 'number' ? rec.stats.def : (statsBase.def ?? 60);
        const phy = typeof rec.stats.phy === 'number' ? rec.stats.phy : (statsBase.phy ?? 60);
        rec.grl = Math.round((pac + sho + pas + dri + def + phy) / 6);
      }
      item.grl = rec.grl;

      data.manager.entrenamiento[jug.id] = rec;
      resultado.jugadores.push(item);
    });

    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    return resultado;
  };

  // Entrenar
  function getUpgradeCost(valorActual) {
    return Math.floor(valorActual * 10);
  }

  let entrenarSeleccion = new Map();

  window.renderEntrenar = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    document.getElementById('entrenar-monedas').textContent = gameState.monedas;
    const container = document.getElementById('entrenar-stats');
    container.innerHTML = '';

    if (data.jugador) {
      const statKeys = [
        { key: 'tiro', icon: 'fa-futbol', label: 'Tiro' },
        { key: 'pase', icon: 'fa-bullseye', label: 'Pase' },
        { key: 'regate', icon: 'fa-bolt', label: 'Regate' },
        { key: 'vision', icon: 'fa-eye', label: 'Visión' }
      ];
      const stats = data.jugador.stats;
      statKeys.forEach(sk => {
        const val = stats[sk.key];
        const cost = getUpgradeCost(val);
        const puede = gameState.monedas >= cost && val < 99;
        container.innerHTML += `
          <div class="entrenar-stat">
            <div class="entrenar-stat-icon"><i class="fas ${sk.icon}"></i></div>
            <div class="entrenar-stat-info">
              <span class="stat-label">${sk.label}</span>
              <span class="stat-cost">Coste: 🪙 ${cost}</span>
            </div>
            <div class="entrenar-stat-value">${val}</div>
            <button class="btn-upgrade" data-stat="${sk.key}" ${!puede ? 'disabled' : ''}>+</button>
          </div>`;
      });
      return;
    }

    // Modo Manager: entrenamiento manual semanal
    if (!data.manager) return;
    const equipo = data.manager.equipo;
    const jugadores = getPlantillaEquipo(equipo);
    const yaEntrenado = entrenadoEstaSemana();

    let html = `<div class="entrenar-semana-banner ${yaEntrenado ? 'usado' : 'disponible'}">
      ${yaEntrenado
        ? '<i class="fas fa-check-circle"></i> Ya has entrenado esta semana. Juega el próximo partido para desbloquear el siguiente entrenamiento.'
        : '<i class="fas fa-bolt"></i> Entrenamiento disponible esta semana (GRATIS, 1 vez). Toca un jugador para añadirlo y elige sus stats.'}</div>`;

    jugadores.forEach(jug => {
      const grl = calcularGrlJugador(jug);
      const sel = entrenarSeleccion.get(jug.id);
      const activo = !!sel;
      const foto = jug.foto || 'assets/players/default.png';
      const statsKeys = jug.posicion === 'POR' ? ['div', 'han', 'kic', 'ref', 'spd', 'pos'] : ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
      const statsChips = statsKeys.map(k => {
        const val = jug.stats?.[k] ?? 60;
        const xp = data.manager.entrenamiento?.[jug.id]?.xp?.[k] || 0;
        const req = getXPRequired(val);
        const marcado = activo && sel.stats.has(k);
        const recomendado = !activo && getEnfoqueStats(jug.posicion).includes(k);
        return `<button class="entrenar-chip ${marcado ? 'marcado' : ''} ${recomendado ? 'recomendado' : ''}" onclick="event.stopPropagation(); toggleStatEntrenar('${jug.id}','${k}')">
          <span class="chip-stat">${k.toUpperCase()}</span><span class="chip-val">${val}</span><span class="chip-xp">${xp}/${req}</span>
        </button>`;
      }).join('');

      html += `<div class="entrenar-jugador ${activo ? 'activo' : ''}" onclick="toggleJugadorEntrenar('${jug.id}')">
        <div class="entrenar-jug-avatar">
          <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
          <i class="fas fa-user plantilla-avatar-fallback"></i>
        </div>
        <div class="entrenar-jug-info">
          <span class="entrenar-jug-nombre">${jug.nombre} <span class="${posColor(jug.posicion)}">${jug.posicion}</span></span>
          <span class="entrenar-jug-grl">GRL ${grl}</span>
          <div class="entrenar-chips">${statsChips}</div>
        </div>
        <span class="entrenar-check"><i class="fas ${activo ? 'fa-check-circle' : 'fa-circle'}"></i></span>
      </div>`;
    });

    html += `<button class="btn-bluelock btn-gold entrenar-btn" onclick="confirmarEntrenamiento()" ${yaEntrenado ? 'disabled' : ''}>
      <i class="fas fa-dumbbell"></i> ENTRENAR (GRATIS)
    </button>`;
    container.innerHTML = html;
  };

  window.toggleJugadorEntrenar = function (jugId) {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const jug = getJugador(jugId, data.manager?.equipo);
    if (!jug) return;
    if (entrenarSeleccion.has(jugId)) {
      entrenarSeleccion.delete(jugId);
    } else {
      entrenarSeleccion.set(jugId, { jug, stats: new Set(getEnfoqueStats(jug.posicion)) });
    }
    renderEntrenar();
  };

  window.toggleStatEntrenar = function (jugId, stat) {
    const sel = entrenarSeleccion.get(jugId);
    if (!sel) return;
    if (sel.stats.has(stat)) sel.stats.delete(stat);
    else sel.stats.add(stat);
    renderEntrenar();
  };

  window.confirmarEntrenamiento = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    if (entrenadoEstaSemana()) {
      mostrarModal('AVISO', 'Ya has entrenado esta semana. Juega el próximo partido para desbloquear el siguiente entrenamiento.');
      return;
    }
    const items = [];
    entrenarSeleccion.forEach(sel => {
      if (sel.stats.size > 0) items.push({ jug: sel.jug, stats: [...sel.stats] });
    });
    if (items.length === 0) {
      mostrarModal('AVISO', 'Selecciona al menos un jugador y sus stats para entrenar.');
      return;
    }
    const resultado = aplicarEntrenamientoManual(items);
    if (!resultado) return;
    marcarEntrenado();
    entrenarSeleccion.clear();
    renderEntrenar();
    mostrarProgresoSemanal(resultado);
  };

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-upgrade');
    if (!btn) return;
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (!data.jugador) return;
    const statKey = btn.dataset.stat;
    const stats = data.jugador.stats;
    if (stats[statKey] >= 99) return;
    const cost = getUpgradeCost(stats[statKey]);
    if (gameState.monedas < cost) return;
    stats[statKey]++;
    gameState.monedas -= cost;
    guardarEstado();
    renderEntrenar();
    reprobarGol();
  });

  // Clasificación
  function nombreEquipoPorId(teamId) {
    if (typeof NEO_EQUIPOS !== 'undefined') {
      const eq = NEO_EQUIPOS.find(e => e.id === teamId);
      if (eq) return eq.name;
    }
    if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
      const plantilla = PLANTILLAS_EQUIPO[teamId];
      if (plantilla && plantilla[0]?.equipo) return plantilla[0].equipo;
    }
    return teamId;
  }

  function escudoEquipoPorId(teamId) {
    if (typeof NEO_EQUIPOS !== 'undefined') {
      const eq = NEO_EQUIPOS.find(e => e.id === teamId);
      if (eq && eq.escudo) return eq.escudo;
    }
    return '';
  }

  function escudoEquipoPorNombre(nombre) {
    if (nombre && typeof NEO_EQUIPOS !== 'undefined') {
      const eq = NEO_EQUIPOS.find(e => e.name === nombre);
      if (eq && eq.escudo) return eq.escudo;
    }
    return '';
  }

  function htmlEscudoEquipo(nombre) {
    const escudo = escudoEquipoPorNombre(nombre);
    if (escudo) return `<img src="${escudo}" onerror="this.onerror=null;this.outerHTML='<i class=&quot;fas fa-shield-halved&quot;></i>';" alt="${nombre || ''}">`;
    let teamId = null;
    if (nombre && typeof NOMBRE_EQUIPO !== 'undefined') {
      for (const k of Object.keys(NOMBRE_EQUIPO)) {
        if (NOMBRE_EQUIPO[k] === nombre) { teamId = k; break; }
      }
    }
    const col = (teamId && typeof COLORES_EQUIPOS !== 'undefined' && COLORES_EQUIPOS[teamId])
      ? COLORES_EQUIPOS[teamId]
      : { p: '#334466', s: '#667799', forma: 'circulo' };
    return `<span class="clasificacion-logo-badge forma-${col.forma || 'circulo'}" style="background:linear-gradient(135deg,${col.p},${col.s})">${inicialesEquipo(nombre)}</span>`;
  }

  function inicialesEquipo(nombre) {
    if (!nombre) return '??';
    const palabras = nombre.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(w));
    const iniciales = palabras.slice(0, 2).map(w => w[0].toUpperCase()).join('');
    return iniciales || nombre.slice(0, 2).toUpperCase();
  }

  function tablaLigaHtml(equipos) {
    const clasif = gameState.estadoTemporada?.clasificacion || {};
    const filas = equipos.map(eq => {
      const nombre = nombreEquipoPorId(eq.id);
      const escudo = escudoEquipoPorId(eq.id);
      const prev = clasif[eq.id] || {};
      return {
        teamId: eq.id,
        nombre,
        escudo,
        pj: prev.pj || 0, pg: prev.pg || 0, pe: prev.pe || 0, pp: prev.pp || 0,
        gf: prev.gf || 0, gc: prev.gc || 0, pts: prev.pts || 0
      };
    });

    filas.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return (b.gf - b.gc) - (a.gf - a.gc);
    });

    let html = '<table class="clasificacion-table"><thead><tr><th>#</th><th>EQUIPO</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>PTS</th></tr></thead><tbody>';
    filas.forEach((eq, i) => {
      const posCls = i === 0 ? 'pos-1' : i === 1 ? 'pos-2' : i === 2 ? 'pos-3' : '';
      let escudoHtml;
      if (eq.escudo) {
        const extra = eq.teamId === 'monao' ? ' clasificacion-logo-shrink' : '';
        escudoHtml = `<img class="${extra.trim()}" src="${eq.escudo}" onerror="this.onerror=null;this.outerHTML='<i class=&quot;fas fa-shield-halved&quot;></i>';" alt="${eq.nombre}">`;
      } else {
        const col = (typeof COLORES_EQUIPOS !== 'undefined' && COLORES_EQUIPOS[eq.teamId])
          ? COLORES_EQUIPOS[eq.teamId]
          : { p: '#334466', s: '#667799', forma: 'circulo' };
        const forma = col.forma || 'circulo';
        escudoHtml = `<span class="clasificacion-logo-badge forma-${forma}" style="background:linear-gradient(135deg,${col.p},${col.s})">${inicialesEquipo(eq.nombre)}</span>`;
      }
      const logoCls = eq.escudo ? 'clasificacion-logo' : 'clasificacion-logo con-forma';
      html += `<tr class="${posCls}" onclick="verPlantillaClasificacion('${eq.teamId}')"><td>${i + 1}.</td><td class="clasificacion-equipo"><div class="${logoCls}">${escudoHtml}</div><span>${eq.nombre}</span></td><td>${eq.pj}</td><td>${eq.pg}</td><td>${eq.pe}</td><td>${eq.pp}</td><td>${eq.gf}</td><td>${eq.gc}</td><td class="clasificacion-pts">${eq.pts}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
  }

  window.renderClasificacion = function () {
    const container = document.getElementById('clasificacion-arbol');
    if (!container || typeof CONFIG_PAISES === 'undefined') return;

    if (!gameState.estadoTemporada) {
      try {
        const saved = localStorage.getItem('blue_lock_save');
        if (saved) {
          const d = JSON.parse(saved);
          if (d.tipo === 'manager' && d.manager?.temporada) {
            gameState.estadoTemporada = d.manager.temporada;
          }
        }
      } catch (e) { /* noop */ }
    }

    container.innerHTML = CONFIG_PAISES.map(pais => {
      const totalEq = pais.ligas.reduce((a, l) => a + l.equipos.length, 0);
      const abierto = clasificacionPaisesAbiertos.has(pais.id);
      const bodyHtml = pais.ligas.map(liga => `
        <div class="clas-liga">
          <div class="clas-liga-header">⚽ ${liga.nombre} <span class="clas-liga-count">${liga.equipos.length}</span></div>
          ${tablaLigaHtml(liga.equipos)}
        </div>`).join('');
      return `
        <div class="clas-pais${abierto ? ' open' : ''}">
          <div class="clas-pais-header" onclick="toggleClasificacionPais('${pais.id}')">
            <span class="clas-pais-bandera">${pais.bandera}</span>
            <span class="clas-pais-nombre">${pais.nombre}</span>
            <span class="clas-pais-count">${pais.ligas.length} ${pais.ligas.length === 1 ? 'liga' : 'ligas'} · ${totalEq} ${totalEq === 1 ? 'equipo' : 'equipos'}</span>
            <span class="clas-pais-chevron"><i class="fas fa-chevron-down"></i></span>
          </div>
          <div class="clas-pais-body">${bodyHtml}</div>
        </div>`;
    }).join('');
  };

  window.toggleClasificacionPais = function (paisId) {
    if (clasificacionPaisesAbiertos.has(paisId)) clasificacionPaisesAbiertos.delete(paisId);
    else clasificacionPaisesAbiertos.add(paisId);
    renderClasificacion();
  };

  function resultadosDeJornada(temporada, jornadaNum) {
    const registro = (temporada.partidosJugados || []).find(r => r.jornada === jornadaNum);
    if (!registro) return null;
    const partidos = [{ local: registro.local, visit: registro.visit, gl: registro.gl, gv: registro.gv }];
    (registro.fondo || []).forEach(f => partidos.push({ local: f.l, visit: f.v, gl: f.gl, gv: f.gv }));
    return partidos;
  }

  window.renderCalendario = function () {
    const container = document.getElementById('calendario-lista');
    const ligaEl = document.getElementById('calendario-liga');
    if (!container) return;
    container.innerHTML = '';
    if (ligaEl) ligaEl.textContent = '';

    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const { temporada, liga } = getTemporada(data);
    if (!liga) return;

    const ligaKey = liga.nombre;
    const eqManager = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
    if (!eqManager) return;
    const calendario = temporada.calendario[ligaKey];
    if (!calendario) return;

    if (ligaEl) ligaEl.textContent = `${liga.nombre} · JORNADA ${Math.min(temporada.jornadaActual + 1, calendario.length)}/${calendario.length}`;

    let html = '';
    calendario.forEach((jornada, idx) => {
      const jornadaNum = idx + 1;
      const jugada = idx < temporada.jornadaActual;
      const esActual = idx === temporada.jornadaActual;
      const resultados = resultadosDeJornada(temporada, jornadaNum);

      let body = '';
      jornada.forEach(([l, v]) => {
        const esPropio = l === eqManager.id || v === eqManager.id;
        const localHtml = `<span class="calendario-local"><span class="calendario-logo">${escudoHtmlPartido(l)}</span><span class="calendario-nombre">${nombreEquipoPorId(l)}</span></span>`;
        const visitHtml = `<span class="calendario-visit"><span class="calendario-nombre">${nombreEquipoPorId(v)}</span><span class="calendario-logo">${escudoHtmlPartido(v)}</span></span>`;
        let texto;
        if (jugada && resultados) {
          const r = resultados.find(p => (p.local === l && p.visit === v) || (p.local === v && p.visit === l));
          if (r) {
            texto = `${localHtml}
              <span class="calendario-resultado">${r.gl} - ${r.gv}</span>
              ${visitHtml}`;
          } else {
            texto = `${localHtml}
              <span class="calendario-resultado">—</span>
              ${visitHtml}`;
          }
        } else {
          texto = `${localHtml}
            <span class="calendario-resultado">VS</span>
            ${visitHtml}`;
        }
        body += `<div class="calendario-partido${esPropio ? ' propio' : ''}">${texto}</div>`;
      });

      const badge = jugada ? '<span class="calendario-badge jugado">JUGADO</span>'
        : esActual ? '<span class="calendario-badge actual">ACTUAL</span>'
        : '<span class="calendario-badge pendiente">PENDIENTE</span>';

      html += `<div class="calendario-jornada${esActual ? ' actual' : ''}">
        <div class="calendario-jornada-header">JORNADA ${jornadaNum} ${badge}</div>
        ${body}
      </div>`;
    });
    container.innerHTML = html;
  };

  const FORMACIONES_POS = {
    "4-3-3": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 45, slots: [{x:25, pos:"MCD"},{x:50, pos:"MC"},{x:75, pos:"MCO"}] },
      { y: 17, slots: [{x:20, pos:"EI"},{x:50, pos:"DC"},{x:80, pos:"ED"}] }
    ],
    "4-4-2": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 47, slots: [{x:12, pos:"EI"},{x:35, pos:"MC"},{x:65, pos:"MC"},{x:88, pos:"ED"}] },
      { y: 19, slots: [{x:35, pos:"DC"},{x:65, pos:"DC"}] }
    ],
    "3-5-2": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 72, slots: [{x:20, pos:"DFC"},{x:50, pos:"DFC"},{x:80, pos:"DFC"}] },
      { y: 49, slots: [{x:10, pos:"LI"},{x:28, pos:"MC"},{x:50, pos:"MCD"},{x:72, pos:"MC"},{x:90, pos:"LD"}] },
      { y: 19, slots: [{x:35, pos:"DC"},{x:65, pos:"DC"}] }
    ],
    "4-1-4-1": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 75, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 57, slots: [{x:50, pos:"MCD"}] },
      { y: 37, slots: [{x:12, pos:"EI"},{x:35, pos:"MCO"},{x:65, pos:"MCO"},{x:88, pos:"ED"}] },
      { y: 15, slots: [{x:50, pos:"DC"}] }
    ],
    "4-2-3-1": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 76, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 58, slots: [{x:35, pos:"MCD"},{x:65, pos:"MCD"}] },
      { y: 38, slots: [{x:12, pos:"EI"},{x:50, pos:"MCO"},{x:88, pos:"ED"}] },
      { y: 16, slots: [{x:50, pos:"DC"}] }
    ],
    "3-4-3": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 75, slots: [{x:22, pos:"DFC"},{x:50, pos:"DFC"},{x:78, pos:"DFC"}] },
      { y: 48, slots: [{x:18, pos:"MI"},{x:42, pos:"MC"},{x:58, pos:"MC"},{x:82, pos:"MD"}] },
      { y: 17, slots: [{x:20, pos:"EI"},{x:50, pos:"DC"},{x:80, pos:"ED"}] }
    ],
    "5-2-3": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 78, slots: [{x:10, pos:"CAD"},{x:30, pos:"DFC"},{x:50, pos:"DFC"},{x:70, pos:"DFC"},{x:90, pos:"CAI"}] },
      { y: 52, slots: [{x:35, pos:"MCD"},{x:65, pos:"MCD"}] },
      { y: 19, slots: [{x:20, pos:"EI"},{x:50, pos:"DC"},{x:80, pos:"ED"}] }
    ],
    "4-3-1-2": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 55, slots: [{x:25, pos:"MC"},{x:50, pos:"MCD"},{x:75, pos:"MC"}] },
      { y: 38, slots: [{x:50, pos:"MCO"}] },
      { y: 16, slots: [{x:38, pos:"DC"},{x:62, pos:"DC"}] }
    ],
    "5-3-2": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 78, slots: [{x:10, pos:"CAD"},{x:30, pos:"DFC"},{x:50, pos:"DFC"},{x:70, pos:"DFC"},{x:90, pos:"CAI"}] },
      { y: 52, slots: [{x:22, pos:"MC"},{x:50, pos:"MCD"},{x:78, pos:"MC"}] },
      { y: 18, slots: [{x:38, pos:"DC"},{x:62, pos:"DC"}] }
    ],
    "3-4-2-1": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 75, slots: [{x:22, pos:"DFC"},{x:50, pos:"DFC"},{x:78, pos:"DFC"}] },
      { y: 52, slots: [{x:12, pos:"MI"},{x:35, pos:"MC"},{x:65, pos:"MC"},{x:88, pos:"MD"}] },
      { y: 34, slots: [{x:38, pos:"SD"},{x:62, pos:"SD"}] },
      { y: 16, slots: [{x:50, pos:"DC"}] }
    ],
    "4-2-2-2": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 58, slots: [{x:35, pos:"MCD"},{x:65, pos:"MCD"}] },
      { y: 38, slots: [{x:28, pos:"MCO"},{x:72, pos:"MCO"}] },
      { y: 16, slots: [{x:38, pos:"DC"},{x:62, pos:"DC"}] }
    ],
    "4-5-1": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 52, slots: [{x:12, pos:"MI"},{x:28, pos:"MC"},{x:50, pos:"MCD"},{x:72, pos:"MC"},{x:88, pos:"MD"}] },
      { y: 17, slots: [{x:50, pos:"DC"}] }
    ],
    "4-3-2-1": [
      { y: 90, slots: [{x:50, pos:"POR"}] },
      { y: 77, slots: [{x:15, pos:"LI"},{x:35, pos:"DFC"},{x:65, pos:"DFC"},{x:85, pos:"LD"}] },
      { y: 58, slots: [{x:22, pos:"MCD"},{x:50, pos:"MC"},{x:78, pos:"MCD"}] },
      { y: 37, slots: [{x:35, pos:"MCO"},{x:65, pos:"MCO"}] },
      { y: 16, slots: [{x:50, pos:"DC"}] }
    ]
  };

  let slotSeleccionado = null;
  let subSeleccionado = null;

  window.renderTactica = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    document.getElementById('tactica-equipo').textContent = data.manager.equipo;

    if (!data.manager.tactica) {
      const jugadores = getPlantillaEquipo(data.manager.equipo);
      const eq = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.name === data.manager.equipo) : null;
      const formacion = eq?.formation || '4-3-3';
      const { once, banca } = elegirMejorOnce(jugadores, formacion);
      data.manager.tactica = { formacion, once, banca };
      localStorage.setItem('blue_lock_save', JSON.stringify(data));
    }
    slotSeleccionado = null;
    subSeleccionado = null;
    document.querySelectorAll('.tactica-formation-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.form === data.manager.tactica.formacion);
    });
    renderCampo();
    renderSuplentes();
  };

  function getJugador(id, equipo) {
    const fichajes = getFichajes();
    if (fichajes.length > 0) {
      const f = fichajes.find(p => p.id === id);
      if (f) return aplicarEstamina(aplicarEntrenamiento(f), teamIdPorNombre(equipo));
    }
    if (equipo && typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        const plantilla = PLANTILLAS_EQUIPO[key];
        if (plantilla[0]?.equipo === equipo || !equipo) {
          const found = plantilla.find(p => p.id === id);
          if (found) return aplicarEstamina(aplicarEntrenamiento(normalizarJugador(found)), key);
          if (plantilla[0]?.equipo === equipo) break;
        }
      }
    }
    return null;
  }

  function normalizarJugador(j) {
    if (!j) return j;
    if (!j.foto) j.foto = `assets/players/${j.id}.png`;
    if (typeof j.estamina !== 'number') j.estamina = 100;
    if (j.pierna) j.pie = j.pierna;
    if (j.altura && typeof j.altura === 'string') j.altura = parseInt(j.altura) || j.altura;
    if (j.stats) {
      if (j.posicion === 'POR') {
        j.div = j.stats.div ?? j.div;
        j.han = j.stats.han ?? j.han;
        j.kic = j.stats.kic ?? j.kic;
        j.ref = j.stats.ref ?? j.ref;
        j.spd = j.stats.spd ?? j.spd;
        j.pos = j.stats.pos ?? j.pos;
      } else {
        j.tiro = j.stats.sho ?? j.tiro;
        j.pase = j.stats.pas ?? j.pase;
        j.regate = j.stats.dri ?? j.regate;
        j.defensa = j.stats.def ?? j.defensa;
        j.pac = j.stats.pac ?? j.pac;
        j.phy = j.stats.phy ?? j.phy;
      }
      if (j.posicionSecundaria) j.posicionSec = j.posicionSecundaria;
    }
    return j;
  }

  function aplicarEntrenamiento(jug) {
    if (!jug || !jug.id) return jug;
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return jug;
      const data = JSON.parse(saved);
      const rec = data.manager?.entrenamiento?.[jug.id];
      if (!rec || !rec.stats) return jug;
      const copia = { ...jug, stats: { ...(jug.stats || {}) } };
      if (jug.posicion === 'POR') {
        ['div', 'han', 'kic', 'ref', 'spd', 'pos'].forEach(k => {
          if (typeof rec.stats[k] === 'number') copia.stats[k] = rec.stats[k];
        });
        copia.div = copia.stats.div ?? jug.div;
        copia.han = copia.stats.han ?? jug.han;
        copia.kic = copia.stats.kic ?? jug.kic;
        copia.ref = copia.stats.ref ?? jug.ref;
        copia.spd = copia.stats.spd ?? jug.spd;
        copia.pos = copia.stats.pos ?? jug.pos;
      } else {
        ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(k => {
          if (typeof rec.stats[k] === 'number') copia.stats[k] = rec.stats[k];
        });
        copia.tiro = copia.stats.sho ?? jug.tiro;
        copia.pase = copia.stats.pas ?? jug.pase;
        copia.regate = copia.stats.dri ?? jug.regate;
        copia.defensa = copia.stats.def ?? jug.defensa;
        copia.pac = copia.stats.pac ?? jug.pac;
        copia.phy = copia.stats.phy ?? jug.phy;
      }
      if (typeof rec.grl === 'number') copia.grl = rec.grl;
      return copia;
    } catch (e) {
      return jug;
    }
  }

  function getFichajes() {
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return [];
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager?.fichajes) return [];
      const vendidos = data.manager.vendidos || [];
      return data.manager.fichajes.map(normalizarJugador).filter(f => !vendidos.includes(f.id));
    } catch (e) {
      return [];
    }
  }

  function getPlantillaEquipo(equipo) {
    let base = [];
    let teamId = teamIdPorNombre(equipo);
    if (equipo && typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        const plantilla = PLANTILLAS_EQUIPO[key];
        if (plantilla[0]?.equipo === equipo) {
          teamId = key;
          base = plantilla.map(normalizarJugador).map(aplicarEntrenamiento).map(p => aplicarEstamina(p, key));
          break;
        }
      }
    }
    if (equipo) {
      const vendidos = [];
      try {
        const saved = localStorage.getItem('blue_lock_save');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.manager?.vendidos) vendidos.push(...data.manager.vendidos);
        }
      } catch (e) { /* noop */ }
      base = base.filter(p => !vendidos.includes(p.id));
      const fichajes = getFichajes().filter(f => f.equipo === equipo && !base.some(p => p.id === f.id));
      return base.concat(fichajes.map(p => aplicarEstamina(aplicarEntrenamiento(p), teamId)));
    }
    return base;
  }

  function posColor(pos) {
    const map = {
      POR: 'pos-purple',
      DFC: 'pos-red', LD: 'pos-red', LI: 'pos-red', CAI: 'pos-red', CAD: 'pos-red',
      MCD: 'pos-orange', MC: 'pos-orange', MCO: 'pos-orange', MI: 'pos-orange', MD: 'pos-orange',
      DC: 'pos-green', EI: 'pos-green', ED: 'pos-green', SD: 'pos-green'
    };
    return map[pos] || '';
  }

  function renderizarFilaJugador(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    return `<div class="pfila">
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
      </div>
      <div class="pfila-stats">
        <div class="pfila-stat"><span>SHO</span>${jug.tiro}</div>
        <div class="pfila-stat"><span>PAS</span>${jug.pase}</div>
        <div class="pfila-stat"><span>DRI</span>${jug.regate}</div>
        <div class="pfila-stat"><span>DEF</span>${jug.defensa}</div>
      </div>
    </div>`;
  }

  function pieTexto(jug) {
    return jug.pie || jug.pierna || '—';
  }

  function renderizarFilaInfo(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const bandera = jug.bandera || '';
    const pie = pieTexto(jug);
    const tieneLogoClub = !!escudoEquipoPorNombre(jug.equipo);
    return `<div class="pfila pfila-info-row">
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
        <span class="pfila-valor">${formatearYenes(calcularValor(grl, jug))}</span>
      </div>
      <div class="pfila-extra">
        <span class="pfila-club-logo ${tieneLogoClub ? '' : 'con-forma'}">
          ${htmlEscudoEquipo(jug.equipo)}
        </span>
        <span class="pfila-extra-col">
          <span class="pfila-extra-item">${bandera} ${jug.nacionalidad || '—'}</span>
          <span class="pfila-extra-item"><i class="fas fa-shoe-prints"></i> ${pie}</span>
        </span>
      </div>
    </div>`;
  }

  function renderizarFilaStats(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const esPOR = jug.posicion === 'POR';
    const statsHtml = esPOR
      ? `<div class="pfila-stat"><span>DIV</span>${jug.div || 60}</div>
         <div class="pfila-stat"><span>HAN</span>${jug.han || 60}</div>
         <div class="pfila-stat"><span>KIC</span>${jug.kic || 60}</div>
         <div class="pfila-stat"><span>REF</span>${jug.ref || 60}</div>
         <div class="pfila-stat"><span>SPD</span>${jug.spd || 60}</div>
         <div class="pfila-stat"><span>POS</span>${jug.pos || 60}</div>`
      : `<div class="pfila-stat"><span>PAC</span>${jug.pac || 60}</div>
         <div class="pfila-stat"><span>SHO</span>${jug.tiro}</div>
         <div class="pfila-stat"><span>PAS</span>${jug.pase}</div>
         <div class="pfila-stat"><span>DRI</span>${jug.regate}</div>
         <div class="pfila-stat"><span>DEF</span>${jug.defensa}</div>
         <div class="pfila-stat"><span>PHY</span>${jug.phy || 60}</div>`;
    return `<div class="pfila pfila-stats-row">
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
        <span class="pfila-valor">${formatearYenes(calcularValor(grl, jug))}</span>
      </div>
      <div class="pfila-stats">
        ${statsHtml}
      </div>
    </div>`;
  }

  function renderizarFichaGrandeJugador(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    function bar(val) {
      const pct = Math.round((val / 100) * 100);
      return `<div class="ficha-stat-box"><span class="ficha-stat-label">${val}</span><div class="ficha-stat-bar"><div class="ficha-stat-fill" style="width:${pct}%"></div></div></div>`;
    }
    const esPOR = jug.posicion === 'POR';
    const statsGrid = esPOR
      ? `<div class="ficha-stat-cat"><span class="ficha-stat-title">ESTIRADA</span>${bar(jug.div || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">PARADA</span>${bar(jug.han || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">SAQUE</span>${bar(jug.kic || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">REFLEJOS</span>${bar(jug.ref || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">VELOCIDAD</span>${bar(jug.spd || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">POSICIÓN</span>${bar(jug.pos || 60)}</div>`
      : `<div class="ficha-stat-cat"><span class="ficha-stat-title">VELOCIDAD</span>${bar(jug.pac || 60)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">TIRO</span>${bar(jug.tiro)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">PASE</span>${bar(jug.pase)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">REGATE</span>${bar(jug.regate)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">DEFENSA</span>${bar(jug.defensa)}</div>
         <div class="ficha-stat-cat"><span class="ficha-stat-title">FÍSICO</span>${bar(jug.phy || 60)}</div>`;
    return `<div class="mi-egoista-card">
      <div class="ficha-header"><span>BLUE LOCK PROJECT</span></div>
      <div class="ficha-top">
        <div class="ficha-data-grid">
          <div class="ficha-row"><div class="ficha-label">FULL NAME</div><div class="ficha-value">${jug.nombre.toUpperCase()}</div></div>
          <div class="ficha-row"><div class="ficha-label">POSITION</div><div class="ficha-value">${jug.posicion}</div></div>
          <div class="ficha-row"><div class="ficha-label">SEC. POSITION</div><div class="ficha-value">${jug.posicionSec || '—'}</div></div>
          <div class="ficha-row"><div class="ficha-label">DOM. FOOT</div><div class="ficha-value">${pieTexto(jug)}</div></div>
          <div class="ficha-row"><div class="ficha-label">GRL</div><div class="ficha-value">${grl}</div></div>
        </div>
        <div class="ficha-photo">
          <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        </div>
      </div>
      <div class="ficha-stats-grid">
        ${statsGrid}
      </div>
    </div>`;
  }

  function renderizarCartaJugador(jug, compact) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const nombreParts = jug.nombre.split(' ');
    const apellido = nombreParts.length > 1 ? nombreParts.slice(1).join(' ') : jug.nombre;
    return `<div class="ut-card ${compact ? 'compact' : ''}">
      <div class="ut-top">
        <div class="ut-left">
          <span class="ut-grl">${grl}</span>
          <span class="ut-pos ${posColor(jug.posicion)}">${jug.posicion}</span>
          ${jug.posicionSec ? `<span class="ut-pos-sec ${posColor(jug.posicionSec)}">${jug.posicionSec}</span>` : ''}
        </div>
        <div class="ut-right">
          <span class="ut-icon-ego"><i class="fas fa-bolt"></i></span>
        </div>
      </div>
      <div class="ut-photo">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user ut-photo-fallback"></i>
      </div>
      <div class="ut-name">${apellido}</div>
      <div class="ut-stats">
        <div class="ut-stat"><span class="ut-stat-label">PAC</span><span class="ut-stat-val">${jug.pac || 60}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">SHO</span><span class="ut-stat-val">${jug.tiro}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">PAS</span><span class="ut-stat-val">${jug.pase}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">DRI</span><span class="ut-stat-val">${jug.regate}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">DEF</span><span class="ut-stat-val">${jug.defensa}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">PHY</span><span class="ut-stat-val">${jug.phy || 60}</span></div>
      </div>
    </div>`;
  }

  function estaminaHtml(jug) {
    if (!jug) return '';
    const est = typeof jug.estamina === 'number' ? jug.estamina : 100;
    const cls = est >= 60 ? 'alta' : est >= 30 ? 'media' : 'baja';
    return `<div class="tslot-stamina">
      <div class="tslot-stamina-fill ${cls}" style="width:${est}%"></div>
      <span>${est}</span>
    </div>`;
  }

  // ===== MEJOR ONCE POR POSICIÓN =====
  const STAT_CLAVE_POSICION = {
    POR: 'por', DFC: 'def', LD: 'def', LI: 'def', CAD: 'def', CAI: 'def',
    MCD: 'def', MC: 'pas', MCO: 'pas', MI: 'dri', MD: 'dri',
    EI: 'dri', ED: 'dri', SD: 'sho', DC: 'sho'
  };

  const POS_COMPATIBLES = {
    DFC: ['MCD', 'LD', 'LI', 'CAD', 'CAI'],
    LD: ['CAD', 'DFC'], LI: ['CAI', 'DFC'],
    CAD: ['LD', 'DFC'], CAI: ['LI', 'DFC'],
    MCD: ['MC', 'DFC'], MC: ['MCD', 'MCO'], MCO: ['MC', 'SD', 'MI', 'MD'],
    MI: ['MC', 'EI', 'MD'], MD: ['MC', 'ED', 'MI'],
    EI: ['MI', 'ED', 'SD'], ED: ['MD', 'EI', 'SD'],
    SD: ['MCO', 'DC'], DC: ['SD', 'EI', 'ED']
  };

  function statJugador(jug, key) {
    if (!jug) return 0;
    if (key === 'por') {
      return Math.round(((jug.div || 60) + (jug.han || 60) + (jug.kic || 60) + (jug.ref || 60) + (jug.spd || 60) + (jug.pos || 60)) / 6);
    }
    const val = Number(jug.stats?.[key] ?? jug[key] ?? 50);
    const pac = Number(jug.stats?.pac ?? jug.pac ?? 50);
    return val + pac * 0.05;
  }

  function posicionesDeJugador(jug) {
    const lista = [];
    if (jug?.posicion) lista.push(jug.posicion);
    if (jug?.posicionSec) {
      String(jug.posicionSec).split('/').forEach(p => {
        const t = p.trim();
        if (t) lista.push(t);
      });
    }
    return lista;
  }

  function elegirMejorOnce(plantilla, formacion) {
    const plant = (plantilla || []).slice();
    const slots = (FORMACIONES_POS[formacion] || FORMACIONES_POS['4-3-3'])
      .flatMap(fila => fila.slots.map(s => s.pos));
    const usados = new Set();
    const resultado = [];

    function mejorDe(candidatos, posSlot) {
      let mejor = null;
      let mejorScore = -1;
      candidatos.forEach(j => {
        if (!j || usados.has(j.id)) return;
        const score = statJugador(j, STAT_CLAVE_POSICION[posSlot] || 'grl');
        if (score > mejorScore) { mejorScore = score; mejor = j; }
      });
      if (mejor) usados.add(mejor.id);
      return mejor;
    }

    slots.forEach(posSlot => {
      const exactos = plant.filter(j => posicionesDeJugador(j).includes(posSlot));
      const j = mejorDe(exactos, posSlot);
      resultado.push(j ? j.id : null);
    });

    slots.forEach((posSlot, idx) => {
      if (resultado[idx]) return;
      const comps = POS_COMPATIBLES[posSlot] || [];
      for (const cp of comps) {
        const candidatos = plant.filter(j => posicionesDeJugador(j).includes(cp));
        const j = mejorDe(candidatos, posSlot);
        if (j) { resultado[idx] = j.id; break; }
      }
    });

    slots.forEach((posSlot, idx) => {
      if (resultado[idx]) return;
      const j = mejorDe(plant, posSlot);
      if (j) resultado[idx] = j.id;
    });

    const once = resultado.filter(Boolean);
    const banca = plant.filter(p => !usados.has(p.id)).map(p => p.id);
    return { once, banca };
  }

  function renderCampo() {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const tactica = data.manager.tactica;
    const equipo = data.manager.equipo;
    const pos = FORMACIONES_POS[tactica.formacion];
    const pitch = document.getElementById('tactica-pitch');
    let idx = 0;
    let html = '';
    pos.forEach(fila => {
      fila.slots.forEach(slot => {
        const jugId = tactica.once[idx];
        const jug = getJugador(jugId, equipo);
        const selected = slotSeleccionado === idx;
        const nombreParts = (jug?.nombre || '').split(' ');
        const nombreMostrar = nombreParts.length > 1 ? nombreParts.slice(1).join(' ') : (jug?.nombre || '—');
        html += `<div class="tactica-slot ${selected ? 'selected' : ''}" style="top:${fila.y}%;left:${slot.x}%;" data-idx="${idx}" onclick="clickSlot(${idx})" ondblclick="abrirFichaJugador('${jugId}')">
          <div class="tslot-grl">${calcularGrlJugador(jug)}</div>
          <div class="tslot-avatar">
            <img src="${jug?.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug?.nombre || ''}">
          </div>
          <div class="tslot-info">
            <span class="tslot-pos ${posColor(slot.pos) || ''}">${slot.pos || jug?.posicion || ''}</span>
            <span class="tslot-name">${nombreMostrar}</span>
            ${estaminaHtml(jug)}
          </div>
        </div>`;
        idx++;
      });
    });
    pitch.innerHTML = html;
  }

  function renderSuplentes() {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const tactica = data.manager.tactica;
    const equipo = data.manager.equipo;
    const grid = document.getElementById('tactica-subs');
    let html = '';
    tactica.banca.forEach((jugId, bidx) => {
      const jug = getJugador(jugId, equipo);
      if (!jug) return;
      const selected = subSeleccionado === bidx;
      html += `<div class="tactica-sub-card ${selected ? 'selected' : ''}" onclick="clickSub('${jugId}', ${bidx})" ondblclick="abrirFichaJugador('${jugId}')">
        <div class="tslot-grl" style="position:static;width:30px;font-size:0.7rem;">${calcularGrlJugador(jug)}</div>
        <div class="tslot-avatar">
          <img src="${jug.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        </div>
        <div class="tslot-info" style="flex:1;align-items:flex-start;">
          <span class="tslot-pos ${posColor(jug.posicion)}">${jug.posicion}</span>
          <span class="tslot-name" style="max-width:none;font-size:0.65rem;">${jug.nombre}</span>
          ${estaminaHtml(jug)}
        </div>
        <i class="fas fa-exchange-alt swap-icon"></i>
      </div>`;
    });
    grid.innerHTML = html;
  }

  window.clickSlot = function (idx) {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const tactica = data.manager.tactica;

    if (subSeleccionado !== null) {
      const subId = tactica.banca[subSeleccionado];
      const titularId = tactica.once[idx];
      tactica.once[idx] = subId;
      tactica.banca[subSeleccionado] = titularId;
      slotSeleccionado = null;
      subSeleccionado = null;
      localStorage.setItem('blue_lock_save', JSON.stringify(data));
      renderCampo();
      renderSuplentes();
      return;
    }

    if (slotSeleccionado === null) {
      slotSeleccionado = idx;
    } else if (slotSeleccionado === idx) {
      slotSeleccionado = null;
    } else {
      [tactica.once[slotSeleccionado], tactica.once[idx]] = [tactica.once[idx], tactica.once[slotSeleccionado]];
      slotSeleccionado = null;
    }
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    renderCampo();
    renderSuplentes();
  };

  window.clickSub = function (jugId, bidx) {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    const tactica = data.manager.tactica;

    if (slotSeleccionado !== null) {
      const titularId = tactica.once[slotSeleccionado];
      tactica.once[slotSeleccionado] = jugId;
      const bancaIdx = tactica.banca.indexOf(jugId);
      if (bancaIdx !== -1) tactica.banca[bancaIdx] = titularId;
      slotSeleccionado = null;
      subSeleccionado = null;
      localStorage.setItem('blue_lock_save', JSON.stringify(data));
      renderCampo();
      renderSuplentes();
      return;
    }

    if (subSeleccionado === null) {
      subSeleccionado = bidx;
    } else if (subSeleccionado === bidx) {
      subSeleccionado = null;
    } else {
      [tactica.banca[subSeleccionado], tactica.banca[bidx]] = [tactica.banca[bidx], tactica.banca[subSeleccionado]];
      subSeleccionado = null;
    }
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    renderCampo();
    renderSuplentes();
  };

  window.cambiarFormacion = function (form) {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    data.manager.tactica.formacion = form;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    document.querySelectorAll('.tactica-formation-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.form === form);
    });
    slotSeleccionado = null;
    subSeleccionado = null;
    renderCampo();
    renderSuplentes();
  };

  window.guardarAlineacion = function () {
    guardarEstado();
  };

  // ===== MERCADO DE FICHAJES =====
  function calcularValor(grl, jug) {
    if (jug && typeof VALORES_JUGADOR !== 'undefined' && VALORES_JUGADOR[jug.id]) {
      return VALORES_JUGADOR[jug.id];
    }
    const g = grl || 60;
    if (g >= 95) return 600000000 + Math.round((g - 95) * 60000000);
    if (g >= 90) return 400000000 + Math.round((g - 90) * 40000000);
    if (g >= 85) return 180000000 + Math.round((g - 85) * 24000000);
    if (g >= 80) return 90000000 + Math.round((g - 80) * 18000000);
    if (g >= 70) return 40000000 + Math.round((g - 70) * 5000000);
    return 10000000 + Math.round((g - 50) * 750000);
  }

  function calcularSalario(grl, jug) {
    return Math.round(calcularValor(grl, jug) * 0.1);
  }

  function formatearYenes(n) {
    if (typeof n !== 'number') return '—';
    if (n >= 1000000000) return `¥${(n / 1000000000).toFixed(1).replace('.', ',')}B`;
    if (n >= 1000000) return `¥${Math.round(n / 1000000)}M`;
    return `¥${n}`;
  }

  function getEquipoIdDeJugador(jug) {
    if (!jug || typeof PLANTILLAS_EQUIPO === 'undefined') return null;
    for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
      if (PLANTILLAS_EQUIPO[key].some(p => p.id === jug.id)) return key;
    }
    return null;
  }

  function divisionDeJugador(jug) {
    const eqId = getEquipoIdDeJugador(jug);
    if (!eqId || typeof DIVISIONES === 'undefined') return null;
    if (DIVISIONES.primera?.equipos?.includes(eqId)) return 'primera';
    if (DIVISIONES.segunda?.equipos?.includes(eqId)) return 'segunda';
    if (DIVISIONES.institutos?.equipos?.includes(eqId)) return 'institutos';
    return null;
  }

  function getPresupuestoManager() {
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return 0;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return 0;
      if (typeof data.manager.presupuesto !== 'number') {
        const eq = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
        data.manager.presupuesto = eq?.budget ?? 5000000000;
        if (!data.manager.fichajes) data.manager.fichajes = [];
        localStorage.setItem('blue_lock_save', JSON.stringify(data));
      } else if (data.manager.presupuesto < 10000) {
        data.manager.presupuesto = data.manager.presupuesto * 1000000;
        localStorage.setItem('blue_lock_save', JSON.stringify(data));
      }
      return data.manager.presupuesto;
    } catch (e) {
      return 0;
    }
  }

  function todosLosJugadores() {
    const lista = [];
    if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        PLANTILLAS_EQUIPO[key].forEach(p => lista.push(normalizarJugador(p)));
      }
    }
    return lista;
  }

  let mercadoFiltro = { posicion: '', division: '', orden: 'grl' };

  const MERCADO_LABELS = {
    posicion: {
      '': 'Posición',
      POR: 'POR', DFC: 'DFC', LI: 'LI', LD: 'LD', CAI: 'CAI', CAD: 'CAD',
      MCD: 'MCD', MC: 'MC', MCO: 'MCO', MI: 'MI', MD: 'MD',
      EI: 'EI', ED: 'ED', SD: 'SD', DC: 'DC'
    },
    division: {
      '': 'División',
      primera: 'LIGA NEL',
      segunda: 'LIGA PRO',
      institutos: 'INSTITUTOS'
    },
    orden: {
      grl: 'Mayor GRL',
      precio: 'Menor Precio',
      nombre: 'Nombre'
    }
  };

  window.toggleFiltroDropdown = function (campo) {
    const panel = document.getElementById(`mercado-${campo}-panel`);
    if (!panel) return;
    const estaAbierto = panel.classList.contains('open');
    document.querySelectorAll('.mercado-drop-panel').forEach(p => p.classList.remove('open'));
    if (!estaAbierto) panel.classList.add('open');
  };

  window.setFiltroMercado = function (campo, valor) {
    mercadoFiltro[campo] = valor;
    const label = document.getElementById(`mercado-${campo}-label`);
    if (label) label.textContent = MERCADO_LABELS[campo]?.[valor] || '—';
    const panel = document.getElementById(`mercado-${campo}-panel`);
    if (panel) {
      panel.querySelectorAll('.mercado-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.val === valor);
      });
      panel.classList.remove('open');
    }
    filtrarMercado();
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mercado-dropdown')) {
      document.querySelectorAll('.mercado-drop-panel.open').forEach(p => p.classList.remove('open'));
    }
  });

  function sincronizarLabelsMercado() {
    ['posicion', 'division', 'orden'].forEach(campo => {
      const label = document.getElementById(`mercado-${campo}-label`);
      if (label) label.textContent = MERCADO_LABELS[campo]?.[mercadoFiltro[campo]] || '—';
      const panel = document.getElementById(`mercado-${campo}-panel`);
      if (panel) {
        panel.querySelectorAll('.mercado-opt').forEach(o => {
          o.classList.toggle('active', o.dataset.val === mercadoFiltro[campo]);
        });
      }
    });
  }

  window.renderMercado = function () {
    getPresupuestoManager();
    document.getElementById('mercado-presupuesto').textContent = formatearYenes(getPresupuestoManager());
    const buscar = document.getElementById('mercado-buscar');
    if (buscar) buscar.value = '';
    sincronizarLabelsMercado();
    filtrarMercado();
  };

  window.filtrarMercado = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const equipo = data.manager.equipo;

    const base = getPlantillaEquipo(equipo);
    const idsPropios = new Set(base.map(p => p.id));

    let jugadores = todosLosJugadores().filter(p => !idsPropios.has(p.id));

    const texto = (document.getElementById('mercado-buscar')?.value || '').trim().toLowerCase();
    if (texto) jugadores = jugadores.filter(p => p.nombre.toLowerCase().includes(texto));

    const pos = mercadoFiltro.posicion;
    if (pos) jugadores = jugadores.filter(p => p.posicion === pos);

    const div = mercadoFiltro.division;
    if (div) jugadores = jugadores.filter(p => divisionDeJugador(p) === div);

    const orden = mercadoFiltro.orden || 'grl';
    jugadores.forEach(p => {
      p._grl = calcularGrlJugador(p);
    });
    if (orden === 'grl') {
      jugadores.sort((a, b) => b._grl - a._grl);
    } else if (orden === 'precio') {
      jugadores.sort((a, b) => calcularValor(a._grl, a) - calcularValor(b._grl, b));
    } else {
      jugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    const hayFiltros = texto || pos || div || orden !== 'grl';
    if (!hayFiltros) jugadores = jugadores.slice(0, 12);

    const container = document.getElementById('mercado-lista');
    if (jugadores.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No se encontraron jugadores.</p>';
      return;
    }

    let html = '';
    jugadores.forEach(p => {
      html += `<div class="plantilla-card-wrapper" onclick="abrirFichaJugador('${p.id}')">
        ${renderizarFilaInfo(p)}
      </div>`;
    });
    container.innerHTML = html;
  };

  window.ficharJugador = function (jugadorId) {
    cerrarFicha();
    let saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    if (typeof data.manager.presupuesto !== 'number') {
      getPresupuestoManager();
      saved = localStorage.getItem('blue_lock_save');
      if (!saved) return;
      data = JSON.parse(saved);
    }
    const presupuesto = data.manager.presupuesto;

    const jug = todosLosJugadores().find(p => p.id === jugadorId);
    if (!jug) return;
    const grl = calcularGrlJugador(jug);
    const valor = calcularValor(grl, jug);

    if (presupuesto < valor) {
      mostrarModal('PRESUPUESTO INSUFICIENTE', `No tienes fondos suficientes para fichar a ${jug.nombre} (necesitas ${formatearYenes(valor)}).`);
      return;
    }

    data.manager.presupuesto = presupuesto - valor;
    if (!data.manager.fichajes) data.manager.fichajes = [];
    const nuevo = { ...jug, equipo: data.manager.equipo };
    data.manager.fichajes.push(nuevo);
    localStorage.setItem('blue_lock_save', JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = formatearYenes(data.manager.presupuesto);
    mostrarModal('¡FICHAJE COMPLETADO!', `¡Fichaje de ${jug.nombre} completado! Ha sido añadido a tu plantilla.`);
    filtrarMercado();
  };

  window.venderJugador = function (jugadorId) {
    cerrarFicha();
    let saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    if (typeof data.manager.presupuesto !== 'number') {
      getPresupuestoManager();
      saved = localStorage.getItem('blue_lock_save');
      if (!saved) return;
      data = JSON.parse(saved);
    }

    const jug = todosLosJugadores().find(p => p.id === jugadorId);
    if (!jug) return;
    const grl = calcularGrlJugador(jug);
    const valor = calcularValor(grl, jug);

    if (!data.manager.vendidos) data.manager.vendidos = [];
    if (!data.manager.vendidos.includes(jugadorId)) data.manager.vendidos.push(jugadorId);

    if (data.manager.fichajes) {
      data.manager.fichajes = data.manager.fichajes.filter(f => f.id !== jugadorId);
    }

    data.manager.presupuesto = (data.manager.presupuesto || 0) + valor;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = formatearYenes(data.manager.presupuesto);
    mostrarModal('¡JUGADOR VENDIDO!', `Has ofrecido a ${jug.nombre} a otros equipos por ${formatearYenes(valor)}.`);
    filtrarMercado();
  };

  // ===== ENTRENAMIENTO SEMANAL =====
  const ETIQUETAS_STATS = { pac: 'PAC', sho: 'SHO', pas: 'PAS', dri: 'DRI', def: 'DEF', phy: 'PHY' };

  // ===== SIMULADOR DE JORNADA (MODO CARRERA MANAGER) =====
  function aplicarResultado(clasif, localId, visitId, gl, gv) {
    const l = clasif[localId] || (clasif[localId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 });
    const v = clasif[visitId] || (clasif[visitId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 });
    l.pj++; v.pj++;
    l.gf += gl; l.gc += gv;
    v.gf += gv; v.gc += gl;
    if (gl > gv) { l.pg++; v.pp++; l.pts += 3; }
    else if (gl < gv) { v.pg++; l.pp++; v.pts += 3; }
    else { l.pe++; v.pe++; l.pts += 1; v.pts += 1; }
  }

  function simularPartidoFondo(localNombre, visitNombre) {
    const gl = calcularTeamGrl(localNombre);
    const gv = calcularTeamGrl(visitNombre);
    const dif = gl - gv;
    const factorLocal = 3;
    const sesgo = (dif + factorLocal) / 8;
    const golesLocal = Math.max(0, Math.round(sesgo + (Math.random() * 2.4) - 1));
    const golesVisit = Math.max(0, Math.round((Math.random() * 2.2) - 1.1 - sesgo / 2));
    return [Math.min(golesLocal, 5), Math.min(golesVisit, 5)];
  }

  function escudoHtmlPartido(teamId) {
    const escudo = escudoEquipoPorId(teamId);
    if (escudo) {
      return `<img src="${escudo}" onerror="this.onerror=null;this.style.display='none'" alt="">`;
    }
    const nombre = nombreEquipoPorId(teamId);
    const col = (typeof COLORES_EQUIPOS !== 'undefined' && COLORES_EQUIPOS[teamId])
      ? COLORES_EQUIPOS[teamId]
      : { p: '#334466', s: '#667799', forma: 'circulo' };
    return `<span class="clasificacion-logo-badge forma-${col.forma || 'circulo'}" style="background:linear-gradient(135deg,${col.p},${col.s})">${inicialesEquipo(nombre)}</span>`;
  }

  function escribirLogPartido(texto, clase) {
    const log = document.getElementById('partido-log');
    if (!log) return;
    const div = document.createElement('div');
    div.className = 'partido-log-item' + (clase ? ' ' + clase : '');
    div.textContent = texto;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  window.cancelarSimulacionPartido = function () {
    partidoCtx = null;
    partidoTurno = 0;
    goBack();
  };

  window.verClasificacionTrasPartido = function () {
    renderClasificacion();
    showScreen('screen-clasificacion');
  };

  window.volverAlHubTrasPartido = function () {
    navHistory.length = 0;
    showScreen('screen-hub');
    renderHub();
  };

  const TURNOS_PARTIDO = [
    { tipo: 'ataque', minuto: 8 },
    { tipo: 'defensa', minuto: 22 },
    { tipo: 'ataque', minuto: 38 },
    { tipo: 'defensa', minuto: 55 },
    { tipo: 'ataque', minuto: 70 },
    { tipo: 'defensa', minuto: 85 }
  ];

  let partidoTurno = 0;
  let partidoGolesLocal = 0;
  let partidoGolesVisit = 0;
  let partidoCtx = null;

  function partidoJugadoresDelOnce(equipoNombre) {
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return [];
      const d = JSON.parse(saved);
      const once = d.manager?.tactica?.once || [];
      return once.map(id => getJugador(id, equipoNombre)).filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function elegirPorRol(plantilla, roles) {
    const candidatos = plantilla.filter(p => p.posicion !== 'POR' && roles.includes(p.posicion));
    const pool = candidatos.length ? candidatos : plantilla.filter(p => p.posicion !== 'POR');
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const CRUCES = {
    DRI: ['DEF', 'PHY'],
    SHO: ['DEF', 'PHY'],
    PAC: ['PAC', 'DEF'],
    PAS: ['DEF', 'PAC'],
    PHY: ['PHY', 'DEF'],
    DEF: ['DEF', 'PHY']
  };

  const ETIQUETA_STAT = { PAC: 'Ritmo', SHO: 'Tiro', PAS: 'Pase', DRI: 'Regate', DEF: 'Defensa', PHY: 'Físico' };
  const PROB_GOL = { SHO: 0.55, DRI: 0.40, PAC: 0.35, PAS: 0.30, PHY: 0.20, DEF: 0.15 };

  function statDeJugador(jug, stat) {
    if (!jug) return 50;
    return Number(jug.stats?.[stat.toLowerCase()] ?? jug[stat.toLowerCase()] ?? 50);
  }

  function armaActivada(jug, stat) {
    const armas = (typeof ARMAS_DATABASE !== 'undefined') ? (ARMAS_DATABASE[jug?.id] || []) : [];
    let total = 0;
    let nombre = '';
    armas.forEach(a => {
      if (a.stats && typeof a.stats[stat.toLowerCase()] === 'number') {
        total += a.stats[stat.toLowerCase()];
        if (!nombre) nombre = a.name;
      }
    });
    return total > 0 ? { bonus: total, nombre } : null;
  }

  const ACCIONES_RIVAL = {
    DC: ['SHO', 'DRI', 'PAC'],
    SD: ['SHO', 'PAS', 'DRI'],
    EI: ['DRI', 'PAC', 'SHO'],
    ED: ['PAC', 'DRI', 'SHO'],
    MCO: ['PAS', 'DRI', 'SHO'],
    MI: ['PAS', 'DRI', 'PAC'],
    MD: ['PAS', 'DRI', 'PAC'],
    MC: ['PAS', 'DRI', 'PHY'],
    MCD: ['PAS', 'DEF', 'PHY'],
    DFC: ['DEF', 'PHY', 'PAC'],
    LD: ['PAC', 'DEF', 'PAS'],
    LI: ['PAC', 'DEF', 'PAS'],
    CAD: ['PAC', 'DEF', 'PHY'],
    CAI: ['PAC', 'DEF', 'PHY']
  };

  function ponderarAccionRival(jug) {
    const pool = ACCIONES_RIVAL[jug?.posicion] || ['DRI', 'PAC', 'SHO'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function mejorRespuestaIA(jug, accionesPosibles) {
    let mejor = accionesPosibles[0];
    let mejorVal = -1;
    accionesPosibles.forEach(s => {
      const v = statDeJugador(jug, s);
      if (v > mejorVal) { mejorVal = v; mejor = s; }
    });
    return mejor;
  }

  function resolverDuelo(atac, def, statAt, statDef, esGolSiGana) {
    let a = statDeJugador(atac, statAt);
    let d = statDeJugador(def, statDef);
    const atacFatigado = (atac?.estamina ?? 100) < 50;
    const defFatigado = def ? (def?.estamina ?? 100) < 50 : false;
    if (atacFatigado) a = Math.round(a * 0.85);
    if (defFatigado) d = Math.round(d * 0.85);
    const armaAt = armaActivada(atac, statAt);
    const armaDef = def ? armaActivada(def, statDef) : null;
    const bonusAt = armaAt ? armaAt.bonus : 0;
    const bonusDef = armaDef ? armaDef.bonus : 0;
    const dado = 1 + Math.floor(Math.random() * 20);
    const totalAt = a + bonusAt + dado;
    const totalDef = d + bonusDef + 10 + (def ? Math.floor(Math.random() * 8) : 0);
    const gana = totalAt > totalDef;

    let desenlace = gana ? 'avance' : 'recuperacion';
    if (gana && esGolSiGana) {
      let prob = PROB_GOL[statAt] ?? 0.35;
      if (statDef === 'DEF') prob -= 0.05;
      if (statDef === 'PHY') prob -= 0.08;
      if (statDef === 'PAC') prob -= 0.03;
      prob = Math.max(0.05, prob);
      if (Math.random() < prob) desenlace = 'gol';
    }
    if (gana && desenlace === 'gol' && def && statDef === 'PHY' && (statAt === 'DRI' || statAt === 'PAC') && (totalAt - totalDef) <= 3 && Math.random() < 0.25) {
      desenlace = 'falta';
    }
    const probGol = gana && esGolSiGana ? Math.max(0.05, (PROB_GOL[statAt] ?? 0.35) - (statDef === 'DEF' ? 0.05 : 0) - (statDef === 'PHY' ? 0.08 : 0) - (statDef === 'PAC' ? 0.03 : 0)) : 0;
    return {
      a, d, dado, bonusAt, bonusDef, totalAt, totalDef, gana, atacFatigado, defFatigado,
      desenlace, armaAt, armaDef, gol: desenlace === 'gol', probGol
    };
  }

  function finalizarPartido() {
    const ctx = partidoCtx;
    if (!ctx) return;
    const { data, temporada, partidoUsuario, resultadosFondo, eqManager } = ctx;
    document.getElementById('partido-minuto').textContent = "90' · FINAL";
    aplicarResultado(temporada.clasificacion, partidoUsuario[0], partidoUsuario[1], partidoGolesLocal, partidoGolesVisit);
    temporada.partidosJugados.push({
      jornada: temporada.jornadaActual + 1,
      local: partidoUsuario[0], visit: partidoUsuario[1],
      gl: partidoGolesLocal, gv: partidoGolesVisit,
      fondo: resultadosFondo
    });
    temporada.jornadaActual += 1;
    data.manager.semana += 1;
    data.manager.entrenadoSemana = false;
    onceIdsDeManager(data).forEach(id => descontarEstaminaPartido(data, id, eqManager.id));
    aplicarRecuperacionJornada(data);
    generarAlertasBuzon(data);
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    sincronizarSlotActivo();
    document.getElementById('partido-btn-fin').style.display = 'block';
    reprobarGol();
  }

  function avatarHtml(jug) {
    if (!jug) return '';
    const foto = jug.foto || 'assets/players/default.png';
    return `<div class="duelo-avatar">
      <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre || ''}">
    </div>`;
  }

  function dueloCardHtml(jug, rol, accion) {
    const accionHtml = accion
      ? `<div class="duelo-accion">${accion.label} <span class="duelo-stat">${accion.stat}</span></div>`
      : '';
    return `<div class="duelo-card ${rol}">
      ${avatarHtml(jug)}
      <span class="duelo-nombre">${jug?.nombre || '—'}</span>
      <span class="duelo-pos ${posColor(jug?.posicion) || ''}">${jug?.posicion || ''}</span>
      ${accionHtml}
    </div>`;
  }

  function mostrarTurnoActual() {
    const ctx = partidoCtx;
    if (!ctx) return;
    const turno = TURNOS_PARTIDO[partidoTurno];
    if (!turno) {
      finalizarPartido();
      return;
    }
    const { esLocal, eqManager, rivalId, rivalNombre, data } = ctx;
    document.getElementById('partido-minuto').textContent = `${turno.minuto}'`;
    const miOnce = partidoJugadoresDelOnce(data.manager.equipo);
    const plantillaRival = getPlantillaPorNombre(rivalNombre);

    const ATACANTES = ['DC', 'SD', 'EI', 'ED', 'MCO', 'MI', 'MD'];
    const DEFENSAS = ['DFC', 'LD', 'LI', 'CAD', 'CAI', 'MCD'];

    const esAtaque = turno.tipo === 'ataque';
    let miJug, rivalJug, accionRival, opcionesDefensa, misOpcionesAtaque;
    if (esAtaque) {
      miJug = elegirPorRol(miOnce, ATACANTES) || elegirPorRol(miOnce, []);
      rivalJug = elegirPorRol(plantillaRival, DEFENSAS) || elegirPorRol(plantillaRival, []);
      misOpcionesAtaque = (ACCIONES_RIVAL[miJug?.posicion] || ['DRI', 'SHO']).slice(0, 2);
    } else {
      rivalJug = elegirPorRol(plantillaRival, ATACANTES) || elegirPorRol(plantillaRival, []);
      miJug = elegirPorRol(miOnce, DEFENSAS) || elegirPorRol(miOnce, []);
      accionRival = ponderarAccionRival(rivalJug);
      opcionesDefensa = CRUCES[accionRival] || ['DEF', 'PHY'];
    }
    ctx.turnoActual = { turno, miJug, rivalJug, esAtaque, accionRival, opcionesDefensa, resuelto: false };

    const turnoEl = document.getElementById('partido-turno');
    const opcionesEl = document.getElementById('partido-opciones');
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) resultadoEl.innerHTML = '';
    if (!turnoEl || !opcionesEl) return;

    const titulo = esAtaque ? 'TU TURNO DE ATAQUE' : '¡EL RIVAL ATACA!';
    const rivalAccion = esAtaque
      ? { label: 'Preparado para defender', stat: '—' }
      : { label: ETIQUETA_STAT[accionRival] || accionRival, stat: accionRival };
    const miAccion = esAtaque ? { label: 'Elige tu acción', stat: '—' } : { label: 'Elige cómo responder', stat: '—' };

    let opcionesHtml;
    const statsOfrecidas = esAtaque ? misOpcionesAtaque : opcionesDefensa;
    opcionesHtml = statsOfrecidas.map(s => {
      const v = Math.round(statDeJugador(miJug, s));
      return `<button class="btn-bluelock partido-opcion-btn" onclick="resolverOpcion('${s}')">
        <span>${ETIQUETA_STAT[s] || s} (${s})</span>
        <span class="partido-opcion-stats">Tu ${s}: ${v}</span>
      </button>`;
    }).join('');

    let armaAviso = '';
    const armasJug = (typeof ARMAS_DATABASE !== 'undefined') ? (ARMAS_DATABASE[miJug?.id] || []) : [];
    const armasRelevantes = armasJug.filter(a =>
      Object.keys(a.stats || {}).some(st => statsOfrecidas.includes(st.toUpperCase()))
    );
    if (armasRelevantes.length) {
      const tarjetas = armasRelevantes.map(a => {
        const efectos = Object.entries(a.stats || {})
          .filter(([st]) => statsOfrecidas.includes(st.toUpperCase()))
          .map(([st, bonus]) => `<span class="ficha-arma-efecto">+${bonus} ${st.toUpperCase()}</span>`)
          .join('');
        return `<div class="partido-arma">
          <div class="ficha-arma-nombre">${a.name}</div>
          <div class="ficha-arma-efectos">${efectos}</div>
        </div>`;
      }).join('');
      armaAviso = `<div class="partido-armas">
        <div class="ficha-arma-header"><i class="fas fa-crosshairs"></i> ARMAS</div>
        ${tarjetas}
      </div>`;
    }
    opcionesHtml += armaAviso;

    turnoEl.innerHTML = `
      <div class="duelo-vs">
        ${esLocal ? dueloCardHtml(miJug, 'propio', miAccion) : dueloCardHtml(rivalJug, 'rival', rivalAccion)}
        <span class="duelo-vs-sep">VS</span>
        ${esLocal ? dueloCardHtml(rivalJug, 'rival', rivalAccion) : dueloCardHtml(miJug, 'propio', miAccion)}
      </div>
      <div class="duelo-titulo">${titulo}</div>
      <div class="duelo-pista">${esAtaque
        ? `Ataca con ${miJug?.nombre || 'tu jugador'}. El rival defenderá con su mejor estadística según tu acción.`
        : `${rivalJug?.nombre} va a usar su ${accionRival} (${ETIQUETA_STAT[accionRival] || accionRival}). Responde eligiendo cómo defender.`}</div>`;
    opcionesEl.innerHTML = opcionesHtml;
  }

  function fmtDuelo(res, invertido) {
    const a = invertido ? res.d : res.a;
    const b = invertido ? res.a : res.d;
    const bonusA = invertido ? res.bonusDef : res.bonusAt;
    const bonusB = invertido ? res.bonusAt : res.bonusDef;
    const ladoA = `${a}${bonusA ? '+' + bonusA + ' arma' : ''}+${res.dado}`;
    const ladoB = `${b}${bonusB ? '+' + bonusB + ' arma' : ''}`;
    return `${ladoA} vs ${ladoB}`;
  }

  window.resolverOpcion = function (stat) {
    const ctx = partidoCtx;
    if (!ctx || !ctx.turnoActual || ctx.turnoActual.resuelto) return;
    const { turno, miJug, rivalJug, esAtaque, accionRival } = ctx.turnoActual;
    const esLocal = ctx.esLocal;

    let atac, def, statAt, statDef;
    if (esAtaque) {
      atac = miJug; def = rivalJug;
      statAt = stat;
      const contras = CRUCES[stat] || ['DEF', 'PHY'];
      statDef = mejorRespuestaIA(def, contras);
    } else {
      atac = rivalJug; def = miJug;
      statAt = accionRival;
      statDef = stat;
    }
    const res = resolverDuelo(atac, def, statAt, statDef, true);
    ctx.turnoActual.resuelto = true;

    let texto, clase;
    const atacNom = atac?.nombre || '?';
    const defNom = def?.nombre || '?';
    let armaMsg = '';
    if (res.armaAt) armaMsg += ` +${res.armaAt.bonus} ${statAt}`;
    if (res.armaDef) armaMsg += ` +${res.armaDef.bonus} ${statDef}`;
    if (armaMsg) armaMsg = ' ARMA:' + armaMsg;

    if (esAtaque) {
      if (res.desenlace === 'gol') {
        texto = `¡GOLAZO! ${atacNom} gana el duelo con ${statAt} y marca (${fmtDuelo(res, false)})${armaMsg}`;
        clase = 'gol';
        if (esLocal) partidoGolesLocal++; else partidoGolesVisit++;
      } else if (res.desenlace === 'falta') {
        texto = `¡FALTA! ${defNom} derriba a ${atacNom} con su carga (${fmtDuelo(res, false)})${armaMsg}`;
        clase = 'parada';
      } else if (res.gana) {
        texto = `${atacNom} gana la jugada con ${statAt} pero no logra concretar (${fmtDuelo(res, false)})${armaMsg}`;
        clase = res.armaAt ? 'arma' : '';
      } else {
        texto = `${defNom} recupera el balón frente a ${atacNom} (${fmtDuelo(res, false)})${armaMsg}`;
        clase = 'parada';
      }
    } else {
      if (res.desenlace === 'gol') {
        texto = `¡GOL DEL RIVAL! ${atacNom} marca con ${statAt} superando a ${defNom} (${fmtDuelo(res, true)})${armaMsg}`;
        clase = 'gol';
        if (esLocal) partidoGolesVisit++; else partidoGolesLocal++;
      } else if (res.desenlace === 'falta') {
        texto = `¡FALTA! ${defNom} corta la jugada de ${atacNom} con falta (${fmtDuelo(res, true)})${armaMsg}`;
        clase = 'parada';
      } else if (res.gana) {
        texto = `${atacNom} gana la jugada con ${statAt} pero ${defNom} evita el gol (${fmtDuelo(res, true)})${armaMsg}`;
        clase = res.armaDef ? 'arma' : '';
      } else {
        texto = `${defNom} recupera ante ${atacNom} (${fmtDuelo(res, true)})${armaMsg}`;
        clase = res.armaDef ? 'arma' : 'parada';
      }
    }

    document.getElementById('partido-goles-local').textContent = String(partidoGolesLocal);
    document.getElementById('partido-goles-visit').textContent = String(partidoGolesVisit);
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) {
      resultadoEl.innerHTML = texto;
      resultadoEl.className = 'partido-resultado ' + clase;
    }
    escribirLogPartido(`${turno.minuto}' · ${texto}`, clase);
    const opcionesEl = document.getElementById('partido-opciones');
    if (opcionesEl) opcionesEl.innerHTML = '';
    setTimeout(() => {
      partidoTurno++;
      mostrarTurnoActual();
    }, 900);
  };

  window.iniciarJornada = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const { temporada, liga } = getTemporada(data);
    if (!liga) return;
    localStorage.setItem('blue_lock_save', JSON.stringify(data));
    const ligaKey = liga.nombre;
    const eqManager = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
    if (!eqManager) return;
    const calendario = temporada.calendario[ligaKey];
    if (!calendario || temporada.jornadaActual >= calendario.length) {
      mostrarModal('TEMPORADA COMPLETA', '¡Has completado todas las jornadas de la liga! La temporada ha terminado.');
      return;
    }

    const jornada = calendario[temporada.jornadaActual];
    const partidoUsuario = jornada.find(([l, v]) => l === eqManager.id || v === eqManager.id);
    if (!partidoUsuario) return;

    const resultadosFondo = [];
    jornada.forEach(([l, v]) => {
      if (l === eqManager.id || v === eqManager.id) return;
      const ln = nombreEquipoPorId(l);
      const vn = nombreEquipoPorId(v);
      const [gl, gv] = simularPartidoFondo(ln, vn);
      resultadosFondo.push({ l, v, gl, gv });
      aplicarResultado(temporada.clasificacion, l, v, gl, gv);
      descontarEstaminaEquipoNPC(data, l);
      descontarEstaminaEquipoNPC(data, v);
    });

    const esLocal = partidoUsuario[0] === eqManager.id;
    const rivalId = esLocal ? partidoUsuario[1] : partidoUsuario[0];
    const rivalNombre = nombreEquipoPorId(rivalId);

    partidoTurno = 0;
    partidoGolesLocal = 0;
    partidoGolesVisit = 0;
    partidoCtx = { data, temporada, esLocal, eqManager, rivalId, rivalNombre, partidoUsuario, resultadosFondo, turnoActual: null };

    document.getElementById('partido-jornada').textContent = `JORNADA ${temporada.jornadaActual + 1} · ${liga.nombre}`;
    document.getElementById('partido-nombre-local').textContent = nombreEquipoPorId(partidoUsuario[0]);
    document.getElementById('partido-nombre-visit').textContent = nombreEquipoPorId(partidoUsuario[1]);
    document.getElementById('partido-escudo-local').innerHTML = escudoHtmlPartido(partidoUsuario[0]);
    document.getElementById('partido-escudo-visit').innerHTML = escudoHtmlPartido(partidoUsuario[1]);
    document.getElementById('partido-goles-local').textContent = '0';
    document.getElementById('partido-goles-visit').textContent = '0';
    document.getElementById('partido-log').innerHTML = '';
    document.getElementById('partido-btn-fin').style.display = 'none';
    document.getElementById('partido-resultado').innerHTML = '';
    showScreen('screen-partido');
    mostrarTurnoActual();
  };

  window.actualizarTablaClasificacion = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    gameState.estadoTemporada = data.manager.temporada;
    renderClasificacion();
  };

  window.jugarProximoPartido = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) {
      mostrarModal('MODO JUGADOR', 'La simulación de partidos está disponible solo en el Modo Carrera (Manager).');
      return;
    }
    iniciarJornada();
  };

  function mostrarProgresoSemanal(resultado) {
    const titulo = `💪 ENTRENAMIENTO — SEMANA ${resultado.semana}`;
    const huboSubidas = resultado.jugadores.some(j => j.subidas.length > 0);
    let html = '';

    if (huboSubidas) {
      html += `<div class="semana-alerta"><i class="fas fa-arrow-up"></i> ¡Varios jugadores han subido de nivel esta semana!</div>`;
    } else {
      html += `<div class="semana-alerta neutra">Ningún jugador alcanzó el umbral de mejora esta semana. Sigue entrenando.</div>`;
    }

    resultado.jugadores.forEach(j => {
      const xps = Object.entries(j.xp)
        .map(([stat, val]) => `<span class="semana-xp"><b>${ETIQUETAS_STATS[stat]}</b> +${val} XP</span>`)
        .join(' ');
      const subidas = j.subidas
        .map(s => `<span class="semana-subida"><i class="fas fa-arrow-up"></i> ${ETIQUETAS_STATS[s.stat]}: ${s.antes} → ${s.despues}</span>`)
        .join(' ');
      const avatar = j.foto || 'assets/players/default.png';
      html += `<div class="semana-item ${j.subidas.length ? 'subio' : ''}">
        <div class="semana-avatar">
          <img src="${avatar}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${j.nombre}">
        </div>
        <div class="semana-info">
          <span class="semana-nombre">${j.nombre} <span class="${posColor(j.posicion)}">${j.posicion}</span></span>
          <span class="semana-xps-line">${xps}</span>
          ${subidas ? `<span class="semana-subidas-line">${subidas}</span>` : ''}
        </div>
        <div class="semana-grl">GRL ${j.grl}</div>
      </div>`;
    });

    document.getElementById('modal-title').innerHTML = titulo;
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
  }

  const FICHA_DATOS = {
    isagi: { altura: 175, pie: "Diestro" },
    bachira: { altura: 176, pie: "Diestro" },
    chigiri: { altura: 177, pie: "Diestro" },
    gagamaru: { altura: 191, pie: "Diestro" },
    kunigami: { altura: 188, pie: "Zurdo" },
    raichi: { altura: 182, pie: "Diestro" },
    igaguri: { altura: 172, pie: "Diestro" },
    kuon: { altura: 185, pie: "Diestro" },
    naruhaya: { altura: 168, pie: "Diestro" },
    imamura: { altura: 178, pie: "Diestro" },
    iemon: { altura: 187, pie: "Diestro" }
  };

  window.abrirFichaJugador = function (jugadorId) {
    let jug;
    if (jugadorId === 'jugador') {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return;
      const data = JSON.parse(saved);
      if (!data.jugador) return;
      jug = {
        id: 'player',
        nombre: data.jugador.nombre,
        foto: '',
        posicion: data.jugador.posicion,
        posicionSec: '—',
        edad: '—',
        instituto: '—',
        tiro: data.jugador.stats.tiro,
        pase: data.jugador.stats.pase,
        regate: data.jugador.stats.regate,
        defensa: data.jugador.stats.defensa || 40,
        pac: 60,
        phy: 60,
        altura: '—',
        pie: '—'
      };
    } else {
      jug = null;
      if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
        for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
          jug = PLANTILLAS_EQUIPO[key].find(p => p.id === jugadorId);
          if (jug) { jug = aplicarEntrenamiento(normalizarJugador(jug)); break; }
        }
      }
      if (!jug) { cerrarFicha(); return; }
      const extra = FICHA_DATOS[jugadorId] || {};
      jug.altura = jug.altura || extra.altura || 175;
      jug.pie = jug.pie || extra.pie || 'Diestro';
    }

    function cuadrito(etiqueta, valor) {
      return `<div class="pfila-stat ficha-stat-box"><span>${etiqueta}</span>${valor}</div>`;
    }

    const grlFicha = calcularGrlJugador(jug);

    const armas = (typeof ARMAS_DATABASE !== 'undefined') ? ARMAS_DATABASE[jug.id] : null;
    let bloqueArma = '';
    if (armas && armas.length) {
      const etiquetas = { pac: 'PAC', sho: 'SHO', pas: 'PAS', dri: 'DRI', def: 'DEF', phy: 'PHY' };
      const headerArma = armas.length > 1 ? 'ARMAS' : 'ARMA PRINCIPAL';
      const tarjetas = armas.map(a => {
        const efectos = Object.entries(a.stats || {})
          .map(([st, bonus]) => `<span class="ficha-arma-efecto">+${bonus} en ${etiquetas[st] || st.toUpperCase()}</span>`)
          .join('');
        return `
        <div class="ficha-arma">
          <div class="ficha-arma-nombre">${a.name}</div>
          <div class="ficha-arma-efectos">${efectos}</div>
          <div class="ficha-arma-desc">${a.desc}</div>
        </div>`;
      }).join('');
      bloqueArma = `
      <div class="ficha-armas">
        <div class="ficha-arma-header"><i class="fas fa-crosshairs"></i> ${headerArma}</div>
        ${tarjetas}
      </div>`;
    }

    let btnOferta = '';
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (saved && jugadorId !== 'player') {
        const data = JSON.parse(saved);
        if (data.tipo === 'manager' && data.manager) {
          const propios = new Set(getPlantillaEquipo(data.manager.equipo).map(p => p.id));
          if (propios.has(jug.id)) {
            btnOferta = `<button class="ficha-oferta-btn vender" onclick="venderJugador('${jugadorId}')">
              <i class="fas fa-tag"></i> OFERECER A EQUIPOS
            </button>`;
          } else {
            const presupuesto = data.manager.presupuesto ?? getPresupuestoManager();
            const valor = calcularValor(grlFicha, jug);
            const puede = presupuesto >= valor;
            btnOferta = `<button class="ficha-oferta-btn ${puede ? '' : 'disabled'}" ${puede ? '' : 'disabled'} onclick="ficharJugador('${jugadorId}')">
              <i class="fas fa-handshake"></i> ${puede ? 'REALIZAR OFERTA' : 'PRESUPUESTO INSUFICIENTE'}
            </button>`;
          }
        }
      }
    } catch (e) {
      btnOferta = '';
    }

    const fotoSrc = jug.foto || 'assets/players/default.png';
    const tieneLogoClub = !!escudoEquipoPorNombre(jug.equipo);
    document.getElementById('ficha-content').innerHTML = `
      <div class="ficha-header"><span>BLUE LOCK PROJECT</span></div>
      <div class="ficha-top">
        <div class="ficha-data-grid">
          <div class="ficha-row">
            <div class="ficha-label">FULL NAME</div>
            <div class="ficha-value">${jug.nombre.toUpperCase()}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">SCHOOL</div>
            <div class="ficha-value">${jug.instituto || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">NATIONALITY</div>
            <div class="ficha-value">${jug.bandera || ''} ${jug.nacionalidad || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">AGE</div>
            <div class="ficha-value">${jug.edad}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">VALOR</div>
            <div class="ficha-value">${formatearYenes(calcularValor(grlFicha, jug))}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">POSITION</div>
            <div class="ficha-value">${jug.posicion}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">SEC. POSITION</div>
            <div class="ficha-value">${jug.posicionSec || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">HEIGHT</div>
            <div class="ficha-value">${jug.altura}cm</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">DOM. FOOT</div>
            <div class="ficha-value">${jug.pie}</div>
          </div>
        </div>
        <div class="ficha-side">
          <div class="ficha-photo">
            <img src="${fotoSrc}" onerror="this.onerror=null;this.style.display='none'" alt="${jug.nombre}">
            <i class="fas fa-user ficha-photo-fallback"></i>
          </div>
          <div class="ficha-club-emblem ${tieneLogoClub ? '' : 'con-forma'}">
            ${htmlEscudoEquipo(jug.equipo)}
          </div>
          <div class="ficha-club-name">${jug.equipo || '—'}</div>
          <div class="ficha-club-grl">${grlFicha}</div>
        </div>
      </div>
      <div class="ficha-stats-grid ficha-stats-6">
        ${jug.posicion === 'POR'
          ? `${cuadrito('DIV', jug.div || 60)}${cuadrito('HAN', jug.han || 60)}${cuadrito('KIC', jug.kic || 60)}${cuadrito('REF', jug.ref || 60)}${cuadrito('SPD', jug.spd || 60)}${cuadrito('POS', jug.pos || 60)}`
          : `${cuadrito('PAC', jug.pac || 60)}${cuadrito('SHO', jug.tiro)}${cuadrito('PAS', jug.pase)}${cuadrito('DRI', jug.regate)}${cuadrito('DEF', jug.defensa)}${cuadrito('PHY', jug.phy || 60)}`}
      </div>
      ${bloqueArma}
      ${btnOferta}
    `;
    document.getElementById('ficha-modal-overlay').classList.add('active');
  };

  window.cerrarFicha = function () {
    document.getElementById('ficha-modal-overlay').classList.remove('active');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarFicha();
  });

  // Historia: obtener foto de personaje
  function getPersonajeFoto(nombre) {
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
    return p?.foto || '';
  }

  // Historia: renderizar según estado
  window.renderHistoria = function () {
    if (!MODO_HISTORIA || !MODO_HISTORIA.length) return;
    const cap = MODO_HISTORIA[0];
    document.getElementById('historia-cap-titulo').textContent = cap.titulo;

    if (gameState.historia.estado === 'dialogo') {
      renderDialogoHistoria();
    } else {
      renderMenuHistoria();
    }
  };

  // Historia: menú de partidos
  function renderMenuHistoria() {
    const cap = MODO_HISTORIA[0];
    let html = `<div class="bl-card"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">${cap.descripcion}</p></div><div style="display:flex;flex-direction:column;gap:8px;">`;

    cap.partidos.forEach((p, i) => {
      const done = gameState.historia.completados.includes(p.id);
      const blocked = i > 0 && !gameState.historia.completados.includes(cap.partidos[i - 1].id);
      const unlocked = !done && !blocked;
      let icon, cls, label;
      if (done) { icon = 'fa-check-circle'; cls = 'completado'; label = 'COMPLETADO'; }
      else if (blocked) { icon = 'fa-lock'; cls = 'bloqueado'; label = 'BLOQUEADO'; }
      else { icon = 'fa-play-circle'; cls = 'disponible'; label = 'DISPONIBLE'; }

      html += `<div class="historia-match ${cls}" data-idx="${i}" ${unlocked ? 'onclick="iniciarPartido(' + i + ')"' : ''}>
        <div class="match-icon"><i class="fas ${icon}"></i></div>
        <div class="match-info">
          <span class="match-rival">${p.rival}</span>
          <span class="match-status">${label}</span>
        </div>
      </div>`;
    });

    html += '</div>';
    const btnCont = document.getElementById('btn-continuar-historia');

    if (cap.partidos.every(p => gameState.historia.completados.includes(p.id))) {
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
    const partido = cap.partidos[gameState.historia.partidoActual];
    const dialogos = gameState.historia.dialogoTipo === 'pre' ? partido.dialogoPre : partido.dialogoPost;
    const idx = gameState.historia.dialogoIndex;
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
    } else if (gameState.historia.dialogoTipo === 'post') {
      html += `<button class="btn-bluelock btn-gold btn-dialogo" onclick="completarPartido()"><i class="fas fa-check"></i> CONTINUAR</button>`;
    } else {
      html += `<button class="btn-bluelock btn-gold btn-dialogo" onclick="mostrarModalPartido()"><i class="fas fa-fire"></i> JUGAR PARTIDO</button>`;
    }

    html += `</div>`;
    document.getElementById('historia-content').innerHTML = html;
  }

  // Historia: iniciar partido
  window.iniciarPartido = function (idx) {
    gameState.historia.partidoActual = idx;
    gameState.historia.dialogoIndex = 0;
    gameState.historia.dialogoTipo = 'pre';
    gameState.historia.estado = 'dialogo';
    renderHistoria();
  };

  // Historia: avanzar diálogo
  window.avanzarDialogo = function () {
    gameState.historia.dialogoIndex++;
    renderHistoria();
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
    cerrarModal();
    if (victoria) {
      gameState.monedas += 200;
      gameState.historia.dialogoIndex = 0;
      gameState.historia.dialogoTipo = 'post';
      renderDialogoHistoria();
    } else {
      mostrarModal('DERROTA', 'Has perdido el partido. Vuelve a intentarlo cuando estés listo.');
    }
  };

  // Historia: completar partido
  window.completarPartido = function () {
    const cap = MODO_HISTORIA[0];
    const partido = cap.partidos[gameState.historia.partidoActual];
    if (!gameState.historia.completados.includes(partido.id)) {
      gameState.historia.completados.push(partido.id);
    }
    gameState.historia.estado = 'menu';
    guardarEstado();
    renderHistoria();
  };

  // Formulario: Crear Jugador
  document.getElementById('form-crear-jugador').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('input-nombre-jugador').value.trim();
    if (!nombre) {
      mostrarModal('ERROR', 'Ingresa un nombre para tu Egoísta.');
      return;
    }
    const posicion = document.getElementById('select-posicion').value;
    const paisId = document.getElementById('select-pais').value;

    const save = {
      tipo: "jugador",
      monedas: gameState.monedas,
      gemas: gameState.gemas,
      jugador: {
        nombre, posicion, pais: paisId,
        stats: { tiro: 65, pase: 65, regate: 65, vision: 65, ego: 70 }
      },
      fechaCreacion: new Date().toISOString()
    };

    localStorage.setItem('blue_lock_save', JSON.stringify(save));
    mostrarModal("¡EGOÍSTA REGISTRADO!", `Bienvenido a Blue Lock, ${nombre}. Tu camino a ser el #1 comienza ahora.`);
    cargarEstado();
    renderHub();
    showScreen('screen-hub');
  });

  // Formulario: Iniciar Carrera (Manager)
  const nombreManagerInput = document.getElementById('input-nombre-manager');
  if (nombreManagerInput) {
    nombreManagerInput.addEventListener('input', function () {
      actualizarEstadoIniciarCarrera();
    });
  }
  document.getElementById('form-modo-manager').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('input-nombre-manager').value.trim();
    if (!nombre) {
      mostrarModal('ERROR', 'Ingresa el nombre del Manager.');
      return;
    }
    if (!tsState.equipoId) {
      mostrarModal('ERROR', 'Selecciona un equipo base.');
      return;
    }
    const equipo = tsState.equipoNombre;

    // Límite de slots
    const slots = getManagerSlots();
    if (slots.length >= MAX_SLOTS) {
      mostrarModal('SLOTS LLENOS', `No puedes crear más partidas. Has alcanzado el máximo de ${MAX_SLOTS} guardados. Elimina una partida para crear una nueva.`);
      return;
    }

    sincronizarSlotActivo();

    const save = {
      tipo: "manager",
      monedas: gameState.monedas,
      gemas: gameState.gemas,
      manager: {
        nombre, equipo,
        buzon: { mensajes: [mensajeEgoBienvenida(equipo)] }
      },
      fechaCreacion: new Date().toISOString()
    };

    localStorage.setItem('blue_lock_save', JSON.stringify(save));
    const slotId = nuevoSlotId();
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
    slots.push({
      slotId,
      fechaCreacion: save.fechaCreacion,
      fechaGuardado: save.fechaCreacion,
      equipo,
      semana: 0,
      data: save
    });
    saveManagerSlots(slots);

    mostrarModal("¡MANAGER REGISTRADO!", `Bienvenido, Manager ${nombre}. Dirigirás al ${equipo}.`);
    cargarEstado();
    renderHub();
    showScreen('screen-hub');
  });

  // Init Calls
  cargarEstado();
  cargarPaisesUI();
  renderTienda();
  renderLogros();
});
