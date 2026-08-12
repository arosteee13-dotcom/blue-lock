// LÓGICA PRINCIPAL DEL MENÚ Y NAVEGACIÓN DE BLUE LOCK MANAGER

document.addEventListener('DOMContentLoaded', () => {
  console.log("Blue Lock Manager Engine initialized.");

  // Capturador global de errores (diagnóstico en pantalla)
  window.onerror = function (msg, src, line, col, err) {
    const el = document.getElementById('error-overlay');
    if (el) {
      el.style.display = 'block';
      el.textContent = 'ERROR: ' + msg + '\n' + (src || '') + ':' + line + ':' + col + '\n' + (err && err.stack ? err.stack : '');
    }
  };

  // App State (estado compartido definido en database-core.js)
  const gameState = BL.estado.gameState;

  // Audio Global
  const estadoAudio = BL.estado.audio;

  // Utilidades compartidas para los módulos (acceso perezoso a helpers del motor)
  BL.util.actualizarMonedasUI = function () { actualizarMonedasUI(); };
  BL.util.animFila = function (idx) { return animFila(idx); };
  BL.util.elegirMejorOnce = function (plantilla, formacion) { return elegirMejorOnce(plantilla, formacion); };
  BL.util.getPlantillaEquipo = function (nombre) { return getPlantillaEquipo(nombre); };
  BL.util.aplicarResultado = function (clasif, l, v, gl, gv) { aplicarResultado(clasif, l, v, gl, gv); };
  BL.util.getPlantillaPorNombre = function (nombre) { return getPlantillaPorNombre(nombre); };
  BL.util.getJugador = function (id, equipo) { return getJugador(id, equipo); };
  BL.util.teamIdPorNombre = function (nombre) { return teamIdPorNombre(nombre); };
  BL.util.nombreEquipoPorId = function (id) { return nombreEquipoPorId(id); };
  BL.util.normalizarJugador = function (j) { return normalizarJugador(j); };
  BL.util.sumarRendimiento = function (jugId, cambios) { sumarRendimiento(jugId, cambios); };
  BL.util.ligaDeClubId = function (id) { return ligaDeClubId(id); };
  BL.util.getTemporada = function (data) { return getTemporada(data); };
  BL.util.getLigaDeManager = function (data) { return getLigaDeManager(data); };
  BL.util.sincronizarSlotActivo = function () { sincronizarSlotActivo(); };
  BL.util.alineacionEntrenador = function (data) { return alineacionEntrenador(data); };
  BL.util.simularPartidoFondo = function (data, lid, vid) { return simularPartidoFondoDesdeData(data, lid, vid); };
  BL.util.descontarEstaminaEquipoNPC = function (data, teamId) { descontarEstaminaEquipoNPC(data, teamId); };
  BL.util.repartirGolesNPC = function (data, teamId, goles) { repartirGolesNPCMemoria(data, teamId, goles); };
  BL.util.plantillaDesdeData = function (data, teamId) { return plantillaDesdeData(data, teamId); };
  BL.util.sumarRendimientoBatch = function (jugId, cambios) { sumarRendimientoBatch(jugId, cambios); };
  BL.util.persistirRendimiento = function () { persistirRendimiento(); };

  let plantillaSort = { by: 'posicion', asc: true };
  let plantillaVista = 'info';
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
    if (!data.manager.listaTraspasos) data.manager.listaTraspasos = [];
    if (!data.manager.rendimiento) data.manager.rendimiento = {};
    if (!data.manager.traspasos) data.manager.traspasos = {};
    const liga = getLigaDeManager(data);
    if (typeof CONFIG_PAISES !== 'undefined') {
      CONFIG_PAISES.forEach(pais => {
        pais.ligas.forEach(l => {
          const ids = l.equipos.map(e => e.id);
          const cal = t.calendario[l.nombre];
          const desactualizado = cal && !calendarioCoincide(cal, ids);
          if (!cal || desactualizado) {
            t.calendario[l.nombre] = generarCalendarioRoundRobin(ids);
            l.equipos.forEach(e => {
              if (!t.clasificacion[e.id]) t.clasificacion[e.id] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 };
            });
          }
        });
      });
    }
    return { temporada: t, liga };
  }

  function calendarioCoincide(cal, ids) {
    const set = new Set(ids);
    const enCal = new Set();
    cal.forEach(jornada => jornada.forEach(([l, v]) => { enCal.add(l); enCal.add(v); }));
    if (enCal.size !== set.size) return false;
    for (const id of set) if (!enCal.has(id)) return false;
    return true;
  }

  const RENDIMIENTO_DEFAULT = () => ({
    partidosJugados: 0, goles: 0, asistencias: 0, paradas: 0,
    tarjetasAmarillas: 0, tarjetasRojas: 0, notaMedia: 0.0, mvps: 0
  });

  let rendimientoCache = null;

  function leerRendimientoData() {
    if (rendimientoCache) return rendimientoCache;
    try {
      const saved = BL.core.leerGuardado();
      if (!saved) return (rendimientoCache = {});
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return (rendimientoCache = {});
      if (!data.manager.rendimiento) data.manager.rendimiento = {};
      rendimientoCache = data.manager.rendimiento;
    } catch (e) {
      rendimientoCache = {};
    }
    return rendimientoCache;
  }

  function getRendimiento(jugId) {
    const mapa = leerRendimientoData();
    if (!mapa[jugId]) mapa[jugId] = RENDIMIENTO_DEFAULT();
    return mapa[jugId];
  }

  function aplicarRendimiento(jug) {
    if (!jug || !jug.id) return jug;
    jug.rendimiento = { ...RENDIMIENTO_DEFAULT(), ...getRendimiento(jug.id) };
    return jug;
  }

  function persistirRendimiento() {
    try {
      const saved = BL.core.leerGuardado();
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return;
      data.manager.rendimiento = leerRendimientoData();
      BL.core.guardarPartida(JSON.stringify(data));
      sincronizarSlotActivo();
      rendimientoCache = null;
    } catch (e) { /* noop */ }
  }

  function sumarRendimiento(jugId, cambios) {
    const r = getRendimiento(jugId);
    const keys = ['partidosJugados', 'goles', 'asistencias', 'paradas', 'tarjetasAmarillas', 'tarjetasRojas'];
    keys.forEach(k => {
      if (typeof cambios[k] === 'number') r[k] = (r[k] || 0) + cambios[k];
    });
    persistirRendimiento();
  }

  // Acumula rendimiento en memoria sin persistir por cada jugador (para bucles grandes)
  function sumarRendimientoBatch(jugId, cambios) {
    const r = getRendimiento(jugId);
    const keys = ['partidosJugados', 'goles', 'asistencias', 'paradas', 'tarjetasAmarillas', 'tarjetasRojas'];
    keys.forEach(k => {
      if (typeof cambios[k] === 'number') r[k] = (r[k] || 0) + cambios[k];
    });
  }

  function aplicarNota(jugId, nota) {
    const r = getRendimiento(jugId);
    const clamp = Math.max(1, Math.min(10, nota));
    r.notaMedia = r.partidosJugados > 0
      ? Math.round(((r.notaMedia || 0) * (r.partidosJugados - 1) + clamp) / r.partidosJugados * 10) / 10
      : clamp;
    persistirRendimiento();
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
      const saved = BL.core.leerGuardado();
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

  function cobrarEstaminaArma(data, jugId, teamId, coste) {
    if (!jugId || !teamId || !coste) return;
    const actual = (esEquipoManager(data, teamId)
      ? (data.manager.estamina?.[jugId] ?? ESTAMINA_MAX)
      : (data.manager.temporada?.estaminaNPC?.[teamId]?.[jugId] ?? ESTAMINA_MAX));
    guardarEstaminaEnData(data, jugId, teamId, actual - coste);
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
    badge.classList.remove('buzon-pulse');
    if (noLeidos > 0) {
      void badge.offsetWidth;
      badge.classList.add('buzon-pulse');
    }
  };

  function renderizarStatsOferta(info) {
    if (!info) return '';
    const esPOR = info.posicion === 'POR';
    const stat = (e, v) => `<div class="pfila-stat"><span>${e}</span>${v || 60}</div>`;
    return esPOR
      ? `${stat('EST', info.div)}${stat('PAR', info.han)}${stat('SAQ', info.kic)}${stat('REF', info.ref)}${stat('VEL', info.spd)}${stat('POS', info.pos)}`
      : `${stat('RIT', info.pac)}${stat('TIR', info.tiro)}${stat('PAS', info.pase)}${stat('REG', info.regate)}${stat('DEF', info.defensa)}${stat('FIS', info.phy)}`;
  }

  window.abrirMensaje = function (id) {
    const buzon = estadoBuzon;
    const msg = (buzon?.mensajes || []).find(m => m.id === id);
    if (!msg) return;
    if (!msg.leido) {
      msg.leido = true;
      try {
        const saved = BL.core.leerGuardado();
        if (saved) {
          const data = JSON.parse(saved);
          if (data.manager) {
            data.manager.buzon = buzon;
            BL.core.guardarPartida(JSON.stringify(data));
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
      let ofertasHtml = '';
      if (msg.tipo === 'oferta' && Array.isArray(msg.ofertas) && msg.ofertas.length) {
        if (msg.jugadorInfo && !msg.jugadorInfo.equipo) {
          let jugDB = todosLosJugadores().find(p => p.id === msg.jugadorInfo.id);
          if (!jugDB) jugDB = getFichajes().find(p => p.id === msg.jugadorInfo.id);
          if (jugDB) msg.jugadorInfo.equipo = jugDB.equipo;
        }
        const jugCard = msg.jugadorInfo
          ? `<div class="plantilla-card-wrapper">
              <div class="pfila pfila-info-row pfila-oferta">
                ${pfilaContenido(msg.jugadorInfo)}
                <div class="buzon-oferta-stats">${renderizarStatsOferta(msg.jugadorInfo)}</div>
              </div>
            </div>`
          : '';
        if (msg.contrato) {
          ofertasHtml = `<div class="buzon-ofertas">` + msg.ofertas.map(o => `
            <div class="buzon-oferta">
              <div class="buzon-oferta-club">
                <span class="buzon-oferta-logo">${htmlEscudoEquipo(o.club)}</span>
                <span class="buzon-oferta-nombre">${o.club}</span>
              </div>
              <div class="buzon-oferta-liga">${o.liga}</div>
              <div class="buzon-oferta-precio">${formatearYenes(o.sueldo)}</div>
              <div class="buzon-oferta-acciones">
                <button class="buzon-oferta-btn aceptar" onclick="firmarContrato('${msg.id}','${o.id}')"><i class="fas fa-pen-nib"></i> FIRMAR</button>
              </div>
            </div>`).join('') + `</div>`;
        } else {
          ofertasHtml = `${jugCard}<div class="buzon-ofertas">` + msg.ofertas.map((o, i) => `
          <div class="buzon-oferta">
            <div class="buzon-oferta-club">
              <span class="buzon-oferta-logo">${htmlEscudoEquipo(o.club)}</span>
              <span class="buzon-oferta-nombre">${o.club}</span>
            </div>
            <div class="buzon-oferta-precio">${formatearYenes(o.precio)}</div>
            ${typeof o.precioInicial === 'number' && o.precio !== o.precioInicial
              ? `<div class="buzon-oferta-subida"><i class="fas fa-arrow-up"></i> EL CLUB TE OFRECE ${formatearYenes(o.precio)}</div>`
              : ''}
            <div class="buzon-oferta-acciones">
              <button class="buzon-oferta-btn aceptar" onclick="aceptarOferta('${msg.id}','${o.id}')"><i class="fas fa-check"></i> ACEPTAR</button>
              <button class="buzon-oferta-btn rechazar" onclick="rechazarOferta('${msg.id}','${o.id}')"><i class="fas fa-times"></i> RECHAZAR</button>
              <button class="buzon-oferta-btn contra" onclick="mostrarContraoferta('${msg.id}','${o.id}')"><i class="fas fa-handshake"></i> CONTRAOFERTAR</button>
            </div>
            <div class="buzon-contraoferta" id="contra-${o.id}" style="display:none;">
              <span class="buzon-contraoferta-titulo">PEDIR UN % MÁS:</span>
              <div class="buzon-contraoferta-opts">
                <button class="buzon-contra-btn" onclick="enviarContraoferta('${msg.id}','${o.id}',5)">+5%</button>
                <button class="buzon-contra-btn" onclick="enviarContraoferta('${msg.id}','${o.id}',10)">+10%</button>
                <button class="buzon-contra-btn" onclick="enviarContraoferta('${msg.id}','${o.id}',15)">+15%</button>
                <button class="buzon-contra-btn" onclick="enviarContraoferta('${msg.id}','${o.id}',20)">+20%</button>
              </div>
            </div>
          </div>`).join('') + `</div>`;
        }
      }
      detalle.innerHTML = `
        <div class="buzon-detalle-card">
          <div class="buzon-detalle-remitente">DE: ${msg.remitente}</div>
          <div class="buzon-detalle-asunto">${msg.asunto}</div>
          <div class="buzon-detalle-meta">Jornada ${msg.jornada} · ${msg.tipo === 'medico' ? '🚨 Alerta' : msg.contrato ? '📝 Oferta de contrato' : msg.tipo === 'oferta' ? '💰 Oferta de traspaso' : '📋 Información'}</div>
          <div class="buzon-detalle-cuerpo">${msg.cuerpo}</div>
          ${ofertasHtml}
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

  window.volverListaBuzonSiDetalle = function () {
    const detalle = document.getElementById('buzon-detalle');
    if (detalle && detalle.style.display !== 'none') {
      volverListaBuzon();
    } else {
      goBack();
    }
  };

  function cerrarOfertaEnMensaje(data, msgId, ofertaId) {
    const buzon = getBuzon(data);
    const msg = (buzon.mensajes || []).find(m => m.id === msgId);
    if (!msg) return;
    if (Array.isArray(msg.ofertas)) {
      msg.ofertas = msg.ofertas.filter(o => o.id !== ofertaId);
    }
    data.manager.buzon = buzon;
  }

  function refrescarBuzonTrasOferta(msgId) {
    try {
      const saved = BL.core.leerGuardado();
      if (saved) {
        const data = JSON.parse(saved);
        if (data.manager) {
          const buzon = getBuzon(data);
          if (Array.isArray(buzon.mensajes)) {
            buzon.mensajes = buzon.mensajes.filter(m => {
              if (m.tipo === 'oferta') return Array.isArray(m.ofertas) && m.ofertas.length > 0;
              return true;
            });
          }
          data.manager.buzon = buzon;
          BL.core.guardarPartida(JSON.stringify(data));
        }
      }
    } catch (e) { /* noop */ }
    actualizarBuzonBadge();
    const presupuestoEl = document.getElementById('mercado-presupuesto');
    if (presupuestoEl) presupuestoEl.textContent = formatearYenes(getPresupuestoManager());
    const detalle = document.getElementById('buzon-detalle');
    const lista = document.getElementById('buzon-lista');
    const msgSigue = (estadoBuzon?.mensajes || []).some(m => m.id === msgId);
    if (msgSigue) {
      abrirMensaje(msgId);
    } else {
      if (detalle) detalle.style.display = 'none';
      renderBuzon();
      if (lista) lista.style.display = 'flex';
    }
  }

  function ligaDeClubId(clubId) {
    if (typeof CONFIG_PAISES === 'undefined') return '—';
    for (const pais of CONFIG_PAISES) {
      for (const liga of pais.ligas) {
        if (liga.equipos.some(e => e.id === clubId)) return liga.nombre;
      }
    }
    return '—';
  }

  // Genera las 3 ofertas iniciales de clubes (instituto-con-equipo primero si aplica)
  function generarOfertasIniciales(manager) {
    const clubes = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.slice() : [];
    const instituto = manager?.egoista?.instituto || '';
    const clubInstituto = instituto ? (clubes.find(eq => eq.name === instituto) || null) : null;

    const pool = clubInstituto ? clubes.filter(eq => eq.id !== clubInstituto.id) : clubes;
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const seleccion = clubInstituto ? [clubInstituto, ...pool.slice(0, 2)] : pool.slice(0, 3);
    return seleccion.map((eq, idx) => ({
      id: 'ct_' + idx + '_' + Math.floor(Math.random() * 99999),
      clubId: eq.id,
      club: eq.name,
      liga: ligaDeClubId(eq.id)
    }));
  }

  // ===== MODAL OFERTAS INICIALES DE CLUBES =====

  window.cerrarModalOfertas = function () {
    document.getElementById('modal-ofertas-iniciales').classList.remove('active');
  };

  window.abrirModalOfertasIniciales = function () {
    const overlay = document.getElementById('modal-ofertas-iniciales');
    const cont = document.getElementById('ofertas-iniciales-content');
    if (!overlay || !cont) return;
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    if (!data.manager.eleccionEquipoPendiente) return;
    const ofertas = data.manager.ofertasIniciales || [];
    if (ofertas.length === 0) return;
    const valor = VALOR_POSICION[data.manager.egoista?.posicion] || 1500000;

    cont.innerHTML = ofertas.map(o => `
      <div class="oferta-club-card">
        <div class="oferta-club-logo">${htmlEscudoEquipo(o.club)}</div>
        <div class="oferta-club-info">
          <span class="oferta-club-nombre">${o.club}</span>
          <span class="oferta-club-liga">${o.liga || '—'}</span>
          <span class="oferta-club-valor"><i class="fas fa-coins"></i> ${formatearYenesCompleto(valor)}</span>
        </div>
        <button class="oferta-club-btn" onclick="aceptarOfertaInicial('${o.clubId}')">
          <i class="fas fa-pen-nib"></i> ACEPTAR CONTRATO
        </button>
      </div>`).join('');

    overlay.classList.add('active');
  };

  window.aceptarOfertaInicial = function (clubId) {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const oferta = (data.manager.ofertasIniciales || []).find(o => o.clubId === clubId);
    if (!oferta) return;

    const valor = VALOR_POSICION[data.manager.egoista?.posicion] || 1500000;
    data.manager.equipo = oferta.club;
    data.manager.presupuesto = valor;
    data.manager.eleccionEquipoPendiente = false;
    if (data.manager.egoista) data.manager.egoista.equipo = oferta.club;
    const fich = (data.manager.fichajes || []).find(f => f.id === 'egoista');
    if (fich) { fich.equipo = oferta.club; fich.agenteLibre = false; }

    // El Egoísta pasa a formar parte de la plantilla del club (juega, sale en la alineación y acumula estadísticas)
    const teamId = teamIdPorNombre(oferta.club);
    if (teamId) {
      const jugador = normalizarJugador({ ...fich, id: 'egoista' });
      if (typeof ligaDeClubId === 'function') jugador.liga = ligaDeClubId(teamId) || jugador.liga;
      if (!data.manager.equipos) data.manager.equipos = {};
      if (!Array.isArray(data.manager.equipos[teamId])) data.manager.equipos[teamId] = [];
      const yaEnPlantilla = data.manager.equipos[teamId].some(p => p.id === 'egoista');
      if (!yaEnPlantilla) {
        jugador.dorsal = data.manager.equipos[teamId].length + 1;
        data.manager.equipos[teamId].push(jugador);
      }
    }

    if (!data.manager.buzon) data.manager.buzon = { mensajes: [] };
    data.manager.buzon.mensajes.unshift({
      id: 'ctr_' + Date.now(),
      remitente: 'Oficina del Club',
      asunto: 'CONTRATO FIRMADO',
      cuerpo: `Bienvenido a tu nuevo club ${oferta.club}. Tu Egoísta ha debutado oficialmente.`,
      leido: false,
      jornada: 0,
      tipo: 'info'
    });

    BL.core.guardarPartida(data);
    sincronizarSlotActivo();
    cerrarModalOfertas();
    renderHub();
  };
  window.firmarContrato = function (msgId, ofertaId) {
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const buzon = getBuzon(data);
    const msg = (buzon.mensajes || []).find(m => m.id === msgId);
    const oferta = msg && Array.isArray(msg.ofertas) ? msg.ofertas.find(o => o.id === ofertaId) : null;
    if (!oferta) return;

    data.manager.equipo = oferta.club;
    data.manager.presupuesto = oferta.sueldo || 0;
    if (data.manager.egoista) data.manager.egoista.equipo = oferta.club;
    const fich = (data.manager.fichajes || []).find(f => f.id === 'egoista');
    if (fich) { fich.equipo = oferta.club; fich.agenteLibre = false; }
    buzon.mensajes = buzon.mensajes.filter(m => m.id !== msgId);
    data.manager.buzon = buzon;
    BL.core.guardarPartida(JSON.stringify(data));
    mostrarModal('¡CONTRATO FIRMADO!', `¡${data.manager.egoista?.nombre || 'Tu Egoísta'} ha firmado con ${oferta.club}!`);
    renderHub();
    showScreen('screen-hub');
  };

  window.aceptarOferta = function (msgId, ofertaId) {
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const buzon = getBuzon(data);
    const msg = (buzon.mensajes || []).find(m => m.id === msgId);
    const oferta = msg && Array.isArray(msg.ofertas) ? msg.ofertas.find(o => o.id === ofertaId) : null;
    if (!oferta) return;

    const jugadorId = oferta.jugadorId;
    const precio = oferta.precio;
    if (!data.manager.traspasos) data.manager.traspasos = {};
    data.manager.traspasos[jugadorId] = { clubId: oferta.clubId, club: oferta.club };
    if (data.manager.fichajes) {
      data.manager.fichajes = data.manager.fichajes.filter(f => f.id !== jugadorId);
    }
    if (data.manager.listaTraspasos) {
      data.manager.listaTraspasos = data.manager.listaTraspasos.filter(id => id !== jugadorId);
    }
    data.manager.presupuesto = (data.manager.presupuesto || 0) + precio;

    // Limpiar cualquier oferta pendiente de ese jugador en otros mensajes
    (buzon.mensajes || []).forEach(m => {
      if (Array.isArray(m.ofertas)) {
        m.ofertas = m.ofertas.filter(o => o.jugadorId !== jugadorId);
      }
    });
    data.manager.buzon = buzon;
    BL.core.guardarPartida(JSON.stringify(data));

    const clubNombre = oferta.club || 'el club';
    const nombreJug = getJugador(jugadorId, data.manager.equipo)?.nombre || oferta.jugador || 'el jugador';
    mostrarModal('¡TRASPASO COMPLETADO!', `Has vendido a ${nombreJug} a ${clubNombre} por ${formatearYenes(precio)}.`);
    refrescarBuzonTrasOferta(msgId);
    filtrarMercado();
  };

  window.rechazarOferta = function (msgId, ofertaId) {
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const buzon = getBuzon(data);
    const msg = (buzon.mensajes || []).find(m => m.id === msgId);
    if (!msg) return;
    const oferta = Array.isArray(msg.ofertas) ? msg.ofertas.find(o => o.id === ofertaId) : null;
    const nombre = oferta?.club || 'El club';
    cerrarOfertaEnMensaje(data, msgId, ofertaId);
    BL.core.guardarPartida(JSON.stringify(data));
    mostrarModal('OFERTA RECHAZADA', `Has rechazado la oferta de ${nombre}.`);
    refrescarBuzonTrasOferta(msgId);
  };

  window.mostrarContraoferta = function (msgId, ofertaId) {
    const cont = document.getElementById(`contra-${ofertaId}`);
    if (!cont) return;
    cont.style.display = cont.style.display === 'none' ? 'flex' : 'none';
  };

  window.enviarContraoferta = function (msgId, ofertaId, pct) {
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const buzon = getBuzon(data);
    const msg = (buzon.mensajes || []).find(m => m.id === msgId);
    const oferta = msg && Array.isArray(msg.ofertas) ? msg.ofertas.find(o => o.id === ofertaId) : null;
    if (!oferta) return;

    const jugadorId = oferta.jugadorId;
    const jug = getJugador(jugadorId, data.manager.equipo);
    const grl = calcularGrlJugador(jug);
    const valor = calcularValor(grl, jug);
    const club = typeof NEO_EQUIPOS !== 'undefined' ? NEO_EQUIPOS.find(e => e.id === oferta.clubId) : null;
    const tope = Math.round(valor * 1.5);
    const limiteClub = Math.min(club?.budget || 0, tope);
    if (typeof oferta.rondas !== 'number') oferta.rondas = 0;
    if (typeof oferta.precioInicial !== 'number') oferta.precioInicial = oferta.precio;
    const precioActual = oferta.precio;
    const pedido = Math.round(precioActual * (1 + pct / 100));

    // Rechazo forzoso: no puede pagarlo o se cansa de negociar
    if (pedido > limiteClub || oferta.rondas >= 2) {
      const motivo = oferta.rondas >= 2
        ? `${club?.name || 'El club'} se cansa de negociar y retira su oferta.`
        : `${club?.name || 'El club'} no puede pagar tu contraoferta de ${formatearYenes(pedido)} y la retira.`;
      cerrarOfertaEnMensaje(data, msgId, ofertaId);
      BL.core.guardarPartida(JSON.stringify(data));
      mostrarModal('CONTRAOFERTA RECHAZADA', motivo);
      refrescarBuzonTrasOferta(msgId);
      return;
    }

    // Decisión aleatoria ponderada según qué tan lejos del valor pida el usuario
    const distancia = Math.max(0, Math.min(1, (pedido - valor) / (tope - valor || 1)));
    const probAceptar = 0.35 * (1 - distancia);
    const probRechazar = 0.25 + 0.55 * distancia;
    const probSubir = Math.max(0, 1 - probAceptar - probRechazar);
    const r = Math.random();

    if (r < probAceptar) {
      // El club acepta el precio pedido, pero el traspaso se completa al pulsar ACEPTAR
      oferta.precio = pedido;
      oferta.rondas = (oferta.rondas || 0) + 1;
      data.manager.buzon = buzon;
      BL.core.guardarPartida(JSON.stringify(data));

      mostrarModal('EL CLUB ACEPTA TU PRECIO', `${club?.name || 'El club'} acepta tu contraoferta de ${formatearYenes(pedido)} por ${jug?.nombre || 'el jugador'}. Pulsa ACEPTAR para completar el traspaso.`);
      refrescarBuzonTrasOferta(msgId);
      return;
    }

    if (r < probAceptar + probSubir) {
      // El club sube su oferta a un precio intermedio
      const factorSubida = 0.3 + Math.random() * 0.4;
      let nuevo = Math.round(precioActual + (pedido - precioActual) * factorSubida);
      nuevo = Math.min(nuevo, pedido, club?.budget || nuevo);
      oferta.precio = nuevo;
      oferta.rondas = (oferta.rondas || 0) + 1;
      data.manager.buzon = buzon;
      BL.core.guardarPartida(JSON.stringify(data));

      mostrarModal('EL CLUB SUBE SU OFERTA', `${club?.name || 'El club'} no acepta tu contraoferta de ${formatearYenes(pedido)}, pero sube su oferta a ${formatearYenes(nuevo)} por ${jug?.nombre || 'el jugador'}. Puedes aceptar, rechazar o contraofertar de nuevo.`);
      refrescarBuzonTrasOferta(msgId);
      return;
    }

    // Rechazo por decisión aleatoria
    cerrarOfertaEnMensaje(data, msgId, ofertaId);
    BL.core.guardarPartida(JSON.stringify(data));
    mostrarModal('CONTRAOFERTA RECHAZADA', `${club?.name || 'El club'} rechaza tu contraoferta de ${formatearYenes(pedido)} y retira la oferta.`);
    refrescarBuzonTrasOferta(msgId);
  };

  function tierCantera(clubUsuario) {
    const b = clubUsuario?.budget ?? 0;
    if (b >= 8500000000) return 1;
    if (b >= 1000000000) return 2;
    return 3;
  }

  const POTENCIALES_CANTERA = {
    1: { S: 0.15, A: 0.35, B: 0.40, C: 0.09, D: 0.01 },
    2: { S: 0.05, A: 0.20, B: 0.40, C: 0.25, D: 0.10 },
    3: { S: 0.01, A: 0.08, B: 0.25, C: 0.40, D: 0.26 }
  };

  function elegirPotencial(tier) {
    const tabla = POTENCIALES_CANTERA[tier];
    let r = Math.random();
    for (const [pot, prob] of Object.entries(tabla)) {
      if (r < prob) return pot;
      r -= prob;
    }
    return 'D';
  }

  const RANGO_MEDIA_POTENCIAL = {
    S: { min: 58, max: 66 },
    A: { min: 54, max: 62 },
    B: { min: 50, max: 58 },
    C: { min: 44, max: 52 },
    D: { min: 38, max: 46 }
  };

  const VALOR_POR_MEDIA_POTENCIAL = {
    S: 300000, A: 180000, B: 100000, C: 50000, D: 25000
  };

  function generarJuvenil(clubUsuario) {
    if (!clubUsuario) return null;
    const tier = tierCantera(clubUsuario);
    const potencial = elegirPotencial(tier);
    const rango = RANGO_MEDIA_POTENCIAL[potencial];
    const media = rango.min + Math.floor(Math.random() * (rango.max - rango.min + 1));
    const posicion = posicionAleatoria();
    const pais = (clubUsuario.domesticLeague === 'Japón_Pro' || clubUsuario.domesticLeague === 'Institutos')
      ? 'Japón' : (clubUsuario.domesticLeague || 'Japón');
    const nacionalidad = elegirNacionalidad(pais);
    const id = `cantera_${clubUsuario.id}_${Date.now()}_${Math.floor(Math.random() * 999)}`;
    return {
      id,
      nombre: nombreAleatorio(nacionalidad),
      nacionalidad,
      bandera: BANDERAS_PAIS[nacionalidad] || '🌍',
      equipo: clubUsuario.name,
      liga: 'Cantera',
      posicion,
      grl: media,
      edad: 16 + Math.floor(Math.random() * 2),
      pierna: ['Derecha', 'Derecha', 'Derecha', 'Izquierda', 'Izquierda', 'Ambas'][Math.floor(Math.random() * 6)],
      potencial,
      tier,
      stats: statsPorPosicion(posicion, media),
      valor: Math.round(media * VALOR_POR_MEDIA_POTENCIAL[potencial])
    };
  }

  const NUM_CANTERA = 4;

  // Generar la hornada de cantera (una sola vez, a mitad de temporada)
  function generarHornadaCantera(data) {
    if (!data || data.tipo !== 'manager' || !data.manager) return;
    if (!data.manager.cantera) data.manager.cantera = [];
    if (data.manager.canteraGenerada) return;
    const eqManager = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.name === data.manager.equipo) : null;
    const hornada = [];
    for (let i = 0; i < NUM_CANTERA; i++) {
      const c = generarJuvenil(eqManager);
      if (c) hornada.push(c);
    }
    data.manager.cantera.push(...hornada);
    data.manager.canteraGenerada = true;
    const buzon = data.manager.buzon || { mensajes: [] };
    buzon.mensajes.unshift({
      id: 'cantera_' + Date.now(),
      remitente: 'Director de Cantera',
      asunto: '¡NUEVAS PROMESAS EN LA CANTERA!',
      cuerpo: `La cantera de ${data.manager.equipo} ha descubierto una hornada de ${hornada.length} jóvenes talentos. Revisa el apartado PRÓXIMOS EGOÍSTAS y decide quién sube al primer equipo.`,
      leido: false,
      jornada: data.manager.temporada?.jornadaActual ?? 0,
      tipo: 'info'
    });
    data.manager.buzon = buzon;
  }

  // Subir un canterano al primer equipo (100% gratuito)
  window.subirCanterano = function (jugadorId) {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const cantera = data.manager.cantera || [];
    const idx = cantera.findIndex(c => c.id === jugadorId);
    if (idx === -1) return;
    const c = cantera[idx];
    const teamId = teamIdPorNombre(data.manager.equipo);
    if (!teamId) return;
    const jugador = normalizarJugador({ ...c });
    if (typeof ligaDeClubId === 'function') jugador.liga = ligaDeClubId(teamId) || jugador.liga;
    if (!data.manager.equipos) data.manager.equipos = {};
    if (!Array.isArray(data.manager.equipos[teamId])) data.manager.equipos[teamId] = [];
    jugador.dorsal = data.manager.equipos[teamId].length + 1;
    data.manager.equipos[teamId].push(jugador);
    cantera.splice(idx, 1);
    data.manager.cantera = cantera;
    BL.core.guardarPartida(data);
    cerrarFicha();
    mostrarModal('¡PROMESA SUBIDA AL PRIMER EQUIPO!', `${c.nombre} ya forma parte de la plantilla de ${data.manager.equipo}.`);
  };

  window.renderCantera = function () {
    reproducirMusicaPantalla('inspiration');
    const cont = document.getElementById('cantera-content');
    if (!cont) return;
    const vacia = `<div class="bl-card" style="text-align:center;padding:20px;">
      <i class="fas fa-gem" style="font-size:2rem;color:var(--blue-lock-cyan);margin-bottom:8px;"></i>
      <p style="color:var(--text-muted);font-size:0.85rem;line-height:1.5;">
        La cantera se está desarrollando. Descubrirás a las próximas promesas egoístas de tu club a mitad de temporada.
      </p>
    </div>`;
    const saved = BL.core.leerGuardado();
    if (!saved) { cont.innerHTML = vacia; return; }
    let data;
    try { data = JSON.parse(saved); } catch (e) { cont.innerHTML = vacia; return; }
    if (data.tipo !== 'manager' || !data.manager) { cont.innerHTML = vacia; return; }
    const cantera = data.manager.cantera || [];
    if (cantera.length === 0) { cont.innerHTML = vacia; return; }

    let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <h3 style="margin:0;font-size:0.95rem;color:var(--blue-lock-cyan);text-transform:uppercase;letter-spacing:1px;">Promesas de la cantera</h3>
      <span style="font-size:0.75rem;color:var(--text-muted);">${cantera.length} jugadores</span>
    </div>`;
    html += `<div style="display:flex;flex-direction:column;gap:8px;">`;
    cantera.forEach((c, idx) => {
      try {
        const jug = normalizarJugador({ ...c });
        html += `<div class="plantilla-card-wrapper anim-fila"${animFila(idx)} onclick="abrirFichaJugador('${c.id}')">
          ${renderizarFilaStats(jug)}
        </div>`;
      } catch (e) { console.error('Error pintando canterano', c?.id, e); }
    });
    html += `</div>`;
    cont.innerHTML = html;
  };

  // ===== PALMARÉS (vitrina de trofeos) =====

  // Una copa por cada liga del juego (todos los países)
  function listarTrofeos() {
    const trofeos = [];
    if (typeof CONFIG_PAISES !== 'undefined') {
      CONFIG_PAISES.forEach(pais => {
        (pais.ligas || []).forEach(l => {
          trofeos.push({ id: l.nombre, nombre: l.nombre, pais: pais.bandera || '', icono: 'fas fa-trophy' });
        });
      });
    }
    if (trofeos.length === 0 && typeof NEO_LIGAS !== 'undefined') {
      Object.keys(NEO_LIGAS).forEach(key => {
        const l = NEO_LIGAS[key];
        trofeos.push({ id: l.name, nombre: l.name, pais: '', icono: 'fas fa-trophy' });
      });
    }
    return trofeos;
  }

  window.renderPalmares = function () {
    reproducirMusicaPantalla('inspiration');
    const cont = document.getElementById('palmares-content');
    if (!cont) return;
    const data = BL.core.cargarPartida();
    const ganados = (data?.manager?.palmares || []);
    cont.innerHTML = listarTrofeos().map(t => {
      const ganado = ganados.includes(t.id);
      return `
        <div class="trofeo-card ${ganado ? 'ganado' : ''}">
          <span class="trofeo-bandera">${t.pais}</span>
          <i class="${t.icono} trofeo-icono ${ganado ? 'ganado' : 'bloqueado'}"></i>
          <span class="trofeo-nombre">${t.nombre}</span>
          <span class="trofeo-estado">${ganado ? 'GANADO' : 'SIN CONQUISTAR'}</span>
        </div>`;
    }).join('');
  };

  // ===== ESTRATEGIA (solo lectura: alineación del míster) =====
  // ===== ESTADÍSTICAS (temporada del jugador) =====
  window.renderEstadisticas = function () {
    reproducirMusicaPantalla('inspiration');
    const cont = document.getElementById('estadisticas-content');
    if (!cont) return;
    const data = BL.core.cargarPartida();
    if (!data || data.tipo !== 'manager' || !data.manager) { cont.innerHTML = ''; return; }
    const r = data.manager.rendimiento?.egoista || {};

    const stat = (icono, etiqueta, valor, color) => `
      <div class="estadistica-stat" style="border-color:${color};">
        <i class="${icono}"></i>
        <span class="estadistica-valor">${valor}</span>
        <span class="estadistica-label">${etiqueta}</span>
      </div>`;

    cont.innerHTML = `
      <div class="estadisticas-grid">
        ${stat('fas fa-futbol', 'GOLES', r.goles || 0, 'var(--blue-lock-cyan)')}
        ${stat('fas fa-bullseye', 'ASISTENCIAS', r.asistencias || 0, '#7cf7c4')}
        ${stat('fas fa-shirt', 'PARTIDOS', r.partidosJugados || 0, '#ffd700')}
        ${stat('fas fa-star', 'NOTA MEDIA', (r.notaMedia || 0).toFixed(1), 'var(--gold-ego)')}
      </div>
    `;
  };

  window.renderBuzon = function () {
    reproducirMusicaPantalla('bedroom');
    const cont = document.getElementById('buzon-lista');
    if (!cont) return;
    try {
      const saved = BL.core.leerGuardado();
      if (saved) {
        const data = JSON.parse(saved);
        if (data.manager) getBuzon(data);
      }
    } catch (e) { /* noop */ }
    const detalle = document.getElementById('buzon-detalle');
    if (detalle) detalle.style.display = 'none';
    cont.style.display = 'flex';

    const mensajes = [...(estadoBuzon?.mensajes || [])]
      .map((m, idx) => ({ m, idx }))
      .sort((a, b) => {
        const na = a.m.leido ? 1 : 0;
        const nb = b.m.leido ? 1 : 0;
        if (na !== nb) return na - nb;
        return b.idx - a.idx;
      })
      .map(x => x.m);

    if (mensajes.length === 0) {
      cont.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No tienes mensajes.</p>';
      actualizarBuzonBadge();
      return;
    }

    cont.innerHTML = mensajes.map((m, idx) => `
      <div class="buzon-msg ${m.leido ? 'leido' : 'no-leido'} anim-fila"${animFila(idx)} onclick="abrirMensaje('${m.id}')">
        <div class="buzon-msg-remitente">${m.remitente} ${m.leido ? '' : '<span class="buzon-dot"></span>'}</div>
        <div class="buzon-msg-asunto">${m.asunto}</div>
        <div class="buzon-msg-meta">Jornada ${m.jornada} · ${m.tipo}</div>
      </div>`).join('');
    actualizarBuzonBadge();
  };

  // Cargar Guardado Previsto
  function cargarEstado() {
    const saved = BL.core.leerGuardado() || BL.core.leerLegacy();

    // Ocultar los continuar por defecto (el de manager y el de crear egoísta siempre visibles: abren el selector de slots)
    const btnHistoria = document.getElementById('btn-continuar-historia');
    if (btnHistoria) btnHistoria.style.display = 'none';
    const btnJugador = document.getElementById('btn-continuar-jugador');
    if (btnJugador) btnJugador.style.display = 'flex';
    const btnManager = document.getElementById('btn-continuar-manager');
    if (btnManager) btnManager.style.display = 'flex';

    if (saved) {
      try {
        const data = JSON.parse(saved);
        gameState.datosPartida = data;
        gameState.partidaGuardada = true;
        if (data.historia) gameState.historia = data.historia;

        // Saneado de campos del manager (evita saves corruptos de versiones anteriores)
        if (data.manager) {
          if (!data.manager.traspasos || typeof data.manager.traspasos !== 'object' || Array.isArray(data.manager.traspasos)) data.manager.traspasos = {};
          if (!Array.isArray(data.manager.vendidos)) data.manager.vendidos = [];
          if (!Array.isArray(data.manager.listaTraspasos)) data.manager.listaTraspasos = [];
          if (!data.manager.rendimiento || typeof data.manager.rendimiento !== 'object') data.manager.rendimiento = {};
          if (!data.manager.fichajes || !Array.isArray(data.manager.fichajes)) data.manager.fichajes = [];
          if (!Array.isArray(data.manager.palmares)) data.manager.palmares = [];

          // Re-sincronizar las plantillas base inyectadas con la base de datos actual
          // (aplica retroactivamente ediciones de stats/grl de PLANTILLAS_EQUIPO)
          if (typeof PLANTILLAS_EQUIPO !== 'undefined' && data.manager.equipos) {
            Object.keys(PLANTILLAS_EQUIPO).forEach(teamId => {
              data.manager.equipos[teamId] = (PLANTILLAS_EQUIPO[teamId] || []).map(j => ({ ...j }));
            });
            BL.core.guardarPartida(data);
          }

          // Re-sincronizar los agentes libres con la base de datos actual
          if (typeof AGENTES_LIBRES !== 'undefined') {
            data.manager.agentesLibres = AGENTES_LIBRES.map(j => ({ ...j }));
            BL.core.guardarPartida(data);
          }
        }

        if (data.tipo !== 'manager') {
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
    const c = document.getElementById('user-coins');
    const g = document.getElementById('user-gems');
    [[c, gameState.monedas], [g, gameState.gemas]].forEach(([el, val]) => {
      if (!el) return;
      const antes = el.innerText;
      el.innerText = val;
      if (String(antes) !== String(val) && el.parentElement) {
        el.parentElement.classList.remove('coin-pulse');
        void el.parentElement.offsetWidth;
        el.parentElement.classList.add('coin-pulse');
      }
    });
  }

  // ===== SLOTS DE GUARDADO (MODO CARRERA) =====
  const MAX_SLOTS = 3;

  function getManagerSlots() {
    return BL.core.cargarSlots();
  }

  function saveManagerSlots(slots) {
    BL.core.guardarSlots(slots);
  }

  function nuevoSlotId() {
    return 's' + Date.now() + Math.floor(Math.random() * 1000);
  }

  function sincronizarSlotActivo() {
    try {
      const activeId = BL.core.slotActivo();
      if (!activeId) return;
      const data = BL.core.cargarPartida();
      if (!data) return;
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
  function nacionalidadesOrdenadas() {
    if (typeof BANDERAS_PAIS === 'undefined') return [];
    return Object.keys(BANDERAS_PAIS).sort((a, b) => a.localeCompare(b, 'es'));
  }

  function cargarNacionalidadesUI() {
    const select = document.getElementById('select-nacionalidad');
    if (!select || typeof BANDERAS_PAIS === 'undefined') return;
    select.innerHTML = '';
    nacionalidadesOrdenadas().forEach(pais => {
      const opt = document.createElement('option');
      opt.value = pais;
      opt.textContent = `${BANDERAS_PAIS[pais]} ${pais}`;
      select.appendChild(opt);
    });
  }

  window.abrirSelectorNacionalidad = function () {
    const lista = document.getElementById('nacionalidad-lista');
    if (!lista || typeof BANDERAS_PAIS === 'undefined') return;
    const actual = document.getElementById('select-nacionalidad')?.value || '';
    lista.innerHTML = nacionalidadesOrdenadas().map(pais => `
      <button class="nac-item ${pais === actual ? 'selected' : ''}" data-pais="${pais}" onclick="elegirNacionalidad('${pais}')">
        <span class="nac-flag">${BANDERAS_PAIS[pais]}</span>
        <span class="nac-nombre">${pais}</span>
        ${pais === actual ? '<i class="fas fa-check nac-check"></i>' : ''}
      </button>`).join('');
    const buscar = document.getElementById('buscar-nacionalidad-modal');
    if (buscar) { buscar.value = ''; buscar.focus(); }
    document.getElementById('nacionalidad-modal-overlay').classList.add('active');
  };

  window.filtrarNacionalidadesModal = function () {
    const input = document.getElementById('buscar-nacionalidad-modal');
    const lista = document.getElementById('nacionalidad-lista');
    if (!input || !lista) return;
    const q = input.value.trim().toLowerCase();
    lista.querySelectorAll('.nac-item').forEach(item => {
      const coincide = !q || (item.dataset.pais || '').toLowerCase().includes(q);
      item.style.display = coincide ? '' : 'none';
    });
  };

  window.elegirNacionalidad = function (pais) {
    const select = document.getElementById('select-nacionalidad');
    if (select) select.value = pais;
    const btn = document.getElementById('btn-nacionalidad');
    if (btn && typeof BANDERAS_PAIS !== 'undefined') {
      btn.innerHTML = `${BANDERAS_PAIS[pais] || '<i class="fas fa-earth-americas"></i>'} ${pais}`;
    }
    cerrarSelectorNacionalidad();
    renderizarFichaEgoista();
  };

  window.cerrarSelectorNacionalidad = function () {
    document.getElementById('nacionalidad-modal-overlay').classList.remove('active');
  }

  const POSICIONES = [
    { codigo: 'POR', label: 'Portero', x: 50, y: 88 },
    { codigo: 'LI', label: 'Lateral Izquierdo', x: 15, y: 74 },
    { codigo: 'DFC', label: 'Defensa Central', x: 50, y: 74 },
    { codigo: 'LD', label: 'Lateral Derecho', x: 85, y: 74 },
    { codigo: 'CAI', label: 'Carrilero Izquierdo', x: 10, y: 58 },
    { codigo: 'MCD', label: 'Mediocentro Defensivo', x: 50, y: 58 },
    { codigo: 'CAD', label: 'Carrilero Derecho', x: 90, y: 58 },
    { codigo: 'MI', label: 'Medio Izquierdo', x: 20, y: 44 },
    { codigo: 'MC', label: 'Mediocentro', x: 50, y: 44 },
    { codigo: 'MD', label: 'Medio Derecho', x: 80, y: 44 },
    { codigo: 'MCO', label: 'Mediocentro Ofensivo', x: 50, y: 32 },
    { codigo: 'EI', label: 'Extremo Izquierdo', x: 20, y: 20 },
    { codigo: 'DC', label: 'Delantero Centro', x: 50, y: 20 },
    { codigo: 'ED', label: 'Extremo Derecho', x: 80, y: 20 }
  ];

  window.abrirSelectorPosicion = function () {
    const pitch = document.getElementById('posicion-pitch');
    if (!pitch) return;
    const actual = document.getElementById('select-posicion')?.value || '';
    pitch.innerHTML = POSICIONES.map(p => `
      <button class="pos-slot ${p.codigo === actual ? 'selected' : ''} ${posColor(p.codigo) || ''}" style="top:${p.y}%;left:${p.x}%;" onclick="elegirPosicion('${p.codigo}')">
        ${p.codigo}
      </button>`).join('');
    document.getElementById('posicion-modal-overlay').classList.add('active');
  };

  window.elegirPosicion = function (codigo) {
    const select = document.getElementById('select-posicion');
    if (select) select.value = codigo;
    const btn = document.getElementById('btn-posicion');
    const p = POSICIONES.find(x => x.codigo === codigo);
    if (btn && p) {
      btn.classList.remove('pos-purple', 'pos-red', 'pos-orange', 'pos-green');
      if (posColor(codigo)) btn.classList.add(posColor(codigo));
      btn.innerHTML = `<i class="fas fa-futbol"></i> ${p.label} (${p.codigo})`;
    }
    cerrarSelectorPosicion();
    renderizarFichaEgoista();
  };

  window.cerrarSelectorPosicion = function () {
    document.getElementById('posicion-modal-overlay').classList.remove('active');
  }

  window.generarListaAlturas = function () {
    const panel = document.getElementById('mercado-altura-panel');
    if (!panel) return;
    const actual = parseInt(document.getElementById('input-altura')?.value, 10) || 0;
    panel.innerHTML = '';
    for (let cm = 160; cm <= 195; cm++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mercado-opt' + (cm === actual ? ' active' : '');
      btn.dataset.altura = String(cm);
      btn.textContent = cm + ' cm';
      btn.onclick = function () { elegirAltura(cm); };
      panel.appendChild(btn);
    }
  };

  window.elegirAltura = function (cm) {
    const label = document.getElementById('altura-label');
    if (label) label.textContent = cm + ' cm';
    const input = document.getElementById('input-altura');
    if (input) input.value = cm;
    const panel = document.getElementById('mercado-altura-panel');
    if (panel) {
      panel.querySelectorAll('.mercado-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.altura === String(cm));
      });
      panel.classList.remove('open');
    }
    renderizarFichaEgoista();
  };

  window.elegirPie = function (valor) {
    const label = document.getElementById('pie-label');
    if (label) label.textContent = valor;
    const select = document.getElementById('select-pie');
    if (select) select.value = valor;
    const panel = document.getElementById('mercado-pie-panel');
    if (panel) {
      panel.querySelectorAll('.mercado-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.val === valor);
      });
      panel.classList.remove('open');
    }
    renderizarFichaEgoista();
  };

  window.generarListaInstitutos = function () {
    const panel = document.getElementById('mercado-instituto-panel');
    if (!panel) return;
    const actual = document.getElementById('input-instituto')?.value || '';
    const institutos = (typeof NEO_EQUIPOS !== 'undefined')
      ? NEO_EQUIPOS.filter(eq => eq.domesticLeague === 'Institutos').map(eq => eq.name).sort((a, b) => a.localeCompare(b, 'es'))
      : [];
    let html = `<button type="button" class="mercado-opt ${actual === '' ? 'active' : ''}" data-val="" onclick="elegirInstituto('')">— Sin instituto</button>`;
    html += institutos.map(nombre =>
      `<button type="button" class="mercado-opt ${actual === nombre ? 'active' : ''}" data-val="${nombre}" onclick="elegirInstituto('${nombre.replace(/'/g, "\\'")}')">${nombre}</button>`
    ).join('');
    panel.innerHTML = html;
  };

  window.elegirInstituto = function (nombre) {
    const label = document.getElementById('instituto-label');
    if (label) label.textContent = nombre || '—';
    const input = document.getElementById('input-instituto');
    if (input) input.value = nombre;
    const panel = document.getElementById('mercado-instituto-panel');
    if (panel) {
      panel.querySelectorAll('.mercado-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.val === nombre);
      });
      panel.classList.remove('open');
    }
    renderizarFichaEgoista();
  };

  const EGOISTA_STATS_BASE = {
    POR: { est: 50, man: 48, saq: 45, ref: 58, vel: 44, col: 50 },
    DFC: { tiro: 30, pase: 45, regate: 40, vision: 45, def: 58, fis: 52 },
    LI: { tiro: 35, pase: 48, regate: 50, vision: 45, def: 56, fis: 50 },
    LD: { tiro: 35, pase: 48, regate: 50, vision: 45, def: 56, fis: 50 },
    CAI: { tiro: 38, pase: 52, regate: 50, vision: 46, def: 48, fis: 56 },
    CAD: { tiro: 38, pase: 52, regate: 50, vision: 46, def: 48, fis: 56 },
    MCD: { tiro: 35, pase: 52, regate: 45, vision: 50, def: 56, fis: 50 },
    MC: { tiro: 44, pase: 58, regate: 52, vision: 52, def: 45, fis: 48 },
    MCO: { tiro: 50, pase: 52, regate: 52, vision: 58, def: 30, fis: 44 },
    MI: { tiro: 46, pase: 50, regate: 56, vision: 48, def: 40, fis: 48 },
    MD: { tiro: 46, pase: 50, regate: 56, vision: 48, def: 40, fis: 48 },
    EI: { tiro: 50, pase: 48, regate: 58, vision: 48, def: 28, fis: 46 },
    ED: { tiro: 50, pase: 48, regate: 58, vision: 48, def: 28, fis: 46 },
    DC: { tiro: 58, pase: 42, regate: 50, vision: 45, def: 25, fis: 52 }
  };

  const VALOR_POSICION = {
    DC: 2800000, MCO: 2800000, EI: 2800000, ED: 2800000,
    MC: 2300000, MI: 2300000, MD: 2300000, CAI: 2300000, CAD: 2300000,
    DFC: 1800000, MCD: 1800000, LI: 1800000, LD: 1800000,
    POR: 1500000
  };

  function formatearYenesCompleto(n) {
    if (typeof n !== 'number') return '—';
    return '¥ ' + n.toLocaleString('en-US');
  }

  function grlEgoistaBase(atributos, esPOR) {
    if (esPOR) return Math.round((atributos.est + atributos.man + atributos.saq + atributos.ref + atributos.vel + atributos.col) / 6);
    return Math.round((atributos.tiro + atributos.pase + atributos.regate + atributos.vision + atributos.def + atributos.fis) / 6);
  }

  function bonusAltura(altura) {
    const h = parseInt(altura, 10);
    if (isNaN(h)) return 0;
    if (h >= 190) return 3;
    if (h >= 175) return 2;
    return 0;
  }

  function aplicarBonusAltura(atributos, posicion, altura) {
    const bonus = bonusAltura(altura);
    if (!bonus) return atributos;
    const base = (typeof EGOISTA_STATS_BASE !== 'undefined') ? (EGOISTA_STATS_BASE[posicion] || {}) : {};
    const especial = Object.keys(base).find(k => base[k] >= 55);
    const res = {};
    Object.keys(atributos).forEach(k => {
      let v = atributos[k] + bonus;
      if (k !== especial && v >= 55) v = 54;
      res[k] = v;
    });
    return res;
  }

  // ===== HEXÁGONO DE ATRIBUTOS (RADAR BLUE LOCK) =====
  const RANGOS_HEX = [
    { min: 90, letra: 'S', color: '#FFD700' },
    { min: 80, letra: 'A', color: '#FF4500' },
    { min: 70, letra: 'B', color: '#00FFFF' },
    { min: 55, letra: 'C', color: '#00FF00' },
    { min: 0, letra: 'D', color: '#A9A9A9' }
  ];

  function rangoHex(valor) {
    const v = Number(valor) || 0;
    for (let i = 0; i < RANGOS_HEX.length; i++) if (v >= RANGOS_HEX[i].min) return RANGOS_HEX[i];
    return RANGOS_HEX[RANGOS_HEX.length - 1];
  }

  const VERTICES_CAMPO = [
    { nombre: 'Ritmo', key: 'pac' },
    { nombre: 'Tiro', key: 'sho' },
    { nombre: 'Pase', key: 'pas' },
    { nombre: 'Regate', key: 'dri' },
    { nombre: 'Defensa', key: 'def' },
    { nombre: 'Físico', key: 'phy' }
  ];
  const VERTICES_POR = [
    { nombre: 'Velocidad', key: 'spd' },
    { nombre: 'Colocación', key: 'pos' },
    { nombre: 'Saque', key: 'kic' },
    { nombre: 'Manejo', key: 'han' },
    { nombre: 'Estirada', key: 'div' },
    { nombre: 'Reflejos', key: 'ref' }
  ];

  // Hexágono de atributos (radar). Función global reutilizable:
  // renderizarHexagono(canvasId, stats, esPOR) — esPOR auto-detectado si se omite.
  window.renderizarHexagono = function (canvasId, stats, esPOR) {
    const canvas = document.getElementById(canvasId || 'canvas-hexagono');
    if (!canvas) return;
    if (esPOR === undefined) {
      esPOR = !!(stats && (stats.div !== undefined || stats.spd !== undefined || stats.kic !== undefined));
    }
    const ctx = canvas.getContext('2d');
    const W = 520;
    const H = 560;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 - 8;
    const R = 176;
    const verts = esPOR ? VERTICES_POR : VERTICES_CAMPO;
    const valores = verts.map(v => Number((stats || {})[v.key]) || 0);
    const hasData = valores.some(x => x > 0);

    const punto = (i, radio) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
      return { x: cx + radio * Math.cos(a), y: cy + radio * Math.sin(a) };
    };

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const p = punto(i, R);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(4, 10, 22, 0.6)';
    ctx.fill();
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;

    [0.5, 0.8].forEach(f => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const p = punto(i, R * f);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.22)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const p = punto(i, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    if (hasData) {
      const radioVal = v => R * Math.max(0.08, Math.min(1, v / 100));
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const p = punto(i, radioVal(valores[i]));
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 180, 255, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
      const dirX = Math.cos(a);
      const dirY = Math.sin(a);
      const valor = valores[i];
      const rango = hasData ? rangoHex(valor) : { letra: '—', color: '#3a4657' };
      const nx = cx + dirX * (R + 22);
      const ny = cy + dirY * (R + 22);
      ctx.font = '600 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(verts[i].nombre, nx, ny);
      ctx.font = '900 26px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = hasData ? rango.color : '#3a4657';
      ctx.shadowColor = rango.color;
      ctx.shadowBlur = hasData ? 10 : 0;
      ctx.fillText(rango.letra, nx, ny - 22);
      ctx.shadowBlur = 0;
    }

    if (!hasData) {
      ctx.font = '700 14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = 'rgba(160, 180, 200, 0.7)';
      ctx.fillText('ELIGE POSICIÓN', cx, cy);
    }
  };

  window.renderizarFichaEgoista = function () {
    const nombre = document.getElementById('input-nombre-jugador')?.value.trim() || 'TU NOMBRE';
    const posicion = document.getElementById('select-posicion')?.value || '';
    const nacionalidad = document.getElementById('select-nacionalidad')?.value || '';
    const bandera = (typeof BANDERAS_PAIS !== 'undefined' ? BANDERAS_PAIS[nacionalidad] : '') || '🌍';
    const instituto = document.getElementById('input-instituto')?.value.trim() || '—';
    const edad = document.getElementById('input-edad')?.value || '—';
    const altura = document.getElementById('input-altura')?.value ? document.getElementById('input-altura').value + 'cm' : '—';
    const pie = document.getElementById('select-pie')?.value || '—';

    // No pisar filas que estén en edición
    const el = (id, txt) => { const e = document.getElementById(id); if (e && !e.querySelector('input, select')) e.textContent = txt; };
    el('ficha-nombre-pantalla', nombre.toUpperCase());
    el('ficha-nacionalidad-pantalla', nacionalidad ? `${bandera} ${nacionalidad}` : '🌍 —');
    el('instituto-label', instituto || '—');
    el('ficha-posicion-pantalla', posicion || '—');
    el('ficha-edad-pantalla', String(edad));
    el('altura-label', altura);
    el('pie-label', pie);
    el('ficha-valor-pantalla', posicion ? formatearYenesCompleto(VALOR_POSICION[posicion] || 0) : '—');

    const cont = document.getElementById('contenedor-atributos-ficha');
    if (!cont) return;
    if (!posicion) {
      el('ficha-grl-valor', '—');
      cont.innerHTML = '<p style="font-size:0.7rem;color:var(--text-muted);padding:8px;text-align:center;">Elige una posición para calcular tus atributos</p>';
      window.renderizarHexagono('canvas-hexagono', {}, false);
      return;
    }

    const stats = (typeof EGOISTA_STATS_BASE !== 'undefined') ? (EGOISTA_STATS_BASE[posicion] || {}) : {};
    const esPOR = posicion === 'POR';
    const atributos = esPOR
      ? { est: stats.est || 50, man: stats.man || 48, saq: stats.saq || 45, ref: stats.ref || 58, vel: stats.vel || 44, col: stats.col || 50 }
      : { tiro: stats.tiro || 30, pase: stats.pase || 45, regate: stats.regate || 40, vision: stats.vision || 45, def: stats.def || 58, fis: stats.fis || 52 };
    const atributosFin = aplicarBonusAltura(atributos, posicion, document.getElementById('input-altura')?.value || 0);

    const grl = grlEgoistaBase(atributosFin, esPOR);
    el('ficha-grl-valor', String(grl));

    const cuadro = (et, val) => `<div class="pfila-stat ficha-stat-box"><span>${et}</span>${val}</div>`;
    cont.innerHTML = esPOR
      ? `${cuadro('EST', atributosFin.est)}${cuadro('PAR', atributosFin.man)}${cuadro('SAQ', atributosFin.saq)}${cuadro('REF', atributosFin.ref)}${cuadro('VEL', atributosFin.vel)}${cuadro('POS', atributosFin.col)}`
      : `${cuadro('RIT', posicion === 'DC' ? 54 : 55)}${cuadro('TIR', atributosFin.tiro)}${cuadro('PAS', atributosFin.pase)}${cuadro('REG', atributosFin.regate)}${cuadro('DEF', atributosFin.def)}${cuadro('FIS', atributosFin.fis)}`;

    const hexStats = esPOR
      ? { spd: atributosFin.vel, pos: atributosFin.col, kic: atributosFin.saq, han: atributosFin.man, div: atributosFin.est, ref: atributosFin.ref }
      : { pac: 54, sho: atributosFin.tiro, pas: atributosFin.pase, dri: atributosFin.regate, def: atributosFin.def, phy: atributosFin.fis };
    window.renderizarHexagono('canvas-hexagono', hexStats, esPOR);

    return { nombre, posicion, nacionalidad, bandera, instituto, edad, altura, pie, esPOR, atributos: atributosFin, grl };
  }

  function commitFilaTexto(valueId, inputId) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input) return;
    const inp = valueEl.querySelector('input');
    input.value = inp ? inp.value : '';
    valueEl.innerHTML = '';
    renderizarFichaEgoista();
  }

  function commitFilaNumero(valueId, inputId, min, max) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input) return;
    const inp = valueEl.querySelector('input');
    let v = inp ? parseInt(inp.value, 10) : NaN;
    if (isNaN(v)) v = parseInt(input.value, 10) || min;
    v = Math.max(min, Math.min(max, v));
    input.value = v;
    valueEl.innerHTML = '';
    renderizarFichaEgoista();
  }

  function commitFilaSelect(valueId, inputId) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input) return;
    const sel = valueEl.querySelector('select');
    if (sel) input.value = sel.value;
    valueEl.innerHTML = '';
    renderizarFichaEgoista();
  }

  window.editarFilaTexto = function (valueId, inputId, maxlen) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input || valueEl.querySelector('input, select')) return;
    valueEl.innerHTML = `<input type="text" class="ficha-inline-input" maxlength="${maxlen}" value="${String(input.value || '').replace(/"/g, '&quot;')}">`;
    const inp = valueEl.querySelector('input');
    inp.focus();
    inp.setSelectionRange(inp.value.length, inp.value.length);
    inp.addEventListener('blur', function () { commitFilaTexto(valueId, inputId); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commitFilaTexto(valueId, inputId); } });
  };

  window.editarFilaNumero = function (valueId, inputId, min, max) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input || valueEl.querySelector('input, select')) return;
    valueEl.innerHTML = `<input type="number" class="ficha-inline-input" min="${min}" max="${max}" value="${input.value || ''}">`;
    const inp = valueEl.querySelector('input');
    inp.focus();
    inp.addEventListener('blur', function () { commitFilaNumero(valueId, inputId, min, max); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commitFilaNumero(valueId, inputId, min, max); } });
  };

  window.editarFilaSelect = function (valueId, inputId, opciones) {
    const valueEl = document.getElementById(valueId);
    const input = document.getElementById(inputId);
    if (!valueEl || !input || valueEl.querySelector('input, select')) return;
    const actual = input.value || '';
    const opts = (opciones || []).map(o => {
      const label = o === '' ? '—' : o;
      return `<option value="${o}" ${o === actual ? 'selected' : ''}>${label}</option>`;
    }).join('');
    valueEl.innerHTML = `<select class="ficha-inline-select">${opts}</select>`;
    const sel = valueEl.querySelector('select');
    sel.focus();
    sel.addEventListener('change', function () { commitFilaSelect(valueId, inputId); });
    sel.addEventListener('blur', function () { commitFilaSelect(valueId, inputId); });
  };

  let egoistaAvatarUrl = '';

  // Redimensionar una imagen a máx. 300x300 y devolver un dataURL compacto (compartido)
  function redimensionarAvatar(archivo, callback) {
    const reader = new FileReader();
    reader.onload = function () {
      const imagen = new Image();
      imagen.onload = function () {
        const max = 300;
        let w = imagen.width;
        let h = imagen.height;
        if (w > max || h > max) {
          const ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imagen, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      imagen.onerror = function () {
        mostrarModal('ERROR', 'No se pudo leer la imagen seleccionada.');
      };
      imagen.src = reader.result;
    };
    reader.onerror = function () {
      mostrarModal('ERROR', 'No se pudo leer el archivo seleccionado.');
    };
    reader.readAsDataURL(archivo);
  }

  // Guardar el avatar del Egoísta en el save y refrescar hub + ficha
  window.guardarAvatarJugador = function (dataUrl) {
    const data = BL.core.cargarPartida();
    if (!data || data.tipo !== 'manager' || !data.manager) return;
    if (data.manager.egoista) data.manager.egoista.avatar = dataUrl;
    if (data.manager.egoistaCreado) data.manager.egoistaCreado.avatar = dataUrl;
    const fich = (data.manager.fichajes || []).find(f => f.id === 'egoista');
    if (fich) fich.foto = dataUrl;
    BL.core.guardarPartida(data);
    sincronizarSlotActivo();
    cerrarModalAvatar();
    renderHub();
    abrirFichaJugador('egoista');
  };

  // Quitar el avatar del Egoísta y volver al predeterminado
  window.eliminarAvatarJugador = function () {
    const data = BL.core.cargarPartida();
    if (!data || data.tipo !== 'manager' || !data.manager) return;
    if (data.manager.egoista) data.manager.egoista.avatar = 'assets/players/default.png';
    if (data.manager.egoistaCreado) data.manager.egoistaCreado.avatar = 'assets/players/default.png';
    const fich = (data.manager.fichajes || []).find(f => f.id === 'egoista');
    if (fich) fich.foto = 'assets/players/default.png';
    BL.core.guardarPartida(data);
    sincronizarSlotActivo();
    cerrarModalAvatar();
    renderHub();
    abrirFichaJugador('egoista');
  };

  // Modal de opciones de avatar (encima de la ficha del jugador)
  window.abrirModalAvatar = function () {
    const overlay = document.getElementById('modal-avatar-opciones');
    if (!overlay) return;
    const data = BL.core.cargarPartida();
    const foto = data?.manager?.egoista?.avatar || data?.manager?.egoistaCreado?.avatar || 'assets/players/default.png';
    const img = document.getElementById('avatar-modal-foto');
    if (img) img.src = foto;
    const btnQuitar = document.getElementById('btn-avatar-quitar');
    if (btnQuitar) btnQuitar.style.display = (typeof foto === 'string' && foto.startsWith('data:')) ? '' : 'none';
    overlay.classList.add('active');
  };

  window.cerrarModalAvatar = function () {
    document.getElementById('modal-avatar-opciones').classList.remove('active');
  };

  window.elegirAvatarArchivo = function () {
    const input = document.getElementById('input-avatar-ficha');
    if (!input) return;
    input.onchange = function () {
      const archivo = input.files && input.files[0];
      if (!archivo) return;
      if (!/^image\//.test(archivo.type)) {
        mostrarModal('ERROR', 'El archivo debe ser una imagen.');
        return;
      }
      if (archivo.size > 5 * 1024 * 1024) {
        mostrarModal('ERROR', 'La imagen es demasiado grande (máx. 5 MB).');
        return;
      }
      redimensionarAvatar(archivo, guardarAvatarJugador);
      input.value = '';
    };
    input.click();
  };

  (function initAvatarEgoista() {
    const contAvatar = document.getElementById('contenedor-avatar-crear');
    const inputFile = document.getElementById('input-avatar-archivo');
    if (!contAvatar || !inputFile) return;

    function aplicarAvatar(dataUrl) {
      egoistaAvatarUrl = dataUrl;
      const img = document.getElementById('ficha-avatar');
      if (img) {
        img.style.display = '';
        contAvatar.classList.remove('sin-avatar');
        img.src = dataUrl;
      }
    }

    contAvatar.addEventListener('click', function () {
      inputFile.click();
    });

    inputFile.addEventListener('change', function () {
      const archivo = inputFile.files && inputFile.files[0];
      if (!archivo) return;
      if (!/^image\//.test(archivo.type)) {
        mostrarModal('ERROR', 'El archivo debe ser una imagen.');
        return;
      }
      if (archivo.size > 5 * 1024 * 1024) {
        mostrarModal('ERROR', 'La imagen es demasiado grande (máx. 5 MB).');
        return;
      }
      redimensionarAvatar(archivo, aplicarAvatar);
      inputFile.value = '';
    });
  })();

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
    return '<i class="fas fa-star"></i>'.repeat(enteras) + (media ? '<i class="fas fa-star-half-stroke"></i>' : '');
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
    document.getElementById('ts-equipo-label').innerHTML = `${eq.name}${grl} ${formatearYenes(eq.budget)} ${estrellasTexto(eq.stars)}`;
    document.getElementById('ts-selected-name').style.display = 'block';
    actualizarEstadoIniciarCarrera();
  };

  window.tsVerPlantilla = function (equipoId) {
    const eq = NEO_EQUIPOS.find(e => e.id === equipoId);
    if (!eq) return;
    const base = (typeof PLANTILLAS_EQUIPO !== 'undefined' && Array.isArray(PLANTILLAS_EQUIPO[equipoId]))
      ? PLANTILLAS_EQUIPO[equipoId].map(j => {
          const n = normalizarJugador({ ...j });
          n.rendimiento = { partidosJugados: 0, goles: 0, asistencias: 0, paradas: 0, tarjetasAmarillas: 0, tarjetasRojas: 0, notaMedia: 0 };
          return n;
        })
      : [];
    abrirPlantillaEquipo(eq.name, base);
  };

  window.verPlantillaClasificacion = function (teamId) {
    const nombre = nombreEquipoPorId(teamId);
    const plantilla = getPlantillaEquipo(nombre);
    abrirPlantillaEquipo(nombre, plantilla);
  };

  function abrirPlantillaEquipo(nombre, plantilla) {
    document.getElementById('plantilla-titulo').textContent = 'PLANTILLA';
    document.getElementById('plantilla-conteo').textContent = plantilla && plantilla.length ? '(' + plantilla.length + ' jugadores)' : '';
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
    if (screenId === 'screen-hub') {
      detenerMusicaPantalla();
      try {
        const saved = BL.core.leerGuardado();
        if (saved) {
          const data = JSON.parse(saved);
          if (data.manager) getBuzon(data);
        }
      } catch (e) { /* noop */ }
      actualizarBuzonBadge();
      rendimientoCache = null;
    }
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.classList.add('pantalla-oculta');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('pantalla-oculta');
      target.classList.add('active');
    }
    if (screenId === 'screen-partido' && partidoEstado === 'pausa' && partidoCtx) {
      try {
        const s = BL.core.leerGuardado();
        if (s) {
          const fresh = JSON.parse(s);
          if (fresh?.manager?.tactica) partidoCtx.data.manager.tactica = fresh.manager.tactica;
        }
      } catch (e) { /* noop */ }
      empezarRelojPartido();
    }
  }

  // Navegación segura: oculta las demás pantallas con .pantalla-oculta,
  // muestra la activa y ejecuta su loader de datos (si está registrado).
  window.mostrarPantalla = function (nombre) {
    const id = String(nombre || '').startsWith('screen-') ? nombre : 'screen-' + nombre;
    const current = document.querySelector('.screen.active');
    if (current && current.id !== id) {
      navHistory.push(current.id);
    }
    activarPantalla(id);
    const loader = BL.cargadores[nombre] || BL.cargadores[id];
    if (loader) {
      try { loader(); } catch (e) { console.error('Loader de pantalla', id, e); }
    }
  };

  window.showScreen = function (screenId) {
    mostrarPantalla(screenId);
  };

  window.goBack = function () {
    const prev = navHistory.pop();
    activarPantalla(prev && document.getElementById(prev) ? prev : 'screen-main');
  };

  // Modal Generic Helper
  window.mostrarModal = function (titulo, mensaje) {
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-body').innerText = mensaje;
    const content = document.querySelector('.modal-content');
    if (content) {
      const esError = /ERROR|RECHAZAD|INSUFICIENTE|LLENO|LLENA|DERROTA/i.test(titulo || '');
      content.classList.remove('modal-error');
      if (esError) {
        void content.offsetWidth;
        content.classList.add('modal-error');
      }
    }
    document.getElementById('modal-overlay').classList.add('active');
  };

  window.cerrarModal = function () {
    const content = document.querySelector('.modal-content');
    if (content) content.classList.remove('modal-error');
    document.getElementById('modal-overlay').classList.remove('active');
  };

  window.mostrarFormJugador = function () {
    document.getElementById('cj-menu').style.display = 'none';
    document.getElementById('cj-form').style.display = 'flex';
    generarListaAlturas();
    generarListaInstitutos();
    renderizarFichaEgoista();
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

  let slotsOrigenActual = 'carrera';

  function origenDeSlot(slot) {
    if (slot && slot.origen) return slot.origen;
    return (slot?.data?.manager?.egoistaCreado) ? 'egoista' : 'carrera';
  }

  window.mostrarSlotsManager = function (origen) {
    slotsOrigenActual = origen || 'carrera';
    sincronizarSlotActivo();
    const slots = getManagerSlots().filter(s => origenDeSlot(s) === slotsOrigenActual);
    const titulo = slotsOrigenActual === 'egoista'
      ? '<i class="fas fa-save"></i> TUS EGOÍSTAS'
      : '<i class="fas fa-save"></i> CARGAR PARTIDA (MODO CARRERA)';
    document.getElementById('modal-title').innerHTML = titulo;

    if (slots.length === 0) {
      document.getElementById('modal-body').innerHTML = `
        <p style="text-align:center;padding:20px 0;color:var(--text-muted);">
          No hay partidas guardadas actualmente.
        </p>`;
      document.getElementById('modal-overlay').classList.add('active');
      return;
    }

    const activeId = BL.core.slotActivo();
    let html = '';
    slots.forEach((slot, i) => {
      const fecha = slot.fechaGuardado ? new Date(slot.fechaGuardado) : (slot.fechaCreacion ? new Date(slot.fechaCreacion) : null);
      const fechaTxt = fecha ? fecha.toLocaleString('es-ES') : '—';
      const semana = typeof slot.semana === 'number' ? slot.semana : (slot.data?.manager?.semana || 0);
      const esEgoista = origenDeSlot(slot) === 'egoista';
      const nombrePrincipal = esEgoista
        ? (slot.data?.manager?.egoista?.nombre || '—')
        : (slot.data?.manager?.nombre || '—');
      const club = slot.data?.manager?.equipo || slot.equipo || '—';
      const activo = slot.slotId === activeId;
      html += `<div class="slot-card">
        <div class="slot-info">
          <span class="slot-equipo">${nombrePrincipal}</span>
          <span class="slot-meta">${club} · Semana ${semana} · Guardado: ${fechaTxt}</span>
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
    BL.core.guardarPartida(slot.data);
    BL.core.guardarSlotActivo(slotId);
    cerrarModal();
    cargarEstado();
    renderHub();
    showScreen('screen-hub');
  };

  window.eliminarSlot = function (slotId) {
    let slots = getManagerSlots();
    const eraActivo = BL.core.slotActivo() === slotId;
    slots = slots.filter(s => s.slotId !== slotId);
    saveManagerSlots(slots);
    if (eraActivo) {
      BL.core.borrarSlotActivo();
      const data = BL.core.cargarPartida();
      if (data && data.tipo === 'manager') BL.core.borrarPartida();
    }
    mostrarSlotsManager(slotsOrigenActual);
  };

  // Reproductor de Audio
  const DEFAULT_VOLUME = 0.05;
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
  const whistleSound = document.getElementById('whistle-sound');

  let isPlaying = false;

  const matchSound = document.getElementById('match-sound');
  const despairSound = document.getElementById('despair-sound');
  const puzzleSound = document.getElementById('puzzle-sound');
  const inspirationSound = document.getElementById('inspiration-sound');
  const egoSound = document.getElementById('ego-sound');
  const emergencySound = document.getElementById('emergency-sound');
  const lastChanceSound = document.getElementById('last-chance-sound');
  const awakeningSound = document.getElementById('awakening-sound');
  const intellectSound = document.getElementById('intellect-sound');
  const pushForwardSound = document.getElementById('push-forward-sound');
  const bedroomSound = document.getElementById('bedroom-sound');

  estadoAudio.musicas['tema'] = { audio: themeAudio, nombre: 'Blue Lock Theme (Menú Principal)' };
  estadoAudio.sonidosSFX['gol'] = { audio: goalSound, nombre: 'Sonido de Gol (Cuando Marcas)' };
  estadoAudio.sonidosSFX['arma_ego'] = { audio: goalSound, nombre: 'Activación de Arma (Egoísta)' };
  estadoAudio.sonidosSFX['silbato_arbitro'] = { audio: whistleSound, nombre: 'Silbato del Árbitro (Inicio del Partido)' };
  estadoAudio.sonidosSFX['partido'] = { audio: matchSound, nombre: 'Match Start (Música Base - Inicio de Partido)' };
  estadoAudio.sonidosSFX['tema'] = { audio: themeAudio, nombre: 'Blue Lock Theme (Música - Ganando)' };
  estadoAudio.sonidosSFX['puzzle'] = { audio: puzzleSound, nombre: 'Puzzle (Música - Empatando)' };
  estadoAudio.sonidosSFX['despair'] = { audio: despairSound, nombre: 'Despair (Música - Perdiendo)' };
  estadoAudio.sonidosSFX['inspiration'] = { audio: inspirationSound, nombre: 'Inspiration (Música - Plantilla y Táctica)' };
  estadoAudio.sonidosSFX['intellect'] = { audio: intellectSound, nombre: 'Intellect (Música - Mercado de Fichajes)' };
  estadoAudio.sonidosSFX['push_forward'] = { audio: pushForwardSound, nombre: 'Push Forward (Música - Entrenamiento)' };
  estadoAudio.sonidosSFX['bedroom'] = { audio: bedroomSound, nombre: 'Bedroom (Música - Bandeja de Entrada)' };
  estadoAudio.sonidosSFX['ego'] = { audio: egoSound, nombre: 'EGO (Música - Turno de Ataque)' };
  estadoAudio.sonidosSFX['emergency'] = { audio: emergencySound, nombre: 'Emergency (Música - Turno de Defensa)' };
  estadoAudio.sonidosSFX['last_chance'] = { audio: lastChanceSound, nombre: 'Last Chance (Música - Jugada Final)' };
  estadoAudio.sonidosSFX['awakening'] = { audio: awakeningSound, nombre: 'Awakening (Música - Despertar)' };

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
    Object.values(estadoAudio.sonidosSFX).forEach(s => { s.audio.volume = value; });
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
    BL.core.guardarAjuste('bl_volume_general', value);
  }

  window.cambiarVolumenGeneral = function (valor) {
    const v = parseFloat(valor);
    if (isNaN(v)) return;
    estadoAudio.volumenGeneral = v;
    setVolume(v);
  };

  window.reproducirSFX = function (nombreSonido) {
    const sfx = estadoAudio.sonidosSFX[nombreSonido];
    if (!sfx) return;
    if (!estadoAudio.sfxActivados) return;
    if (estadoAudio.sfxIndividuales[nombreSonido] === false) return;
    if (estadoAudio.sfxReproduciendose && estadoAudio.sfxReproduciendose !== nombreSonido) {
      detenerSFX(estadoAudio.sfxReproduciendose);
    }
    sfx.audio.volume = estadoAudio.volumenGeneral;
    sfx.audio.currentTime = 0;
    sfx.audio.play().catch(() => {});
    estadoAudio.sfxReproduciendose = nombreSonido;
    marcarSFXActivo(nombreSonido);
  };

  window.detenerSFX = function (nombreSonido) {
    const sfx = estadoAudio.sonidosSFX[nombreSonido];
    if (!sfx) return;
    sfx.audio.pause();
    sfx.audio.currentTime = 0;
    if (estadoAudio.sfxReproduciendose === nombreSonido) {
      estadoAudio.sfxReproduciendose = null;
    }
    marcarSFXActivo(null);
  };

  function marcarSFXActivo(nombreSonido) {
    document.querySelectorAll('#contenedor-sfx .sfx-item').forEach(item => {
      item.classList.toggle('activo', item.dataset.sfx === nombreSonido);
    });
  }

  window.reprobarGol = function () {
    reproducirSFX('gol');
  };

  let temaSonandoAntesDePartido = false;

  function iniciarMusicaPartido() {
    temaSonandoAntesDePartido = isPlaying;
    if (isPlaying) {
      themeAudio.pause();
    }
    reproducirSFX('partido');
  }

  const MUSICAS_PARTIDO = ['partido', 'puzzle', 'despair', 'ego', 'emergency', 'last_chance', 'awakening', 'tema'];

  function pausarMusicasExcepto(sonido) {
    MUSICAS_PARTIDO.forEach(k => {
      if (k !== sonido) {
        const audio = estadoAudio.sonidosSFX[k]?.audio;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
  }

  function tocarMusicaEstado(sonido, activo) {
    const sfx = estadoAudio.sonidosSFX[sonido];
    if (!sfx) return;
    if (!activo || estadoAudio.sfxIndividuales[sonido] === false) {
      sfx.audio.pause();
      sfx.audio.currentTime = 0;
      return;
    }
    pausarMusicasExcepto(sonido);
    const audio = sfx.audio;
    if (audio.paused) {
      audio.volume = estadoAudio.volumenGeneral;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  function detenerMusicaPartido() {
    pausarMusicasExcepto(null);
    if (temaSonandoAntesDePartido) {
      themeAudio.play().catch(() => {});
      temaSonandoAntesDePartido = false;
    }
  }

  let temaPausadoPorPantalla = false;
  const MUSICAS_PANTALLA = ['inspiration', 'intellect', 'push_forward', 'bedroom'];

  function reproducirMusicaPantalla(sonido) {
    try {
      if (isPlaying && !themeAudio.paused) {
        themeAudio.pause();
        temaPausadoPorPantalla = true;
      }
      tocarMusicaEstado(sonido, estadoAudio.sfxActivados);
    } catch (e) {
      console.error('audio pantalla', sonido, e);
    }
  }

  function detenerMusicaPantalla() {
    try {
      MUSICAS_PANTALLA.forEach(k => {
        const sfx = estadoAudio.sonidosSFX[k];
        if (sfx) {
          sfx.audio.pause();
          sfx.audio.currentTime = 0;
        }
      });
      if (temaPausadoPorPantalla) {
        themeAudio.play().catch(() => {});
        temaPausadoPorPantalla = false;
      }
    } catch (e) {
      console.error('audio detener pantalla', e);
    }
  }

  function actualizarAudioEstadoPartido() {
    if (!partidoCtx) return;
    const master = estadoAudio.sfxActivados;
    if (partidoCtx.ultimaJugadaArmaUsuario) {
      tocarMusicaEstado('awakening', master);
      return;
    }
    const misGoles = partidoCtx.esLocal ? partidoGolesLocal : partidoGolesVisit;
    const golesRival = partidoCtx.esLocal ? partidoGolesVisit : partidoGolesLocal;

    if (golesRival > misGoles) {
      tocarMusicaEstado('despair', master);
    } else if (misGoles > golesRival) {
      tocarMusicaEstado('tema', master);
    } else {
      tocarMusicaEstado('puzzle', master);
    }
  }

  // Restaurar volumen guardado o usar default bajo
  const savedVolume = BL.core.leerAjusteRaw('bl_volume_general') || BL.core.leerAjusteRaw('bl_theme_volume');
  estadoAudio.volumenGeneral = savedVolume !== null ? parseFloat(savedVolume) : DEFAULT_VOLUME;
  if (isNaN(estadoAudio.volumenGeneral)) estadoAudio.volumenGeneral = DEFAULT_VOLUME;
  const cbSfx = document.getElementById('checkbox-sfx');
  const savedSfxMaster = BL.core.leerAjusteRaw('bl_sfx_activados');
  if (savedSfxMaster !== null) estadoAudio.sfxActivados = savedSfxMaster === 'true';
  const savedSfxInd = BL.core.leerAjusteRaw('bl_sfx_individuales');
  if (savedSfxInd) {
    try {
      const parsed = JSON.parse(savedSfxInd);
      estadoAudio.sfxIndividuales = { ...estadoAudio.sfxIndividuales, ...parsed };
    } catch (e) {}
  }
  if (cbSfx) cbSfx.checked = estadoAudio.sfxActivados;
  setVolume(estadoAudio.volumenGeneral);
  window.renderListaSFX();

  volSlider.addEventListener('input', function () {
    cambiarVolumenGeneral(this.value);
  });

  // Autoplay al cargar (si el navegador lo permite y el usuario no lo pausó antes)
  if (BL.core.leerAjusteRaw('bl_theme_autoplay') !== 'false') {
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
      BL.core.guardarAjuste('bl_theme_autoplay', 'false');
    } else {
      themeAudio.play();
      BL.core.guardarAjuste('bl_theme_autoplay', 'true');
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
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    gameState.monedas = data.monedas ?? gameState.monedas;
    gameState.gemas = data.gemas ?? gameState.gemas;
    actualizarMonedasUI();
    if (data.manager?.buzon) getBuzon(data);
    actualizarBuzonBadge();

    const esEgoista = !!(data.manager?.egoistaCreado);

    // Perfil del hub: tarjeta de plantilla para el jugador, perfil clásico para el manager
    const hubProfile = document.getElementById('hub-profile');
    const perfilJugador = document.getElementById('hub-perfil-jugador');

    // Avatar del hub: el del Egoísta (si tiene uno propio), si no icono genérico
    const hubAvatar = document.getElementById('hub-avatar');
    if (hubAvatar) {
      const avatarSrc = data.manager?.egoista?.avatar || data.manager?.egoistaCreado?.avatar || data.jugador?.avatar || data.jugador?.foto || '';
      const esGenerico = !avatarSrc || avatarSrc === 'assets/players/default.png';
      hubAvatar.innerHTML = '';
      if (esGenerico) {
        hubAvatar.innerHTML = '<i class="fas fa-user"></i>';
      } else {
        const img = document.createElement('img');
        img.src = avatarSrc;
        img.alt = '';
        img.addEventListener('error', function () {
          hubAvatar.innerHTML = '<i class="fas fa-user"></i>';
        });
        hubAvatar.appendChild(img);
      }
    }

    if (hubProfile) hubProfile.style.display = esEgoista ? 'none' : '';
    if (perfilJugador) perfilJugador.style.display = esEgoista ? '' : 'none';

    document.getElementById('hub-nombre').textContent = data.jugador?.nombre
      || (esEgoista ? (data.manager?.egoista?.nombre || data.manager?.nombre) : (data.manager?.nombre || '—'));
    document.getElementById('hub-equipo').textContent = data.jugador ? data.jugador.pais : (data.manager?.equipo || 'AGENTE LIBRE');

    const rolEl = document.getElementById('hub-rol');
    const statsEl = document.getElementById('hub-stats');

    if (esEgoista) {
      rolEl.textContent = 'JUGADOR';
      const ego = data.manager.egoista || {};
      const egoCreado = data.manager.egoistaCreado || {};
      const rend = data.manager.rendimiento?.egoista || {};
      // Cabecera del jugador: misma tarjeta que una fila de la plantilla
      if (perfilJugador) {
        const fich = (data.manager.fichajes || []).find(f => f.id === 'egoista');
        if (fich) {
          const jug = normalizarJugador({ ...fich });
          jug.foto = ego.avatar || egoCreado.avatar || jug.foto;
          if (typeof jug.valor !== 'number') jug.valor = egoCreado.valor;
          if (!jug.instituto) jug.instituto = ego.instituto || '—';
          perfilJugador.innerHTML = `<div class="plantilla-card-wrapper anim-fila" onclick="abrirFichaJugador('egoista')">${renderizarFilaInfo(jug)}</div>`;
        }
      }
      const esPORego = ego.posicion === 'POR';
      statsEl.innerHTML = `
        <span><i class="fas fa-shirt"></i> PJ: ${rend.partidosJugados || 0}</span>
        <span><i class="fas fa-futbol"></i> GOLES: ${rend.goles || 0}</span>
        <span><i class="fas fa-bullseye"></i> ASIST: ${rend.asistencias || 0}</span>
        ${esPORego ? `<span><i class="fas fa-hand"></i> PARADAS: ${rend.paradas || 0}</span>` : ''}
        <span><i class="fas fa-square"></i> AMAR.: ${rend.tarjetasAmarillas || 0}</span>
        <span><i class="fas fa-square"></i> ROJAS: ${rend.tarjetasRojas || 0}</span>
        <span><i class="fas fa-star"></i> NOTA: ${(rend.notaMedia || 0).toFixed(1)}</span>
        <span><i class="fas fa-bolt"></i> EGO: ${ego.puntosEgo || 0} pts</span>
        <span><i class="fas fa-handshake"></i> Confianza: ${typeof data.manager.confianzaEntrenador === 'number' ? data.manager.confianzaEntrenador : 60}%</span>
      `;
    } else if (data.tipo === 'jugador' && data.jugador) {
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
      const presupuesto = typeof m.presupuesto === 'number' ? m.presupuesto : (m.equipo ? (NEO_EQUIPOS.find(e => e.name === m.equipo)?.budget ?? 0) : 0);
      const numJug = m.equipo ? getPlantillaEquipo(m.equipo).length : 0;
      const semana = m.semana || 0;
      const rolTxt = m.equipo ? 'MANAGER' : 'AGENTE LIBRE';
      rolEl.textContent = rolTxt;
      statsEl.innerHTML = `
        <span><i class="fas fa-coins"></i> Presupuesto: ${formatearYenes(presupuesto)}</span>
        <span><i class="fas fa-users"></i> Plantilla: ${numJug} jug.</span>
        <span><i class="fas fa-calendar-week"></i> Semana: ${semana}</span>
        <span><i class="fas fa-store"></i> Fichajes: ${(m.fichajes || []).length}</span>
      `;
    }

    // Cuadrícula: pares según modo (jugador vs manager)
    const pares = [
      ['hub-btn-palmares', 'hub-btn-mercado'],
      ['hub-btn-estrategia', 'hub-btn-tactica'],
      ['hub-btn-estadisticas', 'hub-btn-cantera']
    ];
    pares.forEach(([egoId, managerId]) => {
      const egoBtn = document.getElementById(egoId);
      const mgrBtn = document.getElementById(managerId);
      if (egoBtn) egoBtn.style.display = esEgoista ? '' : 'none';
      if (mgrBtn) mgrBtn.style.display = esEgoista ? 'none' : '';
    });

    // Botones que dependen de tener club
    const conClub = !!(data.manager?.equipo);
    const idsDependientes = esEgoista
      ? ['hub-btn-entrenar', 'hub-btn-estrategia', 'hub-btn-estadisticas', 'hub-btn-calendario', 'hub-btn-clasificacion', 'hub-btn-jugar']
      : ['hub-btn-mercado', 'hub-btn-entrenar', 'hub-btn-tactica', 'hub-btn-cantera', 'hub-btn-calendario', 'hub-btn-clasificacion', 'hub-btn-jugar'];
    idsDependientes.forEach(id => {
      const b = document.getElementById(id);
      if (b) b.style.display = conClub ? '' : 'none';
    });

    // Ofertas iniciales: modal cinematográfico por única vez
    if (data.manager?.eleccionEquipoPendiente) {
      abrirModalOfertasIniciales();
    }
  };

  // Guardar estado actual (monedas, gemas) en blue_lock_save
  window.guardarEstado = function () {
    try {
      const saved = BL.core.leerGuardado();
      if (!saved) return;
      const data = JSON.parse(saved);
      if (!data || typeof data !== 'object') return;
      data.monedas = gameState.monedas;
      data.gemas = gameState.gemas;
      data.historia = gameState.historia;
      BL.core.guardarPartida(JSON.stringify(data));
      sincronizarSlotActivo();
    } catch (e) {
      console.error('Error al guardar partida:', e);
    }
  };

  // Plantilla
  window.renderPlantilla = function () {
    try {
      plantillaSort = { by: 'posicion', asc: true };
      plantillaVista = 'info';
      reproducirMusicaPantalla('inspiration');

      const saved = BL.core.leerGuardado();
      if (!saved) { console.error('renderPlantilla: sin save'); return; }
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
        const hexEsPOR = jugCard.posicion === 'POR';
        const hexStats = hexEsPOR
          ? { div: jugCard.div || 60, han: jugCard.han || 60, kic: jugCard.kic || 60, ref: jugCard.ref || 60, spd: jugCard.spd || 60, pos: jugCard.pos || 60 }
          : { pac: jugCard.pac || 60, sho: jugCard.tiro, pas: jugCard.pase, dri: jugCard.regate, def: jugCard.defensa, phy: jugCard.phy || 60 };
        window.renderizarHexagono('mi-egoista-canvas-hexagono', hexStats, hexEsPOR);
        return;
      }

      if (data.tipo !== 'manager' || !data.manager) { console.error('renderPlantilla: no manager', data.tipo); return; }
      // Modo Manager: tabs + sort bar + lista
      previewPlantillaData = null;
      document.getElementById('plantilla-tabs').style.display = '';
      document.getElementById('plantilla-sort-bar').style.display = '';
      document.getElementById('plantilla-titulo').textContent = 'PLANTILLA';
      const cntPlantilla = data.manager.equipo ? getPlantillaEquipo(data.manager.equipo).length : 0;
      document.getElementById('plantilla-conteo').textContent = cntPlantilla ? '(' + cntPlantilla + ' jugadores)' : '';
      document.getElementById('plantilla-equipo').textContent = data.manager.equipo;
      renderPlantillaSortBar();
      renderPlantillaContent();
      console.log('[renderPlantilla] grid chars =', grid.innerHTML.length, '| equipo =', data.manager.equipo);
    } catch (e) {
      console.error('renderPlantilla ERROR:', e);
    }
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
      { key: 'pac', label: 'RIT' },
      { key: 'tiro', label: 'TIR' },
      { key: 'pase', label: 'PAS' },
      { key: 'regate', label: 'REG' },
      { key: 'defensa', label: 'DEF' },
      { key: 'phy', label: 'FIS' }
    ];
    const rendimientoCriteria = [
      { key: 'nombre', label: 'NOMBRE' },
      { key: 'pj', label: 'PJ' },
      { key: 'goles', label: 'GOLES' },
      { key: 'asistencias', label: 'ASIST' },
      { key: 'nota', label: 'NOTA' }
    ];
    let criteria = statsCriteria;
    if (plantillaVista === 'rendimiento') criteria = rendimientoCriteria;
    else if (plantillaVista === 'info') criteria = infoCriteria;
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
    // GRL ponderado por posición.
    // Mapeo semántico (nombres en español → claves del motor):
    //   campo: ritmo→pac, tiro→sho, pase→pas, regate→dri, defensa→def, fisico→phy
    //   POR:   reflejos→ref, paradas→han, posicionamiento→pos, estirada→div, velocidad→spd, saque→kic
    const pac = jug.pac || 50, sho = jug.tiro || 50, pas = jug.pase || 50;
    const dri = jug.regate || 50, def = jug.defensa || 50, phy = jug.phy || 50;
    const div = jug.div || 50, han = jug.han || 50, kic = jug.kic || 50;
    const ref = jug.ref || 50, spd = jug.spd || 50, posK = jug.pos || 50;

    if (jug.posicion === 'POR') {
      return Math.round(ref * 0.35 + han * 0.30 + posK * 0.20 + div * 0.05 + spd * 0.05 + kic * 0.05);
    }
    if (jug.posicion === 'DC' || jug.posicion === 'EI' || jug.posicion === 'ED') {
      return Math.round(sho * 0.40 + dri * 0.20 + pac * 0.15 + phy * 0.15 + pas * 0.07 + def * 0.03);
    }
    if (jug.posicion === 'MI' || jug.posicion === 'MD') {
      return Math.round(pas * 0.30 + dri * 0.25 + pac * 0.20 + sho * 0.12 + phy * 0.08 + def * 0.05);
    }
    if (jug.posicion === 'MC' || jug.posicion === 'MCO' || jug.posicion === 'MCD') {
      return Math.round(pas * 0.35 + dri * 0.20 + phy * 0.15 + def * 0.15 + pac * 0.10 + sho * 0.05);
    }
    if (jug.posicion === 'CAI' || jug.posicion === 'CAD') {
      return Math.round(pac * 0.25 + def * 0.25 + phy * 0.15 + pas * 0.15 + dri * 0.15 + sho * 0.05);
    }
    if (jug.posicion === 'DFC' || jug.posicion === 'LD' || jug.posicion === 'LI' || jug.posicion === 'DF') {
      return Math.round(def * 0.40 + phy * 0.25 + pac * 0.15 + pas * 0.10 + dri * 0.07 + sho * 0.03);
    }
    // SD y posiciones desconocidas: promedio de seguridad
    return Math.round((pac + sho + pas + dri + def + phy) / 6);
  }

  function statOrdenable(jug, key) {
    if (jug.posicion === 'POR') {
      const map = { pac: 'spd', defensa: 'div', phy: 'ref', tiro: 'kic', pase: 'kic', regate: null };
      const k = map[key] ?? key;
      return k ? (jug[k] ?? 0) : 0;
    }
    return jug[key] ?? 0;
  }

  function animFila(idx) {
    return ' style="animation-delay:' + Math.min(idx, 12) * 30 + 'ms"';
  }

  function renderPlantillaContent() {
    let jugadores;
    const grid = document.getElementById('plantilla-grid');
    if (previewPlantillaData) {
      jugadores = [...previewPlantillaData];
    } else {
      const saved = BL.core.leerGuardado();
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return;
      document.getElementById('plantilla-equipo').textContent = data.manager.equipo;
      // 1) Por nombre del manager (equivalente a clasificación)
      jugadores = getPlantillaEquipo(data.manager.equipo);
      // 2) Respaldo: buscar por ID del equipo del manager en NEO_EQUIPOS
      if (!jugadores || jugadores.length === 0) {
        const eqInfo = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.name === data.manager.equipo) : null;
        if (eqInfo) jugadores = getPlantillaEquipo(eqInfo.name);
      }
      // 3) Último respaldo: filtrar todosLosJugadores por el equipo
      if (!jugadores || jugadores.length === 0) {
        jugadores = todosLosJugadores().filter(p => p.equipo === data.manager.equipo);
      }
      if (!jugadores || jugadores.length === 0) {
        console.error('Plantilla vacía para', data.manager.equipo);
      }
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
      } else if (plantillaSort.by === 'pj' || plantillaSort.by === 'goles' || plantillaSort.by === 'asistencias' || plantillaSort.by === 'nota') {
        va = a.rendimiento?.[plantillaSort.by] ?? 0; vb = b.rendimiento?.[plantillaSort.by] ?? 0;
      } else {
        va = statOrdenable(a, plantillaSort.by);
        vb = statOrdenable(b, plantillaSort.by);
      }
      if (typeof va === 'string') return plantillaSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
      return plantillaSort.asc ? va - vb : vb - va;
    });

    let fila = renderizarFilaStats;
    if (plantillaVista === 'rendimiento') fila = renderizarFilaRendimiento;
    else if (plantillaVista === 'info') fila = renderizarFilaInfo;
    grid.innerHTML = '';
    let pintados = 0;
    jugadores.forEach((p, idx) => {
      try {
        const html = fila(p);
        grid.innerHTML += `<div class="plantilla-card-wrapper anim-fila"${animFila(idx)} onclick="abrirFichaJugador('${p.id}')">
          ${html}
        </div>`;
        pintados++;
      } catch (e) {
        console.error('Error pintando jugador', p?.id, e);
      }
    });
    if (pintados === 0 && jugadores.length > 0) {
      console.error('No se pudo pintar ningún jugador, fallback a render simple');
      grid.innerHTML = jugadores.map((p, idx) =>
        `<div class="plantilla-card-wrapper anim-fila"${animFila(idx)} onclick="abrirFichaJugador('${p.id}')">
          <div class="pfila"><span class="pfila-grl">${calcularGrlJugador(p)}</span><span class="pfila-name">${p.nombre}</span></div>
        </div>`
      ).join('');
    }
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
    const saved = BL.core.leerGuardado();
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
    BL.core.guardarPartida(JSON.stringify(data));
  };

  window.avanzarSemana = function () {
    const data = getEntrenamientoData();
    if (!data) return;
    data.manager.semana += 1;
    data.manager.entrenadoSemana = false;
    BL.core.guardarPartida(JSON.stringify(data));
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

    BL.core.guardarPartida(JSON.stringify(data));
    return resultado;
  };

  // Entrenar
  function getUpgradeCost(valorActual) {
    return Math.floor(valorActual * 10);
  }

  let entrenarSeleccion = new Map();

  window.renderEntrenar = function () {
    reproducirMusicaPantalla('push_forward');
    const saved = BL.core.leerGuardado();
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
    const saved = BL.core.leerGuardado();
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
    const saved = BL.core.leerGuardado();
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
    const saved = BL.core.leerGuardado();
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
    if (nombre === 'Agente Libre') {
      return '<i class="fas fa-shield-halved"></i>';
    }
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

  function tablaLideresHtml(lista, titulo, campo, campoLabel, extraLabel) {
    const filas = lista.slice(0, 10).map((j, i) => {
      const r = j.rendimiento || {};
      const foto = j.foto || 'assets/players/default.png';
      const extra = extraLabel ? ` / <span class="lider-nota">${(r.notaMedia || 0).toFixed(1)}</span>` : '';
      return `<tr>
        <td>${i + 1}.</td>
        <td class="clasificacion-equipo">
          <div class="lider-avatar"><img src="${foto}" onerror="this.onerror=null;this.style.display='none';" alt=""><i class="fas fa-user"></i></div>
          <span>${j.nombre}<span class="lider-meta"> ${j.posicion} · ${j.equipo || ''}</span></span>
        </td>
        <td class="lider-valor">${r[campo] || 0}${extra}</td>
      </tr>`;
    }).join('');
    return `
      <div class="clas-liga">
        <div class="clas-liga-header">${titulo}</div>
        <table class="clasificacion-table">
          <thead><tr><th>#</th><th>JUGADOR</th><th>${campoLabel}</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  let clasificacionLigaEstado = { paisId: null, liga: null, vista: 'tabla' };

  window.renderClasificacion = function () {
    const container = document.getElementById('clasificacion-paises');
    if (!container || typeof CONFIG_PAISES === 'undefined') return;
    const paises = [...CONFIG_PAISES].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    container.innerHTML = paises.map((pais, idx) => {
      const totalEq = pais.ligas.reduce((a, l) => a + l.equipos.length, 0);
      const numLigas = pais.ligas.length;
      return `<button class="clas-pais-btn anim-fila"${animFila(idx)} onclick="abrirClasificacionLiga('${pais.id}')">
        <span class="clas-pais-bandera">${pais.bandera}</span>
        <span class="clas-pais-nombre">${pais.nombre}</span>
        <span class="clas-pais-count">${numLigas} ${numLigas === 1 ? 'liga' : 'ligas'} · ${totalEq} ${totalEq === 1 ? 'equipo' : 'equipos'}</span>
        <span class="clas-pais-chevron"><i class="fas fa-chevron-right"></i></span>
      </button>`;
    }).join('');
  };

  window.abrirClasificacionLiga = function (paisId) {
    const pais = CONFIG_PAISES.find(p => p.id === paisId);
    if (!pais || !pais.ligas.length) return;
    clasificacionLigaEstado = { paisId, liga: pais.ligas[0].nombre, vista: 'tabla' };
    renderClasificacionLiga();
    showScreen('screen-clasificacion-liga');
  };

  window.cambiarLigaClasificacion = function (ligaNombre) {
    clasificacionLigaEstado.liga = ligaNombre;
    renderClasificacionLiga();
  };

  window.cambiarVistaClasificacionLiga = function (vista) {
    clasificacionLigaEstado.vista = vista;
    renderClasificacionLiga();
  };

  function renderClasificacionLiga() {
    const pais = CONFIG_PAISES.find(p => p.id === clasificacionLigaEstado.paisId);
    if (!pais) return;
    document.getElementById('clasificacion-liga-titulo').textContent = `${pais.bandera} ${pais.nombre}`;
    document.getElementById('clasificacion-liga-sub').textContent = `${pais.ligas.length} ${pais.ligas.length === 1 ? 'liga' : 'ligas'}`;

    const ligasCont = document.getElementById('clasificacion-liga-ligas');
    if (pais.ligas.length > 1) {
      ligasCont.innerHTML = pais.ligas.map(l =>
        `<button class="clas-liga-tab ${l.nombre === clasificacionLigaEstado.liga ? 'active' : ''}" onclick="cambiarLigaClasificacion('${l.nombre.replace(/'/g, "\\'")}')">${l.nombre}</button>`
      ).join('');
      ligasCont.style.display = 'flex';
    } else {
      ligasCont.innerHTML = '';
      ligasCont.style.display = 'none';
    }

    document.querySelectorAll('#clasificacion-liga-tabs .plantilla-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.vista === clasificacionLigaEstado.vista);
    });

    const liga = pais.ligas.find(l => l.nombre === clasificacionLigaEstado.liga) || pais.ligas[0];
    const contenido = document.getElementById('clasificacion-liga-contenido');
    if (clasificacionLigaEstado.vista === 'tabla') {
      contenido.innerHTML = `
        <div class="clas-liga">
          <div class="clas-liga-header">⚽ ${liga.nombre} <span class="clas-liga-count">${liga.equipos.length}</span></div>
          ${tablaLigaHtml(liga.equipos)}
        </div>`;
    } else {
      contenido.innerHTML = renderEstadisticasLiga(liga);
    }
  }

  function renderEstadisticasLiga(liga) {
    const equipoIds = new Set(liga.equipos.map(e => e.id));
    const jugadores = todosLosJugadores().filter(j =>
      j.rendimiento && (j.rendimiento.goles > 0 || j.rendimiento.asistencias > 0) && equipoIds.has(getEquipoIdDeJugador(j))
    );
    const goleadores = [...jugadores].sort((a, b) => (b.rendimiento.goles - a.rendimiento.goles) || (b.rendimiento.notaMedia - a.rendimiento.notaMedia));
    const asistentes = [...jugadores].sort((a, b) => (b.rendimiento.asistencias - a.rendimiento.asistencias) || (b.rendimiento.notaMedia - a.rendimiento.notaMedia));
    return `
      <div class="clas-lideres">
        ${tablaLideresHtml(goleadores, '⚽ MÁXIMO GOLEADOR DE LA LIGA', 'goles', 'GOLES', true)}
        ${tablaLideresHtml(asistentes, '🎯 MÁXIMO ASISTENTE DE LA LIGA', 'asistencias', 'ASIST', true)}
      </div>`;
  }

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

    const saved = BL.core.leerGuardado();
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
  let tacticaSoloLectura = false;

  window.renderTactica = function (sinMusica, soloLectura) {
    if (!sinMusica) reproducirMusicaPantalla('inspiration');
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    document.getElementById('tactica-equipo').textContent = data.manager.equipo;

    tacticaSoloLectura = !!soloLectura;

    if (!data.manager.tactica || tacticaSoloLectura) {
      // En solo lectura el entrenador decide la alineación (rota jugadores) y la guarda
      data.manager.tactica = alineacionEntrenador(data);
      BL.core.guardarPartida(JSON.stringify(data));
    }
    slotSeleccionado = null;
    subSeleccionado = null;
    const lbl = document.getElementById('tactica-formacion-label');
    if (lbl) lbl.textContent = data.manager.tactica.formacion;
    const panel = document.getElementById('mercado-formacion-panel');
    if (panel) panel.querySelectorAll('.mercado-opt').forEach(o =>
      o.classList.toggle('active', o.dataset.val === data.manager.tactica.formacion));

    // En solo lectura: sin selector de formación (texto estático)
    if (tacticaSoloLectura) {
      const filaFormacion = document.querySelector('.tactica-formacion-row');
      if (filaFormacion) {
        filaFormacion.innerHTML = `<span class="tactica-formacion-label">FORMACIÓN</span><span style="color:var(--blue-lock-cyan);font-weight:800;font-size:0.8rem;">${data.manager.tactica.formacion}</span>`;
      }
    }
    renderCampo();
    renderSuplentes();
  };

  // El entrenador decide la alineación: mejor XI con rotación aleatoria de titulares
  function alineacionEntrenador(data) {
    const jugadores = getPlantillaEquipo(data.manager.equipo);
    const eq = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.name === data.manager.equipo) : null;
    const formacion = eq?.formation || '4-3-3';
    const base = elegirMejorOnce(jugadores, formacion);
    const once = base.once.slice();
    const banca = base.banca.slice();
    const rotaciones = 1 + Math.floor(Math.random() * 3); // 1-3 rotaciones

    const compatibles = (jug) => {
      const pos = posicionesDeJugador(jug);
      return banca.filter(bp => {
        const bpPos = posicionesDeJugador(bp);
        return bpPos.some(p => pos.includes(p) || (POS_COMPATIBLES[p] || []).some(c => pos.includes(c)));
      });
    };

    for (let r = 0; r < rotaciones && banca.length > 0; r++) {
      const idx = Math.floor(Math.random() * once.length);
      const titularId = once[idx];
      const titular = jugadores.find(p => p.id === titularId);
      const candidatos = compatibles(titular);
      if (!titular || candidatos.length === 0) continue;
      const suplente = candidatos[Math.floor(Math.random() * candidatos.length)];
      once[idx] = suplente.id;
      banca.splice(banca.indexOf(suplente.id), 1);
      banca.push(titularId);
    }
    return { formacion, once, banca };
  }

  function getJugador(id, equipo) {
    const fichajes = getFichajes();
    if (fichajes.length > 0) {
      const f = fichajes.find(p => p.id === id);
      if (f) return aplicarEstamina(aplicarEntrenamiento(f), teamIdPorNombre(equipo));
    }
    // Jugadores traspasados a otro club: buscarlos por id en toda la base y devolverlos con su club nuevo
    try {
      const saved = BL.core.leerGuardado();
      if (saved) {
        const d = JSON.parse(saved);
        const t = d.manager?.traspasos?.[id];
        if (t && typeof PLANTILLAS_EQUIPO !== 'undefined') {
          for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
            const found = PLANTILLAS_EQUIPO[key].find(p => p.id === id);
            if (found) return { ...aplicarEstamina(aplicarEntrenamiento(normalizarJugador(found)), key), equipo: t.club };
          }
        }
      }
    } catch (e) { /* noop */ }
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
    if (typeof j.agenteLibre !== 'boolean') j.agenteLibre = false;
    if (j.pierna) {
      // Pie dominante estándar: Derecha / Izquierda / Ambas
      const PIE = { 'Derecho': 'Derecha', 'Diestro': 'Derecha', 'Zurdo': 'Izquierda', 'Izquierdo': 'Izquierda', 'Ambos': 'Ambas' };
      j.pie = PIE[j.pierna] || j.pierna;
    }
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
    aplicarRendimiento(j);
    return j;
  }

  function aplicarEntrenamiento(jug) {
    if (!jug || !jug.id) return jug;
    try {
      const saved = BL.core.leerGuardado();
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
      const saved = BL.core.leerGuardado();
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
    try {
      return getPlantillaEquipoInterno(equipo);
    } catch (e) {
      console.error('Error en getPlantillaEquipo para', equipo, e);
      // Fallback: devolver la plantilla base normalizada sin entrenamiento/estamina
      if (typeof PLANTILLAS_EQUIPO === 'undefined' || !equipo) return [];
      for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
        const plantilla = PLANTILLAS_EQUIPO[key];
        if (plantilla[0]?.equipo === equipo) {
          return plantilla.map(normalizarJugador);
        }
      }
      return [];
    }
  }

  function getPlantillaEquipoInterno(equipo) {
    let base = [];
    let teamId = teamIdPorNombre(equipo);

    // Leer jugadores inyectados del save (si existen); fallback a la base global
    let inyectado = null;
    try {
      const saved = BL.core.leerGuardado();
      if (saved) {
        const d = JSON.parse(saved);
        if (d.manager?.equipos) inyectado = d.manager.equipos;
      }
    } catch (e) { /* noop */ }

    if (equipo) {
      if (inyectado && typeof PLANTILLAS_EQUIPO !== 'undefined') {
        for (const key of Object.keys(inyectado)) {
          const plantilla = inyectado[key];
          if (plantilla && plantilla.length && plantilla[0]?.equipo === equipo) {
            teamId = key;
            base = plantilla.map(normalizarJugador).map(aplicarEntrenamiento).map(p => aplicarEstamina(p, key));
            break;
          }
        }
      }
      if (!base.length && typeof PLANTILLAS_EQUIPO !== 'undefined') {
        for (const key of Object.keys(PLANTILLAS_EQUIPO)) {
          const plantilla = PLANTILLAS_EQUIPO[key];
          if (plantilla[0]?.equipo === equipo) {
            teamId = key;
            base = plantilla.map(normalizarJugador).map(aplicarEntrenamiento).map(p => aplicarEstamina(p, key));
            break;
          }
        }
      }
      const vendidos = [];
      let traspasos = {};
      try {
        const saved = BL.core.leerGuardado();
        if (saved) {
          const data = JSON.parse(saved);
          if (data.manager?.vendidos) vendidos.push(...data.manager.vendidos);
          if (data.manager?.traspasos) traspasos = data.manager.traspasos;
        }
      } catch (e) { /* noop */ }
      // Excluir jugadores traspasados a otros clubes y los vendidos
      base = base.filter(p => !vendidos.includes(p.id) && (!traspasos[p.id] || traspasos[p.id].club === equipo));
      const fichajes = getFichajes().filter(f => f.equipo === equipo && !base.some(p => p.id === f.id));
      const resultado = base.concat(fichajes.map(p => aplicarEstamina(aplicarEntrenamiento(p), teamId)));
      // Añadir jugadores traspasados a este club
      Object.keys(traspasos).forEach(jugId => {
        const t = traspasos[jugId];
        if (t.club !== equipo) return;
        if (resultado.some(p => p.id === jugId)) return;
        const jug = getJugador(jugId, t.club);
        if (jug) resultado.push({ ...jug, equipo });
      });
      return resultado;
    }
    return base;
  }

  function estaEnListaTraspasos(id) {
    try {
      const saved = BL.core.leerGuardado();
      if (!saved) return false;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return false;
      return (data.manager.listaTraspasos || []).includes(id);
    } catch (e) {
      return false;
    }
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
        ${jug.agenteLibre
          ? '<span class="pfila-valor gratis">GRATIS</span>'
          : `<span class="pfila-valor">${formatearYenes(calcularValor(grl, jug))}</span>`}
      </div>
      <div class="pfila-stats">
        <div class="pfila-stat"><span>TIR</span>${jug.tiro}</div>
        <div class="pfila-stat"><span>PAS</span>${jug.pase}</div>
        <div class="pfila-stat"><span>REG</span>${jug.regate}</div>
        <div class="pfila-stat"><span>DEF</span>${jug.defensa}</div>
      </div>
    </div>`;
  }

  function pieTexto(jug) {
    return jug.pie || jug.pierna || '—';
  }

  function pfilaContenido(jug) {
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const bandera = jug.bandera || '';
    const pie = pieTexto(jug);
    const tieneLogoClub = !!escudoEquipoPorNombre(jug.equipo);
    const enLT = estaEnListaTraspasos(jug.id);
    return `
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}${enLT ? ' <span class="lt-tag">LT</span>' : ''}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
        ${jug.agenteLibre
          ? '<span class="pfila-valor gratis">GRATIS</span>'
          : `<span class="pfila-valor">${formatearYenes(calcularValor(grl, jug))}</span>`}
      </div>
      <div class="pfila-extra">
        <span class="pfila-club-logo ${tieneLogoClub ? '' : 'con-forma'}">
          ${htmlEscudoEquipo(jug.equipo)}
        </span>
        <span class="pfila-extra-col">
          <span class="pfila-extra-item">${bandera} ${jug.nacionalidad || '—'}</span>
          <span class="pfila-extra-item"><i class="fas fa-shoe-prints"></i> ${pie}</span>
        </span>
      </div>`;
  }

  function renderizarFilaInfo(jug) {
    if (!jug) return '';
    return `<div class="pfila pfila-info-row">${pfilaContenido(jug)}
    </div>`;
  }

  function renderizarFilaStats(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const esPOR = jug.posicion === 'POR';
    const enLT = estaEnListaTraspasos(jug.id);
    const statsHtml = esPOR
      ? `<div class="pfila-stat"><span>EST</span>${jug.div || 60}</div>
         <div class="pfila-stat"><span>PAR</span>${jug.han || 60}</div>
         <div class="pfila-stat"><span>SAQ</span>${jug.kic || 60}</div>
         <div class="pfila-stat"><span>REF</span>${jug.ref || 60}</div>
         <div class="pfila-stat"><span>VEL</span>${jug.spd || 60}</div>
         <div class="pfila-stat"><span>POS</span>${jug.pos || 60}</div>`
      : `<div class="pfila-stat"><span>RIT</span>${jug.pac || 60}</div>
         <div class="pfila-stat"><span>TIR</span>${jug.tiro}</div>
         <div class="pfila-stat"><span>PAS</span>${jug.pase}</div>
         <div class="pfila-stat"><span>REG</span>${jug.regate}</div>
         <div class="pfila-stat"><span>DEF</span>${jug.defensa}</div>
         <div class="pfila-stat"><span>FIS</span>${jug.phy || 60}</div>`;
    return `<div class="pfila pfila-stats-row">
      <div class="pfila-grl">${grl}</div>
      <div class="pfila-avatar">
        <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        <i class="fas fa-user plantilla-avatar-fallback"></i>
      </div>
      <div class="pfila-info">
        <span class="pfila-name">${jug.nombre}${enLT ? ' <span class="lt-tag">LT</span>' : ''}</span>
        <span class="pfila-meta"><span class="${posColor(jug.posicion)}">${jug.posicion}</span> · ${jug.edad} años</span>
        <span class="pfila-valor">${formatearYenes(calcularValor(grl, jug))}</span>
      </div>
      <div class="pfila-stats">
        ${statsHtml}
      </div>
    </div>`;
  }

  function renderizarFilaRendimiento(jug) {
    if (!jug) return '';
    const grl = calcularGrlJugador(jug);
    const foto = jug.foto || 'assets/players/default.png';
    const r = jug.rendimiento || { partidosJugados: 0, goles: 0, asistencias: 0, paradas: 0, notaMedia: 0 };
    const esPOR = jug.posicion === 'POR';
    const nota = typeof r.notaMedia === 'number' ? r.notaMedia.toFixed(1) : '0.0';
    const col = (e, v) => `<div class="pfila-stat"><span>${e}</span>${v}</div>`;
    const statsHtml = esPOR
      ? `${col('PJ', r.partidosJugados)}${col('GOL', r.goles)}${col('AST', r.asistencias)}${col('PAR', r.paradas)}${col('NOTA', nota)}`
      : `${col('PJ', r.partidosJugados)}${col('GOL', r.goles)}${col('AST', r.asistencias)}${col('NOTA', nota)}`;
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
          <div class="ficha-row"><div class="ficha-label">NOMBRE COMPLETO</div><div class="ficha-value">${jug.nombre.toUpperCase()}</div></div>
          <div class="ficha-row"><div class="ficha-label">POSICIÓN</div><div class="ficha-value">${jug.posicion}</div></div>
          <div class="ficha-row"><div class="ficha-label">POS. SECUNDARIA</div><div class="ficha-value">${jug.posicionSec || '—'}</div></div>
          <div class="ficha-row"><div class="ficha-label">PIE DOMINANTE</div><div class="ficha-value">${pieTexto(jug)}</div></div>
          <div class="ficha-row"><div class="ficha-label">GRL</div><div class="ficha-value">${grl}</div></div>
        </div>
        <div class="ficha-photo">
          <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
        </div>
      </div>
      <div class="ficha-stats-grid">
        ${statsGrid}
      </div>
      <div class="ficha-hexagono">
        <canvas id="mi-egoista-canvas-hexagono" width="520" height="560"></canvas>
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
        <div class="ut-stat"><span class="ut-stat-label">RIT</span><span class="ut-stat-val">${jug.pac || 60}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">TIR</span><span class="ut-stat-val">${jug.tiro}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">PAS</span><span class="ut-stat-val">${jug.pase}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">REG</span><span class="ut-stat-val">${jug.regate}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">DEF</span><span class="ut-stat-val">${jug.defensa}</span></div>
        <div class="ut-stat"><span class="ut-stat-label">FIS</span><span class="ut-stat-val">${jug.phy || 60}</span></div>
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
    return { formacion, once, banca };
  }

  function renderCampo() {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    let data;
    try {
      data = JSON.parse(saved);
    } catch (e) {
      console.error('Error parseando save en renderCampo:', e);
      return;
    }
    if (data.tipo !== 'manager' || !data.manager) return;

    // --- Normalización defensiva: formación siempre válida ---
    const tactica = data.manager.tactica || {};
    const eqInfo = (typeof NEO_EQUIPOS !== 'undefined')
      ? NEO_EQUIPOS.find(e => e.name === data.manager.equipo) : null;
    const formacion = FORMACIONES_POS[tactica.formacion]
      ? tactica.formacion
      : (eqInfo?.formation && FORMACIONES_POS[eqInfo.formation])
        ? eqInfo.formation
        : '4-3-3';
    data.manager.tactica = {
      formacion,
      once: Array.isArray(tactica.once) ? tactica.once : [],
      banca: Array.isArray(tactica.banca) ? tactica.banca : []
    };
    BL.core.guardarPartida(JSON.stringify(data));

    const pos = FORMACIONES_POS[formacion];
    const once = data.manager.tactica.once;
    const equipo = data.manager.equipo;
    const pitch = document.getElementById('tactica-pitch');
    let idx = 0;
    let html = '';
    pos.forEach(fila => {
      fila.slots.forEach(slot => {
        const jugId = once[idx];
        const jug = getJugador(jugId, equipo);
        const selected = slotSeleccionado === idx;
        const nombreParts = (jug?.nombre || '').split(' ');
        const nombreMostrar = nombreParts.length > 1 ? nombreParts.slice(1).join(' ') : (jug?.nombre || '—');
        html += `<div class="tactica-slot ${selected ? 'selected' : ''}${tacticaSoloLectura ? ' solo-lectura' : ''}" style="top:${fila.y}%;left:${slot.x}%;" data-idx="${idx}" ${tacticaSoloLectura ? '' : `onclick="clickSlot(${idx})" ondblclick="abrirFichaJugador('${jugId}')"`}>
          <div class="tslot-grl">${calcularGrlJugador(jug)}</div>
          <div class="tslot-avatar">
            <img src="${jug?.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug?.nombre || ''}">
            <i class="fas fa-user tslot-avatar-fallback"></i>
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
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    const equipo = data.manager.equipo;
    const grid = document.getElementById('tactica-subs');
    let html = '';
    // Suplentes ordenados por posición (se conserva el índice original para el swap)
    const banca = data.manager.tactica?.banca || [];
    const ordenados = banca
      .map((jugId, idx) => ({ jugId, idx, jug: getJugador(jugId, equipo) }))
      .filter(x => x.jug)
      .sort((a, b) => (POS_ORDER[a.jug.posicion] ?? 99) - (POS_ORDER[b.jug.posicion] ?? 99));
    ordenados.forEach(({ jugId, idx: bidx, jug }) => {
      const selected = subSeleccionado === bidx;
      const nombreParts = (jug.nombre || '').split(' ');
      const nombreMostrar = nombreParts.length > 1 ? nombreParts.slice(1).join(' ') : (jug.nombre || '—');
      html += `<div class="tactica-sub-card ${selected ? 'selected' : ''}${tacticaSoloLectura ? ' solo-lectura' : ''}" ${tacticaSoloLectura ? '' : `onclick="clickSub('${jugId}', ${bidx})" ondblclick="abrirFichaJugador('${jugId}')"`}>
        <div class="tslot-grl">${calcularGrlJugador(jug)}</div>
        <div class="tslot-avatar">
          <img src="${jug.foto || 'assets/players/default.png'}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre}">
          <i class="fas fa-user tslot-avatar-fallback"></i>
        </div>
        <div class="tslot-info">
          <span class="tslot-pos ${posColor(jug.posicion)}">${jug.posicion}</span>
          <span class="tslot-name">${nombreMostrar}</span>
          ${estaminaHtml(jug)}
        </div>
        <i class="fas fa-exchange-alt swap-icon"></i>
      </div>`;
    });
    grid.innerHTML = html;
  }

  window.clickSlot = function (idx) {
    const saved = BL.core.leerGuardado();
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
      BL.core.guardarPartida(JSON.stringify(data));
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
    BL.core.guardarPartida(JSON.stringify(data));
    renderCampo();
    renderSuplentes();
  };

  window.clickSub = function (jugId, bidx) {
    const saved = BL.core.leerGuardado();
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
      BL.core.guardarPartida(JSON.stringify(data));
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
    BL.core.guardarPartida(JSON.stringify(data));
    renderCampo();
    renderSuplentes();
  };

  window.cambiarFormacion = function (form) {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    data.manager.tactica.formacion = form;
    BL.core.guardarPartida(JSON.stringify(data));
    const lbl = document.getElementById('tactica-formacion-label');
    if (lbl) lbl.textContent = form;
    const panel = document.getElementById('mercado-formacion-panel');
    if (panel) {
      panel.querySelectorAll('.mercado-opt').forEach(o => o.classList.toggle('active', o.dataset.val === form));
      panel.classList.remove('open');
    }
    slotSeleccionado = null;
    subSeleccionado = null;
    renderCampo();
    renderSuplentes();
  };

  // ===== MERCADO DE FICHAJES =====
  function calcularValor(grl, jug) {
    if (jug && typeof jug.valor === 'number') {
      return jug.valor;
    }
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
    if (n >= 1000000) {
      const m = n / 1000000;
      const txt = Number.isInteger(m) ? String(m) : m.toFixed(1).replace('.', ',');
      return `¥${txt}M`;
    }
    return `¥${n}`;
  }

  let cacheSaveParseado = null;
  let cacheSaveParseadoKey = null;

  function leerSaveCacheado() {
    const s = BL.core.leerGuardado();
    if (cacheSaveParseadoKey === s) return cacheSaveParseado;
    cacheSaveParseado = s ? JSON.parse(s) : null;
    cacheSaveParseadoKey = s;
    return cacheSaveParseado;
  }

  function getEquipoIdDeJugador(jug) {
    if (!jug) return null;
    if (jug._teamId) return jug._teamId;
    if (typeof PLANTILLAS_EQUIPO === 'undefined') return null;
    try {
      const d = leerSaveCacheado();
      const t = d?.manager?.traspasos?.[jug.id];
      if (t?.clubId) return t.clubId;
    } catch (e) { /* noop */ }
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
      const saved = BL.core.leerGuardado();
      if (!saved) return 0;
      const data = JSON.parse(saved);
      if (data.tipo !== 'manager' || !data.manager) return 0;
      if (typeof data.manager.presupuesto !== 'number') {
        const eq = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
        data.manager.presupuesto = eq?.budget ?? 5000000000;
        if (!data.manager.fichajes) data.manager.fichajes = [];
        BL.core.guardarPartida(JSON.stringify(data));
      } else if (data.manager.presupuesto < 10000) {
        data.manager.presupuesto = data.manager.presupuesto * 1000000;
        BL.core.guardarPartida(JSON.stringify(data));
      }
      return data.manager.presupuesto;
    } catch (e) {
      return 0;
    }
  }

  let cacheTodosLosJugadores = null;
  let cacheTodosLosJugadoresKey = null;

  function todosLosJugadores() {
    const saved = BL.core.leerGuardado();
    const clave = saved || '';
    if (cacheTodosLosJugadores && cacheTodosLosJugadoresKey === clave) {
      return cacheTodosLosJugadores;
    }
    const lista = [];
    let traspasos = {};
    let equipos = null;
    let agentes = null;
    try {
      if (saved) {
        const d = JSON.parse(saved);
        if (d.manager?.traspasos) traspasos = d.manager.traspasos;
        if (d.manager?.equipos) equipos = d.manager.equipos;
        if (Array.isArray(d.manager?.agentesLibres)) agentes = d.manager.agentesLibres;
      }
    } catch (e) { /* noop */ }

    // Usar jugadores inyectados en el save si existen; fallback a la base global
    const fuenteEquipos = equipos || (typeof PLANTILLAS_EQUIPO !== 'undefined' ? PLANTILLAS_EQUIPO : {});
    Object.keys(fuenteEquipos).forEach(key => {
      (fuenteEquipos[key] || []).forEach(p => {
        const j = normalizarJugador(p);
        const t = traspasos[j.id];
        if (t) {
          j.equipo = t.club;
          const eqInfo = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.id === t.clubId) : null;
          if (eqInfo) {
            j.bandera = eqInfo.bandera;
            j.nacionalidad = (eqInfo.domesticLeague === 'Japón_Pro' || eqInfo.domesticLeague === 'Institutos') ? 'Japón' : eqInfo.domesticLeague;
          }
        }
        j._teamId = t?.clubId || key;
        lista.push(j);
      });
    });
    const baseAgentes = (typeof AGENTES_LIBRES !== 'undefined' ? AGENTES_LIBRES : []);
    const mapaAgentes = new Map();
    baseAgentes.forEach(a => mapaAgentes.set(a.id, a));
    (agentes || []).forEach(a => mapaAgentes.set(a.id, a));
    const fuenteAgentes = [...mapaAgentes.values()];
    fuenteAgentes.forEach(p => lista.push(normalizarJugador({ ...p })));
    cacheTodosLosJugadoresKey = clave;
    cacheTodosLosJugadores = lista;
    return lista;
  }

  let mercadoFiltro = { posicion: '', division: '', orden: 'grl' };
  let mercadoVista = 'fichajes';
  let mercadoPagina = 0;
  let mercadoFirmaFiltro = '';

  window.cambiarMercadoVista = function (vista) {
    mercadoVista = vista === 'agentes' ? 'agentes' : 'fichajes';
    const tabF = document.getElementById('tab-fichajes');
    const tabA = document.getElementById('tab-agentes');
    if (tabF) tabF.classList.toggle('active', mercadoVista === 'fichajes');
    if (tabA) tabA.classList.toggle('active', mercadoVista === 'agentes');
    filtrarMercado();
  };

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
    reproducirMusicaPantalla('intellect');
    getPresupuestoManager();
    document.getElementById('mercado-presupuesto').textContent = formatearYenes(getPresupuestoManager());
    const buscar = document.getElementById('mercado-buscar');
    if (buscar) buscar.value = '';
    sincronizarLabelsMercado();
    filtrarMercado();
  };

  window.filtrarMercado = function () {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const equipo = data.manager.equipo;

    const base = getPlantillaEquipo(equipo);
    const idsPropios = new Set(base.map(p => p.id));
    const vendidos = data.manager.vendidos || [];

    let jugadores = todosLosJugadores().filter(p => !idsPropios.has(p.id) && !vendidos.includes(p.id));

    if (mercadoVista === 'agentes') {
      jugadores = jugadores.filter(p => p.agenteLibre === true);
    } else {
      jugadores = jugadores.filter(p => p.agenteLibre !== true);
    }

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

    const container = document.getElementById('mercado-lista');
    const paginacionEl = document.getElementById('mercado-paginacion');
    if (jugadores.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No se encontraron jugadores.</p>';
      if (paginacionEl) paginacionEl.innerHTML = '';
      return;
    }

    // Reset de página si cambiaron los filtros/búsqueda/vista
    const firma = `${mercadoVista}|${texto}|${pos}|${div}|${orden}`;
    if (firma !== mercadoFirmaFiltro) {
      mercadoPagina = 0;
      mercadoFirmaFiltro = firma;
    }

    const POR_PAGINA = 20;
    const totalCoincidencias = jugadores.length;
    const totalPaginas = Math.max(1, Math.ceil(totalCoincidencias / POR_PAGINA));
    mercadoPagina = Math.min(mercadoPagina, totalPaginas - 1);
    const pagina = mercadoPagina;
    jugadores = jugadores.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

    const aviso = totalCoincidencias > POR_PAGINA
      ? `<p style="font-size:0.68rem;color:var(--text-muted);margin:0 0 8px;">Página ${pagina + 1} de ${totalPaginas} · ${totalCoincidencias} jugadores</p>`
      : '';

    let html = '';
    jugadores.forEach((p, idx) => {
      html += `<div class="plantilla-card-wrapper anim-fila"${animFila(idx)} onclick="abrirFichaJugador('${p.id}')">
        ${renderizarFilaInfo(p)}
      </div>`;
    });
    container.innerHTML = aviso + html;
    if (paginacionEl) paginacionEl.innerHTML = htmlPaginacionMercado(pagina, totalPaginas);
  };

  function paginasVisiblesMercado(pagina, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const set = new Set([0, total - 1, pagina - 1, pagina, pagina + 1].filter(i => i >= 0 && i < total));
    const lista = [...set].sort((a, b) => a - b);
    const out = [];
    let prev = -1;
    lista.forEach(i => {
      if (prev !== -1 && i - prev > 1) out.push('...');
      out.push(i);
      prev = i;
    });
    return out;
  }

  function htmlPaginacionMercado(pagina, totalPaginas) {
    if (totalPaginas <= 1) return '';
    let nums = paginasVisiblesMercado(pagina, totalPaginas).map(p => {
      if (p === '...') return '<span class="mercado-pag-ellipsis">…</span>';
      return `<button class="mercado-pag-btn ${p === pagina ? 'active' : ''}" onclick="irAPaginaMercado(${p})">${p + 1}</button>`;
    }).join('');
    return `<div class="mercado-paginacion-bar">
      <button class="mercado-pag-btn nav" ${pagina === 0 ? 'disabled' : ''} onclick="irAPaginaMercado(${pagina - 1})"><i class="fas fa-chevron-left"></i></button>
      ${nums}
      <button class="mercado-pag-btn nav" ${pagina === totalPaginas - 1 ? 'disabled' : ''} onclick="irAPaginaMercado(${pagina + 1})"><i class="fas fa-chevron-right"></i></button>
    </div>`;
  }

  window.irAPaginaMercado = function (pagina) {
    mercadoPagina = Math.max(0, pagina);
    filtrarMercado();
  };

  window.ficharJugador = function (jugadorId, precioOferta) {
    cerrarFicha();
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    if (typeof data.manager.presupuesto !== 'number') {
      getPresupuestoManager();
      saved = BL.core.leerGuardado();
      if (!saved) return;
      data = JSON.parse(saved);
    }
    const presupuesto = data.manager.presupuesto;

    const jug = todosLosJugadores().find(p => p.id === jugadorId);
    if (!jug) return;
    const grl = calcularGrlJugador(jug);
    const esAgente = jug.agenteLibre === true;
    const valorMercado = calcularValor(grl, jug);
    const valor = esAgente ? 0 : (precioOferta !== undefined && precioOferta !== null && precioOferta !== '' ? Number(precioOferta) : valorMercado);

    // Límite de plantilla: 22 jugadores
    const plantillaActual = getPlantillaEquipo(data.manager.equipo);
    if (plantillaActual.length >= 22) {
      mostrarModal('PLANTILLA LLENA', 'Tu plantilla tiene el máximo de 22 jugadores. Vende o ofrece a algún jugador antes de fichar a otro.');
      return;
    }

    if (!esAgente && ((typeof valor !== 'number' || !isFinite(valor)) || valor < valorMercado)) {
      mostrarModal('OFERTA RECHAZADA', `El club rechaza tu oferta de ${formatearYenes(valor)} por ${jug.nombre}. Debes ofrecer al menos el valor de mercado (${formatearYenes(valorMercado)}).`);
      return;
    }

    if (presupuesto < valor) {
      mostrarModal('PRESUPUESTO INSUFICIENTE', `No tienes fondos suficientes para fichar a ${jug.nombre} (necesitas ${formatearYenes(valor)}).`);
      return;
    }

    data.manager.presupuesto = presupuesto - valor;
    if (!data.manager.fichajes) data.manager.fichajes = [];
    const nuevo = { ...jug, equipo: data.manager.equipo };
    data.manager.fichajes.push(nuevo);
    if (esAgente) {
      if (!data.manager.vendidos) data.manager.vendidos = [];
      if (!data.manager.vendidos.includes(jugadorId)) data.manager.vendidos.push(jugadorId);
    }
    BL.core.guardarPartida(JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = formatearYenes(data.manager.presupuesto);
    mostrarModal('¡FICHAJE COMPLETADO!', `¡Fichaje de ${jug.nombre} completado! Ha sido añadido a tu plantilla${esAgente ? ' (AGENTE LIBRE, gratis)' : ''}.`);
    filtrarMercado();
  };

  window.venderJugador = function (jugadorId) {
    cerrarFicha();
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;

    const jug = todosLosJugadores().find(p => p.id === jugadorId);
    if (!jug) return;

    if (!data.manager.listaTraspasos) data.manager.listaTraspasos = [];
    if (data.manager.listaTraspasos.includes(jugadorId)) {
      mostrarModal('YA EN LA LISTA', `${jug.nombre} ya está en la lista de traspasos. Los clubes interesados te envían sus ofertas por el buzón.`);
      return;
    }
    data.manager.listaTraspasos.push(jugadorId);
    BL.core.guardarPartida(JSON.stringify(data));
    try {
      generarOfertasTraspaso(data);
    } catch (e) {
      console.error('Error al generar ofertas de traspaso:', e);
    }
    BL.core.guardarPartida(JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = formatearYenes(data.manager.presupuesto);
    mostrarModal('JUGADOR EN LISTA DE TRASPASOS', `${jug.nombre} ha sido añadido a la lista de traspasos. Los clubes interesados te enviarán ofertas por el buzón de inmediato y en cada jornada mientras siga en la lista.`);
    filtrarMercado();
    const plantillaScreen = document.getElementById('screen-plantilla');
    if (plantillaScreen && plantillaScreen.classList.contains('active') && !previewPlantillaData) {
      renderPlantillaContent();
    }
  };

  window.quitarDeListaTraspasos = function (jugadorId) {
    cerrarFicha();
    let saved = BL.core.leerGuardado();
    if (!saved) return;
    let data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;

    const jug = todosLosJugadores().find(p => p.id === jugadorId);
    if (!jug) return;

    if (data.manager.listaTraspasos) {
      data.manager.listaTraspasos = data.manager.listaTraspasos.filter(id => id !== jugadorId);
    }
    BL.core.guardarPartida(JSON.stringify(data));

    document.getElementById('mercado-presupuesto').textContent = formatearYenes(data.manager.presupuesto);
    mostrarModal('RETIRADO DE LA LISTA', `${jug.nombre} ya no está en la lista de traspasos.`);
    filtrarMercado();
    const plantillaScreen = document.getElementById('screen-plantilla');
    if (plantillaScreen && plantillaScreen.classList.contains('active') && !previewPlantillaData) {
      renderPlantillaContent();
    }
  };

  // ===== ENTRENAMIENTO SEMANAL =====
  const ETIQUETAS_STATS = { pac: 'RIT', sho: 'TIR', pas: 'PAS', dri: 'REG', def: 'DEF', phy: 'FIS' };

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

  // Plantilla desde el save ya en memoria (data.manager.equipos), sin re-parsear localStorage
  function plantillaDesdeData(data, teamId) {
    const eqs = data?.manager?.equipos || {};
    let arr = eqs[teamId];
    if ((!arr || !arr.length) && typeof PLANTILLAS_EQUIPO !== 'undefined') arr = PLANTILLAS_EQUIPO[teamId];
    return (arr || []).map(normalizarJugador);
  }

  function grlDesdePlantilla(plantilla) {
    if (!plantilla || !plantilla.length) return 60;
    const sum = plantilla.reduce((a, p) => {
      const grl = calcularGrlJugador(p);
      const factor = (p.estamina ?? 100) < 50 ? 0.85 : 1;
      return a + grl * factor;
    }, 0);
    return sum / plantilla.length;
  }

  // Versión de simularPartidoFondo que opera sobre data en memoria (evita JSON.parse por club)
  function simularPartidoFondoDesdeData(data, lid, vid) {
    const gl = grlDesdePlantilla(plantillaDesdeData(data, lid));
    const gv = grlDesdePlantilla(plantillaDesdeData(data, vid));
    const dif = gl - gv;
    const factorLocal = 3;
    const sesgo = (dif + factorLocal) / 8;
    const golesLocal = Math.max(0, Math.round(sesgo + (Math.random() * 2.4) - 1));
    const golesVisit = Math.max(0, Math.round((Math.random() * 2.2) - 1.1 - sesgo / 2));
    return [Math.min(golesLocal, 5), Math.min(golesVisit, 5)];
  }

  // Versión de repartirGolesNPC en memoria (sin getPlantillaPorNombre)
  function repartirGolesNPCMemoria(data, teamId, goles) {
    if (!goles || goles <= 0) return;
    const plantilla = plantillaDesdeData(data, teamId);
    if (!Array.isArray(plantilla) || !plantilla.length) return;
    const atacantes = plantilla.filter(p => ['DC', 'SD', 'EI', 'ED', 'MCO', 'MI', 'MD'].includes(p.posicion));
    const pool = atacantes.length ? atacantes : plantilla;
    const pesos = pool.map(p => statDeJugador(p, 'sho'));
    const totalPeso = pesos.reduce((a, b) => a + b, 0) || 1;
    for (let i = 0; i < goles; i++) {
      let r = Math.random() * totalPeso;
      let pick = pool[0];
      for (let k = 0; k < pool.length; k++) {
        r -= pesos[k];
        if (r <= 0) { pick = pool[k]; break; }
      }
      if (pick?.id) {
        sumarRendimientoBatch(pick.id, { goles: 1, partidosJugados: 1 });
        const tieneArma = (typeof ARMAS_DATABASE !== 'undefined') && (ARMAS_DATABASE[pick.id] || []).length > 0;
        if (tieneArma) cobrarEstaminaArma(data, pick.id, teamId, 8);
      }
    }
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
    detenerRelojPartido();
    partidoCtx = null;
    detenerMusicaPartido();
    goBack();
  };

  window.volverAlHubTrasPartido = function () {
    detenerRelojPartido();
    navHistory.length = 0;
    showScreen('screen-hub');
    renderHub();
  };

  let partidoMinuto = 0;
  let partidoEstado = 'flujo';
  let partidoCronometro = null;
  let eventoActual = null;
  let partidoGolesLocal = 0;
  let partidoGolesVisit = 0;
  let partidoCtx = null;

  function partidoJugadoresDelOnce(equipoNombre) {
    try {
      const saved = BL.core.leerGuardado();
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
  const PROB_DESPERTAR = 0.35;

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

  function simularDueloGoleador(delantero, portero) {
    const atacFatigado = (delantero?.estamina ?? 100) < 50;
    const porFatigado = (portero?.estamina ?? 100) < 50;

    // 1. Atributos en conflicto (con debuff de estamina como resolverDuelo)
    let sho = statDeJugador(delantero, 'sho');
    let div = statDeJugador(portero, 'div');
    let ref = statDeJugador(portero, 'ref');
    let pos = statDeJugador(portero, 'pos');
    let han = statDeJugador(portero, 'han');
    let kic = statDeJugador(portero, 'kic');
    if (atacFatigado) sho = Math.round(sho * 0.85);
    if (porFatigado) { div = Math.round(div * 0.85); ref = Math.round(ref * 0.85); pos = Math.round(pos * 0.85); han = Math.round(han * 0.85); kic = Math.round(kic * 0.85); }

    const statParada = (div + ref + pos) / 3;

    // 2. Sistema de diferencias con límite de seguridad
    let probGol = 50 + (sho - statParada);
    probGol = Math.max(5, Math.min(95, probGol));

    const gol = Math.random() * 100 < probGol;
    const nomDel = delantero?.nombre || 'el delantero';
    const nomPOR = portero?.nombre || 'el portero';

    if (gol) {
      if (delantero?.id) sumarRendimiento(delantero.id, { goles: 1, partidosJugados: 1 });
      return {
        gol: true, rebote: false, contraataque: false,
        mensaje: `¡${nomDel} golpea el esférico con violencia! Cruza la línea... ¡GOL! ${nomPOR} ni se entera.`
      };
    }

    // 3. Juego post-parada: dado de 100 vs 'han'
    const dado = 1 + Math.floor(Math.random() * 100);
    let bloca;
    if (dado < han) bloca = true;
    else if (dado > han) bloca = false;
    else bloca = Math.random() < 0.5; // empate -> moneda 50/50

    if (bloca) {
      const contraataque = Math.random() * 100 < kic;
      return {
        gol: false, rebote: false, contraataque,
        mensaje: contraataque
          ? `¡${nomPOR} bloca el disparo de ${nomDel} y saca en largo! CONTRAATAQUE relámpago de tu equipo.`
          : `¡${nomPOR} se hace con el balón tras el tiro de ${nomDel} y mantiene la posesión!`
      };
    }

    return {
      gol: false, rebote: true, contraataque: false,
      mensaje: `¡${nomPOR} desvía el disparo de ${nomDel}! El balón queda REBOTANDO vivo en el área...`
    };
  }

  function resolverDuelo(atac, def, statAt, statDef, esGolSiGana, armasActivas) {
    let a = statDeJugador(atac, statAt);
    let d = statDeJugador(def, statDef);
    const atacFatigado = (atac?.estamina ?? 100) < 50;
    const defFatigado = def ? (def?.estamina ?? 100) < 50 : false;
    if (atacFatigado) a = Math.round(a * 0.85);
    if (defFatigado) d = Math.round(d * 0.85);
    const armaAt = (armasActivas && armasActivas.atac === false) ? null : armaActivada(atac, statAt);
    const armaDef = (armasActivas && armasActivas.def === false) ? null : (def ? armaActivada(def, statDef) : null);
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
    detenerRelojPartido();
    ocultarBotonTactica();
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
    try {
      onceIdsDeManager(data).forEach(id => descontarEstaminaPartido(data, id, eqManager.id));
      aplicarRecuperacionJornada(data);

      // Rendimiento de temporada: registrar partido jugado + nota para el once del manager
      const miEquipo = data.manager.equipo;
      const onceIds = onceIdsDeManager(data);
      let mejorNota = -1;
      let mejorId = null;
      onceIds.forEach(id => {
        const j = getJugador(id, miEquipo);
        sumarRendimiento(id, { partidosJugados: 1 });
        if (j) {
          const r = getRendimiento(id);
          const gol = r.goles;
          let nota = 6.0 + (gol > 0 ? 1.0 : 0);
          if (j.posicion === 'POR') nota += r.paradas > 0 ? Math.min(1.5, r.paradas * 0.15) : 0;
          nota -= r.tarjetasRojas > 0 ? 2 : 0;
          nota -= r.tarjetasAmarillas > 0 ? 0.5 : 0;
          aplicarNota(id, nota);
          if (nota > mejorNota) { mejorNota = nota; mejorId = id; }
        }
      });
      // MVP del partido: el jugador del once con mejor nota
      if (mejorId) {
        const rMvp = getRendimiento(mejorId);
        rMvp.mvps = (rMvp.mvps || 0) + 1;
      }
      // Rival del partido del usuario: registrar partido jugado a su once
      const rivalId = ctx.esLocal ? partidoUsuario[1] : partidoUsuario[0];
      const rivalNombre2 = nombreEquipoPorId(rivalId);
      const rivalOnce = getPlantillaPorNombre(rivalNombre2);
      if (Array.isArray(rivalOnce)) rivalOnce.forEach(p => sumarRendimiento(p.id, { partidosJugados: 1 }));

      generarAlertasBuzon(data);
      generarOfertasTraspaso(data);
      // Sincronizar el mapa de rendimiento acumulado durante el partido antes de guardar
      rendimientoCache = null;
      data.manager.rendimiento = leerRendimientoData();
      BL.core.guardarPartida(JSON.stringify(data));
      sincronizarSlotActivo();
    } catch (e) {
      console.error('Error al finalizar partido:', e);
    }
    try {
      document.getElementById('partido-btn-fin').style.display = 'block';
    } catch (e) { /* noop */ }
    detenerMusicaPartido();
    reprobarGol();
  }

  function avatarHtml(jug) {
    if (!jug) return '';
    const foto = jug.foto || 'assets/players/default.png';
    return `<div class="duelo-avatar">
      <img src="${foto}" onerror="this.onerror=null;this.src='assets/players/default.png';this.addEventListener('error',function(){this.style.display='none'})" alt="${jug.nombre || ''}">
      <i class="fas fa-user duelo-avatar-fallback"></i>
    </div>`;
  }

  function grlGlobalClub(teamId) {
    if (typeof NEO_EQUIPOS !== 'undefined') {
      const eq = NEO_EQUIPOS.find(e => e.id === teamId);
      if (eq && typeof eq.grl === 'number') return eq.grl;
    }
    const nombre = nombreEquipoPorId(teamId);
    return calcularTeamGrl(nombre);
  }

  function generarOfertasTraspaso(data) {
    if (!data?.manager) return;
    const lt = data.manager.listaTraspasos || [];
    if (lt.length === 0) return;
    const buzon = getBuzon(data);
    const eqManager = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
    if (!eqManager) return;
    const jornada = data.manager.temporada?.jornadaActual ?? 0;
    const clubes = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.filter(e => e.id !== eqManager.id && e.name !== data.manager.equipo) : [];
    const MIN_OFERTAS = 3;
    const MAX_OFERTAS = 5;

    // Cache de plantillas por club (evita miles de lecturas de localStorage)
    const plantillasCache = {};
    function plantillaDeClub(club) {
      if (!plantillasCache[club.name]) {
        let plantilla = [];
        if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
          const key = Object.keys(PLANTILLAS_EQUIPO).find(k => PLANTILLAS_EQUIPO[k][0]?.equipo === club.name);
          if (key) plantilla = PLANTILLAS_EQUIPO[key];
        }
        plantillasCache[club.name] = plantilla;
      }
      return plantillasCache[club.name];
    }

    // Recortar a MAX las ofertas de mensajes antiguos (evita acumulaciones previas >5)
    (buzon.mensajes || []).forEach(m => {
      if (m.tipo === 'oferta' && Array.isArray(m.ofertas) && m.ofertas.length > MAX_OFERTAS) {
        m.ofertas = m.ofertas.slice(0, MAX_OFERTAS);
        m.totalOfertas = m.ofertas.reduce((a, o) => a + (o.precio || 0), 0);
      }
    });

    lt.forEach(jugId => {
      try {
        const jug = getJugador(jugId, data.manager.equipo);
        if (!jug) return;
        const grl = calcularGrlJugador(jug);
        const valor = calcularValor(grl, jug);
        const pos = jug.posicion;
        let ofertas = [];

        // Clubes que ya hicieron una oferta por este jugador (no deben repetirse)
        const clubesYaOfertantes = new Set();
        (buzon.mensajes || []).forEach(m => {
          if (m.tipo === 'oferta' && Array.isArray(m.ofertas)) {
            m.ofertas.forEach(o => {
              if (o.jugadorId === jugId && o.clubId) clubesYaOfertantes.add(o.clubId);
            });
          }
        });

        clubes.forEach(club => {
          // 0. No repetir oferta del mismo club para el mismo jugador
          if (clubesYaOfertantes.has(club.id)) return;
          // 1. Presupuesto: el club debe poder pagar al menos el valor
          if ((club.budget || 0) < valor) return;
          // 2. GRL del club: el jugador no baja a un club mucho peor
          const clubGrl = grlGlobalClub(club.id);
          if (clubGrl < grl - 5) return;
          // 3. Necesidad de posición (usa la plantilla en memoria, sin releer localStorage)
          const enPos = plantillaDeClub(club).filter(p => p.posicion === pos);
          const cuenta = enPos.length;
          const mejor = enPos.length ? Math.max(...enPos.map(p => calcularGrlJugador(p))) : 0;
          const necesita = cuenta <= 3 || mejor < grl - 3;
          if (!necesita) return;

          // 4. Probabilidad de que el club haga una oferta esta jornada
          if (Math.random() > 0.6) return;

          const factor = 0.85 + Math.random() * 0.35; // entre 85% y 120% del valor
          let precio = Math.round(valor * factor);
          if (precio > club.budget) precio = club.budget;
          ofertas.push({
            id: 'of' + Date.now() + Math.floor(Math.random() * 1000),
            clubId: club.id,
            club: club.name,
            jugadorId: jugId,
            jugador: jug.nombre,
            precio
          });
        });

      if (ofertas.length === 0) return;
      if (ofertas.length > MAX_OFERTAS) {
        const tope = MIN_OFERTAS + Math.floor(Math.random() * (MAX_OFERTAS - MIN_OFERTAS + 1));
        ofertas = ofertas.slice(0, Math.min(tope, ofertas.length));
      }
      const total = ofertas.reduce((a, o) => a + o.precio, 0);
      const jugadorInfo = {
        id: jug.id,
        equipo: jug.equipo,
        nombre: jug.nombre,
        foto: jug.foto || '',
        posicion: jug.posicion,
        posicionSec: jug.posicionSec || jug.posicionSecundaria || '',
        grl,
        edad: jug.edad,
        nacionalidad: jug.nacionalidad,
        bandera: jug.bandera || '',
        pie: pieTexto(jug),
        stats: jug.stats || {},
        tiro: jug.tiro, pase: jug.pase, regate: jug.regate,
        defensa: jug.defensa, pac: jug.pac, phy: jug.phy,
        div: jug.div, han: jug.han, kic: jug.kic, ref: jug.ref, spd: jug.spd, pos: jug.pos,
        valor
      };
      // Si ya existe un mensaje de oferta para este jugador, añadir las nuevas ofertas a él (sin superar MAX)
      const existente = (buzon.mensajes || []).find(m => m.tipo === 'oferta' && Array.isArray(m.ofertas) && m.ofertas.some(o => o.jugadorId === jugId));
      if (existente) {
        if (existente.ofertas.length > MAX_OFERTAS) {
          existente.ofertas = existente.ofertas.slice(0, MAX_OFERTAS);
          existente.totalOfertas = existente.ofertas.reduce((a, o) => a + o.precio, 0);
        }
        const hueco = MAX_OFERTAS - existente.ofertas.length;
        if (hueco > 0) {
          const nuevas = ofertas.slice(0, hueco);
          existente.ofertas.push(...nuevas);
          existente.totalOfertas = (existente.totalOfertas || 0) + nuevas.reduce((a, o) => a + o.precio, 0);
        }
        existente.leido = false;
        if (!existente.jugadorInfo) existente.jugadorInfo = jugadorInfo;
        return;
      }
      buzon.mensajes.push({
        id: 'm' + Date.now() + Math.floor(Math.random() * 1000),
        remitente: 'Jinpachi Ego',
        asunto: `Ofertas por ${jug.nombre}`,
        cuerpo: `Los siguientes clubes están interesados en fichar a ${jug.nombre}. Puedes aceptar, rechazar o contraofertar cada oferta:`,
        leido: false,
        jornada,
        tipo: 'oferta',
        ofertas,
        totalOfertas: total,
        jugadorInfo
      });
      } catch (e) {
        console.error('Error al generar ofertas para', jugId, e);
      }
    });
    data.manager.buzon = buzon;
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

  function detenerRelojPartido() {
    if (partidoCronometro) {
      clearInterval(partidoCronometro);
      partidoCronometro = null;
    }
  }

  function mostrarBotonTactica() {
    const b = document.getElementById('partido-btn-tactica');
    if (!b) return;
    b.style.display = 'block';
    const btn = b.querySelector('button');
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('deshabilitado');
    }
  }

  function deshabilitarBotonTactica() {
    const b = document.getElementById('partido-btn-tactica');
    if (!b) return;
    const btn = b.querySelector('button');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('deshabilitado');
    }
  }

  function ocultarBotonTactica() {
    const b = document.getElementById('partido-btn-tactica');
    if (b) b.style.display = 'none';
  }

  function empezarRelojPartido() {
    detenerRelojPartido();
    if (!partidoCtx) return;
    partidoEstado = 'flujo';
    mostrarBotonTactica();
    partidoCronometro = setInterval(avanzarRelojPartido, 1300);
  }

  window.abrirTacticaEnVivo = function () {
    if (!partidoCtx || partidoEstado !== 'flujo') return;
    detenerRelojPartido();
    partidoEstado = 'pausa';
    ocultarBotonTactica();
    renderTactica(true);
    showScreen('screen-tactica');
  };

  function elegirTipoEvento() {
    const PESOS_EVENTO = [
      { tipo: 'ataque', peso: 25 },
      { tipo: 'defensa', peso: 20 },
      { tipo: 'disparo', peso: 35 },
      { tipo: 'disparoRival', peso: 14 },
      { tipo: 'quieto', peso: 6 }
    ];
    const total = PESOS_EVENTO.reduce((a, e) => a + e.peso, 0);
    let r = Math.random() * total;
    for (const e of PESOS_EVENTO) {
      r -= e.peso;
      if (r <= 0) return e.tipo;
    }
    return 'quieto';
  }

  function elegirPortero(plantilla) {
    const pool = plantilla.filter(p => p.posicion === 'POR');
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function fraseAmbientePartido() {
    const frases = [
      'Posesión repartida en el centro del campo.',
      'El partido transcurre con mucha intensidad.',
      'Combinaciones cortas por banda, sin llegar a puerta.',
      'El juego se ralentiza con faltas y pausas.',
      'Ambos equipos se miden sin soltar el balón.',
      'El público agita las gradas alentando a su equipo.'
    ];
    return frases[Math.floor(Math.random() * frases.length)];
  }

  function avanzarRelojPartido() {
    if (partidoEstado !== 'flujo' || !partidoCtx) return;
    const salto = 1 + Math.floor(Math.random() * 2);
    partidoMinuto = Math.min(90, partidoMinuto + salto);
    const minEl = document.getElementById('partido-minuto');
    if (minEl) {
      minEl.textContent = `${partidoMinuto}'`;
      minEl.classList.toggle('ultimos-minutos', partidoMinuto >= 85);
    }
    const master = estadoAudio.sfxActivados;
    if (partidoMinuto >= 85) tocarMusicaEstado('last_chance', master);

    if (partidoMinuto >= 90) {
      detenerRelojPartido();
      finalizarPartido();
      return;
    }
    if (Math.random() < 0.33) {
      escribirLogPartido(`${partidoMinuto}' · ${fraseAmbientePartido()}`, 'quiet');
    }
    if (Math.random() < 0.24) {
      detenerRelojPartido();
      try {
        lanzarEventoPartido();
      } catch (e) {
        console.error('Error lanzando evento de partido:', e);
        empezarRelojPartido();
      }
    }
  }

  function lanzarEventoPartido() {
    const ctx = partidoCtx;
    if (!ctx || partidoEstado !== 'flujo') return;
    const tipo = elegirTipoEvento();
    const { rivalNombre, data } = ctx;
    const miOnce = partidoJugadoresDelOnce(data.manager.equipo);
    const plantillaRival = getPlantillaPorNombre(rivalNombre);
    const ATACANTES = ['DC', 'SD', 'EI', 'ED', 'MCO', 'MI', 'MD'];
    const DEFENSAS = ['DFC', 'LD', 'LI', 'CAD', 'CAI', 'MCD'];

    const ev = { tipo, minuto: partidoMinuto, resuelto: false };
    ev.despertarUsuario = Math.random() < PROB_DESPERTAR;
    ev.despertarRival = Math.random() < PROB_DESPERTAR;
    if (tipo === 'ataque') {
      ev.miJug = elegirPorRol(miOnce, ATACANTES) || elegirPorRol(miOnce, []);
      ev.rivalJug = elegirPorRol(plantillaRival, DEFENSAS) || elegirPorRol(plantillaRival, []);
      ev.esAtaque = true;
      ev.opciones = (ACCIONES_RIVAL[ev.miJug?.posicion] || ['DRI', 'SHO']).slice(0, 2);
    } else if (tipo === 'defensa') {
      ev.rivalJug = elegirPorRol(plantillaRival, ATACANTES) || elegirPorRol(plantillaRival, []);
      ev.miJug = elegirPorRol(miOnce, DEFENSAS) || elegirPorRol(miOnce, []);
      ev.esAtaque = false;
      ev.accionRival = ponderarAccionRival(ev.rivalJug);
      ev.opciones = CRUCES[ev.accionRival] || ['DEF', 'PHY'];
    } else if (tipo === 'disparo') {
      ev.miJug = elegirPorRol(miOnce, ATACANTES) || elegirPorRol(miOnce, []);
      ev.rivalJug = elegirPortero(plantillaRival);
      ev.esAtaque = true;
    } else if (tipo === 'disparoRival') {
      ev.rivalJug = elegirPorRol(plantillaRival, ATACANTES) || elegirPorRol(plantillaRival, []);
      ev.miJug = elegirPortero(miOnce);
      ev.esAtaque = false;
    }

    partidoEstado = 'evento';
    ctx.ultimaJugadaArmaUsuario = false;
    eventoActual = ev;
    deshabilitarBotonTactica();

    if (tipo === 'quieto') {
      resolverEventoQuieto();
    } else if (tipo === 'disparoRival') {
      resolverDisparoRival();
    } else {
      mostrarEventoActual();
    }
  }

  function botonesArmasEvento(ev, statsOfrecidas, hacerOnclick) {
    if (!ev?.despertarUsuario) return '';
    const armasJug = (typeof ARMAS_DATABASE !== 'undefined') ? (ARMAS_DATABASE[ev.miJug?.id] || []) : [];
    const armasRelevantes = armasJug.filter(a =>
      Object.keys(a.stats || {}).some(st => statsOfrecidas.includes(st.toUpperCase()))
    );
    if (!armasRelevantes.length) return '';
    const botones = armasRelevantes.map(a => {
      const stClave = Object.keys(a.stats || {}).find(st => statsOfrecidas.includes(st.toUpperCase())).toUpperCase();
      const bonus = a.stats[stClave.toLowerCase()];
      return `<button class="btn-bluelock partido-opcion-btn partido-arma-btn" onclick="${hacerOnclick(stClave)}">
        <span>⚔ ${a.name}</span>
        <span class="partido-opcion-stats">+${bonus} ${stClave}</span>
      </button>`;
    }).join('');
    return `<div class="partido-armas">
      <div class="ficha-arma-header"><i class="fas fa-crosshairs"></i> ARMAS (USAR)</div>
      ${botones}
    </div>`;
  }

  function mostrarEventoActual() {
    const ctx = partidoCtx;
    if (!ctx) return;
    const ev = eventoActual;
    if (!ev) return;
    const { esLocal } = ctx;
    const minEl = document.getElementById('partido-minuto');
    if (minEl) {
      minEl.textContent = `${ev.minuto}'`;
      minEl.classList.toggle('ultimos-minutos', ev.minuto >= 85);
    }
    const turnoEl = document.getElementById('partido-turno');
    const opcionesEl = document.getElementById('partido-opciones');
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) resultadoEl.innerHTML = '';
    if (!turnoEl || !opcionesEl) return;

    if (ev.tipo === 'disparo') {
      const miAccion = { label: '¡Dispara a puerta!', stat: 'SHO' };
      const rivalAccion = { label: 'Guardando el arco', stat: 'POR' };
      turnoEl.innerHTML = `
        <div class="duelo-vs">
          ${esLocal ? dueloCardHtml(ev.miJug, 'propio', miAccion) : dueloCardHtml(ev.rivalJug, 'rival', rivalAccion)}
          <span class="duelo-vs-sep">VS</span>
          ${esLocal ? dueloCardHtml(ev.rivalJug, 'rival', rivalAccion) : dueloCardHtml(ev.miJug, 'propio', miAccion)}
        </div>
        <div class="duelo-titulo">⚽ ¡OCASIÓN DE GOL!</div>
        <div class="duelo-pista">${ev.miJug?.nombre || 'Tu delantero'} encara a ${ev.rivalJug?.nombre || 'el portero rival'}. ¡Elige cómo rematar!</div>`;
      opcionesEl.innerHTML = `
        <button class="btn-bluelock partido-opcion-btn" onclick="resolverDisparo(false)">
          <span>¡DISPARA!</span>
          <span class="partido-opcion-stats">Tiro: ${Math.round(statDeJugador(ev.miJug, 'sho'))}</span>
        </button>
        ${botonesArmasEvento(ev, ['SHO', 'DRI'], () => 'resolverDisparo(true)')}`;
      return;
    }

    const esAtaque = ev.esAtaque;
    const titulo = esAtaque ? 'TU TURNO DE ATAQUE' : '¡EL RIVAL ATACA!';
    const rivalAccion = esAtaque
      ? { label: 'Preparado para defender', stat: '—' }
      : { label: ETIQUETA_STAT[ev.accionRival] || ev.accionRival, stat: ev.accionRival };
    const miAccion = esAtaque ? { label: 'Elige tu acción', stat: '—' } : { label: 'Elige cómo responder', stat: '—' };
    const statsOfrecidas = ev.opciones;
    const opcionesHtml = statsOfrecidas.map(s => {
      const v = Math.round(statDeJugador(ev.miJug, s));
      return `<button class="btn-bluelock partido-opcion-btn" onclick="resolverOpcion('${s}')">
        <span>${ETIQUETA_STAT[s] || s} (${s})</span>
        <span class="partido-opcion-stats">Tu ${s}: ${v}</span>
      </button>`;
    }).join('') + botonesArmasEvento(ev, statsOfrecidas, (st) => `resolverOpcion('${st}', true)`);

    turnoEl.innerHTML = `
      <div class="duelo-vs">
        ${esLocal ? dueloCardHtml(ev.miJug, 'propio', miAccion) : dueloCardHtml(ev.rivalJug, 'rival', rivalAccion)}
        <span class="duelo-vs-sep">VS</span>
        ${esLocal ? dueloCardHtml(ev.rivalJug, 'rival', rivalAccion) : dueloCardHtml(ev.miJug, 'propio', miAccion)}
      </div>
      <div class="duelo-titulo">${titulo}</div>
      <div class="duelo-pista">${esAtaque
        ? `Ataca con ${ev.miJug?.nombre || 'tu jugador'}. El rival defenderá con su mejor estadística según tu acción.`
        : `${ev.rivalJug?.nombre} va a usar su ${ev.accionRival} (${ETIQUETA_STAT[ev.accionRival] || ev.accionRival}). Responde eligiendo cómo defender.`}</div>`;
    opcionesEl.innerHTML = opcionesHtml;
  }

  function resolverEventoQuieto() {
    const ev = eventoActual;
    if (!ev) return;
    const frases = [
      'Jugada rota por el centro. El balón va y viene.',
      'El rival presiona arriba pero tu defensa despeja.',
      'Saque de banda. El juego se reinicia con calma.',
      'Falta en el medio campo. Ambos equipos reordenan líneas.',
      'Tu equipo combina con paciencia en busca del hueco.'
    ];
    const texto = `${ev.minuto}' · ${frases[Math.floor(Math.random() * frases.length)]}`;
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) {
      resultadoEl.innerHTML = texto;
      resultadoEl.className = 'partido-resultado';
    }
    escribirLogPartido(texto, 'quiet');
    const turnoEl = document.getElementById('partido-turno');
    if (turnoEl) turnoEl.innerHTML = '';
    const opcionesEl = document.getElementById('partido-opciones');
    if (opcionesEl) opcionesEl.innerHTML = '';
    eventoActual = null;
    partidoEstado = 'flujo';
    setTimeout(() => empezarRelojPartido(), 800);
  }

  function resolverDisparoRival() {
    const ev = eventoActual;
    if (!ev) return;
    const ctx = partidoCtx;
    const esLocal = ctx ? ctx.esLocal : false;
    const delantero = ev.rivalJug;
    const portero = ev.miJug;
    const res = simularDueloGoleador(delantero, portero);
    let texto, clase;
    if (res.gol) {
      if (esLocal) partidoGolesVisit++; else partidoGolesLocal++;
      texto = `¡DISPARO DEL RIVAL! ${delantero?.nombre || 'El rival'} marca... ¡GOL EN CONTRA! (${partidoMinuto}')`;
      clase = 'gol';
      reproducirSFX('gol');
    } else {
      texto = `Disparo del rival: ${res.mensaje}`;
      clase = 'parada';
    }
    pintarMarcador();
    actualizarAudioEstadoPartido();
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) {
      resultadoEl.innerHTML = texto;
      resultadoEl.className = 'partido-resultado ' + clase;
    }
    escribirLogPartido(`${ev.minuto}' · ${texto}`, clase);
    const turnoEl = document.getElementById('partido-turno');
    if (turnoEl) turnoEl.innerHTML = '';
    const opcionesEl = document.getElementById('partido-opciones');
    if (opcionesEl) opcionesEl.innerHTML = '';
    eventoActual = null;
    partidoEstado = 'flujo';
    setTimeout(() => empezarRelojPartido(), 1100);
  }

  window.resolverDisparo = function (esArma) {
    const ctx = partidoCtx;
    const ev = eventoActual;
    if (!ctx || !ev || ev.resuelto || ev.tipo !== 'disparo') return;
    const esLocal = ctx.esLocal;
    const delantero = ev.miJug;
    const portero = ev.rivalJug;
    ev.resuelto = true;
    eventoActual = null;
    partidoEstado = 'flujo';

    const COSTE_ARMA = 8;
    if (esArma && delantero?.id && ctx.eqManager) {
      cobrarEstaminaArma(ctx.data, delantero.id, ctx.eqManager.id, COSTE_ARMA);
      escribirLogPartido(`⚡ ${delantero.nombre} prepara su arma para el disparo (${COSTE_ARMA} de estamina).`, 'arma');
    }

    const res = simularDueloGoleador(delantero, portero);
    let texto, clase;
    if (res.gol) {
      if (esLocal) partidoGolesLocal++; else partidoGolesVisit++;
      texto = `¡${delantero?.nombre || 'El delantero'} DISPARA... ¡GOOOL! (${partidoMinuto}')`;
      clase = 'gol';
      reproducirSFX('gol');
    } else {
      texto = res.mensaje;
      clase = 'parada';
    }
    pintarMarcador();
    partidoCtx.ultimaJugadaArmaUsuario = !!esArma;
    actualizarAudioEstadoPartido();
    const resultadoEl = document.getElementById('partido-resultado');
    if (resultadoEl) {
      resultadoEl.innerHTML = texto;
      resultadoEl.className = 'partido-resultado ' + clase;
    }
    escribirLogPartido(`${ev.minuto}' · ${texto}`, clase);
    const turnoEl = document.getElementById('partido-turno');
    if (turnoEl) turnoEl.innerHTML = '';
    const opcionesEl = document.getElementById('partido-opciones');
    if (opcionesEl) opcionesEl.innerHTML = '';
    setTimeout(() => empezarRelojPartido(), 1100);
  };

  function fmtDuelo(res, invertido) {
    const a = invertido ? res.d : res.a;
    const b = invertido ? res.a : res.d;
    const bonusA = invertido ? res.bonusDef : res.bonusAt;
    const bonusB = invertido ? res.bonusAt : res.bonusDef;
    const ladoA = `${a}${bonusA ? '+' + bonusA + ' arma' : ''}+${res.dado}`;
    const ladoB = `${b}${bonusB ? '+' + bonusB + ' arma' : ''}`;
    return `${ladoA} vs ${ladoB}`;
  }

  function pintarMarcador() {
    const elL = document.getElementById('partido-goles-local');
    const elV = document.getElementById('partido-goles-visit');
    [[elL, partidoGolesLocal], [elV, partidoGolesVisit]].forEach(([el, val]) => {
      if (!el) return;
      const antes = el.textContent;
      el.textContent = String(val);
      if (antes !== String(val)) {
        el.classList.remove('gol-bump');
        void el.offsetWidth;
        el.classList.add('gol-bump');
      }
    });
  }

  window.resolverOpcion = function (stat, esArma) {
    const ctx = partidoCtx;
    const ev = eventoActual;
    if (!ctx || !ev || ev.resuelto) return;
    if (ev.tipo !== 'ataque' && ev.tipo !== 'defensa') return;
    const { miJug, rivalJug, esAtaque, accionRival } = ev;
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
    const armasActivas = esAtaque
      ? { atac: !!ev.despertarUsuario, def: !!ev.despertarRival }
      : { atac: !!ev.despertarRival, def: !!ev.despertarUsuario };
    const res = resolverDuelo(atac, def, statAt, statDef, true, armasActivas);
    ev.resuelto = true;
    eventoActual = null;
    partidoEstado = 'flujo';

    try {
      // Coste de estamina por usar arma
      const COSTE_ARMA = 8;
      if (esArma && miJug?.id && ctx.eqManager) {
        cobrarEstaminaArma(ctx.data, miJug.id, ctx.eqManager.id, COSTE_ARMA);
        escribirLogPartido(`⚡ ${miJug.nombre} desata su arma y gasta ${COSTE_ARMA} de estamina.`, 'arma');
      }
      const rivalUsaArma = (!esAtaque && res.armaAt) || (esAtaque && res.armaDef);
      if (rivalUsaArma && rivalJug?.id && ctx.rivalId) {
        cobrarEstaminaArma(ctx.data, rivalJug.id, ctx.rivalId, COSTE_ARMA);
        escribirLogPartido(`⚡ ${rivalJug.nombre} activa su arma y gasta ${COSTE_ARMA} de estamina.`, 'arma');
      }

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
          if (atac?.id) sumarRendimiento(atac.id, { goles: 1, partidosJugados: 1 });
          reproducirSFX('gol');
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
          if (atac?.id) sumarRendimiento(atac.id, { goles: 1, partidosJugados: 1 });
          reproducirSFX('gol');
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

      pintarMarcador();
      partidoCtx.ultimaJugadaArmaUsuario = esAtaque ? !!res.armaAt : !!res.armaDef;
      actualizarAudioEstadoPartido();
      const resultadoEl = document.getElementById('partido-resultado');
      if (resultadoEl) {
        resultadoEl.innerHTML = texto;
        resultadoEl.className = 'partido-resultado ' + clase;
      }
      escribirLogPartido(`${ev.minuto}' · ${texto}`, clase);
      const opcionesEl = document.getElementById('partido-opciones');
      if (opcionesEl) opcionesEl.innerHTML = '';
    } catch (e) {
      console.error('Error al resolver evento:', e);
    }
    setTimeout(() => {
      empezarRelojPartido();
    }, 900);
  };

  window.iniciarJornada = function () {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    const { temporada, liga } = getTemporada(data);
    if (!liga) return;
    BL.core.guardarPartida(JSON.stringify(data));
    const ligaKey = liga.nombre;
    const eqManager = NEO_EQUIPOS.find(e => e.name === data.manager.equipo);
    if (!eqManager) return;

    // Respaldo: si la táctica no está inicializada, crearla (partidas viejas)
    if (!data.manager.tactica || !Array.isArray(data.manager.tactica.once) || data.manager.tactica.once.length === 0) {
      try {
        const plantillaJ = getPlantillaEquipo(data.manager.equipo);
        data.manager.tactica = elegirMejorOnce(plantillaJ, eqManager.formation || '4-3-3');
        BL.core.guardarPartida(JSON.stringify(data));
      } catch (e) { console.error('Error inicializando táctica en iniciarJornada:', e); }
    }

    const calendario = temporada.calendario[ligaKey];
    if (!calendario || temporada.jornadaActual >= calendario.length) {
      mostrarModal('TEMPORADA COMPLETA', '¡Has completado todas las jornadas de la liga! La temporada ha terminado.');
      return;
    }

    // Hornada de cantera a mitad de temporada (una sola vez)
    try {
      if (temporada.jornadaActual === Math.floor(calendario.length / 2)) {
        generarHornadaCantera(data);
        BL.core.guardarPartida(JSON.stringify(data));
      }
    } catch (e) { console.error('Error generando cantera:', e); }

    const jornada = calendario[temporada.jornadaActual];
    const partidoUsuario = jornada.find(([l, v]) => l === eqManager.id || v === eqManager.id);
    if (!partidoUsuario) return;

    // Simular todos los partidos IA de la jornada (excepto el del jugador)
    const resultadosFondo = window.simularJornadaGeneral
      ? window.simularJornadaGeneral(temporada.jornadaActual)
      : [];

    const esLocal = partidoUsuario[0] === eqManager.id;
    const rivalId = esLocal ? partidoUsuario[1] : partidoUsuario[0];
    const rivalNombre = nombreEquipoPorId(rivalId);

    partidoMinuto = 0;
    partidoGolesLocal = 0;
    partidoGolesVisit = 0;
    partidoEstado = 'flujo';
    eventoActual = null;
    partidoCtx = { data, temporada, esLocal, eqManager, rivalId, rivalNombre, partidoUsuario, resultadosFondo, turnoActual: null, ultimaJugadaArmaUsuario: false };

    document.getElementById('partido-jornada').textContent = `JORNADA ${temporada.jornadaActual + 1} · ${liga.nombre}`;
    document.getElementById('partido-nombre-local').textContent = nombreEquipoPorId(partidoUsuario[0]);
    document.getElementById('partido-nombre-visit').textContent = nombreEquipoPorId(partidoUsuario[1]);
    document.getElementById('partido-escudo-local').innerHTML = escudoHtmlPartido(partidoUsuario[0]);
    document.getElementById('partido-escudo-visit').innerHTML = escudoHtmlPartido(partidoUsuario[1]);
    const golElL = document.getElementById('partido-goles-local');
    const golElV = document.getElementById('partido-goles-visit');
    golElL.textContent = '0';
    golElV.textContent = '0';
    golElL.classList.remove('gol-bump');
    golElV.classList.remove('gol-bump');
    document.getElementById('partido-log').innerHTML = '';
    document.getElementById('partido-btn-fin').style.display = 'none';
    document.getElementById('partido-resultado').innerHTML = '';
    document.getElementById('partido-turno').innerHTML = '';
    document.getElementById('partido-opciones').innerHTML = '';
    const minElInit = document.getElementById('partido-minuto');
    minElInit.textContent = "1'";
    minElInit.classList.remove('ultimos-minutos');
    showScreen('screen-partido');
    reproducirSFX('silbato_arbitro');
    iniciarMusicaPartido();
    empezarRelojPartido();
  };

  window.actualizarTablaClasificacion = function () {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) return;
    gameState.estadoTemporada = data.manager.temporada;
    renderClasificacion();
  };

  window.jugarProximoPartido = function () {
    const saved = BL.core.leerGuardado();
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.tipo !== 'manager' || !data.manager) {
      mostrarModal('MODO JUGADOR', 'La simulación de partidos está disponible solo en el Modo Carrera (Manager).');
      return;
    }
    if (data.manager.egoistaCreado && typeof window.iniciarSimuladorJugador === 'function') {
      window.iniciarSimuladorJugador();
    } else {
      iniciarJornada();
    }
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
      const saved = BL.core.leerGuardado();
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
      if (!jug && typeof AGENTES_LIBRES !== 'undefined') {
        const ag = AGENTES_LIBRES.find(p => p.id === jugadorId);
        if (ag) jug = normalizarJugador({ ...ag });
      }
      if (!jug) {
        try {
          const d = BL.core.cargarPartida();
          const cantera = d?.manager?.cantera || [];
          const cc = cantera.find(p => p.id === jugadorId);
          if (cc) jug = normalizarJugador({ ...cc });
          if (!jug) {
            const fichaje = (d?.manager?.fichajes || []).find(p => p.id === jugadorId);
            if (fichaje) {
              jug = normalizarJugador({ ...fichaje });
              // Ficha del Egoísta: completar datos propios (avatar, valor por posición e instituto)
              const ego = d?.manager?.egoista || {};
              const egoCreado = d?.manager?.egoistaCreado || {};
              if (!jug.foto) jug.foto = ego.avatar || egoCreado.avatar || jug.foto;
              if (typeof jug.valor !== 'number') jug.valor = egoCreado.valor;
              if (!jug.instituto) jug.instituto = ego.instituto || '—';
            }
          }
        } catch (e) { /* noop */ }
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
      const etiquetas = { pac: 'RIT', sho: 'TIR', pas: 'PAS', dri: 'REG', def: 'DEF', phy: 'FIS' };
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
      const saved = BL.core.leerGuardado();
      if (saved && jugadorId !== 'player') {
        const data = JSON.parse(saved);
        if (data.tipo === 'manager' && data.manager) {
          if (String(jugadorId).startsWith('cantera_')) {
            btnOferta = `<button class="ficha-oferta-btn" onclick="subirCanterano('${jugadorId}')">
              <i class="fas fa-arrow-up"></i> SUBIR AL PRIMER EQUIPO (GRATIS)
            </button>`;
          } else {
          const propios = new Set(getPlantillaEquipo(data.manager.equipo).map(p => p.id));
          if (propios.has(jug.id)) {
            const enLT = estaEnListaTraspasos(jug.id);
            btnOferta = enLT
              ? `<button class="ficha-oferta-btn vender" onclick="quitarDeListaTraspasos('${jugadorId}')">
                  <i class="fas fa-undo"></i> RETIRAR DE LA LISTA DE TRASPASOS
                </button>`
              : `<button class="ficha-oferta-btn vender" onclick="venderJugador('${jugadorId}')">
                  <i class="fas fa-tag"></i> OFERECER A EQUIPOS
                </button>`;
          } else if (jug.agenteLibre === true) {
            btnOferta = `<button class="ficha-oferta-btn" onclick="ficharJugador('${jugadorId}')">
              <i class="fas fa-handshake"></i> FICHAR GRATIS
            </button>`;
          } else {
            const presupuesto = data.manager.presupuesto ?? getPresupuestoManager();
            const valor = calcularValor(grlFicha, jug);
            const puede = presupuesto >= valor;
            btnOferta = `
            <div class="ficha-oferta-box">
              <div class="ficha-oferta-ref">VALOR DE MERCADO: ${formatearYenes(valor)}</div>
              <input type="number" class="ficha-oferta-input" id="ficha-oferta-precio" min="${valor}" step="500000" value="${valor}" ${puede ? '' : 'disabled'}>
              <button class="ficha-oferta-btn ${puede ? '' : 'disabled'}" ${puede ? '' : 'disabled'} onclick="ficharJugador('${jugadorId}', document.getElementById('ficha-oferta-precio').value)">
                <i class="fas fa-handshake"></i> ${puede ? 'HACER OFERTA' : 'PRESUPUESTO INSUFICIENTE'}
              </button>
            </div>`;
          }
          }
        }
      }
    } catch (e) {
      btnOferta = '';
    }

    const fotoSrc = jug.foto || 'assets/players/default.png';
    const esFichaEgoista = jugadorId === 'egoista';
    const avatarPersonalizado = esFichaEgoista && typeof fotoSrc === 'string' && fotoSrc.startsWith('data:');
    const tieneLogoClub = !!escudoEquipoPorNombre(jug.equipo);
    document.getElementById('ficha-content').innerHTML = `
      <div class="ficha-header"><span>BLUE LOCK PROJECT</span></div>
      <div class="ficha-top">
        <div class="ficha-data-grid">
          <div class="ficha-row">
            <div class="ficha-label">NOMBRE COMPLETO</div>
            <div class="ficha-value">${jug.nombre.toUpperCase()}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">INSTITUTO</div>
            <div class="ficha-value">${jug.instituto || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">NACIONALIDAD</div>
            <div class="ficha-value">${jug.bandera || ''} ${jug.nacionalidad || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">EDAD</div>
            <div class="ficha-value">${jug.edad}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">VALOR</div>
            <div class="ficha-value">${formatearYenes(calcularValor(grlFicha, jug))}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">POSICIÓN</div>
            <div class="ficha-value">${jug.posicion}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">POS. SECUNDARIA</div>
            <div class="ficha-value">${jug.posicionSec || '—'}</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">ALTURA</div>
            <div class="ficha-value">${jug.altura}cm</div>
          </div>
          <div class="ficha-row">
            <div class="ficha-label">PIE DOMINANTE</div>
            <div class="ficha-value">${jug.pie}</div>
          </div>
        </div>
        <div class="ficha-side">
          <div class="ficha-photo ${esFichaEgoista ? 'ficha-photo-editable' : ''}" ${esFichaEgoista ? 'onclick="abrirModalAvatar()" title="Cambiar avatar"' : ''}>
            <img src="${fotoSrc}" onerror="this.onerror=null;this.style.display='none'" alt="${jug.nombre}">
            <i class="fas fa-user ficha-photo-fallback"></i>
            ${esFichaEgoista ? '<span class="ficha-avatar-edit-hint"><i class="fas fa-camera"></i></span>' : ''}
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
          ? `${cuadrito('EST', jug.div || 60)}${cuadrito('PAR', jug.han || 60)}${cuadrito('SAQ', jug.kic || 60)}${cuadrito('REF', jug.ref || 60)}${cuadrito('VEL', jug.spd || 60)}${cuadrito('POS', jug.pos || 60)}`
          : `${cuadrito('RIT', jug.pac || 60)}${cuadrito('TIR', jug.tiro)}${cuadrito('PAS', jug.pase)}${cuadrito('REG', jug.regate)}${cuadrito('DEF', jug.defensa)}${cuadrito('FIS', jug.phy || 60)}`}
      </div>
      <div class="ficha-rendimiento">
        <div class="ficha-arma-header"><i class="fas fa-chart-simple"></i> RENDIMIENTO DE TEMPORADA</div>
        <div class="ficha-stats-grid ficha-stats-6">
          ${cuadrito('PJ', jug.rendimiento?.partidosJugados ?? 0)}
          ${cuadrito('GOLES', jug.rendimiento?.goles ?? 0)}
          ${cuadrito('ASIST', jug.rendimiento?.asistencias ?? 0)}
          ${jug.posicion === 'POR' ? cuadrito('PARADAS', jug.rendimiento?.paradas ?? 0) : ''}
          ${cuadrito('AMAR.', jug.rendimiento?.tarjetasAmarillas ?? 0)}
          ${cuadrito('ROJAS', jug.rendimiento?.tarjetasRojas ?? 0)}
          ${cuadrito('NOTA', (jug.rendimiento?.notaMedia ?? 0).toFixed(1))}
        </div>
      </div>
      ${bloqueArma}
      ${btnOferta}
      <div class="ficha-hexagono">
        <canvas id="ficha-canvas-hexagono" width="520" height="560"></canvas>
      </div>
    `;
    const hexEsPOR = jug.posicion === 'POR';
    const hexStats = hexEsPOR
      ? { div: jug.div || 60, han: jug.han || 60, kic: jug.kic || 60, ref: jug.ref || 60, spd: jug.spd || 60, pos: jug.pos || 60 }
      : { pac: jug.pac || 60, sho: jug.tiro, pas: jug.pase, dri: jug.regate, def: jug.defensa, phy: jug.phy || 60 };
    window.renderizarHexagono('ficha-canvas-hexagono', hexStats, hexEsPOR);
    document.getElementById('ficha-modal-overlay').classList.add('active');
  };

  window.cerrarFicha = function () {
    document.getElementById('ficha-modal-overlay').classList.remove('active');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarFicha();
  });

  // Formulario: Crear Jugador
  document.getElementById('form-crear-jugador').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('input-nombre-jugador').value.trim();
    if (!nombre) {
      mostrarModal('ERROR', 'Ingresa un nombre para tu Egoísta.');
      return;
    }
    const posicion = document.getElementById('select-posicion').value;
    const nacionalidad = document.getElementById('select-nacionalidad').value;
    if (!nacionalidad) {
      mostrarModal('ERROR', 'Elige una nacionalidad.');
      return;
    }
    const bandera = (typeof BANDERAS_PAIS !== 'undefined' ? BANDERAS_PAIS[nacionalidad] : '') || '🌍';
    const instituto = document.getElementById('input-instituto')?.value.trim() || 'Desconocido';
    const edad = parseInt(document.getElementById('input-edad')?.value, 10) || 16;
    const alturaVal = parseInt(document.getElementById('input-altura')?.value, 10) || 175;
    const pie = document.getElementById('select-pie')?.value || 'Derecha';
    const posicionSec = document.getElementById('select-possec')?.value || '';

    const statsBase = (typeof EGOISTA_STATS_BASE !== 'undefined') ? (EGOISTA_STATS_BASE[posicion] || {}) : {};
    const esPOR = posicion === 'POR';
    const atributos = esPOR
      ? { est: statsBase.est || 50, man: statsBase.man || 48, saq: statsBase.saq || 45, ref: statsBase.ref || 58, vel: statsBase.vel || 44, col: statsBase.col || 50 }
      : { tiro: statsBase.tiro || 30, pase: statsBase.pase || 45, regate: statsBase.regate || 40, vision: statsBase.vision || 45, def: statsBase.def || 58, fis: statsBase.fis || 52 };
    const atributosFin = aplicarBonusAltura(atributos, posicion, parseInt(document.getElementById('input-altura')?.value, 10) || 0);
    const grl = grlEgoistaBase(atributosFin, esPOR);
    const statsFichaje = esPOR
      ? { div: atributosFin.est, han: atributosFin.man, kic: atributosFin.saq, ref: atributosFin.ref, spd: atributosFin.vel, pos: atributosFin.col }
      : { pac: posicion === 'DC' ? 54 : 55, sho: atributosFin.tiro, pas: atributosFin.pase, dri: atributosFin.regate, def: atributosFin.def, phy: atributosFin.fis };
    const avatar = egoistaAvatarUrl || 'assets/players/default.png';

    const save = {
      tipo: "manager",
      monedas: gameState.monedas,
      gemas: gameState.gemas,
      manager: {
        nombre,
        equipo: null,
        presupuesto: 0,
        fichajes: [],
        vendidos: [],
        traspasos: {},
        listaTraspasos: [],
        rendimiento: {},
        estamina: {},
        entrenamiento: {},
        semana: 0,
        entrenadoSemana: false,
        egoista: { nombre, posicion, posicionSec, instituto, edad, altura: alturaVal + 'cm', pie, nacionalidad, bandera, avatar, equipo: null, rango: 'D', grl, stats: { tiro: 65, pase: 65, regate: 65, vision: 65, ego: 70 } },
        egoistaCreado: { nombre, instituto, nacionalidad: { bandera, pais: nacionalidad }, edad, altura: alturaVal + 'cm', pie, posicion, posicionSec, valor: VALOR_POSICION[posicion] || 1500000, avatar, rango: 'D', grl, atributos: atributosFin },
        buzon: { mensajes: [] }
      },
      fechaCreacion: new Date().toISOString()
    };

    // El Egoísta como jugador (agente libre) en fichajes
    save.manager.fichajes.push({
      id: 'egoista',
      nombre,
      posicion,
      posicionSec: posicionSec || undefined,
      edad,
      nacionalidad,
      bandera,
      altura: alturaVal + 'cm',
      pierna: pie,
      grl,
      equipo: null,
      agenteLibre: true,
      stats: statsFichaje
    });

    // Inyectar jugadores de todos los equipos (infraestructura del modo manager)
    save.manager.equipos = {};
    if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
      Object.keys(PLANTILLAS_EQUIPO).forEach(teamId => {
        save.manager.equipos[teamId] = (PLANTILLAS_EQUIPO[teamId] || []).map(j => ({ ...j }));
      });
    }
    save.manager.agentesLibres = (typeof AGENTES_LIBRES !== 'undefined' ? AGENTES_LIBRES : []).map(j => ({ ...j }));
    getTemporada(save);

    // Ofertas iniciales de clubes (modal cinematográfico en el HUB)
    save.manager.ofertasIniciales = generarOfertasIniciales(save.manager);
    save.manager.eleccionEquipoPendiente = true;

    // Autoguardado: registrar la partida en el sistema de slots (CARGAR PARTIDA)
    BL.core.guardarPartida(JSON.stringify(save));
    const slotId = nuevoSlotId();
    BL.core.guardarSlotActivo(slotId);
    const slots = getManagerSlots();
    slots.push({
      slotId,
      fechaCreacion: save.fechaCreacion,
      fechaGuardado: save.fechaCreacion,
      equipo: save.manager.equipo || null,
      semana: 0,
      origen: 'egoista',
      data: save
    });
    saveManagerSlots(slots);

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

    // Construir el save COMPLETO con el estado inicial del manager
    const eqInfo = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.id === tsState.equipoId) : null;
    const save = {
      tipo: "manager",
      monedas: gameState.monedas,
      gemas: gameState.gemas,
      manager: {
        nombre,
        equipo,
        presupuesto: eqInfo?.budget ?? 5000000000,
        fichajes: [],
        vendidos: [],
        traspasos: {},
        listaTraspasos: [],
        rendimiento: {},
        estamina: {},
        entrenamiento: {},
        semana: 0,
        entrenadoSemana: false,
        buzon: { mensajes: [mensajeEgoBienvenida(equipo)] }
      },
      fechaCreacion: new Date().toISOString()
    };
    // Inicializar temporada (calendario + clasificación de la liga del manager)
    getTemporada(save);

    // Inicializar táctica (once + banca) con la formación del equipo
    try {
      const plantillaInicial = getPlantillaEquipo(equipo);
      save.manager.tactica = elegirMejorOnce(plantillaInicial, eqInfo?.formation || '4-3-3');
    } catch (e) {
      console.error('Error inicializando táctica:', e);
      save.manager.tactica = { formacion: eqInfo?.formation || '4-3-3', once: [], banca: [] };
    }

    // Inyectar jugadores de todos los equipos en el save (Map por teamId)
    save.manager.equipos = {};
    if (typeof PLANTILLAS_EQUIPO !== 'undefined') {
      Object.keys(PLANTILLAS_EQUIPO).forEach(teamId => {
        save.manager.equipos[teamId] = (PLANTILLAS_EQUIPO[teamId] || []).map(j => ({ ...j }));
      });
    }
    save.manager.agentesLibres = (typeof AGENTES_LIBRES !== 'undefined' ? AGENTES_LIBRES : []).map(j => ({ ...j }));

    // Diagnóstico
    const totalJug = Object.values(save.manager.equipos).reduce((a, l) => a + l.length, 0);
    console.log('[Inicio Carrera] Equipos inyectados:', Object.keys(save.manager.equipos).length, '| Jugadores:', totalJug);

    // Persistir el save completo ANTES de tocar slots
    BL.core.guardarPartida(JSON.stringify(save));
    const slotId = nuevoSlotId();
    BL.core.guardarSlotActivo(slotId);
    slots.push({
      slotId,
      fechaCreacion: save.fechaCreacion,
      fechaGuardado: save.fechaCreacion,
      equipo,
      semana: 0,
      origen: 'carrera',
      data: save
    });
    saveManagerSlots(slots);

    mostrarModal("¡MANAGER REGISTRADO!", `Bienvenido, Manager ${nombre}. Dirigirás al ${equipo}.`);
    guardarEstado();
    console.log('[Antes de renderHub] Plantilla manager =', getPlantillaEquipo(equipo).length, 'jugadores');
    console.log('[Antes de renderHub] Mercado (todos) =', todosLosJugadores().length, 'jugadores');
    renderHub();
    showScreen('screen-hub');
  });

  // Init Calls
  try { cargarEstado(); } catch (e) { console.error('init cargarEstado', e); }
  try { cargarNacionalidadesUI(); } catch (e) { console.error('init cargarNacionalidadesUI', e); }
  try { window.renderTienda(); } catch (e) { console.error('init renderTienda', e); }
  try { window.renderLogros(); } catch (e) { console.error('init renderLogros', e); }
  try { window.renderMenuPrincipal(); } catch (e) { console.error('init renderMenuPrincipal', e); }

  // Registro de cargadores de pantalla (navegación segura mostrarPantalla)
  BL.cargadores['modo-historia'] = function () { window.renderHistoria(); };
  BL.cargadores['crear-jugador'] = function () {};
  BL.cargadores['modo-manager'] = function () { tsInit(); };
  BL.cargadores['tienda'] = function () { window.renderTienda(); };
  BL.cargadores['logros'] = function () { window.renderLogros(); };
  BL.cargadores['ajustes'] = function () { window.renderListaSFX(); };
  BL.cargadores['hub'] = function () { window.renderHub(); };
});
