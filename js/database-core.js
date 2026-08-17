/* ==========================================================================
 * database-core.js — GuardadoManager
 * Única puerta de acceso a localStorage. Ningún otro módulo debe escribir
 * directamente en el almacenamiento: todo pasa por BL.core.
 * ========================================================================== */
(function () {
  'use strict';

  var CLAVE_PARTIDA = 'blue_lock_save';
  var CLAVE_SLOTS = 'bl_manager_slots';
  var CLAVE_SLOT_ACTIVO = 'bl_manager_active';
  var CLAVE_LEGACY = 'bl_manager_save';
  var CLAVES_AJUSTES = [
    'bl_volume_general',
    'bl_theme_volume',
    'bl_sfx_activados',
    'bl_sfx_individuales',
    'bl_theme_autoplay'
  ];

  function leerClave(clave) {
    try { return localStorage.getItem(clave); } catch (e) { console.error('GuardadoManager.leerClave:', e); return null; }
  }

  function escribirClave(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) { console.error('GuardadoManager.escribirClave:', e); }
  }

  function borrarClave(clave) {
    try { localStorage.removeItem(clave); } catch (e) { console.error('GuardadoManager.borrarClave:', e); }
  }

  function parsear(s, defecto) {
    if (!s) return defecto;
    try { return JSON.parse(s); } catch (e) { console.error('GuardadoManager: JSON inválido en', s.slice(0, 40), e); return defecto; }
  }

  var GuardadoManager = {

    /* ===== Partida principal (blue_lock_save) ===== */

    // Devuelve la cadena cruda (compatible con patrones JSON.parse existentes).
    leerGuardado: function () {
      return leerClave(CLAVE_PARTIDA);
    },

    // Devuelve el objeto parseado o null.
    cargarPartida: function () {
      return parsear(leerClave(CLAVE_PARTIDA), null);
    },

    // Guarda un objeto (lo serializa) o una cadena JSON ya preparada.
    guardarPartida: function (estado) {
      escribirClave(CLAVE_PARTIDA, typeof estado === 'string' ? estado : JSON.stringify(estado));
    },

    existePartida: function () {
      return leerClave(CLAVE_PARTIDA) !== null;
    },

    borrarPartida: function () {
      borrarClave(CLAVE_PARTIDA);
    },

    /* ===== Slots del Modo Carrera ===== */

    leerSlotsRaw: function () {
      return leerClave(CLAVE_SLOTS);
    },

    cargarSlots: function () {
      return parsear(leerClave(CLAVE_SLOTS), []);
    },

    guardarSlots: function (lista) {
      escribirClave(CLAVE_SLOTS, JSON.stringify(lista || []));
    },

    slotActivo: function () {
      return leerClave(CLAVE_SLOT_ACTIVO);
    },

    guardarSlotActivo: function (id) {
      escribirClave(CLAVE_SLOT_ACTIVO, String(id));
    },

    borrarSlotActivo: function () {
      borrarClave(CLAVE_SLOT_ACTIVO);
    },

    /* ===== Ajustes (whitelist) ===== */

    leerAjusteRaw: function (clave) {
      return CLAVES_AJUSTES.indexOf(clave) !== -1 ? leerClave(clave) : null;
    },

    leerAjuste: function (clave, defecto) {
      if (CLAVES_AJUSTES.indexOf(clave) === -1) return defecto;
      return parsear(leerClave(clave), defecto);
    },

    guardarAjuste: function (clave, valor) {
      if (CLAVES_AJUSTES.indexOf(clave) !== -1) {
        escribirClave(clave, typeof valor === 'string' ? valor : JSON.stringify(valor));
      }
    },

    /* ===== Legacy (migración de partidas antiguas) ===== */

    leerLegacy: function () {
      return leerClave(CLAVE_LEGACY);
    },

    borrarLegacy: function () {
      borrarClave(CLAVE_LEGACY);
    }
  };

  // Espacio compartido entre módulos
  window.BL = window.BL || {};

  BL.core = GuardadoManager;

  // Estado runtime compartido (los módulos mutan este objeto; solo se
  // inicializa aquí para que todos compartan la misma referencia).
  BL.estado = {
    gameState: {
      monedas: 1000,
      gemas: 50,
      partidaGuardada: false,
      datosPartida: null,
      historia: {
        partidoActual: 0,
        completados: [],
        estado: 'menu',
        dialogoIndex: 0,
        dialogoTipo: 'pre',
        capActual: 0,
        capCompletados: [],
        escenaActual: null,
        periodicoIndex: 0,
        stats: { ego: 0, moral: 0, inspiracion: 0 }
      }
    },
    audio: {
      volumenGeneral: 0.05,
      sfxActivados: true,
      musicas: {},
      sonidosSFX: {},
      sfxReproduciendose: null,
      sfxIndividuales: {
        gol: true, arma_ego: true, silbato_arbitro: true, partido: true, tema: true,
        puzzle: true, despair: true, inspiration: true, intellect: true, push_forward: true,
        bedroom: true, ego: true, emergency: true, last_chance: true, awakening: true
      }
    }
  };

  BL.cargadores = {};
  BL.util = {};
})();
