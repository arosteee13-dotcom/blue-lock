// BASE DE DATOS PRINCIPAL DE PERSONAJES, EQUIPOS Y LOGROS

const BLUE_LOCK_DATABASE = {
  equiposHistoria: [
    { id: "team_z", nombre: "Equipo Z", estrato: 5, dificultad: "Media" },
    { id: "team_v", nombre: "Equipo V", estrato: 5, dificultad: "Alta" },
    { id: "team_w", nombre: "Equipo W", estrato: 5, dificultad: "Fácil" },
    { id: "bl_eleven", nombre: "Blue Lock Eleven", estrato: 1, dificultad: "Extrema" },
    { id: "japan_u20", nombre: "Japón Sub-20", estrato: 0, dificultad: "Leyenda" }
  ],

  tiendaItems: [
    { id: "item_ego_boost", nombre: "Bebida de Ego Jinpachi", tipo: "Consumible", precio: 500, desc: "Aumenta +5 de Ego a tu jugador en el siguiente partido." },
    { id: "item_holo_flow", nombre: "Aura Azul Brillante", tipo: "Cosmético", precio: 2000, desc: "Efecto visual de aura de fuego azul en partidos." },
    { id: "item_scout_ticket", nombre: "Ticket de Ojeador VIP", tipo: "Pase", precio: 1500, desc: "Permite reclutar talentos inventados con stats más altas." },
    { id: "item_training_room", nombre: "Pase Sala Holográfica", tipo: "Mejora", precio: 5000, desc: "Multiplica x2 los puntos de entrenamiento ganados." }
  ],

  logros: [
    { id: "ach_first_ego", nombre: "Despertar Egoísta", desc: "Crea tu primer jugador en el Modo Carrera.", recompensa: 200, completado: false },
    { id: "ach_team_z_hero", nombre: "Supera el Edificio 5", desc: "Clasifícate en la Primera Selección del Modo Historia.", recompensa: 1000, completado: false },
    { id: "ach_devour", nombre: "Devorador de Talentos", desc: "Recluta a tu primer rival tras ganarle un partido.", recompensa: 500, completado: false },
    { id: "ach_metavision", nombre: "Visión Omnipresente", desc: "Alcanza 90 de Visión con tu jugador.", recompensa: 1500, completado: false }
  ]
};

const PLANTILLAS_EQUIPO = {
  bastard_munchen: [
{ id: "noel_noa", nombre: "Noel Noa", nombreCompleto: "Noel Noa", instituto: "Profesional", edad: 31, dorsal: 9, posicion: "DC", grl: 98, altura: "188cm", pierna: "Ambas", nacionalidad: "Francia", bandera: "🇫🇷", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 95, sho: 99, pas: 92, dri: 96, def: 60, phy: 94 } },
    { id: "michael_kaiser", nombre: "Michael Kaiser", nombreCompleto: "Michael Kaiser", instituto: "BM Youth", edad: 19, dorsal: 10, posicion: "DC", posicionSecundaria: "MCO", grl: 93, altura: "186cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 89, sho: 96, pas: 84, dri: 91, def: 52, phy: 85 } },
    { id: "alexis_ness", nombre: "Alexis Ness", nombreCompleto: "Alexis Ness", instituto: "BM Youth", edad: 18, dorsal: 8, posicion: "MCO", posicionSecundaria: "MC", grl: 86, altura: "181cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 80, sho: 75, pas: 91, dri: 88, def: 65, phy: 72 } },
    { id: "isagi_bm", nombre: "Yoichi Isagi", nombreCompleto: "Yoichi Isagi", instituto: "Ichinan High School", edad: 17, dorsal: 11, posicion: "MCO", posicionSecundaria: "DC", grl: 88, altura: "175cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 82, sho: 86, pas: 88, dri: 85, def: 74, phy: 78 } },
    { id: "kunigami_bm", nombre: "Rensuke Kunigami", nombreCompleto: "Rensuke Kunigami", instituto: "Musashimori High School", edad: 17, dorsal: 50, posicion: "DC", posicionSecundaria: "ED", grl: 86, altura: "188cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 85, sho: 91, pas: 72, dri: 80, def: 65, phy: 92 } },
    { id: "yukimiya_kenyu", nombre: "Kenyu Yukimiya", nombreCompleto: "Kenyu Yukimiya", instituto: "Eisei Academy", edad: 18, dorsal: 15, posicion: "LI", posicionSecundaria: "EI", grl: 84, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 88, sho: 80, pas: 78, dri: 89, def: 70, phy: 76 } },
    { id: "gagamaru_bm", nombre: "Gin Gagamaru", nombreCompleto: "Gin Gagamaru", instituto: "Tofuku High School", edad: 18, dorsal: 99, posicion: "POR", posicionSecundaria: "DC", grl: 87, altura: "191cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 78, sho: 50, pas: 65, dri: 60, def: 88, phy: 86 } },
    { id: "kurona_ranze", nombre: "Ranze Kurona", nombreCompleto: "Ranze Kurona", instituto: "Kanto High School", edad: 16, dorsal: 16, posicion: "CAD", posicionSecundaria: "LD", grl: 83, altura: "168cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 92, sho: 68, pas: 84, dri: 86, def: 72, phy: 70 } },
    { id: "raichi_bm", nombre: "Jingo Raichi", nombreCompleto: "Jingo Raichi", instituto: "Nagumo High School", edad: 17, dorsal: 22, posicion: "MCD", posicionSecundaria: "DFC", grl: 82, altura: "183cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 76, sho: 65, pas: 72, dri: 70, def: 88, phy: 90 } },
    { id: "hiori_yo", nombre: "Yo Hiori", nombreCompleto: "Yo Hiori", instituto: "Kansai Youth Academy", edad: 16, dorsal: 23, posicion: "MCO", posicionSecundaria: "CAD", grl: 85, altura: "183cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 84, sho: 75, pas: 93, dri: 87, def: 68, phy: 72 } },
    { id: "kiyora_jin", nombre: "Jin Kiyora", nombreCompleto: "Jin Kiyora", instituto: "Yamashiro High School", edad: 17, dorsal: 69, posicion: "MI", posicionSecundaria: "LI", grl: 80, altura: "165cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 83, sho: 72, pas: 80, dri: 82, def: 66, phy: 68 } },
    { id: "igarashi_bm", nombre: "Gurimu Igarashi", nombreCompleto: "Gurimu Igarashi", instituto: "Hosenji High School", edad: 17, dorsal: 76, posicion: "LD", posicionSecundaria: "LI", grl: 75, altura: "172cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 72, sho: 60, pas: 68, dri: 65, def: 78, phy: 75 } },
    { id: "neru_teppei", nombre: "Teppei Neru", nombreCompleto: "Teppei Neru", instituto: "Japan Sub-20", edad: 19, dorsal: 0, posicion: "LD", posicionSecundaria: "CAD", grl: 78, altura: "168cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 90, sho: 58, pas: 70, dri: 74, def: 76, phy: 72 } },
    { id: "benedict_grim", nombre: "Benedict Grim", nombreCompleto: "Benedict Grim", instituto: "BM Youth", edad: 19, dorsal: 5, posicion: "ED", posicionSecundaria: "EI", grl: 82, altura: "186cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 85, sho: 80, pas: 78, dri: 81, def: 50, phy: 76 } },
    { id: "erik_gesner", nombre: "Erik Gesner", nombreCompleto: "Erik Gesner", instituto: "BM Youth", edad: 19, dorsal: 13, posicion: "MC", grl: 80, altura: "182cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 75, sho: 70, pas: 82, dri: 78, def: 72, phy: 74 } },
    { id: "birkenstock", nombre: "Birkenstock", nombreCompleto: "Birkenstock", instituto: "BM Youth", edad: 20, dorsal: 6, posicion: "DFC", grl: 81, altura: "189cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 72, sho: 45, pas: 70, dri: 62, def: 84, phy: 83 } },
    { id: "ali_bm", nombre: "Ali", nombreCompleto: "Ali", instituto: "BM Youth", edad: 18, dorsal: 7, posicion: "ED", grl: 79, altura: "179cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 84, sho: 74, pas: 75, dri: 80, def: 48, phy: 70 } },
    { id: "mensah", nombre: "Mensah", nombreCompleto: "Mensah", instituto: "BM Youth", edad: 20, dorsal: 2, posicion: "DFC", grl: 81, altura: "191cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 72, sho: 48, pas: 65, dri: 60, def: 84, phy: 85 } },
    { id: "igor_schneider", nombre: "Igor Schneider", nombreCompleto: "Igor Schneider", instituto: "BM Youth", edad: 19, dorsal: 20, posicion: "MC", posicionSecundaria: "MCD", grl: 78, altura: "184cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 72, sho: 68, pas: 76, dri: 74, def: 74, phy: 76 } },
    { id: "theo_sachs", nombre: "Theo Sachs", nombreCompleto: "Theo Sachs", instituto: "BM Youth", edad: 19, dorsal: 3, posicion: "LI", grl: 78, altura: "180cm", pierna: "Izquierda", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 80, sho: 60, pas: 72, dri: 72, def: 78, phy: 72 } },
    { id: "bachman", nombre: "Bachman", nombreCompleto: "Bachman", instituto: "BM Youth", edad: 20, dorsal: 1, posicion: "POR", grl: 79, altura: "193cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 70, sho: 40, pas: 60, dri: 55, def: 80, phy: 78 } },
    { id: "ndiaye", nombre: "Ndiaye", nombreCompleto: "Ndiaye", instituto: "BM Youth", edad: 19, dorsal: 4, posicion: "DFC", grl: 79, altura: "188cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", stats: { pac: 74, sho: 45, pas: 64, dri: 58, def: 81, phy: 82 } }
  ],
  manshine_city: [{ id: "chris_prince", nombre: "Chris Prince", nombreCompleto: "Chris Prince", instituto: "Profesional", edad: 26, dorsal: 7, posicion: "DC", grl: 98, altura: "190cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 94, sho: 98, pas: 88, dri: 92, def: 75, phy: 99 } },
    { id: "agi", nombre: "Agi", nombreCompleto: "Agi", instituto: "Manshine Academy", edad: 19, dorsal: 9, posicion: "DC", posicionSecundaria: "MCO", grl: 85, altura: "192cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 81, sho: 84, pas: 79, dri: 80, def: 60, phy: 88 } },
    { id: "reo_mikage", nombre: "Reo Mikage", nombreCompleto: "Reo Mikage", instituto: "Dakutsu High School", edad: 17, dorsal: 14, posicion: "MC", posicionSecundaria: "MCD", grl: 87, altura: "185cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 83, sho: 82, pas: 88, dri: 86, def: 82, phy: 84 } },
    { id: "chigiri_mc", nombre: "Hyoma Chigiri", nombreCompleto: "Hyoma Chigiri", instituto: "Wasurenagusa Gakuen High School", edad: 17, dorsal: 44, posicion: "LD", posicionSecundaria: "CAD", grl: 88, altura: "177cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 98, sho: 88, pas: 81, dri: 89, def: 70, phy: 74 } },
    { id: "nagi_seishiro", nombre: "Seishiro Nagi", nombreCompleto: "Seishiro Nagi", instituto: "Dakutsu High School", edad: 17, dorsal: 11, posicion: "DC", posicionSecundaria: "MCO", grl: 89, altura: "190cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 82, sho: 92, pas: 83, dri: 95, def: 55, phy: 85 } },
    { id: "kazuma_nio", nombre: "Kazuma Nio", nombreCompleto: "Kazuma Nio", instituto: "Sunflame Hiroshima Academy", edad: 19, dorsal: 20, posicion: "DFC", posicionSecundaria: "MCD", grl: 81, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 78, sho: 55, pas: 68, dri: 65, def: 83, phy: 86 } },
    { id: "reiji_hiiragi", nombre: "Reiji Hiiragi", nombreCompleto: "Reiji Hiiragi", instituto: "Hoshizuku High School", edad: 18, dorsal: 17, posicion: "MCO", posicionSecundaria: "DC", grl: 79, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 79, sho: 78, pas: 82, dri: 80, def: 62, phy: 72 } },
    { id: "junichi_wanima", nombre: "Junichi Wanima", nombreCompleto: "Junichi Wanima", instituto: "Senshukai High School", edad: 18, dorsal: 0, posicion: "DC", posicionSecundaria: "ED", grl: 77, altura: "182cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 80, sho: 76, pas: 72, dri: 75, def: 58, phy: 78 } },
    { id: "hajime_nishioka", nombre: "Hajime Nishioka", nombreCompleto: "Hajime Nishioka", instituto: "Aomori High School", edad: 18, dorsal: 0, posicion: "EI", posicionSecundaria: "MCO", grl: 78, altura: "171cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 86, sho: 78, pas: 82, dri: 88, def: 42, phy: 60 } },
    { id: "taiga_tsunzaki", nombre: "Taiga Tsunzaki", nombreCompleto: "Taiga Tsunzaki", instituto: "Akudo High School", edad: 18, dorsal: 0, posicion: "DFC", posicionSecundaria: "MCD", grl: 74, altura: "186cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 72, sho: 50, pas: 65, dri: 62, def: 77, phy: 80 } },
    { id: "kairu_saramadara", nombre: "Kairu Saramadara", nombreCompleto: "Kairu Saramadara", instituto: "Shonan High School", edad: 18, dorsal: 0, posicion: "MCD", posicionSecundaria: "DFC", grl: 75, altura: "182cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 74, sho: 58, pas: 72, dri: 68, def: 76, phy: 78 } },
    { id: "mc_driver", nombre: "Driver", nombreCompleto: "Driver", instituto: "Manshine Academy", edad: 19, dorsal: 5, posicion: "DFC", grl: 78, altura: "188cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 74, sho: 45, pas: 66, dri: 62, def: 80, phy: 83 } },
    { id: "mc_swift", nombre: "Swift", nombreCompleto: "Swift", instituto: "Manshine Academy", edad: 18, dorsal: 6, posicion: "LI", posicionSecundaria: "CAD", grl: 77, altura: "178cm", pierna: "Izquierda", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 85, sho: 60, pas: 74, dri: 76, def: 75, phy: 70 } },
    { id: "mc_busby", nombre: "Busby", nombreCompleto: "Busby", instituto: "Manshine Academy", edad: 19, dorsal: 3, posicion: "LD", posicionSecundaria: "CAD", grl: 76, altura: "180cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 82, sho: 58, pas: 72, dri: 73, def: 76, phy: 74 } },
    { id: "mc_rook", nombre: "Rook", nombreCompleto: "Rook", instituto: "Manshine Academy", edad: 20, dorsal: 1, posicion: "POR", grl: 80, altura: "191cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 68, sho: 35, pas: 60, dri: 50, def: 82, phy: 81 } },
    { id: "mc_young", nombre: "Young", nombreCompleto: "Young", instituto: "Manshine Academy", edad: 19, dorsal: 4, posicion: "DFC", grl: 77, altura: "187cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 72, sho: 48, pas: 64, dri: 60, def: 79, phy: 82 } },
    { id: "mc_arthur", nombre: "Arthur", nombreCompleto: "Arthur", instituto: "Manshine Academy", edad: 19, dorsal: 8, posicion: "MC", posicionSecundaria: "MCD", grl: 78, altura: "183cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 76, sho: 70, pas: 80, dri: 78, def: 74, phy: 76 } },
    { id: "mc_damon", nombre: "Damon", nombreCompleto: "Damon", instituto: "Manshine Academy", edad: 18, dorsal: 2, posicion: "MC", posicionSecundaria: "MCO", grl: 77, altura: "181cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 78, sho: 72, pas: 78, dri: 77, def: 68, phy: 72 } }],
  re_al: [{ id: "leonardo_luna", nombre: "Leonardo Luna", nombreCompleto: "Leonardo Luna", instituto: "Profesional", edad: 27, dorsal: 9, posicion: "DC", posicionSecundaria: "MCO", grl: 97, altura: "185cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 93, sho: 97, pas: 90, dri: 95, def: 62, phy: 91 } },
    { id: "itoshi_sae", nombre: "Sae Itoshi", nombreCompleto: "Sae Itoshi", instituto: "Re Al Youth", edad: 18, dorsal: 10, posicion: "MCO", posicionSecundaria: "MC", grl: 94, altura: "180cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 88, sho: 87, pas: 98, dri: 96, def: 72, phy: 76 } },
    { id: "gonzalo_real", nombre: "Gonzalo", nombreCompleto: "Gonzalo", instituto: "Re Al Youth", edad: 19, dorsal: 11, posicion: "DC", posicionSecundaria: "ED", grl: 81, altura: "183cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 84, sho: 82, pas: 75, dri: 81, def: 50, phy: 78 } },
    { id: "real_valdes", nombre: "Valdés", nombreCompleto: "Valdés", instituto: "Re Al Youth", edad: 20, dorsal: 1, posicion: "POR", grl: 82, altura: "192cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 72, sho: 38, pas: 65, dri: 58, def: 84, phy: 80 } },
    { id: "real_sergio", nombre: "Sergio", nombreCompleto: "Sergio", instituto: "Re Al Youth", edad: 19, dorsal: 2, posicion: "DFC", grl: 83, altura: "187cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 76, sho: 55, pas: 70, dri: 65, def: 85, phy: 86 } },
    { id: "real_marcelo", nombre: "Marcelo", nombreCompleto: "Marcelo", instituto: "Re Al Youth", edad: 19, dorsal: 3, posicion: "LI", posicionSecundaria: "CAD", grl: 81, altura: "176cm", pierna: "Izquierda", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 86, sho: 68, pas: 80, dri: 84, def: 75, phy: 74 } },
    { id: "real_fernando", nombre: "Fernando", nombreCompleto: "Fernando", instituto: "Re Al Youth", edad: 20, dorsal: 4, posicion: "DFC", grl: 80, altura: "189cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 74, sho: 48, pas: 68, dri: 62, def: 83, phy: 84 } },
    { id: "real_hugo", nombre: "Hugo", nombreCompleto: "Hugo", instituto: "Re Al Youth", edad: 19, dorsal: 5, posicion: "MCD", grl: 81, altura: "184cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 75, sho: 66, pas: 82, dri: 76, def: 82, phy: 83 } },
    { id: "real_isco", nombre: "Isco", nombreCompleto: "Isco", instituto: "Re Al Youth", edad: 18, dorsal: 6, posicion: "MC", posicionSecundaria: "MCO", grl: 80, altura: "175cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 78, sho: 74, pas: 85, dri: 87, def: 60, phy: 70 } },
    { id: "real_marco", nombre: "Marco", nombreCompleto: "Marco", instituto: "Re Al Youth", edad: 19, dorsal: 7, posicion: "ED", posicionSecundaria: "EI", grl: 81, altura: "180cm", pierna: "Izquierda", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 87, sho: 80, pas: 78, dri: 83, def: 52, phy: 72 } },
    { id: "real_dani", nombre: "Dani", nombreCompleto: "Dani", instituto: "Re Al Youth", edad: 19, dorsal: 8, posicion: "LD", posicionSecundaria: "CAD", grl: 80, altura: "173cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 88, sho: 62, pas: 76, dri: 79, def: 78, phy: 75 } }],
  fc_barcha: [
    {"id":"lavinho","nombre":"Lavinho","instituto":"Profesional","edad":29,"dorsal":11,"posicion":"DC","grl":98,"nacionalidad":"Brasil","bandera":"🇧🇷","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":92,"sho":97,"pas":94,"dri":98,"def":48,"phy":90}},
    {"id":"bachira_fcb","nombre":"Meguru Bachira","instituto":"Rakosute Business High School","edad":17,"dorsal":10,"posicion":"EI","grl":86,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":90,"sho":82,"pas":85,"dri":97,"def":40,"phy":60}},
    {"id":"eita_otoya","nombre":"Eita Otoya","instituto":"Kanau Academy","edad":17,"dorsal":9,"posicion":"ED","grl":83,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":92,"sho":84,"pas":76,"dri":83,"def":44,"phy":72}},
    {"id":"teru_kitsunezato","nombre":"Teru Kitsunezato","instituto":"Seisho Academy","edad":19,"dorsal":13,"posicion":"ED","grl":77,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":87,"sho":80,"pas":78,"dri":83,"def":50,"phy":68}},
    {"id":"miroku_darai","nombre":"Miroku Darai","instituto":"Kanau Academy","edad":18,"dorsal":4,"posicion":"MCD","grl":80,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":78,"sho":68,"pas":78,"dri":76,"def":84,"phy":82}},
    {"id":"haru_hayate","nombre":"Haru Hayate","instituto":"Barcha Academy","edad":18,"dorsal":7,"posicion":"MC","grl":81,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":80,"sho":74,"pas":85,"dri":82,"def":76,"phy":78}},
    {"id":"ignacio_lara","nombre":"Ignacio Lara","instituto":"Barcha Youth","edad":18,"dorsal":3,"posicion":"LI","grl":81,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":60,"pas":78,"dri":80,"def":77,"phy":73}},
    {"id":"barcha_npc_01","nombre":"Miguel Rodriguez","dorsal":1,"posicion":"DFC","grl":59,"edad":19,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 59, "sho": 42, "pas": 57, "dri": 52, "def": 74, "phy": 70}},
    {"id":"barcha_npc_02","nombre":"Alejandro Martinez","dorsal":2,"posicion":"LD","grl":62,"edad":20,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 58, "def": 73, "phy": 68}},
    {"id":"barcha_npc_03","nombre":"Javier Lopez","dorsal":3,"posicion":"LI","grl":62,"edad":21,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 46, "pas": 61, "dri": 59, "def": 74, "phy": 69}},
    {"id":"barcha_npc_04","nombre":"Pablo Gonzalez","dorsal":4,"posicion":"MCD","grl":66,"edad":18,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 55, "pas": 70, "dri": 63, "def": 73, "phy": 70}},
    {"id":"barcha_npc_05","nombre":"Sergio Hernandez","dorsal":5,"posicion":"MC","grl":67,"edad":19,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 64, "pas": 74, "dri": 69, "def": 63, "phy": 64}},
    {"id":"barcha_npc_06","nombre":"Rafael Perez","dorsal":6,"posicion":"MCO","grl":68,"edad":20,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 72, "pas": 77, "dri": 75, "def": 55, "phy": 59}},
    {"id":"barcha_npc_07","nombre":"Daniel Sanchez","dorsal":7,"posicion":"MI","grl":69,"edad":21,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 68, "sho": 66, "pas": 76, "dri": 71, "def": 65, "phy": 66}},
    {"id":"barcha_npc_08","nombre":"Alvaro Ramirez","dorsal":8,"posicion":"EI","grl":61,"edad":18,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}}
  ],
  ubers_fc: [
    {"id":"marc_snuffy","nombre":"Marc Snuffy","instituto":"Profesional","edad":35,"dorsal":11,"posicion":"MCO","grl":97,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":88,"sho":95,"pas":96,"dri":91,"def":82,"phy":92}},
    {"id":"don_lorenzo","nombre":"Don Lorenzo","instituto":"Ubers Youth","edad":19,"dorsal":23,"posicion":"DFC","grl":94,"nacionalidad":"España","bandera":"🇪🇸","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":70,"pas":88,"dri":92,"def":97,"phy":89}},
    {"id":"barou_ubers","nombre":"Shoei Barou","instituto":"Hakuho Academy","edad":18,"dorsal":10,"posicion":"DC","grl":92,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":84,"sho":95,"pas":72,"dri":85,"def":48,"phy":96}},
    {"id":"oliver_aiku","nombre":"Oliver Aiku","instituto":"Ubers Youth","edad":19,"dorsal":3,"posicion":"DFC","grl":88,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":80,"sho":72,"pas":82,"dri":78,"def":91,"phy":88}},
    {"id":"ikki_niko","nombre":"Ikki Niko","instituto":"Kansai Youth Academy","edad":15,"dorsal":4,"posicion":"DFC","grl":85,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":76,"sho":70,"pas":85,"dri":80,"def":88,"phy":76}},
    {"id":"jyubei_aryu","nombre":"Jyubei Aryu","instituto":"Ubers Youth","edad":18,"dorsal":5,"posicion":"DFC","grl":84,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":74,"sho":68,"pas":72,"dri":70,"def":87,"phy":92}},
    {"id":"shuuto_sendou","nombre":"Shuuto Sendou","instituto":"Ubers Youth","edad":18,"dorsal":9,"posicion":"SD","grl":82,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":80,"sho":84,"pas":76,"dri":79,"def":52,"phy":80}},
    {"id":"gen_fukaku","nombre":"Gen Fukaku","instituto":"Ubers Youth","edad":19,"dorsal":1,"posicion":"POR","grl":83,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":74,"sho":42,"pas":66,"dri":58,"def":86,"phy":84}},
    {"id":"ubers_npc_01","nombre":"Lorenzo Russo","dorsal":1,"posicion":"LI","grl":60,"edad":19,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 56, "def": 71, "phy": 66}},
    {"id":"ubers_npc_02","nombre":"Andrea Ferrari","dorsal":2,"posicion":"MCD","grl":63,"edad":20,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 60, "sho": 52, "pas": 67, "dri": 60, "def": 70, "phy": 67}},
    {"id":"ubers_npc_03","nombre":"Alessandro Esposito","dorsal":3,"posicion":"MC","grl":64,"edad":21,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 61, "pas": 71, "dri": 66, "def": 60, "phy": 61}},
    {"id":"ubers_npc_04","nombre":"Francesco Bianchi","dorsal":4,"posicion":"MCO","grl":64,"edad":18,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 64, "sho": 69, "pas": 74, "dri": 72, "def": 52, "phy": 56}},
    {"id":"ubers_npc_05","nombre":"Matteo Romano","dorsal":5,"posicion":"MI","grl":66,"edad":19,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 63, "pas": 73, "dri": 68, "def": 62, "phy": 63}},
    {"id":"ubers_npc_06","nombre":"Luca Colombo","dorsal":6,"posicion":"EI","grl":66,"edad":20,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 76, "sho": 69, "pas": 69, "dri": 74, "def": 51, "phy": 58}},
    {"id":"ubers_npc_07","nombre":"Giovanni Ricci","dorsal":7,"posicion":"ED","grl":60,"edad":21,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"ubers_npc_08","nombre":"Riccardo Marino","dorsal":8,"posicion":"DC","grl":63,"edad":18,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 73, "pas": 59, "dri": 64, "def": 51, "phy": 66}}
  ],
  paris_x_gen: [
    {"id":"julian_loki","nombre":"Julian Loki","instituto":"Profesional","edad":17,"dorsal":7,"posicion":"DC","grl":96,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":95,"sho":96,"pas":88,"dri":93,"def":55,"phy":88}},
    {"id":"rin_pxg","nombre":"Rin Itoshi","instituto":"Junior Youth","edad":16,"dorsal":10,"posicion":"DC","grl":93,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":94,"pas":88,"dri":89,"def":56,"phy":90}},
    {"id":"ryusei_shidou","nombre":"Ryusei Shidou","instituto":"Junior Youth","edad":18,"dorsal":9,"posicion":"DC","grl":90,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":88,"sho":94,"pas":70,"dri":84,"def":48,"phy":88}},
    {"id":"tabito_karasu","nombre":"Tabito Karasu","instituto":"PXG Youth","edad":18,"dorsal":8,"posicion":"MCD","grl":88,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":82,"sho":80,"pas":86,"dri":83,"def":85,"phy":82}},
    {"id":"charles_chevalier","nombre":"Charles Chevalier","instituto":"PXG Youth","edad":15,"dorsal":18,"posicion":"MCO","grl":88,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":84,"sho":76,"pas":96,"dri":90,"def":58,"phy":68}},
    {"id":"aoshi_tokimitsu","nombre":"Aoshi Tokimitsu","instituto":"PXG Youth","edad":17,"dorsal":6,"posicion":"MCD","grl":82,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":78,"sho":72,"pas":74,"dri":76,"def":84,"phy":94}},
    {"id":"zantetsu_tsurugi","nombre":"Zantetsu Tsurugi","instituto":"PXG Youth","edad":17,"dorsal":11,"posicion":"ED","grl":82,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":94,"sho":80,"pas":68,"dri":78,"def":55,"phy":80}},
    {"id":"nijiro_nanase","nombre":"Nijiro Nanase","instituto":"PXG Youth","edad":16,"dorsal":17,"posicion":"EI","grl":78,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":74,"pas":80,"dri":84,"def":62,"phy":66}},
    {"id":"pxg_npc_01","nombre":"Hugo Bernard","dorsal":1,"posicion":"MCD","grl":61,"edad":19,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 58, "sho": 50, "pas": 65, "dri": 58, "def": 68, "phy": 65}},
    {"id":"pxg_npc_02","nombre":"Louis Dubois","dorsal":2,"posicion":"MC","grl":62,"edad":20,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}},
    {"id":"pxg_npc_03","nombre":"Leo Thomas","dorsal":3,"posicion":"MCO","grl":62,"edad":21,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 62, "sho": 67, "pas": 72, "dri": 70, "def": 50, "phy": 54}},
    {"id":"pxg_npc_04","nombre":"Paul Robert","dorsal":4,"posicion":"MI","grl":64,"edad":18,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 61, "pas": 71, "dri": 66, "def": 60, "phy": 61}},
    {"id":"pxg_npc_05","nombre":"Nathan Richard","dorsal":5,"posicion":"EI","grl":64,"edad":19,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 74, "sho": 67, "pas": 67, "dri": 72, "def": 49, "phy": 56}},
    {"id":"pxg_npc_06","nombre":"Tom Petit","dorsal":6,"posicion":"ED","grl":65,"edad":20,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 75, "sho": 68, "pas": 68, "dri": 73, "def": 50, "phy": 57}},
    {"id":"pxg_npc_07","nombre":"Jules Durand","dorsal":7,"posicion":"DC","grl":68,"edad":21,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 71, "sho": 78, "pas": 64, "dri": 69, "def": 56, "phy": 71}},
    {"id":"pxg_npc_08","nombre":"Maxime Leroy","dorsal":8,"posicion":"SD","grl":61,"edad":18,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 64, "sho": 67, "pas": 61, "dri": 64, "def": 47, "phy": 62}}
  ],
  berserk_dortmund: [
    {"id":"dortmund_npc_01","nombre":"Lukas Weber","dorsal":1,"posicion":"DFC","grl":58,"edad":19,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 58, "sho": 41, "pas": 56, "dri": 51, "def": 73, "phy": 69}},
    {"id":"dortmund_npc_02","nombre":"Felix Mueller","dorsal":2,"posicion":"LD","grl":60,"edad":20,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 57, "def": 72, "phy": 67}},
    {"id":"dortmund_npc_03","nombre":"Leon Wagner","dorsal":3,"posicion":"LI","grl":62,"edad":21,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 58, "def": 73, "phy": 68}},
    {"id":"dortmund_npc_04","nombre":"Maximilian Becker","dorsal":4,"posicion":"MCD","grl":65,"edad":18,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 62, "sho": 54, "pas": 69, "dri": 62, "def": 72, "phy": 69}},
    {"id":"dortmund_npc_05","nombre":"Jonas Hoffmann","dorsal":5,"posicion":"MC","grl":66,"edad":19,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 63, "pas": 73, "dri": 68, "def": 62, "phy": 63}},
    {"id":"dortmund_npc_06","nombre":"Timo Koch","dorsal":6,"posicion":"MCO","grl":66,"edad":20,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 71, "pas": 76, "dri": 74, "def": 54, "phy": 58}},
    {"id":"dortmund_npc_07","nombre":"Niklas Richter","dorsal":7,"posicion":"MI","grl":68,"edad":21,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 65, "pas": 75, "dri": 70, "def": 64, "phy": 65}},
    {"id":"dortmund_npc_08","nombre":"Lars Klein","dorsal":8,"posicion":"EI","grl":68,"edad":18,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 78, "sho": 71, "pas": 71, "dri": 76, "def": 53, "phy": 60}},
    {"id":"dortmund_npc_09","nombre":"Sven Wolf","dorsal":9,"posicion":"ED","grl":69,"edad":19,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 79, "sho": 72, "pas": 72, "dri": 77, "def": 54, "phy": 61}},
    {"id":"dortmund_npc_10","nombre":"Johann Schmidt","dorsal":10,"posicion":"DC","grl":62,"edad":20,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 72, "pas": 58, "dri": 63, "def": 50, "phy": 65}},
    {"id":"dortmund_npc_11","nombre":"Lukas Weber","dorsal":11,"posicion":"SD","grl":63,"edad":21,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 69, "pas": 63, "dri": 66, "def": 49, "phy": 64}},
    {"id":"dortmund_npc_12","nombre":"Felix Mueller","dorsal":12,"posicion":"CAD","grl":62,"edad":18,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 59, "def": 72, "phy": 67}},
    {"id":"dortmund_npc_13","nombre":"Leon Wagner","dorsal":13,"posicion":"POR","grl":57,"edad":19,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 58, "sho": 40, "pas": 55, "dri": 48, "def": 73, "phy": 68}},
    {"id":"dortmund_npc_14","nombre":"Maximilian Becker","dorsal":14,"posicion":"DFC","grl":61,"edad":20,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"dortmund_npc_15","nombre":"Jonas Hoffmann","dorsal":15,"posicion":"LD","grl":64,"edad":21,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 60, "def": 75, "phy": 70}},
    {"id":"dortmund_npc_16","nombre":"Timo Koch","dorsal":16,"posicion":"LI","grl":64,"edad":18,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 68, "sho": 48, "pas": 63, "dri": 61, "def": 76, "phy": 71}}
  ],
  ichinan_hs: [
    {"id":"tomonari_tada","nombre":"Tomonari Tada","instituto":"Ichinan High School","edad":16,"dorsal":10,"posicion":"DC","grl":68,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac":72,"sho":70,"pas":65,"dri":68,"def":55,"phy":74}},
    {"id":"ichinan_npc_01","nombre":"Takeshi Suzuki","dorsal":1,"posicion":"DFC","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 41, "pas": 56, "dri": 51, "def": 73, "phy": 69}},
    {"id":"ichinan_npc_02","nombre":"Kenji Takahashi","dorsal":2,"posicion":"LD","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 57, "def": 72, "phy": 67}},
    {"id":"ichinan_npc_03","nombre":"Shota Watanabe","dorsal":3,"posicion":"LI","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 58, "def": 73, "phy": 68}},
    {"id":"ichinan_npc_04","nombre":"Ryo Ito","dorsal":4,"posicion":"MCD","grl":65,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 54, "pas": 69, "dri": 62, "def": 72, "phy": 69}},
    {"id":"ichinan_npc_05","nombre":"Yuta Yamamoto","dorsal":5,"posicion":"MC","grl":61,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 58, "pas": 68, "dri": 63, "def": 57, "phy": 58}},
    {"id":"ichinan_npc_06","nombre":"Daiki Nakamura","dorsal":6,"posicion":"MCO","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 66, "pas": 71, "dri": 69, "def": 49, "phy": 53}},
    {"id":"ichinan_npc_07","nombre":"Sho Sato","dorsal":7,"posicion":"MI","grl":63,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 60, "pas": 70, "dri": 65, "def": 59, "phy": 60}},
    {"id":"ichinan_npc_08","nombre":"Kaito Kobayashi","dorsal":8,"posicion":"EI","grl":63,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 73, "sho": 66, "pas": 66, "dri": 71, "def": 48, "phy": 55}},
    {"id":"ichinan_npc_09","nombre":"Takuya Kato","dorsal":9,"posicion":"ED","grl":64,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 74, "sho": 67, "pas": 67, "dri": 72, "def": 49, "phy": 56}},
    {"id":"ichinan_npc_10","nombre":"Hiroshi Yoshida","dorsal":10,"posicion":"DC","grl":62,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 72, "pas": 58, "dri": 63, "def": 50, "phy": 65}}
  ],
  matsukaze_hs: [
    {"id":"ryosuke_kira","nombre":"Ryosuke Kira","instituto":"Matsukaze Kokuou","edad":18,"dorsal":10,"posicion":"DC","grl":72,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac":76,"sho":78,"pas":68,"dri":74,"def":50,"phy":78}},
    {"id":"shohei_inaba","nombre":"Shohei Inaba","instituto":"Matsukaze Kokuou","edad":17,"dorsal":7,"posicion":"MC","grl":70,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac":72,"sho":68,"pas":76,"dri":70,"def":62,"phy":70}},
    {"id":"matsukaze_npc_01","nombre":"Shota Watanabe","dorsal":1,"posicion":"LI","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 42, "pas": 57, "dri": 55, "def": 70, "phy": 65}},
    {"id":"matsukaze_npc_02","nombre":"Ryo Ito","dorsal":2,"posicion":"MCD","grl":62,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 51, "pas": 66, "dri": 59, "def": 69, "phy": 66}},
    {"id":"matsukaze_npc_03","nombre":"Yuta Yamamoto","dorsal":3,"posicion":"MC","grl":63,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 60, "pas": 70, "dri": 65, "def": 59, "phy": 60}},
    {"id":"matsukaze_npc_04","nombre":"Daiki Nakamura","dorsal":4,"posicion":"MCO","grl":64,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 68, "pas": 73, "dri": 71, "def": 51, "phy": 55}},
    {"id":"matsukaze_npc_05","nombre":"Sho Sato","dorsal":5,"posicion":"MI","grl":65,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 62, "pas": 72, "dri": 67, "def": 61, "phy": 62}},
    {"id":"matsukaze_npc_06","nombre":"Kaito Kobayashi","dorsal":6,"posicion":"EI","grl":59,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 69, "sho": 62, "pas": 62, "dri": 67, "def": 44, "phy": 51}},
    {"id":"matsukaze_npc_07","nombre":"Takuya Kato","dorsal":7,"posicion":"ED","grl":60,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"matsukaze_npc_08","nombre":"Hiroshi Yoshida","dorsal":8,"posicion":"DC","grl":63,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 66, "sho": 73, "pas": 59, "dri": 64, "def": 51, "phy": 66}},
    {"id":"matsukaze_npc_09","nombre":"Takeshi Yamada","dorsal":9,"posicion":"SD","grl":64,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 70, "pas": 64, "dri": 67, "def": 50, "phy": 65}},
    {"id":"matsukaze_npc_10","nombre":"Kenji Tanaka","dorsal":10,"posicion":"CAD","grl":63,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac": 68, "sho": 48, "pas": 63, "dri": 60, "def": 73, "phy": 68}}
  ],
  kitsunezaka_hs: [
    {"id":"kuon","nombre":"Wataru Kuon","instituto":"Matsukaze Kokuou","edad":18,"dorsal":4,"posicion":"DFC","grl":60,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac":55,"sho":50,"pas":55,"dri":48,"def":75,"phy":78}},
    {"id":"kitsunezaka_npc_01","nombre":"Yuta Yamamoto","dorsal":1,"posicion":"MC","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"kitsunezaka_npc_02","nombre":"Daiki Nakamura","dorsal":2,"posicion":"MCO","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 65, "pas": 70, "dri": 68, "def": 48, "phy": 52}},
    {"id":"kitsunezaka_npc_03","nombre":"Sho Sato","dorsal":3,"posicion":"MI","grl":62,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}},
    {"id":"kitsunezaka_npc_04","nombre":"Kaito Kobayashi","dorsal":4,"posicion":"EI","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 72, "sho": 65, "pas": 65, "dri": 70, "def": 47, "phy": 54}},
    {"id":"kitsunezaka_npc_05","nombre":"Takuya Kato","dorsal":5,"posicion":"ED","grl":63,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 73, "sho": 66, "pas": 66, "dri": 71, "def": 48, "phy": 55}},
    {"id":"kitsunezaka_npc_06","nombre":"Hiroshi Yoshida","dorsal":6,"posicion":"DC","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 70, "pas": 56, "dri": 61, "def": 48, "phy": 63}},
    {"id":"kitsunezaka_npc_07","nombre":"Takeshi Yamada","dorsal":7,"posicion":"SD","grl":61,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 67, "pas": 61, "dri": 64, "def": 47, "phy": 62}},
    {"id":"kitsunezaka_npc_08","nombre":"Kenji Tanaka","dorsal":8,"posicion":"CAD","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 57, "def": 70, "phy": 65}},
    {"id":"kitsunezaka_npc_09","nombre":"Shota Suzuki","dorsal":9,"posicion":"POR","grl":55,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 56, "sho": 40, "pas": 53, "dri": 46, "def": 71, "phy": 66}},
    {"id":"kitsunezaka_npc_10","nombre":"Ryo Takahashi","dorsal":10,"posicion":"DFC","grl":59,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 42, "pas": 57, "dri": 52, "def": 74, "phy": 70}}
  ],
  kanau_academy: [
    {"id":"naruhaya","nombre":"Asahi Naruhaya","instituto":"Kanau Academy","edad":16,"dorsal":11,"posicion":"SD","grl":61,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac":80,"sho":68,"pas":60,"dri":72,"def":35,"phy":50}},
    {"id":"kanau_npc_01","nombre":"Daiki Nakamura","dorsal":1,"posicion":"MCO","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 63, "pas": 68, "dri": 66, "def": 46, "phy": 50}},
    {"id":"kanau_npc_02","nombre":"Sho Sato","dorsal":2,"posicion":"MI","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"kanau_npc_03","nombre":"Kaito Kobayashi","dorsal":3,"posicion":"EI","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"kanau_npc_04","nombre":"Takuya Kato","dorsal":4,"posicion":"ED","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"kanau_npc_05","nombre":"Hiroshi Yoshida","dorsal":5,"posicion":"DC","grl":64,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"kanau_npc_06","nombre":"Takeshi Yamada","dorsal":6,"posicion":"SD","grl":59,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 65, "pas": 59, "dri": 62, "def": 45, "phy": 60}},
    {"id":"kanau_npc_07","nombre":"Kenji Tanaka","dorsal":7,"posicion":"CAD","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 55, "def": 68, "phy": 63}},
    {"id":"kanau_npc_08","nombre":"Shota Suzuki","dorsal":8,"posicion":"POR","grl":54,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 54, "sho": 40, "pas": 51, "dri": 44, "def": 69, "phy": 64}},
    {"id":"kanau_npc_09","nombre":"Ryo Takahashi","dorsal":9,"posicion":"DFC","grl":57,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 57, "sho": 40, "pas": 55, "dri": 50, "def": 72, "phy": 68}},
    {"id":"kanau_npc_10","nombre":"Yuta Watanabe","dorsal":10,"posicion":"LD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 56, "def": 71, "phy": 66}}
  ],
  gunma_hs: [
    {"id":"iemon","nombre":"Okuhito Iemon","instituto":"Gunma Highschool","edad":18,"dorsal":1,"posicion":"POR","grl":48,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac":40,"sho":35,"pas":40,"dri":35,"def":70,"phy":65}},
    {"id":"gunma_npc_01","nombre":"Sho Sato","dorsal":1,"posicion":"MI","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"gunma_npc_02","nombre":"Kaito Kobayashi","dorsal":2,"posicion":"EI","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"gunma_npc_03","nombre":"Takuya Kato","dorsal":3,"posicion":"ED","grl":61,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"gunma_npc_04","nombre":"Hiroshi Yoshida","dorsal":4,"posicion":"DC","grl":64,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"gunma_npc_05","nombre":"Takeshi Yamada","dorsal":5,"posicion":"SD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 66, "pas": 60, "dri": 63, "def": 46, "phy": 61}},
    {"id":"gunma_npc_06","nombre":"Kenji Tanaka","dorsal":6,"posicion":"CAD","grl":59,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 56, "def": 69, "phy": 64}},
    {"id":"gunma_npc_07","nombre":"Shota Suzuki","dorsal":7,"posicion":"POR","grl":54,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 55, "sho": 40, "pas": 52, "dri": 45, "def": 70, "phy": 65}},
    {"id":"gunma_npc_08","nombre":"Ryo Takahashi","dorsal":8,"posicion":"DFC","grl":58,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 41, "pas": 56, "dri": 51, "def": 73, "phy": 69}},
    {"id":"gunma_npc_09","nombre":"Yuta Watanabe","dorsal":9,"posicion":"LD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 57, "def": 72, "phy": 67}},
    {"id":"gunma_npc_10","nombre":"Daiki Ito","dorsal":10,"posicion":"LI","grl":56,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 40, "pas": 55, "dri": 53, "def": 68, "phy": 63}}
  ],
  saitama_hs: [
    {"id":"imamura","nombre":"Yudai Imamura","instituto":"Saitama Highschool","edad":18,"dorsal":8,"posicion":"MC","grl":61,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac":68,"sho":60,"pas":65,"dri":62,"def":50,"phy":62}},
    {"id":"saitama_npc_01","nombre":"Kaito Kobayashi","dorsal":1,"posicion":"EI","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"saitama_npc_02","nombre":"Takuya Kato","dorsal":2,"posicion":"ED","grl":61,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"saitama_npc_03","nombre":"Hiroshi Yoshida","dorsal":3,"posicion":"DC","grl":64,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"saitama_npc_04","nombre":"Takeshi Yamada","dorsal":4,"posicion":"SD","grl":65,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 68, "sho": 71, "pas": 65, "dri": 68, "def": 51, "phy": 66}},
    {"id":"saitama_npc_05","nombre":"Kenji Tanaka","dorsal":5,"posicion":"CAD","grl":64,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 69, "sho": 49, "pas": 64, "dri": 61, "def": 74, "phy": 69}},
    {"id":"saitama_npc_06","nombre":"Shota Suzuki","dorsal":6,"posicion":"POR","grl":54,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 54, "sho": 40, "pas": 51, "dri": 44, "def": 69, "phy": 64}},
    {"id":"saitama_npc_07","nombre":"Ryo Takahashi","dorsal":7,"posicion":"DFC","grl":57,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 57, "sho": 40, "pas": 55, "dri": 50, "def": 72, "phy": 68}},
    {"id":"saitama_npc_08","nombre":"Yuta Watanabe","dorsal":8,"posicion":"LD","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 56, "def": 71, "phy": 66}},
    {"id":"saitama_npc_09","nombre":"Daiki Ito","dorsal":9,"posicion":"LI","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 57, "def": 72, "phy": 67}},
    {"id":"saitama_npc_10","nombre":"Sho Yamamoto","dorsal":10,"posicion":"MCD","grl":64,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 53, "pas": 68, "dri": 61, "def": 71, "phy": 68}}
  ],
  senshindo_hs: [
    {"id":"hibiki_okawa","nombre":"Hibiki Okawa","instituto":"Senshindo High School","edad":18,"dorsal":7,"posicion":"MC","grl":66,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac":70,"sho":64,"pas":72,"dri":68,"def":55,"phy":66}},
    {"id":"senshindo_npc_01","nombre":"Takuya Kato","dorsal":1,"posicion":"ED","grl":59,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 69, "sho": 62, "pas": 62, "dri": 67, "def": 44, "phy": 51}},
    {"id":"senshindo_npc_02","nombre":"Hiroshi Yoshida","dorsal":2,"posicion":"DC","grl":62,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 72, "pas": 58, "dri": 63, "def": 50, "phy": 65}},
    {"id":"senshindo_npc_03","nombre":"Takeshi Yamada","dorsal":3,"posicion":"SD","grl":63,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 66, "sho": 69, "pas": 63, "dri": 66, "def": 49, "phy": 64}},
    {"id":"senshindo_npc_04","nombre":"Kenji Tanaka","dorsal":4,"posicion":"CAD","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 59, "def": 72, "phy": 67}},
    {"id":"senshindo_npc_05","nombre":"Shota Suzuki","dorsal":5,"posicion":"POR","grl":57,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 40, "pas": 55, "dri": 48, "def": 73, "phy": 68}},
    {"id":"senshindo_npc_06","nombre":"Ryo Takahashi","dorsal":6,"posicion":"DFC","grl":61,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"senshindo_npc_07","nombre":"Yuta Watanabe","dorsal":7,"posicion":"LD","grl":56,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 40, "pas": 55, "dri": 53, "def": 68, "phy": 63}},
    {"id":"senshindo_npc_08","nombre":"Daiki Ito","dorsal":8,"posicion":"LI","grl":58,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 41, "pas": 56, "dri": 54, "def": 69, "phy": 64}},
    {"id":"senshindo_npc_09","nombre":"Sho Yamamoto","dorsal":9,"posicion":"MCD","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 50, "pas": 65, "dri": 58, "def": 68, "phy": 65}},
    {"id":"senshindo_npc_10","nombre":"Kaito Nakamura","dorsal":10,"posicion":"MC","grl":62,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}}
  ],
  aomori_hs: [
    {"id":"ryo_nameoka","nombre":"Ryo Nameoka","instituto":"Aomori Dadada","edad":19,"dorsal":10,"posicion":"DC","grl":70,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac":74,"sho":72,"pas":66,"dri":70,"def":55,"phy":76}},
    {"id":"aomori_npc_01","nombre":"Hiroshi Yoshida","dorsal":1,"posicion":"DC","grl":62,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 72, "pas": 58, "dri": 63, "def": 50, "phy": 65}},
    {"id":"aomori_npc_02","nombre":"Takeshi Yamada","dorsal":2,"posicion":"SD","grl":63,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 66, "sho": 69, "pas": 63, "dri": 66, "def": 49, "phy": 64}},
    {"id":"aomori_npc_03","nombre":"Kenji Tanaka","dorsal":3,"posicion":"CAD","grl":62,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 59, "def": 72, "phy": 67}},
    {"id":"aomori_npc_04","nombre":"Shota Suzuki","dorsal":4,"posicion":"POR","grl":57,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 40, "pas": 55, "dri": 48, "def": 73, "phy": 68}},
    {"id":"aomori_npc_05","nombre":"Ryo Takahashi","dorsal":5,"posicion":"DFC","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"aomori_npc_06","nombre":"Yuta Watanabe","dorsal":6,"posicion":"LD","grl":58,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 41, "pas": 56, "dri": 54, "def": 69, "phy": 64}},
    {"id":"aomori_npc_07","nombre":"Daiki Ito","dorsal":7,"posicion":"LI","grl":58,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 42, "pas": 57, "dri": 55, "def": 70, "phy": 65}},
    {"id":"aomori_npc_08","nombre":"Sho Yamamoto","dorsal":8,"posicion":"MCD","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 51, "pas": 66, "dri": 59, "def": 69, "phy": 66}},
    {"id":"aomori_npc_09","nombre":"Kaito Nakamura","dorsal":9,"posicion":"MC","grl":63,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 60, "pas": 70, "dri": 65, "def": 59, "phy": 60}},
    {"id":"aomori_npc_10","nombre":"Takuya Sato","dorsal":10,"posicion":"MCO","grl":64,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 68, "pas": 73, "dri": 71, "def": 51, "phy": 55}}
  ]
};

const DIVISIONES = {
  primera: {
    nombre: "LIGA NEO EGOTÍSTA",
    equipos: [
      "bastard_munchen", "berserk_dortmund", "rpb",
      "manshine_city", "arsenaly", "manshine_united", "chelblue", "livers", "miracleicester",
      "fc_barcha", "re_al", "chicorid",
      "ubers_fc", "ac_milanoia", "napolin",
      "paris_x_gen", "marseille", "monao",
      "fc_portimion", "ajajax"
    ]
  },
  segunda: {
    nombre: "LIGA NACIONAL JAPONESA",
    equipos: [
      "ichinan_hs", "matsukaze_hs", "kitsunezaka_hs", "kanau_academy",
      "gunma_hs", "saitama_hs", "senshindo_hs", "aomori_hs",
      "urawa_rubies", "kawasaki_breakerz", "roar_kumamoto", "dosankoro_sapporo",
      "sunflame_hiroshima", "gohonzon_kamakura", "jubilee_iwata",
      "nandatot", "kroningen", "celticoss", "palmaro", "vesper_bremen", "bolos"
    ]
  }
};

// ===== CONFIGURACIÓN DE PAÍSES, LIGAS Y EQUIPOS =====
const CONFIG_PAISES = [
  {
    id: "jpn", nombre: "Japón", bandera: "🇯🇵",
    ligas: [
      {
        nombre: "Blue Lock / Sub-20",
        equipos: [
          { id: "bl_eleven", nombre: "Blue Lock Eleven", nivel: 5, presupuesto: 8000 },
          { id: "japan_u20", nombre: "Japón Sub-20", nivel: 4, presupuesto: 6000 },
          { id: "team_z", nombre: "Equipo Z", nivel: 3, presupuesto: 4000 },
          { id: "team_v", nombre: "Equipo V", nivel: 2, presupuesto: 3000 },
          { id: "team_w", nombre: "Equipo W", nivel: 2, presupuesto: 3000 }
        ]
      },
      {
        nombre: "J1 League",
        equipos: [
          { id: "urawa_rubies", nombre: "Urawa Rubies", escudo: "assets/logos/urawa_rubies.png", nivel: 3, presupuesto: 5500 },
          { id: "kawasaki_breakerz", nombre: "Kawasaki Breakerz", escudo: "assets/logos/kawasaki_breakerz.png", nivel: 3, presupuesto: 5300 },
          { id: "roar_kumamoto", nombre: "Roar Kumamoto", nivel: 2, presupuesto: 4000 },
          { id: "dosankoro_sapporo", nombre: "Dosankoro Sapporo", nivel: 2, presupuesto: 3800 },
          { id: "sunflame_hiroshima", nombre: "Sunflame Hiroshima", nivel: 2, presupuesto: 4200 },
          { id: "gohonzon_kamakura", nombre: "Gohonzon Kamakura", nivel: 2, presupuesto: 3600 },
          { id: "jubilee_iwata", nombre: "Jubilee Iwata", nivel: 2, presupuesto: 3500 }
        ]
      }
    ]
  },
  {
    id: "ger", nombre: "Alemania", bandera: "🇩🇪",
    ligas: [
      {
        nombre: "German Manshaft League (Bundesliga)",
        equipos: [
          { id: "bastard_munchen", nombre: "Bastard München", escudo: "assets/logos/bastard_munchen.png", nivel: 4, presupuesto: 7000 },
          { id: "berserk_dortmund", nombre: "Berserk Dortmund", escudo: "assets/logos/berserk_dortmund.png", nivel: 3, presupuesto: 5800 },
          { id: "rpb", nombre: "RPB", escudo: "assets/logos/rpb.png", nivel: 3, presupuesto: 5100 },
          { id: "vesper_bremen", nombre: "Vesper Bremen", nivel: 2, presupuesto: 4800 }
        ]
      }
    ]
  },
  {
    id: "esp", nombre: "España", bandera: "🇪🇸",
    ligas: [
      {
        nombre: "Spanish Liga (LaLiga)",
        equipos: [
          { id: "fc_barcha", nombre: "FC Barcha", escudo: "assets/logos/barcha.png", nivel: 4, presupuesto: 7200 },
          { id: "chicorid", nombre: "Chicorid", escudo: "assets/logos/chicorid.png", nivel: 3, presupuesto: 5000 }
        ]
      }
    ]
  },
  {
    id: "eng", nombre: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    ligas: [
      {
        nombre: "English Manshine League (Premier)",
        equipos: [
          { id: "manshine_city", nombre: "Manshine City", escudo: "assets/logos/manshine_city.png", nivel: 4, presupuesto: 9000 },
          { id: "arsenaly", nombre: "Arsenaly", escudo: "assets/logos/arsenaly.png", nivel: 3, presupuesto: 6200 },
          { id: "miracleicester", nombre: "Miracleicester", escudo: "assets/logos/miracleicester.png", nivel: 3, presupuesto: 5400 },
          { id: "manshine_united", nombre: "Manshine United", escudo: "assets/logos/manshine_united.png", nivel: 3, presupuesto: 6000 },
          { id: "chelblue", nombre: "Chelblue", escudo: "assets/logos/chelblue.png", nivel: 3, presupuesto: 5800 },
          { id: "livers", nombre: "Livers", nivel: 3, presupuesto: 5400 }
        ]
      }
    ]
  },
  {
    id: "ita", nombre: "Italia", bandera: "🇮🇹",
    ligas: [
      {
        nombre: "Italian Serie (Serie A)",
        equipos: [
          { id: "ubers_fc", nombre: "Ubers FC", escudo: "assets/logos/ubers.png", nivel: 4, presupuesto: 6800 },
          { id: "bolos", nombre: "Bolos", escudo: "assets/logos/bolos.png", nivel: 3, presupuesto: 5400 },
          { id: "ac_milanoia", nombre: "AC Milanoia", escudo: "assets/logos/ac_milanoia.png", nivel: 3, presupuesto: 5600 },
          { id: "napolin", nombre: "Napolin", escudo: "assets/logos/napolin.png", nivel: 3, presupuesto: 5500 },
          { id: "palmaro", nombre: "Palmaro", escudo: "assets/logos/palmaro.png", nivel: 3, presupuesto: 5200 }
        ]
      }
    ]
  },
  {
    id: "fra", nombre: "Francia", bandera: "🇫🇷",
    ligas: [
      {
        nombre: "French League (Ligue 1)",
        equipos: [
          { id: "paris_x_gen", nombre: "Paris X Gen", escudo: "assets/logos/paris_x_gen.png", nivel: 4, presupuesto: 7600 },
          { id: "marseille", nombre: "Marseille", escudo: "assets/logos/marseille.png", nivel: 3, presupuesto: 5500 },
          { id: "monao", nombre: "Monao", escudo: "assets/logos/monao.png", nivel: 3, presupuesto: 5300 },
          { id: "nandatot", nombre: "Nandatot", nivel: 2, presupuesto: 4600 }
        ]
      }
    ]
  },
  {
    id: "por", nombre: "Portugal", bandera: "🇵🇹",
    ligas: [
      {
        nombre: "Portuguese League (Liga Portugal)",
        equipos: [
          { id: "fc_portimion", nombre: "FC Portimion", escudo: "assets/logos/FC Portimion.png", nivel: 3, presupuesto: 4800 }
        ]
      }
    ]
  },
  {
    id: "hol", nombre: "Holanda", bandera: "🇳🇱",
    ligas: [
      {
        nombre: "Dutch Eredivisie",
        equipos: [
          { id: "ajajax", nombre: "Ajajax", escudo: "assets/logos/ajajax.png", nivel: 3, presupuesto: 5200 },
          { id: "kroningen", nombre: "Kroningen", nivel: 2, presupuesto: 4200 }
        ]
      }
    ]
  },
  {
    id: "esc", nombre: "Escocia", bandera: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    ligas: [
      {
        nombre: "Scottish Premiership",
        equipos: [
          { id: "celticoss", nombre: "Celticoss", escudo: "assets/logos/celticoss.png", nivel: 3, presupuesto: 5000 }
        ]
      }
    ]
  }
];

// ===== MODO HISTORIA: CAPÍTULOS Y PARTIDOS =====
const MODO_HISTORIA = [
  {
    id: "cap_1",
    titulo: "Fase 1: Estrato 5 - La Primera Selección",
    descripcion: "Toma el control del Equipo Z en el estrato más bajo de Blue Lock. Enfréntate a los equipos X, Y, W y V en una liga de supervivencia donde solo 2 equipos sobrevivirán a la eliminación total.",
    partidos: [
      {
        id: "historia_eq_x",
        rival: "Equipo X (Líder: Shoei Barou)",
        dialogoPre: [
          { personaje: "Jinpachi Ego", texto: "Bienvenidos a la Primera Selección, inútiles. En este estrato todos sois el rango más bajo. Para sobrevivir debéis crear el fútbol desde el 0." },
          { personaje: "Shoei Barou", texto: "Fuera de mi camino. En este campo, el rey soy yo." }
        ],
        dialogoPost: [
          { personaje: "Jinpachi Ego", texto: "Perder o ganar sin entender tus armas no sirve de nada. Entended vuestro ego antes del próximo partido." }
        ]
      },
      {
        id: "historia_eq_y",
        rival: "Equipo Y (Líder: Ikki Niko)",
        dialogoPre: [
          { personaje: "Ikki Niko", texto: "Nosotros no necesitamos destacar individualmente. Usaremos nuestro cerebro para aplastaros." }
        ],
        dialogoPost: [
          { personaje: "Yoichi Isagi", texto: "¡Puedo ver el campo! ¡Veo dónde va a nacer la oportunidad!" }
        ]
      },
      {
        id: "historia_eq_w",
        rival: "Equipo W (Hermanos Wanima)",
        dialogoPre: [
          { personaje: "Junichi Wanima", texto: "..." }
        ],
        dialogoPost: [
          { personaje: "Meguru Bachira", texto: "El monstruo dentro de mí está empezando a divertirse." }
        ]
      },
      {
        id: "historia_eq_v",
        rival: "Equipo V (Nagi, Reo, Zantetsu)",
        dialogoPre: [
          { personaje: "Reo Mikage", texto: "Nagi y yo nunca hemos perdido. Esto será rápido." },
          { personaje: "Seishiro Nagi", texto: "Qué palo jugar al fútbol... pero Reo dice que hay que ganar." }
        ],
        dialogoPost: [
          { personaje: "Jinpachi Ego", texto: "Enhorabuena, Equipo Z. Habéis logrado transformar el 0 en 1. El verdadero fuego acaba de encenderse." }
        ]
      }
    ]
  }
];

// ===== COLORES DE CLUB PARA EQUIPOS SIN LOGO (2ª DIVISIÓN) =====
const COLORES_EQUIPOS = {
  ichinan_hs: { p: "#1565C0", s: "#E3F2FD", forma: "circulo" },
  matsukaze_hs: { p: "#43A047", s: "#FDD835", forma: "escudo" },
  kitsunezaka_hs: { p: "#EF6C00", s: "#FFF3E0", forma: "hexagono" },
  kanau_academy: { p: "#6A1B9A", s: "#CE93D8", forma: "pentagono" },
  gunma_hs: { p: "#C62828", s: "#1A1A1A", forma: "rombo" },
  saitama_hs: { p: "#2E7D32", s: "#00E676", forma: "octagono" },
  senshindo_hs: { p: "#00838F", s: "#E0F7FA", forma: "cuadro" },
  aomori_hs: { p: "#1A237E", s: "#90CAF9", forma: "gota" },
  sunflame_hiroshima: { p: "#F57C00", s: "#D32F2F", forma: "triangulo" },
  gohonzon_kamakura: { p: "#283593", s: "#FFD700", forma: "estrella" },
  jubilee_iwata: { p: "#B71C1C", s: "#E0F2FE", forma: "chevron" },
  kroningen: { p: "#2E7D32", s: "#ECEFF1", forma: "home" }
};

// ===== GENERADOR DE PLANTILLAS ALEATORIAS PARA EQUIPOS INCOMPLETOS =====

const BANDERAS_PAIS = {
  Japón: "🇯🇵", Alemania: "🇩🇪", Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", España: "🇪🇸",
  Italia: "🇮🇹", Francia: "🇫🇷", Portugal: "🇵🇹", Holanda: "🇳🇱", Escocia: "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
};

const NOMBRES_POR_PAIS = {
  Japón: { nombres: ["Yuto","Riku","Sota","Kaito","Haruki","Ren","Takumi","Daichi","Kouki","Sora","Ayumu","Kenta"], apellidos: ["Tanaka","Suzuki","Takahashi","Kobayashi","Yamamoto","Nakamura","Sato","Kato","Yoshida","Ito","Watanabe","Hayashi"] },
  Alemania: { nombres: ["Jonas","Lukas","Finn","Leon","Paul","Maximilian","Niklas","Tim","Jan","Luca","Felix","Moritz"], apellidos: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Hoffmann","Schulz","Koch","Richter"] },
  Inglaterra: { nombres: ["Jack","Oliver","Harry","George","Charlie","Jacob","Tom","Harry","James","William","Oscar","Daniel"], apellidos: ["Smith","Jones","Taylor","Brown","Wilson","Walker","Wright","Robinson","Thompson","White","Hall","Green"] },
  España: { nombres: ["Sergio","Pablo","Álvaro","Diego","Javier","Marcos","Adrián","Iván","Rubén","Alejandro","Carlos","Miguel"], apellidos: ["García","Fernández","González","Rodríguez","López","Martínez","Sánchez","Pérez","Gómez","Martín","Jiménez","Ruiz"] },
  Italia: { nombres: ["Marco","Luca","Alessandro","Matteo","Francesco","Giovanni","Lorenzo","Simone","Davide","Federico","Antonio","Stefano"], apellidos: ["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Costa"] },
  Francia: { nombres: ["Lucas","Hugo","Jules","Théo","Antoine","Mathis","Louis","Nolan","Enzo","Raphaël","Gabriel","Léo"], apellidos: ["Martin","Bernard","Thomas","Petit","Durand","Leroy","Moreau","Simon","Laurent","Lefebvre","Michel","Garcia"] },
  Portugal: { nombres: ["João","Miguel","Diogo","Tiago","Rui","André","Gonçalo","Pedro","Nuno","Bruno","Ricardo","Hélder"], apellidos: ["Silva","Santos","Ferreira","Pereira","Oliveira","Costa","Rodrigues","Martins","Sousa","Fernandes","Gonçalves","Gomes"] },
  Holanda: { nombres: ["Daan","Sem","Lucas","Luuk","Niels","Thijs","Bram","Ruben","Jesse","Wouter","Joris","Sven"], apellidos: ["de Jong","van Dijk","Bakker","Visser","Smit","Meijer","Mulder","de Boer","Bos","Vos","Peters","Hendriks"] },
  Escocia: { nombres: ["Callum","Finlay","Angus","Ewan","Fraser","Rory","Logan","Liam","Lewis","Kyle","Ross","Craig"], apellidos: ["MacDonald","Campbell","Stewart","Robertson","Thomson","Anderson","Scott","Murray","MacKenzie","Reid","Marshall","Ferguson"] }
};

const MEZCLA_PAISES = {
  Japón: ["Japón"],
  Alemania: ["Alemania","Alemania","Alemania","Alemania","Inglaterra","Francia","Holanda"],
  Inglaterra: ["Inglaterra","Inglaterra","Inglaterra","Inglaterra","Escocia","Alemania","Francia"],
  España: ["España","España","España","España","Italia","Inglaterra","Francia"],
  Italia: ["Italia","Italia","Italia","Italia","España","Francia","Inglaterra"],
  Francia: ["Francia","Francia","Francia","Francia","Alemania","Inglaterra","Italia"],
  Portugal: ["Portugal","Portugal","Portugal","Portugal","España","Inglaterra","Italia"],
  Holanda: ["Holanda","Holanda","Holanda","Holanda","Alemania","Inglaterra","Escocia"],
  Escocia: ["Escocia","Escocia","Escocia","Escocia","Inglaterra","Francia","Alemania"]
};

const POSICIONES_POR_LINEA = [
  { pos: "POR", peso: 1 },
  { pos: "DFC", peso: 3 }, { pos: "LD", peso: 2 }, { pos: "LI", peso: 2 }, { pos: "CAD", peso: 1 }, { pos: "CAI", peso: 1 },
  { pos: "MCD", peso: 2 }, { pos: "MC", peso: 3 }, { pos: "MCO", peso: 2 }, { pos: "MI", peso: 1 }, { pos: "MD", peso: 1 },
  { pos: "EI", peso: 2 }, { pos: "ED", peso: 2 }, { pos: "DC", peso: 3 }, { pos: "SD", peso: 1 }
];

const PAIS_EQUIPO = {
  rpb: "Alemania", vesper_bremen: "Alemania",
  arsenaly: "Inglaterra", manshine_united: "Inglaterra", chelblue: "Inglaterra", livers: "Inglaterra", miracleicester: "Inglaterra",
  chicorid: "España",
  ac_milanoia: "Italia", napolin: "Italia", palmaro: "Italia", bolos: "Italia",
  marseille: "Francia", monao: "Francia", nandatot: "Francia",
  fc_portimion: "Portugal",
  ajajax: "Holanda", kroningen: "Holanda",
  celticoss: "Escocia",
  urawa_rubies: "Japón", kawasaki_breakerz: "Japón", roar_kumamoto: "Japón", dosankoro_sapporo: "Japón",
  sunflame_hiroshima: "Japón", gohonzon_kamakura: "Japón", jubilee_iwata: "Japón",
  ichinan_hs: "Japón", matsukaze_hs: "Japón", kitsunezaka_hs: "Japón", kanau_academy: "Japón",
  gunma_hs: "Japón", saitama_hs: "Japón", senshindo_hs: "Japón", aomori_hs: "Japón"
};

const NOMBRE_EQUIPO = {
  rpb: "RPB", vesper_bremen: "Vesper Bremen",
  arsenaly: "Arsenaly", manshine_united: "Manshine United", chelblue: "Chelblue", livers: "Livers", miracleicester: "Miracleicester",
  chicorid: "Chicorid",
  ac_milanoia: "AC Milanoia", napolin: "Napolin", palmaro: "Palmaro", bolos: "Bolos",
  marseille: "Marseille", monao: "Monao", nandatot: "Nandatot",
  fc_portimion: "FC Portimion",
  ajajax: "Ajajax", kroningen: "Kroningen",
  celticoss: "Celticoss",
  urawa_rubies: "Urawa Rubies", kawasaki_breakerz: "Kawasaki Breakerz", roar_kumamoto: "Roar Kumamoto", dosankoro_sapporo: "Dosankoro Sapporo",
  sunflame_hiroshima: "Sunflame Hiroshima", gohonzon_kamakura: "Gohonzon Kamakura", jubilee_iwata: "Jubilee Iwata",
  ichinan_hs: "Instituto Ichinan", matsukaze_hs: "Matsukaze Kokuou", kitsunezaka_hs: "Instituto Kitsunezaka", kanau_academy: "Academia Kanau",
  gunma_hs: "Instituto Gunma", saitama_hs: "Instituto Saitama", senshindo_hs: "Instituto Senshindo", aomori_hs: "Aomori Dadada"
};

function elegirNacionalidad(paisEquipo) {
  if (paisEquipo === "Japón") return "Japón";
  const extranjeros = (MEZCLA_PAISES[paisEquipo] || []).filter(p => p !== paisEquipo);
  if (Math.random() < 0.8 || extranjeros.length === 0) return paisEquipo;
  return extranjeros[Math.floor(Math.random() * extranjeros.length)];
}

function nombreAleatorio(nacionalidad) {
  const data = NOMBRES_POR_PAIS[nacionalidad] || NOMBRES_POR_PAIS.Japón;
  const n = data.nombres[Math.floor(Math.random() * data.nombres.length)];
  const a = data.apellidos[Math.floor(Math.random() * data.apellidos.length)];
  return `${n} ${a}`;
}

function posicionAleatoria() {
  const total = POSICIONES_POR_LINEA.reduce((s, p) => s + p.peso, 0);
  let r = Math.random() * total;
  for (const p of POSICIONES_POR_LINEA) {
    r -= p.peso;
    if (r <= 0) return p.pos;
  }
  return "MC";
}

function statsPorPosicion(pos, grl) {
  const base = {
    POR: { pac: 30, sho: 20, pas: 35, dri: 30, def: 65, phy: 60 },
    DFC: { pac: 45, sho: 25, pas: 45, dri: 35, def: 70, phy: 65 },
    LD: { pac: 55, sho: 25, pas: 50, dri: 40, def: 60, phy: 60 },
    LI: { pac: 55, sho: 25, pas: 50, dri: 40, def: 60, phy: 60 },
    CAD: { pac: 60, sho: 30, pas: 50, dri: 45, def: 55, phy: 60 },
    CAI: { pac: 60, sho: 30, pas: 50, dri: 45, def: 55, phy: 60 },
    MCD: { pac: 45, sho: 40, pas: 60, dri: 50, def: 55, phy: 60 },
    MC: { pac: 50, sho: 50, pas: 65, dri: 55, def: 45, phy: 55 },
    MCO: { pac: 50, sho: 55, pas: 65, dri: 60, def: 35, phy: 50 },
    MI: { pac: 55, sho: 55, pas: 60, dri: 60, def: 40, phy: 50 },
    MD: { pac: 55, sho: 55, pas: 60, dri: 60, def: 40, phy: 50 },
    EI: { pac: 65, sho: 60, pas: 55, dri: 65, def: 25, phy: 45 },
    ED: { pac: 65, sho: 60, pas: 55, dri: 65, def: 25, phy: 45 },
    SD: { pac: 55, sho: 65, pas: 55, dri: 60, def: 25, phy: 50 },
    DC: { pac: 50, sho: 70, pas: 45, dri: 55, def: 25, phy: 60 }
  };
  const pesos = base[pos] || base.MC;
  const keys = ["pac", "sho", "pas", "dri", "def", "phy"];
  const stats = {};
  let suma = 0;
  keys.forEach(k => {
    const ruido = Math.floor(Math.random() * 15) - 7;
    stats[k] = Math.max(20, Math.min(92, pesos[k] + Math.round((grl - 60) * 0.8) + ruido));
    suma += stats[k];
  });
  const grlCalc = Math.round(suma / 6);
  keys.forEach(k => {
    stats[k] = Math.max(20, Math.min(95, stats[k] + (grl - grlCalc)));
  });
  return stats;
}

function dorsalLibre(equipo, usados) {
  const plantilla = (typeof PLANTILLAS_EQUIPO !== 'undefined' && PLANTILLAS_EQUIPO[equipo]) ? PLANTILLAS_EQUIPO[equipo] : [];
  for (let d = 1; d <= 40; d++) {
    if (usados.has(d)) continue;
    if (!plantilla.some(p => p.dorsal === d)) return d;
  }
  return 40 + usados.size;
}

function generarPlantillaCompleta(teamId) {
  const actuales = (PLANTILLAS_EQUIPO[teamId] || []).slice();
  const falta = 20 - actuales.length;
  const usados = new Set(actuales.map(p => p.dorsal));
  const liga = (typeof DIVISIONES !== 'undefined' && DIVISIONES.primera?.equipos?.includes(teamId))
    ? "Liga Neo Egotísta"
    : "Liga Nacional de Institutos";
  const nombreEquipo = NOMBRE_EQUIPO[teamId] || teamId;
  const paisEquipo = PAIS_EQUIPO[teamId] || "Japón";
  const rangoGrl = liga === "Liga Neo Egotísta" ? [58, 72] : [50, 66];

  const nuevos = [];
  for (let i = 0; i < falta; i++) {
    const dorsal = dorsalLibre(teamId, usados);
    usados.add(dorsal);
    const nacionalidad = elegirNacionalidad(paisEquipo);
    const posicion = posicionAleatoria();
    const grl = rangoGrl[0] + Math.floor(Math.random() * (rangoGrl[1] - rangoGrl[0] + 1));
    nuevos.push({
      id: `${teamId}_npc_${dorsal}`,
      nombre: nombreAleatorio(nacionalidad),
      dorsal,
      posicion,
      grl,
      edad: 17 + Math.floor(Math.random() * 6),
      nacionalidad,
      bandera: BANDERAS_PAIS[nacionalidad] || "🌍",
      equipo: nombreEquipo,
      liga,
      stats: statsPorPosicion(posicion, grl)
    });
  }
  return nuevos;
}

(function completarPlantillas() {
  if (typeof DIVISIONES === 'undefined') return;
  Object.keys(DIVISIONES).forEach(divKey => {
    (DIVISIONES[divKey].equipos || []).forEach(teamId => {
      if (!PLANTILLAS_EQUIPO[teamId]) PLANTILLAS_EQUIPO[teamId] = [];
      if (PLANTILLAS_EQUIPO[teamId].length < 16) {
        PLANTILLAS_EQUIPO[teamId] = PLANTILLAS_EQUIPO[teamId].concat(generarPlantillaCompleta(teamId));
      }
    });
  });
})();
