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
  let clasificacionDiv = 'primera';
  const POS_ORDER = { POR:0, DFC:1, LI:2, LD:3, CAI:4, CAD:5, MCD:6, MC:7, MCO:8, MI:9, MD:10, EI:11, ED:12, SD:13, DC:14 };

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
  let divActual = 'primera';

  const NEO_EQUIPOS = [
    { id: "bastard_munchen", nombre: "Bastard München", bandera: "🇩🇪", pais: "Alemania", escudo: "assets/logos/bastard_munchen.png", nivel: 4, presupuesto: 7000 },
    { id: "berserk_dortmund", nombre: "Berserk Dortmund", bandera: "🇩🇪", pais: "Alemania", escudo: "assets/logos/berserk_dortmund.png", nivel: 3, presupuesto: 5800 },
    { id: "rpb", nombre: "RPB", bandera: "🇩🇪", pais: "Alemania", escudo: "assets/logos/rpb.png", nivel: 3, presupuesto: 5100 },
    { id: "vesper_bremen", nombre: "Vesper Bremen", bandera: "🇩🇪", pais: "Alemania", escudo: "assets/logos/vesper_bremen.png", nivel: 2, presupuesto: 4800 },
    { id: "manshine_city", nombre: "Manshine City", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/manshine_city.png", nivel: 4, presupuesto: 9000 },
    { id: "arsenaly", nombre: "Arsenaly", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/arsenaly.png", nivel: 3, presupuesto: 6200 },
    { id: "miracleicester", nombre: "Miracleicester", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/miracleicester.png", nivel: 3, presupuesto: 5400 },
    { id: "manshine_united", nombre: "Manshine United", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/manshine_united.png", nivel: 3, presupuesto: 6000 },
    { id: "chelblue", nombre: "Chelblue", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/chelblue.png", nivel: 3, presupuesto: 5800 },
    { id: "livers", nombre: "Livers", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", escudo: "assets/logos/livers.png", nivel: 3, presupuesto: 5400 },
    { id: "fc_barcha", nombre: "FC Barcha", bandera: "🇪🇸", pais: "España", escudo: "assets/logos/barcha.png", nivel: 4, presupuesto: 7200 },
    { id: "chicorid", nombre: "Chicorid", bandera: "🇪🇸", pais: "España", escudo: "assets/logos/chicorid.png", nivel: 3, presupuesto: 5000 },
    { id: "re_al", nombre: "Re Al", bandera: "🇪🇸", pais: "España", escudo: "assets/logos/real_bastard.png", nivel: 4, presupuesto: 7500 },
    { id: "ubers_fc", nombre: "Ubers FC", bandera: "🇮🇹", pais: "Italia", escudo: "assets/logos/ubers.png", nivel: 4, presupuesto: 6800 },
    { id: "bolos", nombre: "Bolos", bandera: "🇮🇹", pais: "Italia", escudo: "assets/logos/bolos.png", nivel: 3, presupuesto: 5400 },
    { id: "ac_milanoia", nombre: "AC Milanoia", bandera: "🇮🇹", pais: "Italia", escudo: "assets/logos/ac_milanoia.png", nivel: 3, presupuesto: 5600 },
    { id: "napolin", nombre: "Napolin", bandera: "🇮🇹", pais: "Italia", escudo: "assets/logos/napolin.png", nivel: 3, presupuesto: 5500 },
    { id: "palmaro", nombre: "Palmaro", bandera: "🇮🇹", pais: "Italia", escudo: "assets/logos/palmaro.png", nivel: 3, presupuesto: 5200 },
    { id: "paris_x_gen", nombre: "Paris X Gen", bandera: "🇫🇷", pais: "Francia", escudo: "assets/logos/paris_x_gen.png", nivel: 4, presupuesto: 7600 },
    { id: "marseille", nombre: "Marseille", bandera: "🇫🇷", pais: "Francia", escudo: "assets/logos/marseille.png", nivel: 3, presupuesto: 5500 },
    { id: "monao", nombre: "Monao", bandera: "🇫🇷", pais: "Francia", escudo: "assets/logos/monao.png", nivel: 3, presupuesto: 5300 },
    { id: "nandatot", nombre: "Nandatot", bandera: "🇫🇷", pais: "Francia", escudo: "assets/logos/nandatot.png", nivel: 2, presupuesto: 4600 },
    { id: "bl_eleven", nombre: "Blue Lock Eleven", bandera: "🇯🇵", pais: "Blue Lock", escudo: "assets/logos/bl_eleven.png", nivel: 5, presupuesto: 8000, division: "historia" },
    { id: "team_z", nombre: "Equipo Z", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 3, presupuesto: 4000 },
    { id: "team_v", nombre: "Equipo V", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 2, presupuesto: 3000 },
    { id: "team_w", nombre: "Equipo W", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 2, presupuesto: 3000 },
    { id: "urawa_rubies", nombre: "Urawa Rubies", bandera: "🇯🇵", pais: "Japón", escudo: "assets/logos/urawa_rubies.png", nivel: 3, presupuesto: 5500 },
    { id: "kawasaki_breakerz", nombre: "Kawasaki Breakerz", bandera: "🇯🇵", pais: "Japón", escudo: "assets/logos/kawasaki_breakerz.png", nivel: 3, presupuesto: 5300 },
    { id: "roar_kumamoto", nombre: "Roar Kumamoto", bandera: "🇯🇵", pais: "Japón", escudo: "assets/logos/roar_kumamoto.png", nivel: 2, presupuesto: 4000 },
    { id: "dosankoro_sapporo", nombre: "Dosankoro Sapporo", bandera: "🇯🇵", pais: "Japón", escudo: "assets/logos/dosankoro_sapporo.png", nivel: 2, presupuesto: 3800 },
    { id: "sunflame_hiroshima", nombre: "Sunflame Hiroshima", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 2, presupuesto: 4200 },
    { id: "gohonzon_kamakura", nombre: "Gohonzon Kamakura", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 2, presupuesto: 3600 },
    { id: "jubilee_iwata", nombre: "Jubilee Iwata", bandera: "🇯🇵", pais: "Japón", escudo: "", nivel: 2, presupuesto: 3500 },
    { id: "fc_portimion", nombre: "FC Portimion", bandera: "🇵🇹", pais: "Portugal", escudo: "assets/logos/FC Portimion.png", nivel: 3, presupuesto: 4800 },
    { id: "ajajax", nombre: "Ajajax", bandera: "🇳🇱", pais: "Holanda", escudo: "assets/logos/ajajax.png", nivel: 3, presupuesto: 5200 },
    { id: "kroningen", nombre: "Kroningen", bandera: "🇳🇱", pais: "Holanda", escudo: "", nivel: 2, presupuesto: 4200 },
    { id: "celticoss", nombre: "Celticoss", bandera: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", pais: "Escocia", escudo: "assets/logos/celticoss.png", nivel: 3, presupuesto: 5000 }
  ];

  window.tsInit = function () {
    tsState = { equipoId: null, equipoNombre: '' };
    divActual = 'primera';
    const nombreInput = document.getElementById('input-nombre-manager');
    if (nombreInput) nombreInput.value = '';
    document.getElementById('ts-selected-name').style.display = 'none';
    document.getElementById('btn-submit-manager').disabled = true;
    renderDivisionUI();
    renderNEOEquipos();
  };

  function renderDivisionUI() {
    document.querySelectorAll('.div-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.div === divActual);
    });
    const sub = document.querySelector('.neo-league-sub');
    if (sub && typeof DIVISIONES !== 'undefined') {
      sub.textContent = DIVISIONES[divActual]?.nombre || '';
    }
  }

  function renderNEOEquipos() {
    const grid = document.getElementById('ts-equipos');
    grid.innerHTML = '';
    const divKeys = DIVISIONES[divActual]?.equipos || [];
    NEO_EQUIPOS.forEach(eq => {
      if (!divKeys.includes(eq.id) && divKeys.length > 0) return;
      const escudoHtml = eq.escudo
        ? `<img src="${eq.escudo}" class="ts-emblem-img" onerror="this.onerror=null;this.style.display='none'" alt="${eq.nombre}">`
        : `<i class="fas fa-shield-halved"></i>`;
      const stars = '⭐'.repeat(eq.nivel);
      grid.innerHTML += `<div class="ts-card ts-equipo ${tsState.equipoId === eq.id ? 'selected' : ''}" onclick="tsSeleccionarEquipo('${eq.id}')">
        <span class="ts-emblem">${escudoHtml}</span>
        <span class="ts-name">${eq.nombre}</span>
        <span class="ts-flag-small">${eq.bandera} ${eq.pais}</span>
        <span class="ts-meta">${stars} 🪙${eq.presupuesto}</span>
        <button type="button" class="ts-ver-plantilla" onclick="event.stopPropagation(); tsVerPlantilla('${eq.id}')"><i class="fas fa-users"></i> VER PLANTILLA</button>
      </div>`;
    });
  }

  window.tsSeleccionarEquipo = function (equipoId) {
    const eq = NEO_EQUIPOS.find(e => e.id === equipoId);
    if (!eq) return;
    tsState.equipoId = eq.id;
    tsState.equipoNombre = eq.nombre;
    document.querySelectorAll('.ts-card.ts-equipo').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`.ts-card.ts-equipo[onclick*="'${equipoId}'"]`);
    if (card) card.classList.add('selected');
    document.getElementById('ts-equipo-label').textContent = `${eq.nombre} 🪙${eq.presupuesto} ⭐${eq.nivel}`;
    document.getElementById('ts-selected-name').style.display = 'block';
    document.getElementById('btn-submit-manager').disabled = false;
  };

  window.cambiarDivision = function (div) {
    divActual = div;
    document.querySelectorAll('.div-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.div === div);
    });
    const sub = document.querySelector('.neo-league-sub');
    if (sub && typeof DIVISIONES !== 'undefined') {
      sub.textContent = DIVISIONES[div]?.nombre || '';
    }
    document.getElementById('ts-selected-name').style.display = 'none';
    document.getElementById('btn-submit-manager').disabled = true;
    tsState.equipoId = null;
    renderNEOEquipos();
  };

  window.tsVerPlantilla = function (equipoId) {
    const eq = NEO_EQUIPOS.find(e => e.id === equipoId);
    if (!eq) return;
    abrirPlantillaEquipo(eq.nombre, getPlantillaEquipo(eq.nombre));
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
  window.showScreen = function (screenId) {
    const current = document.querySelector('.screen.active');
    if (current && current.id !== screenId) {
      navHistory.push(current.id);
    }
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
  };

  window.goBack = function () {
    const prev = navHistory.pop();
    if (prev && document.getElementById(prev)) {
      showScreen(prev);
    } else {
      showScreen('screen-main');
    }
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
      const presupuesto = typeof m.presupuesto === 'number' ? m.presupuesto : (NEO_EQUIPOS.find(e => e.nombre === m.equipo)?.presupuesto ?? 0);
      const numJug = getPlantillaEquipo(m.equipo).length;
      const semana = m.semana || 0;
      statsEl.innerHTML = `
        <span><i class="fas fa-coins"></i> Presupuesto: 🪙 ${presupuesto.toLocaleString('es-ES')}</span>
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
        va = a.grl || Math.round((a.tiro + a.pase + a.regate + a.defensa + (a.pac||60) + (a.phy||60)) / 6);
        vb = b.grl || Math.round((b.tiro + b.pase + b.regate + b.defensa + (b.pac||60) + (b.phy||60)) / 6);
      } else {
        va = a[plantillaSort.by] ?? 0;
        vb = b[plantillaSort.by] ?? 0;
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
    if (posicion === 'POR') return ['def', 'pac'];
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
      const pac = typeof rec.stats.pac === 'number' ? rec.stats.pac : (statsBase.pac ?? 60);
      const sho = typeof rec.stats.sho === 'number' ? rec.stats.sho : (statsBase.sho ?? 60);
      const pas = typeof rec.stats.pas === 'number' ? rec.stats.pas : (statsBase.pas ?? 60);
      const dri = typeof rec.stats.dri === 'number' ? rec.stats.dri : (statsBase.dri ?? 60);
      const def = typeof rec.stats.def === 'number' ? rec.stats.def : (statsBase.def ?? 60);
      const phy = typeof rec.stats.phy === 'number' ? rec.stats.phy : (statsBase.phy ?? 60);
      rec.grl = Math.round((pac + sho + pas + dri + def + phy) / 6);
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
      const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
      const sel = entrenarSeleccion.get(jug.id);
      const activo = !!sel;
      const foto = jug.foto || 'assets/players/default.png';
      const statsChips = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(k => {
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
      if (eq) return eq.nombre;
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

  function inicialesEquipo(nombre) {
    if (!nombre) return '??';
    const palabras = nombre.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(w));
    const iniciales = palabras.slice(0, 2).map(w => w[0].toUpperCase()).join('');
    return iniciales || nombre.slice(0, 2).toUpperCase();
  }

  window.renderClasificacion = function () {
    const container = document.getElementById('clasificacion-tabla');
    if (!container || typeof DIVISIONES === 'undefined') return;

    document.querySelectorAll('#clasificacion-tabs .div-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.div === clasificacionDiv);
    });

    const div = DIVISIONES[clasificacionDiv];
    if (!div) return;
    const equipos = div.equipos || [];

    const filas = equipos.map(teamId => {
      const nombre = nombreEquipoPorId(teamId);
      const escudo = escudoEquipoPorId(teamId);
      const prev = (gameState.standings || []).find(s => s.nombre === nombre) || {};
      return {
        teamId,
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

    let html = `<div class="clasificacion-division"><i class="fas fa-shield-halved"></i> ${div.nombre}</div>`;
    html += '<table class="clasificacion-table"><thead><tr><th>#</th><th>EQUIPO</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>PTS</th></tr></thead><tbody>';
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

    container.innerHTML = html;
  };

  window.cambiarClasificacionDiv = function (div) {
    clasificacionDiv = div;
    renderClasificacion();
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
      data.manager.tactica = {
        formacion: "4-3-3",
        once: jugadores.slice(0, 11).map(p => p.id),
        banca: jugadores.slice(11).map(p => p.id)
      };
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
      if (f) return aplicarEntrenamiento(f);
    }
    if (equipo && typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        const plantilla = PLANTILLAS_EQUIPO[key];
        if (plantilla[0]?.equipo === equipo || !equipo) {
          const found = plantilla.find(p => p.id === id);
          if (found) return aplicarEntrenamiento(normalizarJugador(found));
          if (plantilla[0]?.equipo === equipo) break;
        }
      }
    }
    return null;
  }

  function normalizarJugador(j) {
    if (!j) return j;
    if (!j.foto) j.foto = `assets/players/${j.id}.png`;
    if (j.pierna) j.pie = j.pierna;
    if (j.altura && typeof j.altura === 'string') j.altura = parseInt(j.altura) || j.altura;
    if (j.stats) {
      j.tiro = j.stats.sho ?? j.tiro;
      j.pase = j.stats.pas ?? j.pase;
      j.regate = j.stats.dri ?? j.regate;
      j.defensa = j.stats.def ?? j.defensa;
      j.pac = j.stats.pac ?? j.pac;
      j.phy = j.stats.phy ?? j.phy;
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
      ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(k => {
        if (typeof rec.stats[k] === 'number') copia.stats[k] = rec.stats[k];
      });
      copia.tiro = copia.stats.sho ?? jug.tiro;
      copia.pase = copia.stats.pas ?? jug.pase;
      copia.regate = copia.stats.dri ?? jug.regate;
      copia.defensa = copia.stats.def ?? jug.defensa;
      copia.pac = copia.stats.pac ?? jug.pac;
      copia.phy = copia.stats.phy ?? jug.phy;
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
      return data.manager.fichajes.map(normalizarJugador);
    } catch (e) {
      return [];
    }
  }

  function getPlantillaEquipo(equipo) {
    let base = [];
    if (equipo && typeof PLANTILLAS_EQUIPO !== 'undefined') {
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        const plantilla = PLANTILLAS_EQUIPO[key];
        if (plantilla[0]?.equipo === equipo) {
          base = plantilla.map(normalizarJugador).map(aplicarEntrenamiento);
          break;
        }
      }
    }
    if (equipo) {
      const fichajes = getFichajes().filter(f => f.equipo === equipo && !base.some(p => p.id === f.id));
      return base.concat(fichajes.map(aplicarEntrenamiento));
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
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
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
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
    const foto = jug.foto || 'assets/players/default.png';
    const bandera = jug.bandera || '';
    const pie = pieTexto(jug);
    return `<div class="pfila pfila-info-row">
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
      </div>
      <div class="pfila-extra">
        <span class="pfila-extra-item">${bandera} ${jug.nacionalidad || '—'}</span>
        <span class="pfila-extra-item"><i class="fas fa-shoe-prints"></i> ${pie}</span>
      </div>
    </div>`;
  }

  function renderizarFilaStats(jug) {
    if (!jug) return '';
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
    const foto = jug.foto || 'assets/players/default.png';
    return `<div class="pfila pfila-stats-row">
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
        <div class="pfila-stat"><span>PAC</span>${jug.pac || 60}</div>
        <div class="pfila-stat"><span>SHO</span>${jug.tiro}</div>
        <div class="pfila-stat"><span>PAS</span>${jug.pase}</div>
        <div class="pfila-stat"><span>DRI</span>${jug.regate}</div>
        <div class="pfila-stat"><span>DEF</span>${jug.defensa}</div>
        <div class="pfila-stat"><span>PHY</span>${jug.phy || 60}</div>
      </div>
    </div>`;
  }

  function renderizarFichaGrandeJugador(jug) {
    if (!jug) return '';
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
    const foto = jug.foto || 'assets/players/default.png';
    function bar(val) {
      const pct = Math.round((val / 100) * 100);
      return `<div class="ficha-stat-box"><span class="ficha-stat-label">${val}</span><div class="ficha-stat-bar"><div class="ficha-stat-fill" style="width:${pct}%"></div></div></div>`;
    }
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
        <div class="ficha-stat-cat"><span class="ficha-stat-title">VELOCIDAD</span>${bar(jug.pac || 60)}</div>
        <div class="ficha-stat-cat"><span class="ficha-stat-title">TIRO</span>${bar(jug.tiro)}</div>
        <div class="ficha-stat-cat"><span class="ficha-stat-title">PASE</span>${bar(jug.pase)}</div>
        <div class="ficha-stat-cat"><span class="ficha-stat-title">REGATE</span>${bar(jug.regate)}</div>
        <div class="ficha-stat-cat"><span class="ficha-stat-title">DEFENSA</span>${bar(jug.defensa)}</div>
        <div class="ficha-stat-cat"><span class="ficha-stat-title">FÍSICO</span>${bar(jug.phy || 60)}</div>
      </div>
    </div>`;
  }

  function renderizarCartaJugador(jug, compact) {
    if (!jug) return '';
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
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
          <div class="tslot-grl">${jug?.grl || Math.round(((jug?.tiro||60)+(jug?.pase||60)+(jug?.regate||60)+(jug?.defensa||60)+(jug?.pac||60)+(jug?.phy||60))/6)}</div>
          <div class="tslot-avatar">
            <img src="${jug?.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug?.nombre || ''}">
          </div>
          <div class="tslot-info">
            <span class="tslot-pos ${posColor(slot.pos) || ''}">${slot.pos || jug?.posicion || ''}</span>
            <span class="tslot-name">${nombreMostrar}</span>
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
        <div class="tslot-grl" style="position:static;width:30px;font-size:0.7rem;">${jug.grl || Math.round((jug.tiro+jug.pase+jug.regate+jug.defensa+(jug.pac||60)+(jug.phy||60))/6)}</div>
        <div class="tslot-avatar">
          <img src="${jug.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        </div>
        <div class="tslot-info" style="flex:1;align-items:flex-start;">
          <span class="tslot-pos ${posColor(jug.posicion)}">${jug.posicion}</span>
          <span class="tslot-name" style="max-width:none;font-size:0.65rem;">${jug.nombre}</span>
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
      tactica.banca.splice(subSeleccionado, 1);
      tactica.banca.push(titularId);
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
      if (bancaIdx !== -1) tactica.banca.splice(bancaIdx, 1);
      tactica.banca.push(titularId);
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
  function calcularValor(grl) {
    return Math.round(grl * grl * 0.8);
  }

  function calcularSalario(grl) {
    return Math.round(calcularValor(grl) * 0.1);
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
    return null;
  }

  function getPresupuestoManager() {
    try {
      const saved = localStorage.getItem('blue_lock_save');
      if (!saved) return 0;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return 0;
      if (typeof data.manager.presupuesto !== 'number') {
        const eq = NEO_EQUIPOS.find(e => e.nombre === data.manager.equipo);
        data.manager.presupuesto = eq?.presupuesto ?? 5000;
        if (!data.manager.fichajes) data.manager.fichajes = [];
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
      primera: '1.ª División',
      segunda: '2.ª División'
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
    document.getElementById('mercado-presupuesto').textContent = getPresupuestoManager().toLocaleString('es-ES');
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
    const presupuesto = data.manager.presupuesto ?? getPresupuestoManager();
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
      p._grl = p.grl || Math.round((p.tiro + p.pase + p.regate + p.defensa + (p.pac || 60) + (p.phy || 60)) / 6);
    });
    if (orden === 'grl') {
      jugadores.sort((a, b) => b._grl - a._grl);
    } else if (orden === 'precio') {
      jugadores.sort((a, b) => calcularValor(a._grl) - calcularValor(b._grl));
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
      const valor = calcularValor(p._grl);
      const salario = calcularSalario(p._grl);
      const puede = presupuesto >= valor;
      const bandera = p.bandera || '';
      const club = p.equipo || p.instituto || '—';
      html += `<div class="mercado-fila" onclick="abrirFichaJugador('${p.id}')">
        <div class="mercado-grl">${p._grl}</div>
        <div class="mercado-avatar">
          <img src="${p.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${p.nombre}">
          <i class="fas fa-user mercado-avatar-fallback"></i>
        </div>
        <div class="mercado-info">
          <span class="mercado-name">${p.nombre} ${bandera}</span>
          <span class="mercado-meta"><span class="${posColor(p.posicion)}">${p.posicion}</span> · ${club} · ${p._grl} GRL</span>
          <span class="mercado-dinero">🪙 ${valor.toLocaleString('es-ES')} <span class="mercado-salario">/ salario 🪙 ${salario.toLocaleString('es-ES')}</span></span>
        </div>
        <button class="mercado-fichar ${puede ? '' : 'disabled'}" ${puede ? '' : 'disabled'} onclick="event.stopPropagation(); ficharJugador('${p.id}')">FICHAR</button>
      </div>`;
    });
    container.innerHTML = html;
  };

  window.ficharJugador = function (jugadorId) {
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
    const grl = jug.grl || Math.round((jug.tiro + jug.pase + jug.regate + jug.defensa + (jug.pac || 60) + (jug.phy || 60)) / 6);
    const valor = calcularValor(grl);

    if (presupuesto < valor) {
      mostrarModal('PRESUPUESTO INSUFICIENTE', `No tienes fondos suficientes para fichar a ${jug.nombre} (necesitas 🪙 ${valor.toLocaleString('es-ES')}).`);
      return;
    }

    data.manager.presupuesto = presupuesto - valor;
    if (!data.manager.fichajes) data.manager.fichajes = [];
    const nuevo = { ...jug, equipo: data.manager.equipo };
    data.manager.fichajes.push(nuevo);
    localStorage.setItem('blue_lock_save', JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = data.manager.presupuesto.toLocaleString('es-ES');
    mostrarModal('¡FICHAJE COMPLETADO!', `¡Fichaje de ${jug.nombre} completado! Ha sido añadido a tu plantilla.`);
    filtrarMercado();
  };

  // ===== ENTRENAMIENTO SEMANAL =====
  const ETIQUETAS_STATS = { pac: 'PAC', sho: 'SHO', pas: 'PAS', dri: 'DRI', def: 'DEF', phy: 'PHY' };

  window.jugarProximoPartido = function () {
    const saved = localStorage.getItem('blue_lock_save');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo === 'manager' && data.manager) {
      avanzarSemana();
    }
    mostrarModal('PRÓXIMAMENTE', 'El simulador de partidos estará disponible en la próxima actualización.');
    reprobarGol();
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

    const fotoSrc = jug.foto || 'assets/players/default.png';
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
        <div class="ficha-photo">
          <img src="${fotoSrc}" onerror="this.onerror=null;this.src='assets/players/default.png'" alt="${jug.nombre}">
        </div>
      </div>
      <div class="ficha-stats-grid ficha-stats-6">
        ${cuadrito('PAC', jug.pac || 60)}
        ${cuadrito('SHO', jug.tiro)}
        ${cuadrito('PAS', jug.pase)}
        ${cuadrito('DRI', jug.regate)}
        ${cuadrito('DEF', jug.defensa)}
        ${cuadrito('PHY', jug.phy || 60)}
      </div>
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
        nombre, equipo
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
