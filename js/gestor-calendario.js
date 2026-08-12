/* ==========================================================================
 * gestor-calendario.js — Simulación de jornadas IA
 * Centraliza la simulación de todos los partidos del torneo (excepto el del
 * jugador) para una semana, actualizando clasificación, historial y
 * rendimiento. Persistencia exclusivamente a través de BL.core.
 * ========================================================================== */
(function () {
  'use strict';

  window.simularJornadaGeneral = function (semanaActual) {
    const data = BL.core.cargarPartida();
    if (!data || data.tipo !== 'manager' || !data.manager) return [];
    const temporada = data.manager.temporada;
    if (!temporada || !temporada.calendario) return [];

    const jornadaIdx = (typeof semanaActual === 'number') ? semanaActual : (temporada.jornadaActual || 0);
    if (!temporada.simuladas) temporada.simuladas = {};

    // Idempotente: si la jornada ya se simuló, devolver los resultados guardados
    const ya = temporada.simuladas[jornadaIdx];
    if (ya && Array.isArray(ya.resultados)) return ya.resultados;

    const eqManagerId = BL.util.teamIdPorNombre(data.manager.equipo);
    const resultados = [];

    Object.keys(temporada.calendario).forEach(ligaNombre => {
      const cal = temporada.calendario[ligaNombre];
      if (!cal || jornadaIdx >= cal.length) return;
      cal[jornadaIdx].forEach(([l, v]) => {
        // Excluir el partido del jugador (se procesa de forma independiente)
        if (l === eqManagerId || v === eqManagerId) return;

        const [gl, gv] = BL.util.simularPartidoFondo(data, l, v);
        resultados.push({ l, v, gl, gv });

        BL.util.aplicarResultado(temporada.clasificacion, l, v, gl, gv);
        if (BL.util.descontarEstaminaEquipoNPC) {
          BL.util.descontarEstaminaEquipoNPC(data, l);
          BL.util.descontarEstaminaEquipoNPC(data, v);
        }
        BL.util.repartirGolesNPC(data, l, gl);
        BL.util.repartirGolesNPC(data, v, gv);

        [BL.util.plantillaDesdeData(data, l), BL.util.plantillaDesdeData(data, v)].forEach(lista => {
          if (Array.isArray(lista)) lista.forEach(p => {
            if (p && p.id) BL.util.sumarRendimientoBatch(p.id, { partidosJugados: 1 });
          });
        });
      });
    });

    BL.util.persistirRendimiento();
    temporada.simuladas[jornadaIdx] = { resultados };
    BL.core.guardarPartida(data);
    if (BL.util.sincronizarSlotActivo) BL.util.sincronizarSlotActivo();
    return resultados;
  };
})();
