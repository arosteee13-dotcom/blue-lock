/* ==========================================================================
 * simulador-partido.js — Sistema de juego del MODO JUGADOR de Blue Lock
 * Convocatoria → Línea de tiempo 1-90 → Eventos críticos con barra de
 * precisión → Resultados (nota, Puntos de Ego, confianza del entrenador).
 * Persistencia exclusivamente a través de BL.core (database-core.js).
 * ========================================================================== */
(function () {
  'use strict';

  var VELOCIDAD = 70; // ms por minuto simulado

  var S = {
    data: null,
    temporada: null,
    ligaKey: '',
    eqManager: null,
    partidoUsuario: null,
    esLocal: false,
    rivalId: null,
    rivalNombre: null,
    esTitular: false,
    banquillo: false,
    minuto: 0,
    reloj: null,
    aciertos: 0,
    fallos: 0,
    golesLocal: 0,
    golesVisit: 0,
    eventosPlan: [],
    eventosObjetivo: 0,
    golesPlan: { local: [], visit: [] },
    enEvento: false,
    accion: null,
    precisionRAF: null,
    precisionPos: 0,
    precisionDir: 1
  };

  function $() { return document.getElementById(arguments[0]); }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function feed(min, texto, clase) {
    var log = $('partido-log');
    if (!log) return;
    var div = document.createElement('div');
    div.className = 'sim-feed-item ' + (clase || '');
    div.innerHTML = '<span class="sim-feed-min">' + min + "'</span> " + texto;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function setMinuto(m) {
    var el = $('partido-minuto');
    if (el) el.textContent = m + "'";
  }

  function actualizarMarcador() {
    var gl = $('partido-goles-local');
    var gv = $('partido-goles-visit');
    if (gl) gl.textContent = S.golesLocal;
    if (gv) gv.textContent = S.golesVisit;
  }

  // ===== PUNTO DE ENTRADA (desde el HUB: AVANZAR AL DÍA DE PARTIDO) =====
  window.iniciarSimuladorJugador = function () {
    var data = BL.core.cargarPartida();
    if (!data || data.tipo !== 'manager' || !data.manager || !data.manager.egoistaCreado) return;

    var res = BL.util.getTemporada(data);
    var temporada = res.temporada;
    var liga = res.liga;
    if (!liga) return;
    var ligaKey = liga.nombre;
    var eqManager = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(function (e) { return e.name === data.manager.equipo; }) : null;
    if (!eqManager) return;

    var calendario = temporada.calendario[ligaKey];
    if (!calendario || temporada.jornadaActual >= calendario.length) {
      window.mostrarModal('TEMPORADA COMPLETA', '¡Has completado todas las jornadas de la liga! La temporada ha terminado.');
      return;
    }
    var jornada = calendario[temporada.jornadaActual];
    var partidoUsuario = jornada.find(function (par) { return par[0] === eqManager.id || par[1] === eqManager.id; });
    if (!partidoUsuario) return;

    var esLocal = partidoUsuario[0] === eqManager.id;
    var rivalId = esLocal ? partidoUsuario[1] : partidoUsuario[0];
    var rivalNombre = BL.util.nombreEquipoPorId(rivalId);

    S.data = data;
    S.temporada = temporada;
    S.ligaKey = ligaKey;
    S.eqManager = eqManager;
    S.partidoUsuario = partidoUsuario;
    S.esLocal = esLocal;
    S.rivalId = rivalId;
    S.rivalNombre = rivalNombre;
    S.minuto = 0;
    S.aciertos = 0; S.fallos = 0;
    S.golesLocal = 0; S.golesVisit = 0;
    S.enEvento = false;
    S.accion = null;

    // Marcador + jornada
    $('partido-jornada').textContent = 'JORNADA ' + (temporada.jornadaActual + 1) + ' · ' + liga.nombre;
    var nLocal = BL.util.nombreEquipoPorId(partidoUsuario[0]);
    var nVisit = BL.util.nombreEquipoPorId(partidoUsuario[1]);
    $('partido-nombre-local').textContent = nLocal;
    $('partido-nombre-visit').textContent = nVisit;
    $('partido-goles-local').textContent = '0';
    $('partido-goles-visit').textContent = '0';
    $('partido-minuto').textContent = '0\'';
    $('partido-log').innerHTML = '';
    $('partido-opciones').innerHTML = '';
    $('partido-resultado').innerHTML = '';
    $('partido-btn-fin').style.display = 'none';
    var btnTactica = $('partido-btn-tactica');
    if (btnTactica) btnTactica.style.display = 'none';

    // Simular todos los partidos IA de la jornada (excepto el del jugador)
    if (typeof window.simularJornadaGeneral === 'function') {
      window.simularJornadaGeneral(temporada.jornadaActual);
    }

    convocatoria();
    window.showScreen('screen-partido');
  };

  // ===== 1. FASE DE CONVOCATORIA =====
  function convocatoria() {
    // Asegurar alineación decidida en el HUB (el entrenador rota si falta)
    var tactica = S.data.manager.tactica;
    if (!tactica || !Array.isArray(tactica.once) || !tactica.once.length) {
      tactica = BL.util.alineacionEntrenador(S.data);
      S.data.manager.tactica = tactica;
    }

    // Decidir titularidad con la confianza del entrenador
    var conf = typeof S.data.manager.confianzaEntrenador === 'number' ? S.data.manager.confianzaEntrenador : 60;
    var enOnce = (tactica.once || []).indexOf('egoista') !== -1;
    var enBanca = (tactica.banca || []).indexOf('egoista') !== -1;
    var esTitular;
    if (conf < 40) esTitular = false;
    else if (conf > 75) esTitular = true;
    else esTitular = enOnce && Math.random() < (conf / 100);

    // Escribir la decisión en la alineación
    var once = (tactica.once || []).slice();
    var banca = (tactica.banca || []).slice();
    var iOnce = once.indexOf('egoista');
    var iBanca = banca.indexOf('egoista');
    if (esTitular && iOnce === -1 && iBanca !== -1) {
      once.push('egoista');
      banca.splice(iBanca, 1);
    } else if (!esTitular && iBanca === -1 && iOnce !== -1) {
      banca.push('egoista');
      once.splice(iOnce, 1);
    }
    tactica.once = once;
    tactica.banca = banca;
    S.esTitular = esTitular;
    S.banquillo = !esTitular;

    var opciones = $('partido-opciones');
    opciones.innerHTML = `
      <div class="sim-conv">
        <div class="sim-conv-estado ${esTitular ? 'titular' : 'banquillo'}">
          ${esTitular ? '<i class="fas fa-bolt"></i> ESTÁS EN EL 11 TITULAR' : '<i class="fas fa-chair"></i> ESTÁS EN EL BANQUILLO'}
        </div>
        <div class="sim-conv-info">Confianza del entrenador: <b>${conf}</b>%</div>
        <button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;margin-top:10px;" onclick="BL.simulador.arrancarPartido()">
          ${esTitular ? '<i class="fas fa-futbol"></i> SALTAR AL CAMPO' : '<i class="fas fa-hourglass-half"></i> ESPERAR EN EL BANQUILLO'}
        </button>
      </div>`;
  }

  window.BL = window.BL || {};
  BL.simulador = {};

  // ===== 2. MOTOR DE LÍNEA DE TIEMPO =====
  BL.simulador.arrancarPartido = function () {
    $('partido-opciones').innerHTML = '';
    feed(S.minuto === 0 ? 1 : S.minuto, '¡COMIENZA EL PARTIDO! ' + BL.util.nombreEquipoPorId(S.partidoUsuario[0]) + ' vs ' + BL.util.nombreEquipoPorId(S.partidoUsuario[1]), 'feed-gol');
    planificarGoles();
    planificarEventos();
    S.reloj = setInterval(tick, VELOCIDAD);
  };

  function planificarGoles() {
    S.golesPlan = { local: [], visit: [] };
    var nL = Math.floor(Math.random() * 3); // 0-2 goles de fondo
    var nV = Math.floor(Math.random() * 3);
    for (var i = 0; i < nL; i++) S.golesPlan.local.push(8 + Math.floor(Math.random() * 70));
    for (var i = 0; i < nV; i++) S.golesPlan.visit.push(8 + Math.floor(Math.random() * 70));
  }

  function planificarEventos() {
    var desde = S.esTitular ? 10 : 61;
    var hasta = 85;
    S.eventosObjetivo = 2 + Math.floor(Math.random() * 3); // 2-4
    var pool = [];
    for (var m = desde; m <= hasta; m++) pool.push(m);
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    S.eventosPlan = pool.slice(0, S.eventosObjetivo).sort(function (a, b) { return a - b; });
  }

  function golFondo(local) {
    if (local) { S.golesLocal++; feed(S.minuto, '¡GOL de ' + (BL.util.nombreEquipoPorId(S.partidoUsuario[0]) || 'los locales') + '!', 'feed-gol'); }
    else { S.golesVisit++; feed(S.minuto, '¡GOL de ' + (BL.util.nombreEquipoPorId(S.partidoUsuario[1]) || 'los visitantes') + '!', 'feed-gol'); }
    actualizarMarcador();
  }

  function narrarMinuto() {
    if (S.minuto % 7 === 0) {
      var narr = [
        'El balón circula por el centro del campo...',
        '¡Qué intensidad en la medular!',
        'Defensa firme, el rival no encuentra huecos.',
        'Contraataque veloz de tu equipo...'
      ];
      feed(S.minuto, narr[Math.floor(Math.random() * narr.length)]);
    }
  }

  function tick() {
    if (S.enEvento) return;
    if (S.minuto >= 90) { finalizarSimulador(); return; }
    S.minuto++;
    setMinuto(S.minuto);

    if (S.banquillo && S.minuto === 61) {
      S.banquillo = false;
      S.esTitular = true;
      feed(S.minuto, '¡El míster te hace entrar al campo! El Egoísta salta desde el banquillo.', 'feed-evento');
    }

    narrarMinuto();
    if (S.golesPlan.local.indexOf(S.minuto) !== -1) golFondo(true);
    if (S.golesPlan.visit.indexOf(S.minuto) !== -1) golFondo(false);

    if (S.esTitular && S.eventosPlan.indexOf(S.minuto) !== -1) {
      lanzarEvento();
    }
  }

  // ===== 3. EVENTOS CRÍTICOS + DUELO CON BARRA DE PRECISIÓN =====

  var SITUACIONES_CAMPO = [
    {
      texto: 'Uno contra uno',
      rival: { etiqueta: 'te cierra', statKey: 'def', base: 68, perfil: 'defensa' },
      opciones: [
        { id: 'regatear', label: 'REGATEAR', statKey: 'dri' },
        { id: 'pasar', label: 'PASAR', statKey: 'pas' },
        { id: 'disparar', label: 'DISPARAR', statKey: 'sho' },
        { id: 'proteger', label: 'PROTEGER', statKey: 'phy' }
      ]
    },
    {
      texto: 'Recibes de espaldas',
      rival: { etiqueta: 'te presiona', statKey: 'phy', base: 70, perfil: 'medio' },
      opciones: [
        { id: 'girar', label: 'GIRAR', statKey: 'dri' },
        { id: 'devolver', label: 'DEVOLVER', statKey: 'pas' },
        { id: 'proteger', label: 'PROTEGER', statKey: 'phy' }
      ]
    },
    {
      texto: 'Llegas al área',
      rival: { etiqueta: 'el portero sale', statKey: 'pos', base: 70, perfil: 'portero' },
      opciones: [
        { id: 'disparar', label: 'DISPARAR', statKey: 'sho' },
        { id: 'regatear', label: 'REGATEAR AL PORTERO', statKey: 'dri' },
        { id: 'pasar', label: 'PASAR AL COMPAÑERO', statKey: 'pas' }
      ]
    },
    {
      texto: 'Contraataque',
      rival: { etiqueta: 'te persigue', statKey: 'pac', base: 75, perfil: 'veloz' },
      opciones: [
        { id: 'velocidad', label: 'GANAR VELOCIDAD', statKey: 'pac' },
        { id: 'regatear', label: 'REGATEAR', statKey: 'dri' },
        { id: 'pasar', label: 'PASAR', statKey: 'pas' }
      ]
    },
    {
      texto: 'Doble presión',
      rival: { etiqueta: 'te cierran', statKey: 'def', base: 72, perfil: 'defensa' },
      opciones: [
        { id: 'regatear', label: 'REGATEAR', statKey: 'dri' },
        { id: 'pasar', label: 'PASAR', statKey: 'pas' },
        { id: 'disparar', label: 'DISPARAR', statKey: 'sho' }
      ]
    }
  ];

  var SITUACIONES_POR = [
    {
      texto: '¡Disparo lejano!',
      rival: { etiqueta: 'chuta', statKey: 'sho', base: 75, perfil: 'delantero' },
      opciones: [
        { id: 'estirar', label: 'ESTIRADA', statKey: 'div' },
        { id: 'reflejos', label: 'REFLEJOS', statKey: 'ref' },
        { id: 'mano', label: 'MANO A MANO', statKey: 'han' }
      ]
    },
    {
      texto: 'Uno contra uno',
      rival: { etiqueta: 'regatea', statKey: 'dri', base: 78, perfil: 'delantero' },
      opciones: [
        { id: 'salir', label: 'SALIR', statKey: 'spd' },
        { id: 'aguantar', label: 'AGUANTAR LÍNEA', statKey: 'pos' },
        { id: 'mano', label: 'MANO A MANO', statKey: 'han' }
      ]
    },
    {
      texto: 'Centro peligroso',
      rival: { etiqueta: 'saca', statKey: 'sho', base: 72, perfil: 'delantero' },
      opciones: [
        { id: 'atrapa', label: 'ATRAPAR', statKey: 'han' },
        { id: 'despejar', label: 'DESPEJAR', statKey: 'kic' },
        { id: 'salir', label: 'SALIR', statKey: 'spd' }
      ]
    }
  ];

  function esPortero() {
    return S.data.manager.egoista && S.data.manager.egoista.posicion === 'POR';
  }

  function etiquetaStat(key) {
    var map = { sho: 'TIR', dri: 'REG', pas: 'PAS', def: 'DEF', phy: 'FIS', pac: 'RIT',
                div: 'EST', han: 'PAR', kic: 'SAQ', ref: 'REF', spd: 'VEL', pos: 'POS' };
    return map[key] || key.toUpperCase();
  }

  // Elige un rival real según el perfil y devuelve su nombre y su stat para la acción
  function elegirRival(cfg) {
    var rival = BL.util.getPlantillaPorNombre(S.rivalNombre);
    if (Array.isArray(rival) && rival.length) {
      var pool = rival;
      if (cfg.perfil === 'defensa') pool = rival.filter(function (p) { return ['DFC', 'LD', 'LI', 'MCD'].indexOf(p.posicion) !== -1; });
      else if (cfg.perfil === 'portero') pool = rival.filter(function (p) { return p.posicion === 'POR'; });
      else if (cfg.perfil === 'delantero') pool = rival.filter(function (p) { return ['DC', 'EI', 'ED', 'MCO'].indexOf(p.posicion) !== -1; });
      else if (cfg.perfil === 'medio') pool = rival.filter(function (p) { return ['MC', 'MCD', 'MI', 'MD', 'MCO'].indexOf(p.posicion) !== -1; });
      pool = pool.length ? pool : rival;
      var d = pool[Math.floor(Math.random() * pool.length)];
      if (d) {
        var stat = (typeof d[cfg.statKey] === 'number') ? d[cfg.statKey] : cfg.base;
        return { nombre: d.nombre || null, stat: stat };
      }
    }
    return { nombre: null, stat: cfg.base };
  }

  function lanzarEvento() {
    S.enEvento = true;
    clearInterval(S.reloj);
    var situaciones = esPortero() ? SITUACIONES_POR : SITUACIONES_CAMPO;
    var situacion = situaciones[Math.floor(Math.random() * situaciones.length)];
    var rival = elegirRival(situacion.rival);
    S.situacion = situacion;
    S.rivalStat = rival.stat;
    S.rivalNombreActual = rival.nombre;

    feed(S.minuto, '¡DUELO! ' + (S.rivalNombreActual || 'Un rival') + ' ' + situacion.rival.etiqueta +
      ' — ' + etiquetaStat(situacion.rival.statKey) + ' ' + rival.stat, 'feed-critico');
    var opciones = $('partido-opciones');
    opciones.innerHTML = `
      <div class="sim-evento">
        <div class="sim-evento-titulo">${situacion.texto}</div>
        <div class="duelo-rival">${S.rivalNombreActual || 'El rival'} va a usar <b>${etiquetaStat(situacion.rival.statKey)} ${rival.stat}</b></div>
        <div class="sim-evento-opts">
          ${situacion.opciones.map(function (o) {
            return '<button class="btn-bluelock sim-evento-btn" onclick="BL.simulador.elegirAccion(\'' + o.id + '\')">' + o.label + '</button>';
          }).join('')}
        </div>
      </div>`;
  }

  BL.simulador.elegirAccion = function (tipo) {
    var situacion = S.situacion;
    var opt = null;
    situacion.opciones.forEach(function (o) { if (o.id === tipo) opt = o; });
    if (!opt) return;
    var jug = BL.util.getJugador('egoista', S.data.manager.equipo);
    var stat = (jug && typeof jug[opt.statKey] === 'number') ? jug[opt.statKey] : 55;
    S.accion = { tipo: tipo, label: opt.label, stat: stat, statKey: opt.statKey, rival: S.rivalStat };
    mostrarPrecision();
  };

  function mostrarPrecision() {
    var opciones = $('partido-opciones');
    var a = S.accion;
    var keyRival = S.situacion.rival.statKey;
    var prob = clamp(a.stat - a.rival + 50, 5, 95);
    var fallo = 100 - prob;
    S.probAcierto = prob;
    opciones.innerHTML = `
      <div class="sim-evento">
        <div class="sim-evento-titulo">${a.label} — PULSA EN EL MOMENTO EXACTO</div>
        <div class="precision-meta">Tu <b>${etiquetaStat(a.statKey)} ${a.stat}</b> · Rival <b>${etiquetaStat(keyRival)} ${a.rival}</b></div>
        <div class="precision-bar" id="precision-bar">
          <div class="precision-zona pz-exito" style="width:${prob}%"></div>
          <div class="precision-zona pz-fallo" style="width:${fallo}%"></div>
          <div class="precision-aguja" id="precision-aguja"></div>
        </div>
        <div class="precision-leyenda">
          <span class="ley-rojo">FALLO ${fallo}%</span>
          <span class="ley-azul">ÉXITO ${prob}%</span>
        </div>
        <button class="btn-bluelock btn-gold" style="width:100%;justify-content:center;" onclick="BL.simulador.resolverPrecision()">¡AHORA!</button>
      </div>`;

    S.precisionPos = 0;
    S.precisionDir = 1;
    cancelAnimationFrame(S.precisionRAF);
    function anim() {
      S.precisionPos += S.precisionDir * 1.7;
      if (S.precisionPos > 100) { S.precisionPos = 100; S.precisionDir = -1; }
      if (S.precisionPos < 0) { S.precisionPos = 0; S.precisionDir = 1; }
      var aguja = $('precision-aguja');
      if (aguja) aguja.style.left = S.precisionPos + '%';
      S.precisionRAF = requestAnimationFrame(anim);
    }
    anim();
  }

  BL.simulador.resolverPrecision = function () {
    cancelAnimationFrame(S.precisionRAF);
    var pos = S.precisionPos;
    var accion = S.accion;
    if (!accion) return;
    var exito = pos <= S.probAcierto;
    if (exito) {
      S.aciertos++;
      feed(S.minuto, '¡Éxito! Ganas el duelo ' + accion.stat + ' vs ' + accion.rival + '.', 'feed-acierto');
    } else {
      S.fallos++;
      feed(S.minuto, 'Fallas: la jugada no sale bien.', 'feed-fallo');
    }
    aplicarEfectoAccion(accion, exito);
    $('partido-opciones').innerHTML = '';
    S.enEvento = false;
    S.reloj = setInterval(tick, VELOCIDAD);
  };

  function aplicarEfectoAccion(accion, exito) {
    if (esPortero()) {
      if (exito) {
        BL.util.sumarRendimiento('egoista', { paradas: 1 });
        feed(S.minuto, '¡' + accion.label + '! Atajada del Egoísta.', 'feed-gol');
      } else {
        if (S.esLocal) S.golesVisit++; else S.golesLocal++;
        feed(S.minuto, '¡GOL del rival! El disparo se cuela.', 'feed-fallo');
      }
      actualizarMarcador();
      return;
    }
    if (!exito) return;
    if (accion.tipo === 'disparar') {
      if (S.esLocal) S.golesLocal++; else S.golesVisit++;
      BL.util.sumarRendimiento('egoista', { goles: 1 });
      feed(S.minuto, '¡GOOOL! Tu disparo entra!', 'feed-gol');
    } else if (accion.tipo === 'pasar') {
      BL.util.sumarRendimiento('egoista', { asistencias: 1 });
      feed(S.minuto, '¡Asistencia de gol!', 'feed-acierto');
    } else {
      feed(S.minuto, '¡' + accion.label + '! Te impones en el duelo.', 'feed-acierto');
    }
    actualizarMarcador();
  }

  // ===== 4. RESULTADOS FINALES =====
  function finalizarSimulador() {
    clearInterval(S.reloj);
    cancelAnimationFrame(S.precisionRAF);
    S.minuto = 90;
    setMinuto(90);

    var nota = clamp(5 + S.aciertos * 1.5 - S.fallos * 1.5, 1, 10);
    var notaR = Math.round(nota * 10) / 10;
    var puntosEgo = Math.round(notaR * 2);

    // Rendimiento del partido (PJ) y nota media — se persiste vía BL.core
    BL.util.sumarRendimiento('egoista', { partidosJugados: 1 });
    var fresh = BL.core.cargarPartida();
    if (!fresh || fresh.tipo !== 'manager' || !fresh.manager) { fresh = S.data; }

    var r = fresh.manager.rendimiento && fresh.manager.rendimiento.egoista
      ? fresh.manager.rendimiento.egoista
      : { partidosJugados: 1, notaMedia: 0, mvps: 0 };
    var pj = r.partidosJugados || 1;
    r.notaMedia = pj > 1
      ? Math.round(((r.notaMedia || 0) * (pj - 1) + notaR) / pj * 10) / 10
      : notaR;
    if (notaR >= 8) r.mvps = (r.mvps || 0) + 1;
    if (!fresh.manager.rendimiento) fresh.manager.rendimiento = {};
    fresh.manager.rendimiento.egoista = r;

    // Puntos de Ego
    if (!fresh.manager.egoista) fresh.manager.egoista = {};
    fresh.manager.egoista.puntosEgo = (fresh.manager.egoista.puntosEgo || 0) + puntosEgo;

    // Confianza del entrenador
    var conf = typeof fresh.manager.confianzaEntrenador === 'number' ? fresh.manager.confianzaEntrenador : 60;
    fresh.manager.confianzaEntrenador = clamp(conf + Math.round((notaR - 6) * 3), 0, 100);

    // Resultado y avance de temporada
    var res = BL.util.getTemporada(fresh);
    var temporada = res.temporada;
    BL.util.aplicarResultado(temporada.clasificacion, S.partidoUsuario[0], S.partidoUsuario[1], S.golesLocal, S.golesVisit);
    if (!temporada.partidosJugados) temporada.partidosJugados = [];
    temporada.partidosJugados.push({
      jornada: temporada.jornadaActual + 1,
      local: S.partidoUsuario[0], visit: S.partidoUsuario[1],
      gl: S.golesLocal, gv: S.golesVisit, fondo: []
    });
    temporada.jornadaActual += 1;
    fresh.manager.semana = (fresh.manager.semana || 0) + 1;
    fresh.manager.entrenadoSemana = false;

    BL.core.guardarPartida(fresh);
    BL.util.sincronizarSlotActivo();
    S.data = fresh;

    var victoria = S.esLocal ? S.golesLocal > S.golesVisit : S.golesVisit > S.golesLocal;
    var empate = S.golesLocal === S.golesVisit;

    var resultadoHtml = `
      <div class="sim-resultado ${victoria ? 'victoria' : empate ? 'empate' : 'derrota'}">
        <div class="sim-resultado-score">${S.golesLocal} - ${S.golesVisit}</div>
        <div class="sim-resultado-titulo">${victoria ? '<i class="fas fa-trophy"></i> ¡VICTORIA!' : empate ? '<i class="fas fa-handshake"></i> EMPATE' : '<i class="fas fa-heart-broken"></i> DERROTA'}</div>
        <div class="sim-resultado-fila"><span>Aciertos / Fallos</span><b>${S.aciertos} / ${S.fallos}</b></div>
        <div class="sim-resultado-fila"><span>Nota del partido</span><b class="nota">${notaR.toFixed(1)}</b></div>
        <div class="sim-resultado-fila"><span>Puntos de Ego</span><b>+${puntosEgo}</b></div>
        <div class="sim-resultado-fila"><span>Confianza del entrenador</span><b>${fresh.manager.confianzaEntrenador}%</b></div>
      </div>`;
    $('partido-resultado').innerHTML = resultadoHtml;
    $('partido-btn-fin').style.display = 'block';
    feed(90, '¡FINAL DEL PARTIDO!', 'feed-gol');
  }
})();
