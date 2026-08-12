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
    { id: "noel_noa", nombre: "Noel Noa", nombreCompleto: "Noel Noa", apodo: "Mejor Delantero del Mundo", instituto: "Profesional", edad: 31, dorsal: 9, posicion: "DC", grl: 98, altura: "184cm", pierna: "Ambas", nacionalidad: "Francia", bandera: "🇫🇷", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/1/1d/Noel_Noa.png/revision/latest?cb=20230304180037&path-prefix=es", stats: { pac: 95, sho: 99, pas: 92, dri: 96, def: 60, phy: 94 } },
    { id: "michael_kaiser", nombre: "Michael Kaiser", nombreCompleto: "Michael Kaiser", apodo: "Emperador", instituto: "BM Youth", edad: 19, dorsal: 10, posicion: "DC", posicionSecundaria: "MCO", grl: 93, altura: "186cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", valor: 400000000, foto: "https://static.wikia.nocookie.net/bluelock/images/f/f0/Michael_Kaiser.png/revision/latest?cb=20230304180019&path-prefix=es", stats: { pac: 89, sho: 96, pas: 84, dri: 91, def: 52, phy: 85 } },
    { id: "alexis_ness", nombre: "Alexis Ness", nombreCompleto: "Alexis Ness", apodo: "El Mago", instituto: "BM Youth", edad: 18, dorsal: 8, posicion: "MCO", posicionSecundaria: "MC", grl: 86, altura: "181cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", valor: 130000000, foto: "https://static.wikia.nocookie.net/bluelock/images/1/18/Alexis_Ness.png/revision/latest?cb=20230304175709&path-prefix=es", stats: { pac: 80, sho: 75, pas: 91, dri: 88, def: 65, phy: 72 } },
    { id: "isagi_bm", nombre: "Yoichi Isagi", nombreCompleto: "Yoichi Isagi", instituto: "Instituto Ichinan", edad: 17, dorsal: 11, posicion: "MCO", posicionSecundaria: "ED/MD", grl: 82, altura: "175cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/3/39/Yoichi_Isagi.png/revision/latest?cb=20251015005612&path-prefix=es", stats: { pac: 80, sho: 88, pas: 90, dri: 82, def: 75, phy: 76 } },
    { id: "kunigami_bm", nombre: "Rensuke Kunigami", nombreCompleto: "Rensuke Kunigami", instituto: "Instituto Seido", edad: 17, dorsal: 50, posicion: "MCD", posicionSecundaria: "MC", grl: 79, altura: "188cm", pierna: "Ambas", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/8/87/Rensuke_Kunigami.png/revision/latest?cb=20250823031126&path-prefix=es", stats: { pac: 82, sho: 94, pas: 65, dri: 74, def: 62, phy: 96 } },
    { id: "yukimiya_kenyu", nombre: "Kenyu Yukimiya", nombreCompleto: "Kenyu Yukimiya", apodo: "Yukki", instituto: "Eisei Academy", edad: 18, dorsal: 15, posicion: "LI", posicionSecundaria: "EI", grl: 81, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", valor: 42000000, foto: "https://static.wikia.nocookie.net/bluelock/images/7/73/Kenyu_Yukimiya.png/revision/latest?cb=20230304180004&path-prefix=es", stats: { pac: 88, sho: 83, pas: 78, dri: 91, def: 73, phy: 82 } },
    { id: "gagamaru_bm", nombre: "Gin Gagamaru", nombreCompleto: "Gin Gagamaru", instituto: "Tofuku High School", edad: 17, dorsal: 99, posicion: "POR", posicionSecundaria: "DC", grl: 80, altura: "191cm", pierna: "Ambas", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/7/79/Gin_Gagamaru.png/revision/latest?cb=20230304175900&path-prefix=es", stats: {"div":88,"han":87,"kic":58,"ref":86,"spd":78,"pos":83} },
    { id: "kurona_ranze", nombre: "Ranze Kurona", nombreCompleto: "Ranze Kurona", instituto: "Kanto High School", edad: 16, dorsal: 16, posicion: "LD", grl: 77, altura: "168cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", valor: 35000000, foto: "https://static.wikia.nocookie.net/bluelock/images/a/ae/Ranze_Kurona.png/revision/latest?cb=20251031011435&path-prefix=es", stats: { pac: 90, sho: 65, pas: 84, dri: 86, def: 74, phy: 68 } },
    { id: "raichi_bm", nombre: "Jingo Raichi", nombreCompleto: "Jingo Raichi", instituto: "Nagumo High School", edad: 17, dorsal: 22, posicion: "MCD", posicionSecundaria: "MC", grl: 74, altura: "182cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/5/5c/Jingo_Raichi.png/revision/latest?cb=20251128002716&path-prefix=es", stats: { pac: 72, sho: 60, pas: 70, dri: 66, def: 85, phy: 88 } },
    { id: "hiori_yo", nombre: "Yo Hiori", nombreCompleto: "Yo Hiori", instituto: "Kansai Youth Academy", edad: 17, dorsal: 23, posicion: "LI", posicionSecundaria: "LD/EI/ED", grl: 79, altura: "183cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", valor: 39000000, foto: "https://static.wikia.nocookie.net/bluelock/images/6/65/Yo_Hiori.png/revision/latest?cb=20230304180147&path-prefix=es", stats: { pac: 88, sho: 74, pas: 90, dri: 88, def: 65, phy: 72 } },
    { id: "kiyora_jin", nombre: "Jin Kiyora", nombreCompleto: "Jin Kiyora", instituto: "Yamashiro High School", edad: 17, dorsal: 69, posicion: "LI", grl: 75, altura: "165cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", valor: 26000000, foto: "https://static.wikia.nocookie.net/bluelock/images/a/a9/Jin_Kiyora.png/revision/latest?cb=20250726190555&path-prefix=es", stats: { pac: 79, sho: 76, pas: 82, dri: 84, def: 72, phy: 70 } },
    { id: "igarashi_bm", nombre: "Gurimu Igarashi", nombreCompleto: "Gurimu Igarashi", instituto: "Hosenji High School", edad: 16, dorsal: 76, posicion: "LD", posicionSecundaria: "CAD", grl: 75, altura: "172cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/a/aa/Gurimu_Igarashi.png/revision/latest?cb=20251126230542&path-prefix=es", stats: { pac: 72, sho: 60, pas: 68, dri: 65, def: 78, phy: 75 } },
    { id: "neru_teppei", nombre: "Teppei Neru", nombreCompleto: "Teppei Neru", instituto: "Universidad Takeuma", edad: 19, dorsal: 14, posicion: "LD", posicionSecundaria: "CAD", grl: 78, altura: "168cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/2/28/Teppei_Neru.png/revision/latest?cb=20230304180126&path-prefix=es", stats: { pac: 90, sho: 58, pas: 70, dri: 74, def: 76, phy: 72 } },
    { id: "benedict_grim", nombre: "Benedict Grim", nombreCompleto: "Benedict Grim", instituto: "BM Youth", edad: 19, dorsal: 5, posicion: "MCO", posicionSecundaria: "EI", grl: 82, altura: "186cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", valor: 40000000, foto: "https://static.wikia.nocookie.net/bluelock/images/b/b0/Benedict_Grim.png/revision/latest?cb=20230304175723&path-prefix=es", stats: { pac: 85, sho: 80, pas: 78, dri: 81, def: 50, phy: 76 } },
    { id: "erik_gesner", nombre: "Erik Gesner", nombreCompleto: "Erik Gesner", instituto: "BM Youth", edad: 19, dorsal: 13, posicion: "MCO", grl: 80, altura: "182cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/0/04/Erik_Gesner.png/revision/latest?cb=20230304175836&path-prefix=es", stats: { pac: 75, sho: 70, pas: 82, dri: 78, def: 72, phy: 74 } },
    { id: "birkenstock", nombre: "Birkenstock", nombreCompleto: "Birkenstock", instituto: "BM Youth", edad: 20, dorsal: 6, posicion: "DFC", grl: 81, altura: "189cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", valor: 30000000, foto: "https://static.wikia.nocookie.net/bluelock/images/a/aa/Birkenstock_2.jpg/revision/latest?cb=20230311141919&path-prefix=es", stats: { pac: 72, sho: 45, pas: 70, dri: 62, def: 84, phy: 83 } },
    { id: "ali_bm", nombre: "Ali", nombreCompleto: "Ali", instituto: "BM Youth", edad: 18, dorsal: 7, posicion: "MCD", grl: 79, altura: "179cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/f/fa/Ali_2.jpg/revision/latest?cb=20230312203423&path-prefix=es", stats: { pac: 76, sho: 60, pas: 80, dri: 74, def: 74, phy: 67 } },
    { id: "mensah", nombre: "Mensah", nombreCompleto: "Mensah", instituto: "BM Youth", edad: 20, dorsal: 2, posicion: "DFC", grl: 81, altura: "191cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", valor: 27000000, foto: "https://static.wikia.nocookie.net/bluelock/images/e/e7/Mensah_2.jpg/revision/latest?cb=20230311141845&path-prefix=es", stats: { pac: 72, sho: 48, pas: 65, dri: 60, def: 84, phy: 85 } },
    { id: "igor_schneider", nombre: "Igor Schneider", nombreCompleto: "Igor Schneider", instituto: "BM Youth", edad: 19, dorsal: 20, posicion: "MC", posicionSecundaria: "MCD", grl: 78, altura: "184cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/d/d7/Igor_Schneider.png/revision/latest?cb=20230306014439&path-prefix=es", stats: { pac: 72, sho: 68, pas: 76, dri: 74, def: 74, phy: 76 } },
    { id: "theo_sachs", nombre: "Theo Sachs", nombreCompleto: "Theo Sachs", instituto: "BM Youth", edad: 19, dorsal: 3, posicion: "LI", grl: 78, altura: "180cm", pierna: "Izquierda", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/6/66/Theo_Sachs.png/revision/latest?cb=20231112212357&path-prefix=es", stats: { pac: 80, sho: 60, pas: 72, dri: 72, def: 78, phy: 72 } },
    { id: "bachman", nombre: "Bachman", nombreCompleto: "Bachman", instituto: "BM Youth", edad: 20, dorsal: 1, posicion: "POR", grl: 72, altura: "193cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/d/d8/Bachman.png/revision/latest?cb=20231112212407&path-prefix=es", stats: {"div":80,"han":79,"kic":50,"ref":78,"spd":70,"pos":75} },
    { id: "ndiaye", nombre: "Ndiaye", nombreCompleto: "Ndiaye", instituto: "BM Youth", edad: 19, dorsal: 4, posicion: "LD", grl: 79, altura: "188cm", pierna: "Derecha", nacionalidad: "Alemania", bandera: "🇩🇪", equipo: "Bastard München", liga: "German Manshaft League", foto: "https://static.wikia.nocookie.net/bluelock/images/c/c1/Ndiaye.png/revision/latest?cb=20231113044320&path-prefix=es", stats: { pac: 84, sho: 42, pas: 64, dri: 64, def: 76, phy: 74 } }
  ],
  manshine_city: [{ id: "chris_prince", nombre: "Chris Prince", nombreCompleto: "Chris Prince", instituto: "Profesional", edad: 26, dorsal: 7, posicion: "DC", grl: 98, altura: "190cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 94, sho: 98, pas: 88, dri: 92, def: 75, phy: 99 } },
    { id: "agi", nombre: "Agi", nombreCompleto: "Agi", instituto: "Manshine Academy", edad: 19, dorsal: 9, posicion: "DC", posicionSecundaria: "MCO", grl: 85, altura: "192cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 81, sho: 84, pas: 79, dri: 80, def: 60, phy: 88 } },
    { id: "reo_mikage", nombre: "Reo Mikage", nombreCompleto: "Reo Mikage", instituto: "Instituto Hakuho", edad: 17, dorsal: 14, posicion: "MCD", posicionSecundaria: "DFC/MD", grl: 83, altura: "185cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 78000000, foto: "https://static.wikia.nocookie.net/bluelock/images/4/40/Reo_Mikage.png/revision/latest?cb=20230310173019&path-prefix=es", stats: { pac: 82, sho: 81, pas: 88, dri: 84, def: 76, phy: 81 } },
    { id: "chigiri_mc", nombre: "Hyoma Chigiri", nombreCompleto: "Hyoma Chigiri", instituto: "Instituto Rakosute", edad: 16, dorsal: 44, posicion: "LD", posicionSecundaria: "EI", grl: 88, altura: "177cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", foto: "https://static.wikia.nocookie.net/bluelock/images/f/f5/Hyoma_Chigiri.png/revision/latest?cb=20230310051615&path-prefix=es", stats: { pac: 98, sho: 88, pas: 81, dri: 89, def: 70, phy: 74 } },
    { id: "nagi_seishiro", nombre: "Seishiro Nagi", nombreCompleto: "Seishiro Nagi", instituto: "Instituto Hakuho", edad: 17, dorsal: 11, posicion: "DC", posicionSecundaria: "ED/MCO", grl: 88, altura: "190cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 24000000, foto: "https://static.wikia.nocookie.net/bluelock/images/c/c9/Seishiro_Nagi.png/revision/latest?cb=20230310040429&path-prefix=es", stats: { pac: 83, sho: 93, pas: 78, dri: 95, def: 41, phy: 85 } },
    { id: "kazuma_nio", nombre: "Kazuma Niou", nombreCompleto: "Kazuma Niou", apodo: "Dóberman", instituto: "Sunflame Hiroshima Academy", edad: 19, dorsal: 20, posicion: "DFC", posicionSecundaria: "MCD", grl: 81, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 50000000, foto: "https://static.wikia.nocookie.net/bluelock/images/9/97/Kazuma_Niou.png/revision/latest?cb=20230310210324&path-prefix=es", stats: { pac: 78, sho: 55, pas: 68, dri: 65, def: 83, phy: 86 } },
    { id: "reiji_hiiragi", nombre: "Reiji Hiiragi", nombreCompleto: "Reiji Hiiragi", instituto: "Hoshizuku High School", edad: 18, dorsal: 17, posicion: "DC", grl: 69, altura: "184cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 11000000, foto: "https://static.wikia.nocookie.net/bluelock/images/d/dd/Reiji_Hiiragi.png/revision/latest?cb=20250812202546&path-prefix=es", stats: { pac: 76, sho: 71, pas: 78, dri: 77, def: 48, phy: 66 } },
    { id: "junichi_wanima", nombre: "Junichi Wanima", nombreCompleto: "Junichi Wanima", instituto: "Instituto Matsukaze Kokuo", edad: 18, dorsal: 0, posicion: "DC", grl: 74, altura: "178cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 8200000, foto: "https://static.wikia.nocookie.net/bluelock/images/2/2b/Junichi_Wanima.png/revision/latest?cb=20230310180828&path-prefix=es", stats: { pac: 75, sho: 77, pas: 76, dri: 72, def: 42, phy: 72 } },
    { id: "hajime_nishioka", nombre: "Hajime Nishioka", nombreCompleto: "Hajime Nishioka", apodo: "Messi de Aomori", instituto: "Aomori High School", edad: 18, dorsal: 29, posicion: "EI", grl: 68, altura: "170cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 3000000, foto: "https://static.wikia.nocookie.net/bluelock/images/b/b5/Hajime_Nishioka.png/revision/latest?cb=20231118211531&path-prefix=es", stats: { pac: 83, sho: 76, pas: 78, dri: 85, def: 33, phy: 58 } },
    { id: "taiga_tsunzaki", nombre: "Taiga Tsunzaki", nombreCompleto: "Taiga Tsunzaki", instituto: "Akudo High School", edad: 18, dorsal: 100, posicion: "DC", grl: 58, altura: "181cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 2300000, foto: "https://static.wikia.nocookie.net/bluelock/images/a/a1/Taiga_Tsunzaki.png/revision/latest?cb=20230310190153&path-prefix=es", stats: { pac: 63, sho: 61, pas: 42, dri: 58, def: 39, phy: 70 } },
    { id: "kairu_saramadara", nombre: "Kairu Saramadara", nombreCompleto: "Kairu Saramadara", apodo: "Depredador", instituto: "Shonan High School", edad: 18, dorsal: 51, posicion: "DFC", grl: 59, altura: "182cm", pierna: "Derecha", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Manshine City", liga: "English Manshine League", valor: 2400000, foto: "https://static.wikia.nocookie.net/bluelock/images/a/ac/Kairu_Saramadara.png/revision/latest?cb=20230310194137&path-prefix=es", stats: { pac: 62, sho: 40, pas: 52, dri: 48, def: 67, phy: 74 } },
    { id: "mc_driver", nombre: "Driver", nombreCompleto: "Driver", instituto: "Manshine Academy", edad: 19, dorsal: 5, posicion: "DFC", grl: 78, altura: "188cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 74, sho: 45, pas: 66, dri: 62, def: 80, phy: 83 } },
    { id: "mc_swift", nombre: "Swift", nombreCompleto: "Swift", instituto: "Manshine Academy", edad: 18, dorsal: 6, posicion: "LI", posicionSecundaria: "CAD", grl: 77, altura: "178cm", pierna: "Izquierda", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 85, sho: 60, pas: 74, dri: 76, def: 75, phy: 70 } },
    { id: "mc_busby", nombre: "Busby", nombreCompleto: "Busby", instituto: "Manshine Academy", edad: 19, dorsal: 3, posicion: "LD", posicionSecundaria: "CAD", grl: 76, altura: "180cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 82, sho: 58, pas: 72, dri: 73, def: 76, phy: 74 } },
    { id: "mc_rook", nombre: "Rook", nombreCompleto: "Rook", instituto: "Manshine Academy", edad: 20, dorsal: 1, posicion: "POR", grl: 73, altura: "191cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: {"div":82,"han":82,"kic":48,"ref":81,"spd":68,"pos":75} },
    { id: "mc_young", nombre: "Young", nombreCompleto: "Young", instituto: "Manshine Academy", edad: 19, dorsal: 4, posicion: "DFC", grl: 77, altura: "187cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 72, sho: 48, pas: 64, dri: 60, def: 79, phy: 82 } },
    { id: "mc_arthur", nombre: "Arthur", nombreCompleto: "Arthur", instituto: "Manshine Academy", edad: 19, dorsal: 8, posicion: "MC", posicionSecundaria: "MCD", grl: 78, altura: "183cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 76, sho: 70, pas: 80, dri: 78, def: 74, phy: 76 } },
    { id: "mc_damon", nombre: "Damon", nombreCompleto: "Damon", instituto: "Manshine Academy", edad: 18, dorsal: 2, posicion: "MC", posicionSecundaria: "MCO", grl: 77, altura: "181cm", pierna: "Derecha", nacionalidad: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", equipo: "Manshine City", liga: "English Manshine League", stats: { pac: 78, sho: 72, pas: 78, dri: 77, def: 68, phy: 72 } }],
  re_al: [    { id: "leonardo_luna", nombre: "Leonardo Luna", nombreCompleto: "Leonardo Luna", apodo: "El Vástago de La Real", instituto: "Profesional", edad: 27, dorsal: 9, posicion: "DC", posicionSecundaria: "MCO", grl: 97, altura: "185cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", foto: "https://static.wikia.nocookie.net/bluelock/images/b/b4/Leonardo_Luna.png/revision/latest?cb=20250918023157&path-prefix=es", stats: { pac: 93, sho: 97, pas: 90, dri: 95, def: 62, phy: 91 } },
    { id: "itoshi_sae", nombre: "Sae Itoshi", nombreCompleto: "Sae Itoshi", apodo: "Prodigio", instituto: "Re Al Youth", edad: 18, dorsal: 10, posicion: "MCO", posicionSecundaria: "MC", grl: 94, altura: "180cm", pierna: "Izquierda", nacionalidad: "Japón", bandera: "🇯🇵", equipo: "Re Al", liga: "Liga Neo Egotísta", valor: 300000000, foto: "https://static.wikia.nocookie.net/bluelock/images/f/f3/Sae_Itoshi.png/revision/latest?cb=20230313015205&path-prefix=es", stats: { pac: 88, sho: 87, pas: 98, dri: 96, def: 72, phy: 76 } },
    { id: "gonzalo_real", nombre: "Gonzalo", nombreCompleto: "Gonzalo", instituto: "Re Al Youth", edad: 19, dorsal: 11, posicion: "DC", posicionSecundaria: "ED", grl: 81, altura: "183cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 84, sho: 82, pas: 75, dri: 81, def: 50, phy: 78 } },
    { id: "real_valdes", nombre: "Valdés", nombreCompleto: "Valdés", instituto: "Re Al Youth", edad: 20, dorsal: 1, posicion: "POR", grl: 75, altura: "192cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: {"div":84,"han":82,"kic":52,"ref":80,"spd":72,"pos":78} },
    { id: "real_sergio", nombre: "Sergio", nombreCompleto: "Sergio", instituto: "Re Al Youth", edad: 19, dorsal: 2, posicion: "DFC", grl: 83, altura: "187cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 76, sho: 55, pas: 70, dri: 65, def: 85, phy: 86 } },
    { id: "real_marcelo", nombre: "Marcelo", nombreCompleto: "Marcelo", instituto: "Re Al Youth", edad: 19, dorsal: 3, posicion: "LI", posicionSecundaria: "CAD", grl: 81, altura: "176cm", pierna: "Izquierda", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 86, sho: 68, pas: 80, dri: 84, def: 75, phy: 74 } },
    { id: "real_fernando", nombre: "Fernando", nombreCompleto: "Fernando", instituto: "Re Al Youth", edad: 20, dorsal: 4, posicion: "DFC", grl: 80, altura: "189cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 74, sho: 48, pas: 68, dri: 62, def: 83, phy: 84 } },
    { id: "real_hugo", nombre: "Hugo", nombreCompleto: "Hugo", instituto: "Re Al Youth", edad: 19, dorsal: 5, posicion: "MCD", grl: 81, altura: "184cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 75, sho: 66, pas: 82, dri: 76, def: 82, phy: 83 } },
    { id: "real_isco", nombre: "Isco", nombreCompleto: "Isco", instituto: "Re Al Youth", edad: 18, dorsal: 6, posicion: "MC", posicionSecundaria: "MCO", grl: 80, altura: "175cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 78, sho: 74, pas: 85, dri: 87, def: 60, phy: 70 } },
    { id: "real_marco", nombre: "Marco", nombreCompleto: "Marco", instituto: "Re Al Youth", edad: 19, dorsal: 7, posicion: "ED", posicionSecundaria: "EI", grl: 81, altura: "180cm", pierna: "Izquierda", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 87, sho: 80, pas: 78, dri: 83, def: 52, phy: 72 } },
    { id: "real_dani", nombre: "Dani", nombreCompleto: "Dani", instituto: "Re Al Youth", edad: 19, dorsal: 8, posicion: "LD", posicionSecundaria: "CAD", grl: 80, altura: "173cm", pierna: "Derecha", nacionalidad: "España", bandera: "🇪🇸", equipo: "Re Al", liga: "Liga Neo Egotísta", stats: { pac: 88, sho: 62, pas: 76, dri: 79, def: 78, phy: 75 } }],
  fc_barcha: [
    {"id":"lavinho","nombre":"Lavinho","instituto":"Profesional","edad":29,"dorsal":11,"posicion":"DC","grl":98,"nacionalidad":"Brasil","bandera":"🇧🇷","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":92,"sho":97,"pas":94,"dri":98,"def":48,"phy":90}},
    {"id":"bachira_fcb","nombre":"Meguru Bachira","instituto":"Instituto Namikaze","edad":18,"dorsal":10,"posicion":"MI","posicionSecundaria":"EI/LI","grl":78,"altura":"176cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","foto":"https://static.wikia.nocookie.net/bluelock/images/f/f5/Meguru_Bachira.png/revision/latest?cb=20250607233204&path-prefix=es","stats":{"pac":86,"sho":78,"pas":88,"dri":97,"def":48,"phy":68}},
    {"id":"eita_otoya","nombre":"Eita Otoya","apodo":"El Ninja","instituto":"Kanau Academy","edad":17,"dorsal":13,"posicion":"ED","posicionSecundaria":"LD","grl":77,"altura":"177cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":63000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/2/23/Eita_Otoya.png/revision/latest?cb=20260421174352&path-prefix=es","stats":{"pac":92,"sho":84,"pas":79,"dri":88,"def":48,"phy":73}},
    {"id":"teru_kitsunezato","nombre":"Teru Kitsunezato","apodo":"Kitsune","instituto":"Seisho Academy","edad":19,"dorsal":9,"posicion":"ED","grl":77,"altura":"181cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":4000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/2/26/Teru_Kitsunezato.png/revision/latest?cb=20230311203615&path-prefix=es","stats":{"pac":87,"sho":80,"pas":78,"dri":83,"def":50,"phy":68}},
    {"id":"miroku_darai","nombre":"Miroku Darai","apodo":"Buda Golazo","instituto":"Universidad de Jishinomiya","edad":19,"dorsal":16,"posicion":"LI","grl":80,"altura":"176cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":15000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/45/Miroku_Darai.png/revision/latest?cb=20230311230455&path-prefix=es","stats":{"pac":78,"sho":68,"pas":78,"dri":76,"def":84,"phy":82}},
    {"id":"haru_hayate","nombre":"Haru Hayate","instituto":"Barcha Academy","edad":19,"dorsal":7,"posicion":"MCD","grl":81,"altura":"186cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":20000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/49/Haru_Hayate.png/revision/latest?cb=20250105112133&path-prefix=es","stats":{"pac":80,"sho":74,"pas":85,"dri":82,"def":76,"phy":78}},
    {"id":"ignacio_lara","nombre":"Ignacio Lara","instituto":"Barcha Youth","edad":18,"dorsal":3,"posicion":"LI","grl":81,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":60,"pas":78,"dri":80,"def":77,"phy":73}},
    {"id":"barcha_npc_01","nombre":"Miguel Rodriguez","dorsal":1,"posicion":"DFC","grl":59,"edad":19,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 59, "sho": 42, "pas": 57, "dri": 52, "def": 74, "phy": 70}},
    {"id":"barcha_npc_02","nombre":"Alejandro Martinez","dorsal":2,"posicion":"LD","grl":62,"edad":20,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 58, "def": 73, "phy": 68}},
    {"id":"barcha_npc_03","nombre":"Javier Lopez","dorsal":3,"posicion":"LI","grl":62,"edad":21,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 46, "pas": 61, "dri": 59, "def": 74, "phy": 69}},
    {"id":"barcha_npc_04","nombre":"Pablo Gonzalez","dorsal":4,"posicion":"MCD","grl":66,"edad":18,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 55, "pas": 70, "dri": 63, "def": 73, "phy": 70}},
    {"id":"barcha_npc_05","nombre":"Sergio Hernandez","dorsal":5,"posicion":"MC","grl":67,"edad":19,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 64, "pas": 74, "dri": 69, "def": 63, "phy": 64}},
    {"id":"barcha_npc_06","nombre":"Rafael Perez","dorsal":17,"posicion":"MCO","grl":68,"edad":20,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 72, "pas": 77, "dri": 75, "def": 55, "phy": 59}},
    {"id":"barcha_npc_07","nombre":"Daniel Sanchez","dorsal":7,"posicion":"MI","grl":69,"edad":21,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 68, "sho": 66, "pas": 76, "dri": 71, "def": 65, "phy": 66}},
    {"id":"barcha_npc_08","nombre":"Alvaro Ramirez","dorsal":8,"posicion":"EI","grl":61,"edad":18,"nacionalidad":"España","bandera":"🇪🇸","equipo":"FC Barcha","liga":"Liga Neo Egotísta","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"aiki_himizu","nombre":"Aiki Himizu","apodo":"Genio de las mentiras","instituto":"Desconocido","edad":18,"dorsal":77,"posicion":"DC","grl":64,"altura":"178cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":7000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/7/74/Aiki_Himizu.png/revision/latest?cb=20250730070209&path-prefix=es","stats":{"pac":75,"sho":72,"pas":65,"dri":74,"def":35,"phy":68}},
    {"id":"shizuka_haiji","nombre":"Shizuka Haiji","instituto":"Desconocido","edad":18,"dorsal":19,"posicion":"DC","grl":58,"altura":"180cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":6000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/9/9d/Shizuka_Haiji.png/revision/latest?cb=20250823183400&path-prefix=es","stats":{"pac":62,"sho":60,"pas":48,"dri":62,"def":40,"phy":69}},
    {"id":"tetsu_sokura","nombre":"Tetsu Sokura","instituto":"Desconocido","edad":18,"dorsal":20,"posicion":"DC","grl":58,"altura":"180cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":2200000,"foto":"https://static.wikia.nocookie.net/bluelock/images/d/d8/Tetsu_Sokura.png/revision/latest?cb=20250812202046&path-prefix=es","stats":{"pac":66,"sho":63,"pas":48,"dri":62,"def":42,"phy":67}},
    {"id":"itsuki_wakatsuki","nombre":"Itsuki Wakatsuki","instituto":"Desconocido","edad":19,"dorsal":6,"posicion":"MCD","grl":80,"altura":"178cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"FC Barcha","liga":"Liga Neo Egotísta","valor":40000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/0/04/Tatsuki_Wakatsuki.png/revision/latest?cb=20230311205229&path-prefix=es","stats":{"pac":80,"sho":68,"pas":84,"dri":78,"def":87,"phy":85}}
  ],
  ubers_fc: [
    {"id":"marc_snuffy","nombre":"Marc Snuffy","instituto":"Profesional","edad":35,"dorsal":11,"posicion":"MCO","grl":97,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":88,"sho":95,"pas":96,"dri":91,"def":82,"phy":92}},
    {"id":"don_lorenzo","nombre":"Don Lorenzo","instituto":"Ubers Youth","edad":19,"dorsal":2,"posicion":"DFC","grl":94,"nacionalidad":"España","bandera":"🇪🇸","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac":86,"sho":70,"pas":88,"dri":92,"def":97,"phy":89}},
    {"id":"barou_ubers","nombre":"Shouei Barou","apodo":"El Rey","instituto":"Instituto Akudo","edad":18,"dorsal":10,"posicion":"DC","posicionSecundaria":"EI","grl":77,"altura":"187cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","foto":"https://static.wikia.nocookie.net/bluelock/images/3/3d/Shouei_Barou_Peinado.jpg/revision/latest?cb=20250812195648&path-prefix=es","stats":{"pac":85,"sho":94,"pas":61,"dri":88,"def":45,"phy":91}},
    {"id":"oliver_aiku","nombre":"Oliver Aiku","instituto":"Ubers Youth","edad":19,"dorsal":23,"posicion":"DFC","grl":88,"altura":"190cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":60000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/f/fc/Oliver_Aiku.png/revision/latest?cb=20230307140536&path-prefix=es","stats":{"pac":80,"sho":72,"pas":82,"dri":78,"def":91,"phy":88}},
    {"id":"ikki_niko","nombre":"Ikki Niko","instituto":"Academia Wasurenagusa Gakuen","edad":15,"dorsal":4,"posicion":"DFC","posicionSec":"MCD","grl":67,"altura":"173cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","foto":"https://static.wikia.nocookie.net/bluelock/images/a/a4/Ikki_Niko.png/revision/latest?cb=20250824231754&path-prefix=es","stats":{"pac":62,"sho":50,"pas":78,"dri":68,"def":81,"phy":65}},
    {"id":"jyubei_aryu","nombre":"Jyubei Aryu","instituto":"Instituto Gokou","edad":18,"dorsal":17,"posicion":"DFC","grl":80,"altura":"195cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":45000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/40/Jyubei_Aryu.png/revision/latest?cb=20230307140523&path-prefix=es","stats":{"pac":76,"sho":72,"pas":70,"dri":73,"def":87,"phy":89}},
    {"id":"shuuto_sendou","nombre":"Shuuto Sendou","apodo":"Hiena","instituto":"Ubers Youth","edad":18,"dorsal":18,"posicion":"MCO","posicionSecundaria":"DC","grl":82,"altura":"181cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":37000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/a/a2/Shuto_Sendou.png/revision/latest?cb=20230307140613&path-prefix=es","stats":{"pac":80,"sho":84,"pas":76,"dri":79,"def":52,"phy":80}},
    {"id":"gen_fukaku","nombre":"Gen Fukaku","instituto":"Universidad Ryutsu Keizai","edad":19,"dorsal":50,"posicion":"POR","grl":77,"altura":"191cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":28000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/44/Gen_Fukaku.png/revision/latest?cb=20250105112733&path-prefix=es","stats":{"div":86,"han":85,"kic":54,"ref":84,"spd":74,"pos":80}},
    {"id":"ubers_npc_01","nombre":"Lorenzo Russo","dorsal":1,"posicion":"LI","grl":60,"edad":19,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 56, "def": 71, "phy": 66}},
    {"id":"ubers_npc_02","nombre":"Andrea Ferrari","dorsal":24,"posicion":"MCD","grl":63,"edad":20,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 60, "sho": 52, "pas": 67, "dri": 60, "def": 70, "phy": 67}},
    {"id":"ubers_npc_03","nombre":"Alessandro Esposito","dorsal":3,"posicion":"MC","grl":64,"edad":21,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 61, "pas": 71, "dri": 66, "def": 60, "phy": 61}},
    {"id":"ubers_npc_04","nombre":"Francesco Bianchi","dorsal":4,"posicion":"MCO","grl":64,"edad":18,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 64, "sho": 69, "pas": 74, "dri": 72, "def": 52, "phy": 56}},
    {"id":"ubers_npc_05","nombre":"Matteo Romano","dorsal":5,"posicion":"MI","grl":66,"edad":19,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 65, "sho": 63, "pas": 73, "dri": 68, "def": 62, "phy": 63}},
    {"id":"ubers_npc_06","nombre":"Luca Colombo","dorsal":6,"posicion":"EI","grl":66,"edad":20,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 76, "sho": 69, "pas": 69, "dri": 74, "def": 51, "phy": 58}},
    {"id":"ubers_npc_07","nombre":"Giovanni Ricci","dorsal":7,"posicion":"ED","grl":60,"edad":21,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"ubers_npc_08","nombre":"Riccardo Marino","dorsal":8,"posicion":"DC","grl":63,"edad":18,"nacionalidad":"Italia","bandera":"🇮🇹","equipo":"Ubers FC","liga":"Liga Neo Egotísta","stats":{"pac": 66, "sho": 73, "pas": 59, "dri": 64, "def": 51, "phy": 66}},
    {"id":"kyohei_shiguma","nombre":"Kyohei Shiguma","apodo":"El Titán de Kagoshima","instituto":"Academia Ryuunosu","edad":18,"dorsal":55,"posicion":"DC","grl":65,"altura":"192cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":3700000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/46/Kyohei_Shiguma.png/revision/latest?cb=20230307140643&path-prefix=es","stats":{"pac":68,"sho":71,"pas":58,"dri":62,"def":45,"phy":81}},
    {"id":"shingen_tanaka","nombre":"Shingen Tanaka","instituto":"Desconocido","edad":18,"dorsal":5,"posicion":"DC","grl":59,"altura":"179cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":2500000,"foto":"https://static.wikia.nocookie.net/bluelock/images/e/e4/Shingen_Tanaka.png/revision/latest?cb=20230307140656&path-prefix=es","stats":{"pac":65,"sho":63,"pas":44,"dri":59,"def":42,"phy":72}},
    {"id":"yukio_ishikari","nombre":"Yukio Ishikari","instituto":"Desconocido","edad":18,"dorsal":13,"posicion":"DC","grl":61,"altura":"200cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":2900000,"foto":"https://static.wikia.nocookie.net/bluelock/images/0/01/Yukio_Ishikari.png/revision/latest?cb=20230307140628&path-prefix=es","stats":{"pac":60,"sho":77,"pas":45,"dri":60,"def":46,"phy":80}},
    {"id":"pablo_cavasoz","nombre":"Pablo Cavasoz","apodo":"Pecas de niño","instituto":"Profesional","edad":23,"dorsal":21,"posicion":"DC","grl":84,"altura":"177cm","pierna":"Derecha","nacionalidad":"Argentina","bandera":"🇦🇷","equipo":"Ubers FC","liga":"Liga Neo Egotísta","valor":250000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/8/87/Pablo_Cavasoz.png/revision/latest?cb=20230308202439&path-prefix=es","stats":{"pac":88,"sho":97,"pas":90,"dri":90,"def":55,"phy":82}}
  ],
  paris_x_gen: [
    {"id":"julian_loki","nombre":"Julian Loki","apodo":"Dios Velocista","instituto":"Profesional","edad":17,"dorsal":10,"posicion":"DC","grl":96,"altura":"178cm","pierna":"Derecha","nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","foto":"https://static.wikia.nocookie.net/bluelock/images/2/21/Julian_Loki.png/revision/latest?cb=20230308202312&path-prefix=es","stats":{"pac":95,"sho":96,"pas":88,"dri":93,"def":55,"phy":88}},
    {"id":"rin_pxg","nombre":"Rin Itoshi","apodo":"Prodigio","instituto":"Junior Youth","edad":16,"dorsal":9,"posicion":"DC","grl":86,"altura":"186cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":240000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/1/12/Rin_Itoshi.png/revision/latest?cb=20230313015001&path-prefix=es","stats":{"pac":89,"sho":96,"pas":90,"dri":93,"def":68,"phy":84}},
    {"id":"ryusei_shidou","nombre":"Ryusei Shidou","instituto":"Junior Youth","edad":18,"dorsal":99,"posicion":"DC","posicionSecundaria":"ED","grl":79,"altura":"185cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":160000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/f/fb/Ryusei_Shidou.png/revision/latest?cb=20230313022736&path-prefix=es","stats":{"pac":90,"sho":95,"pas":72,"dri":86,"def":40,"phy":91}},
    {"id":"tabito_karasu","nombre":"Tabito Karasu","apodo":"Cuervo","instituto":"PXG Youth","edad":18,"dorsal":27,"posicion":"MCD","grl":81,"altura":"183cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":55000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/4/4b/Tabito_Karasu.png/revision/latest?cb=20230313014332&path-prefix=es","stats":{"pac":78,"sho":74,"pas":83,"dri":86,"def":82,"phy":84}},
    {"id":"charles_chevalier","nombre":"Charles Chevalier","instituto":"PXG Youth","edad":15,"dorsal":18,"posicion":"MCO","grl":88,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac":84,"sho":76,"pas":96,"dri":90,"def":58,"phy":68}},
    {"id":"aoshi_tokimitsu","nombre":"Aoshi Tokimitsu","instituto":"Instituto Daruma Higashi","edad":18,"dorsal":20,"posicion":"MI","posicionSecundaria":"MCD","grl":78,"altura":"183cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":22000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/b/b4/Aoshi_Tokimitsu.png/revision/latest?cb=20230312205720&path-prefix=es","stats":{"pac":85,"sho":74,"pas":72,"dri":78,"def":68,"phy":94}},
    {"id":"zantetsu_tsurugi","nombre":"Zantetsu Tsurugi","instituto":"Instituto Rakosute","edad":17,"dorsal":11,"posicion":"ED","grl":81,"altura":"187cm","pierna":"Izquierda","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":33000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/3/39/Zantetsu_Tsurugi.png/revision/latest?cb=20230313003935&path-prefix=es","stats":{"pac":94,"sho":82,"pas":68,"dri":80,"def":45,"phy":77}},
    {"id":"nijiro_nanase","nombre":"Nijiro Nanase","instituto":"PXG Youth","edad":16,"dorsal":77,"posicion":"EI","grl":73,"altura":"176cm","pierna":"Ambas","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":25000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/8/86/Nijiro_Nanase.png/revision/latest?cb=20250824233020&path-prefix=es","stats":{"pac":80,"sho":68,"pas":79,"dri":75,"def":66,"phy":70}},
    {"id":"pxg_npc_01","nombre":"Hugo Bernard","dorsal":1,"posicion":"MCD","grl":61,"edad":19,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 58, "sho": 50, "pas": 65, "dri": 58, "def": 68, "phy": 65}},
    {"id":"pxg_npc_02","nombre":"Louis Dubois","dorsal":2,"posicion":"MC","grl":62,"edad":20,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}},
    {"id":"pxg_npc_03","nombre":"Leo Thomas","dorsal":3,"posicion":"MCO","grl":62,"edad":21,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 62, "sho": 67, "pas": 72, "dri": 70, "def": 50, "phy": 54}},
    {"id":"pxg_npc_04","nombre":"Paul Robert","dorsal":4,"posicion":"MI","grl":64,"edad":18,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 63, "sho": 61, "pas": 71, "dri": 66, "def": 60, "phy": 61}},
    {"id":"pxg_npc_05","nombre":"Nathan Richard","dorsal":5,"posicion":"EI","grl":64,"edad":19,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 74, "sho": 67, "pas": 67, "dri": 72, "def": 49, "phy": 56}},
    {"id":"pxg_npc_06","nombre":"Tom Petit","dorsal":6,"posicion":"ED","grl":65,"edad":20,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 75, "sho": 68, "pas": 68, "dri": 73, "def": 50, "phy": 57}},
    {"id":"pxg_npc_08","nombre":"Maxime Leroy","dorsal":16,"posicion":"SD","grl":61,"edad":18,"nacionalidad":"Francia","bandera":"🇫🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","stats":{"pac": 64, "sho": 67, "pas": 61, "dri": 64, "def": 47, "phy": 62}},
    {"id":"akira_endoji","nombre":"Akira Endoji","instituto":"Desconocido","edad":18,"dorsal":59,"posicion":"DC","grl":65,"altura":"175cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":3800000,"foto":"https://static.wikia.nocookie.net/bluelock/images/1/19/Akira_Endoji.png/revision/latest?cb=20250823183443&path-prefix=es","stats":{"pac":70,"sho":73,"pas":60,"dri":66,"def":42,"phy":78}},
    {"id":"haruhiko_yuzu","nombre":"Haruhiko Yuzu","instituto":"Desconocido","edad":18,"dorsal":98,"posicion":"DC","grl":63,"altura":"179cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":3200000,"foto":"https://static.wikia.nocookie.net/bluelock/images/b/bc/Haruhiko_Yuzu.png/revision/latest?cb=20230311004758&path-prefix=es","stats":{"pac":72,"sho":70,"pas":64,"dri":68,"def":38,"phy":71}},
    {"id":"dada_silva","nombre":"Dada Silva","apodo":"El Tanque","instituto":"Profesional","edad":28,"dorsal":7,"posicion":"DC","grl":81,"altura":"196cm","pierna":"Derecha","nacionalidad":"Brasil","bandera":"🇧🇷","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":240000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/7/71/Dada_Silva.png/revision/latest?cb=20230308202420&path-prefix=es","stats":{"pac":90,"sho":94,"pas":68,"dri":82,"def":56,"phy":98}},
    {"id":"kento_chou","nombre":"Kento Chou","apodo":"Maniquí","instituto":"Desconocido","edad":19,"dorsal":8,"posicion":"EI","grl":73,"altura":"193cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Paris X Gen","liga":"Liga Neo Egotísta","valor":18000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/a/a9/Kento_Chou.png/revision/latest?cb=20230311003411&path-prefix=es","stats":{"pac":86,"sho":78,"pas":72,"dri":80,"def":38,"phy":82}}
  ],
  topspur_fc: [
    {"id":"topspur_daniel","nombre":"Daniel Whitmore","instituto":"Topspur Academy","edad":27,"dorsal":1,"posicion":"POR","grl":72,"altura":"191cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":20000000,"stats":{"div":80,"han":78,"kic":58,"ref":80,"spd":60,"pos":78}},
    {"id":"topspur_arakawa","nombre":"Yuto Arakawa","instituto":"Instituto Katagiri","edad":22,"dorsal":2,"posicion":"LD","grl":76,"altura":"175cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":34000000,"stats":{"pac":90,"sho":60,"pas":76,"dri":78,"def":76,"phy":78}},
    {"id":"topspur_banks","nombre":"Oliver Banks","instituto":"Topspur Academy","edad":25,"dorsal":3,"posicion":"LI","grl":78,"altura":"180cm","pierna":"Izquierda","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":38000000,"stats":{"pac":88,"sho":62,"pas":78,"dri":80,"def":78,"phy":80}},
    {"id":"topspur_reid","nombre":"Marcus Reid","instituto":"Topspur Academy","edad":26,"dorsal":4,"posicion":"DFC","grl":72,"altura":"189cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":24000000,"stats":{"pac":76,"sho":48,"pas":70,"dri":62,"def":88,"phy":90}},
    {"id":"topspur_kurosawa","nombre":"Hajime Kurosawa","instituto":"Academia Shinshin","edad":23,"dorsal":5,"posicion":"DFC","grl":72,"altura":"187cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":22000000,"stats":{"pac":74,"sho":50,"pas":72,"dri":64,"def":86,"phy":88}},
    {"id":"topspur_foster","nombre":"Callum Foster","instituto":"Topspur Academy","edad":24,"dorsal":6,"posicion":"MCD","grl":76,"altura":"185cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":32000000,"stats":{"pac":76,"sho":60,"pas":78,"dri":70,"def":84,"phy":88}},
    {"id":"topspur_mizuhara","nombre":"Kaito Mizuhara","instituto":"Instituto Arata","edad":20,"dorsal":7,"posicion":"ED","grl":77,"altura":"174cm","pierna":"Izquierda","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":42000000,"stats":{"pac":94,"sho":82,"pas":78,"dri":88,"def":42,"phy":76}},
    {"id":"topspur_hamilton","nombre":"Tyler Hamilton","instituto":"Topspur Academy","edad":23,"dorsal":8,"posicion":"MC","grl":79,"altura":"182cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":45000000,"stats":{"pac":84,"sho":72,"pas":84,"dri":78,"def":72,"phy":86}},
    {"id":"adam_blake","nombre":"Adam Blake","apodo":"Adicto al Gol","instituto":"Profesional","edad":26,"dorsal":10,"posicion":"DC","grl":84,"altura":"190cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":250000000,"foto":"https://static.wikia.nocookie.net/bluelock/images/d/d4/Adam_Blake.png/revision/latest?cb=20250106122510&path-prefix=es","stats":{"pac":93,"sho":97,"pas":75,"dri":88,"def":55,"phy":96}},
    {"id":"topspur_sawamura","nombre":"Riku Sawamura","instituto":"Instituto Furusawa","edad":21,"dorsal":23,"posicion":"MCO","grl":79,"altura":"178cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":55000000,"stats":{"pac":82,"sho":78,"pas":92,"dri":87,"def":54,"phy":80}},
    {"id":"topspur_davenport","nombre":"Leo Davenport","instituto":"Topspur Academy","edad":21,"dorsal":11,"posicion":"EI","grl":75,"altura":"176cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":35000000,"stats":{"pac":92,"sho":80,"pas":78,"dri":84,"def":40,"phy":76}},
    {"id":"topspur_takahashi","nombre":"Ren Takahashi","instituto":"Instituto Himawari","edad":20,"dorsal":12,"posicion":"LI","grl":66,"altura":"177cm","pierna":"Izquierda","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":10000000,"stats":{"pac":82,"sho":52,"pas":66,"dri":68,"def":64,"phy":66}},
    {"id":"topspur_ashworth","nombre":"George Ashworth","instituto":"Topspur Academy","edad":23,"dorsal":13,"posicion":"POR","grl":61,"altura":"190cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":6000000,"stats":{"div":66,"han":64,"kic":52,"ref":66,"spd":54,"pos":64}},
    {"id":"topspur_kitamura","nombre":"Sora Kitamura","instituto":"Instituto Sakurazaka","edad":19,"dorsal":14,"posicion":"LD","grl":65,"altura":"172cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":9000000,"stats":{"pac":84,"sho":50,"pas":64,"dri":66,"def":62,"phy":64}},
    {"id":"topspur_brooks","nombre":"Nathan Brooks","instituto":"Topspur Academy","edad":22,"dorsal":15,"posicion":"DFC","grl":62,"altura":"188cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":7000000,"stats":{"pac":68,"sho":42,"pas":58,"dri":54,"def":74,"phy":78}},
    {"id":"topspur_holloway","nombre":"James Holloway","instituto":"Topspur Academy","edad":24,"dorsal":16,"posicion":"DFC","grl":62,"altura":"190cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":6000000,"stats":{"pac":66,"sho":44,"pas":56,"dri":52,"def":76,"phy":76}},
    {"id":"topspur_whitfield","nombre":"Sam Whitfield","instituto":"Topspur Academy","edad":23,"dorsal":17,"posicion":"MCD","grl":67,"altura":"184cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":11000000,"stats":{"pac":68,"sho":50,"pas":68,"dri":62,"def":74,"phy":78}},
    {"id":"topspur_oneill","nombre":"Charlie O'Neill","instituto":"Topspur Academy","edad":22,"dorsal":18,"posicion":"MC","grl":70,"altura":"181cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":14000000,"stats":{"pac":74,"sho":62,"pas":76,"dri":70,"def":62,"phy":74}},
    {"id":"topspur_tanabe","nombre":"Aoi Tanabe","instituto":"Academia Nadeshiko","edad":20,"dorsal":19,"posicion":"MCO","grl":68,"altura":"173cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":12000000,"stats":{"pac":72,"sho":66,"pas":80,"dri":74,"def":48,"phy":66}},
    {"id":"topspur_nakamura","nombre":"Haruto Nakamura","instituto":"Instituto Kirigamine","edad":19,"dorsal":20,"posicion":"EI","grl":65,"altura":"170cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":9000000,"stats":{"pac":86,"sho":68,"pas":66,"dri":74,"def":34,"phy":60}},
    {"id":"topspur_sinclair","nombre":"Owen Sinclair","instituto":"Topspur Academy","edad":21,"dorsal":21,"posicion":"DC","grl":66,"altura":"186cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":10000000,"stats":{"pac":74,"sho":78,"pas":60,"dri":70,"def":36,"phy":78}},
    {"id":"topspur_ridley","nombre":"Jack Ridley","instituto":"Topspur Academy","edad":20,"dorsal":22,"posicion":"ED","grl":65,"altura":"175cm","pierna":"Derecha","nacionalidad":"Inglaterra","bandera":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","equipo":"Topspur FC","liga":"Liga Neo Egotísta","valor":8000000,"stats":{"pac":86,"sho":70,"pas":64,"dri":72,"def":34,"phy":62}}
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
    {"id":"dortmund_npc_13","nombre":"Leon Wagner","dorsal":13,"posicion":"POR","grl":64,"edad":19,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"div":73,"han":71,"kic":48,"ref":68,"spd":58,"pos":66}},
    {"id":"dortmund_npc_14","nombre":"Maximilian Becker","dorsal":14,"posicion":"DFC","grl":61,"edad":20,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"dortmund_npc_15","nombre":"Jonas Hoffmann","dorsal":15,"posicion":"LD","grl":64,"edad":21,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 60, "def": 75, "phy": 70}},
    {"id":"dortmund_npc_16","nombre":"Timo Koch","dorsal":16,"posicion":"LI","grl":64,"edad":18,"nacionalidad":"Alemania","bandera":"🇩🇪","equipo":"Berserk Dortmund","liga":"Liga Neo Egotísta","stats":{"pac": 68, "sho": 48, "pas": 63, "dri": 61, "def": 76, "phy": 71}}
  ],
  ichinan_hs: [
    {"id":"tomonari_tada","nombre":"Tomonari Tada","instituto":"Instituto Ichinan","edad":16,"dorsal":10,"posicion":"DC","grl":68,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Ichinan","liga":"Liga Nacional de Institutos","stats":{"pac":72,"sho":70,"pas":65,"dri":68,"def":55,"phy":74}},
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
    {"id":"ryosuke_kira","nombre":"Ryosuke Kira","instituto":"Instituto Matsukaze Kokuou","edad":17,"dorsal":10,"posicion":"DC","grl":72,"altura":"181cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/b/b1/Ryosuke_Kira.png/revision/latest?cb=20231116062546&path-prefix=es","stats":{"pac":76,"sho":78,"pas":68,"dri":74,"def":50,"phy":78}},
    {"id":"shohei_inaba","nombre":"Shohei Inaba","instituto":"Instituto Matsukaze Kokuou","edad":17,"dorsal":7,"posicion":"MC","grl":70,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","stats":{"pac":72,"sho":68,"pas":76,"dri":70,"def":62,"phy":70}},
    {"id":"imamura","nombre":"Yudai Imamura","instituto":"Instituto Matsukaze Kokuou","edad":18,"dorsal":7,"posicion":"DC","grl":63,"altura":"178cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Matsukaze Kokuou","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/2/2e/Yudai_Imamura.png/revision/latest?cb=20231116062530&path-prefix=es","stats":{"pac":84,"sho":65,"pas":62,"dri":70,"def":40,"phy":58}},
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
    {"id":"kuon","nombre":"Wataru Kuon","instituto":"Instituto Kitsunezaka","edad":18,"dorsal":4,"posicion":"DC","posicionSecundaria":"MCO","grl":71,"altura":"185cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/e/ed/Wataru_Kuon.png/revision/latest?cb=20231112051630&path-prefix=es","stats":{"pac":70,"sho":72,"pas":74,"dri":65,"def":58,"phy":84}},
    {"id":"kitsunezaka_npc_01","nombre":"Yuta Yamamoto","dorsal":1,"posicion":"MC","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"kitsunezaka_npc_02","nombre":"Daiki Nakamura","dorsal":2,"posicion":"MCO","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 65, "pas": 70, "dri": 68, "def": 48, "phy": 52}},
    {"id":"kitsunezaka_npc_03","nombre":"Sho Sato","dorsal":3,"posicion":"MI","grl":62,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}},
    {"id":"kitsunezaka_npc_04","nombre":"Kaito Kobayashi","dorsal":4,"posicion":"EI","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 72, "sho": 65, "pas": 65, "dri": 70, "def": 47, "phy": 54}},
    {"id":"kitsunezaka_npc_05","nombre":"Takuya Kato","dorsal":5,"posicion":"ED","grl":63,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 73, "sho": 66, "pas": 66, "dri": 71, "def": 48, "phy": 55}},
    {"id":"kitsunezaka_npc_06","nombre":"Hiroshi Yoshida","dorsal":6,"posicion":"DC","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 70, "pas": 56, "dri": 61, "def": 48, "phy": 63}},
    {"id":"kitsunezaka_npc_07","nombre":"Takeshi Yamada","dorsal":7,"posicion":"SD","grl":61,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 67, "pas": 61, "dri": 64, "def": 47, "phy": 62}},
    {"id":"kitsunezaka_npc_08","nombre":"Kenji Tanaka","dorsal":8,"posicion":"CAD","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 45, "pas": 60, "dri": 57, "def": 70, "phy": 65}},
    {"id":"kitsunezaka_npc_09","nombre":"Shota Suzuki","dorsal":9,"posicion":"POR","grl":62,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"div":71,"han":69,"kic":47,"ref":66,"spd":56,"pos":64}},
    {"id":"kitsunezaka_npc_10","nombre":"Ryo Takahashi","dorsal":10,"posicion":"DFC","grl":59,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Kitsunezaka","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 42, "pas": 57, "dri": 52, "def": 74, "phy": 70}}
  ],
  kanau_academy: [
    {"id":"naruhaya","nombre":"Asahi Naruhaya","instituto":"Academia Kanau","edad":15,"dorsal":11,"posicion":"DC","grl":64,"altura":"168cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/8/89/Asahi_Naruhaya.png/revision/latest?cb=20231116040409&path-prefix=es","stats":{"pac":82,"sho":64,"pas":65,"dri":74,"def":45,"phy":55}},
    {"id":"kanau_npc_01","nombre":"Daiki Nakamura","dorsal":1,"posicion":"MCO","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 63, "pas": 68, "dri": 66, "def": 46, "phy": 50}},
    {"id":"kanau_npc_02","nombre":"Sho Sato","dorsal":2,"posicion":"MI","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"kanau_npc_03","nombre":"Kaito Kobayashi","dorsal":3,"posicion":"EI","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"kanau_npc_04","nombre":"Takuya Kato","dorsal":4,"posicion":"ED","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"kanau_npc_05","nombre":"Hiroshi Yoshida","dorsal":5,"posicion":"DC","grl":64,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"kanau_npc_06","nombre":"Takeshi Yamada","dorsal":6,"posicion":"SD","grl":59,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 65, "pas": 59, "dri": 62, "def": 45, "phy": 60}},
    {"id":"kanau_npc_07","nombre":"Kenji Tanaka","dorsal":7,"posicion":"CAD","grl":58,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 55, "def": 68, "phy": 63}},
    {"id":"kanau_npc_08","nombre":"Shota Suzuki","dorsal":8,"posicion":"POR","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"div":69,"han":67,"kic":46,"ref":64,"spd":54,"pos":62}},
    {"id":"kanau_npc_09","nombre":"Ryo Takahashi","dorsal":9,"posicion":"DFC","grl":57,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 57, "sho": 40, "pas": 55, "dri": 50, "def": 72, "phy": 68}},
    {"id":"kanau_npc_10","nombre":"Yuta Watanabe","dorsal":10,"posicion":"LD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Academia Kanau","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 43, "pas": 58, "dri": 56, "def": 71, "phy": 66}}
  ],
  gunma_hs: [
    {"id":"iemon","nombre":"Okuhito Iemon","instituto":"Instituto Motoki","edad":18,"dorsal":1,"posicion":"POR","posicionSecundaria":"DC","grl":69,"altura":"187cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/8/83/Okuhito_Iemon.png/revision/latest?cb=20231116062515&path-prefix=es","stats":{"div":68,"han":70,"kic":72,"ref":67,"spd":65,"pos":71}},
    {"id":"gunma_npc_01","nombre":"Sho Sato","dorsal":1,"posicion":"MI","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 57, "pas": 67, "dri": 62, "def": 56, "phy": 57}},
    {"id":"gunma_npc_02","nombre":"Kaito Kobayashi","dorsal":2,"posicion":"EI","grl":60,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"gunma_npc_03","nombre":"Takuya Kato","dorsal":3,"posicion":"ED","grl":61,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"gunma_npc_04","nombre":"Hiroshi Yoshida","dorsal":4,"posicion":"DC","grl":64,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"gunma_npc_05","nombre":"Takeshi Yamada","dorsal":5,"posicion":"SD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 66, "pas": 60, "dri": 63, "def": 46, "phy": 61}},
    {"id":"gunma_npc_06","nombre":"Kenji Tanaka","dorsal":6,"posicion":"CAD","grl":59,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 56, "def": 69, "phy": 64}},
    {"id":"gunma_npc_07","nombre":"Shota Suzuki","dorsal":7,"posicion":"POR","grl":58,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"div":64,"han":64,"kic":45,"ref":62,"spd":55,"pos":60}},
    {"id":"gunma_npc_08","nombre":"Ryo Takahashi","dorsal":8,"posicion":"DFC","grl":58,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 41, "pas": 56, "dri": 51, "def": 73, "phy": 69}},
    {"id":"gunma_npc_09","nombre":"Yuta Watanabe","dorsal":9,"posicion":"LD","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 64, "sho": 44, "pas": 59, "dri": 57, "def": 72, "phy": 67}},
    {"id":"gunma_npc_10","nombre":"Daiki Ito","dorsal":10,"posicion":"LI","grl":56,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Gunma","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 40, "pas": 55, "dri": 53, "def": 68, "phy": 63}}
  ],
  saitama_hs: [
    {"id":"saitama_npc_01","nombre":"Kaito Kobayashi","dorsal":1,"posicion":"EI","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 70, "sho": 63, "pas": 63, "dri": 68, "def": 45, "phy": 52}},
    {"id":"saitama_npc_02","nombre":"Takuya Kato","dorsal":2,"posicion":"ED","grl":61,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 71, "sho": 64, "pas": 64, "dri": 69, "def": 46, "phy": 53}},
    {"id":"saitama_npc_03","nombre":"Hiroshi Yoshida","dorsal":3,"posicion":"DC","grl":64,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 74, "pas": 60, "dri": 65, "def": 52, "phy": 67}},
    {"id":"saitama_npc_04","nombre":"Takeshi Yamada","dorsal":4,"posicion":"SD","grl":65,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 68, "sho": 71, "pas": 65, "dri": 68, "def": 51, "phy": 66}},
    {"id":"saitama_npc_05","nombre":"Kenji Tanaka","dorsal":5,"posicion":"CAD","grl":64,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"pac": 69, "sho": 49, "pas": 64, "dri": 61, "def": 74, "phy": 69}},
    {"id":"saitama_npc_06","nombre":"Shota Suzuki","dorsal":6,"posicion":"POR","grl":58,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Saitama","liga":"Liga Nacional de Institutos","stats":{"div":64,"han":64,"kic":45,"ref":62,"spd":55,"pos":60}},
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
    {"id":"senshindo_npc_05","nombre":"Shota Suzuki","dorsal":5,"posicion":"POR","grl":60,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"div":67,"han":66,"kic":46,"ref":64,"spd":56,"pos":62}},
    {"id":"senshindo_npc_06","nombre":"Ryo Takahashi","dorsal":6,"posicion":"DFC","grl":61,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"senshindo_npc_07","nombre":"Yuta Watanabe","dorsal":7,"posicion":"LD","grl":56,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 60, "sho": 40, "pas": 55, "dri": 53, "def": 68, "phy": 63}},
    {"id":"senshindo_npc_08","nombre":"Daiki Ito","dorsal":8,"posicion":"LI","grl":58,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 41, "pas": 56, "dri": 54, "def": 69, "phy": 64}},
    {"id":"senshindo_npc_09","nombre":"Sho Yamamoto","dorsal":9,"posicion":"MCD","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 58, "sho": 50, "pas": 65, "dri": 58, "def": 68, "phy": 65}},
    {"id":"senshindo_npc_10","nombre":"Kaito Nakamura","dorsal":10,"posicion":"MC","grl":62,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Senshindo","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 59, "pas": 69, "dri": 64, "def": 58, "phy": 59}}
  ],
  aomori_hs: [
    {"id":"ryo_nameoka","nombre":"Ryo Nameoka","instituto":"Instituto Aomori Dadada","edad":18,"dorsal":10,"posicion":"DC","grl":70,"altura":"187cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/b/bd/Ryo_Nameoka.png/revision/latest?cb=20231117174214&path-prefix=es","stats":{"pac":74,"sho":72,"pas":66,"dri":70,"def":55,"phy":76}},
    {"id":"aomori_npc_01","nombre":"Hiroshi Yoshida","dorsal":1,"posicion":"DC","grl":62,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 65, "sho": 72, "pas": 58, "dri": 63, "def": 50, "phy": 65}},
    {"id":"aomori_npc_02","nombre":"Takeshi Yamada","dorsal":2,"posicion":"SD","grl":63,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 66, "sho": 69, "pas": 63, "dri": 66, "def": 49, "phy": 64}},
    {"id":"aomori_npc_03","nombre":"Kenji Tanaka","dorsal":3,"posicion":"CAD","grl":62,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 67, "sho": 47, "pas": 62, "dri": 59, "def": 72, "phy": 67}},
    {"id":"aomori_npc_04","nombre":"Shota Suzuki","dorsal":4,"posicion":"POR","grl":60,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"div":67,"han":66,"kic":46,"ref":64,"spd":56,"pos":62}},
    {"id":"aomori_npc_05","nombre":"Ryo Takahashi","dorsal":5,"posicion":"DFC","grl":61,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 44, "pas": 59, "dri": 54, "def": 76, "phy": 72}},
    {"id":"aomori_npc_06","nombre":"Yuta Watanabe","dorsal":6,"posicion":"LD","grl":58,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 61, "sho": 41, "pas": 56, "dri": 54, "def": 69, "phy": 64}},
    {"id":"aomori_npc_07","nombre":"Daiki Ito","dorsal":7,"posicion":"LI","grl":58,"edad":19,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 42, "pas": 57, "dri": 55, "def": 70, "phy": 65}},
    {"id":"aomori_npc_08","nombre":"Sho Yamamoto","dorsal":8,"posicion":"MCD","grl":62,"edad":16,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 59, "sho": 51, "pas": 66, "dri": 59, "def": 69, "phy": 66}},
    {"id":"aomori_npc_09","nombre":"Kaito Nakamura","dorsal":9,"posicion":"MC","grl":63,"edad":17,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 62, "sho": 60, "pas": 70, "dri": 65, "def": 59, "phy": 60}},
    {"id":"aomori_npc_10","nombre":"Takuya Sato","dorsal":10,"posicion":"MCO","grl":64,"edad":18,"nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Aomori Dadada","liga":"Liga Nacional de Institutos","stats":{"pac": 63, "sho": 68, "pas": 73, "dri": 71, "def": 51, "phy": 55}}
  ],
  sennou_hs: [
    {"id":"hibiki_ookawa","nombre":"Hibiki Ookawa","instituto":"Instituto Sennou","edad":18,"dorsal":9,"posicion":"DC","grl":61,"altura":"177cm","pierna":"Derecha","nacionalidad":"Japón","bandera":"🇯🇵","equipo":"Instituto Sennou","liga":"Liga Nacional de Institutos","foto":"https://static.wikia.nocookie.net/bluelock/images/3/33/Hibiki_Ookawa.png/revision/latest?cb=20231111015430&path-prefix=es","stats":{"pac":71,"sho":78,"pas":58,"dri":63,"def":25,"phy":72},"estamina":100}
  ]
};

const DIVISIONES = {
  primera: {
    nombre: "LIGA NEL",
    equipos: [
      "bastard_munchen", "berserk_dortmund", "rpb", "vesper_bremen",
      "bach_leverkuzen", "eintracht_frankfort", "schalcke_04", "stuttgard",
      "bach_glachbach", "hoffenheym", "union_berlyn", "sc_freyburg",
      "maynz_05", "koln_fc", "augsburg_fc", "hamburg_sv", "paderborn_fc", "elversberg_sv",
      "manshine_city", "arsenali", "manshine_united", "chelblue", "livers", "miraclester", "brightneon", "topspur_fc",
      "fc_barcha", "re_al", "chicorid",
      "ubers_fc", "ac_milanoia", "napolin",
      "paris_x_gen", "marseille", "monao",
      "fc_portimion", "ajajax"
    ]
  },
  segunda: {
    nombre: "LIGA PRO",
    equipos: [
      "urawa_rubies", "kawasaki_breakerz", "roar_kumamoto", "dosankoro_sapporo",
      "sunflame_hiroshima", "gohonzon_kamakura", "jubilee_iwata",
      "omiya_arcadia", "v_phiten_nagasaki", "bachi_united_chiba",
      "nandat", "start_reims", "kroningen", "aaa_holanda", "shin_troy", "celticoss", "palmaro", "bolos"
    ]
  },
  institutos: {
    nombre: "TORNEO NACIONAL DE INSTITUTOS",
    equipos: [
      "ichinan_hs", "matsukaze_hs", "kitsunezaka_hs", "kanau_academy",
      "gunma_hs", "saitama_hs", "senshindo_hs", "aomori_hs", "sennou_hs"
    ]
  }
};

// ===== CONFIGURACIÓN DE PAÍSES, LIGAS Y EQUIPOS (sincronizado con NEO_EQUIPOS) =====
// NEO_LIGAS y CONFIG_PAISES se definen más abajo, tras NEO_EQUIPOS.


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

// ===== PERSONAJES DEL MODO HISTORIA (no son jugadores) — fotos para sus diálogos =====
const PERSONAJES_HISTORIA = {
  "Yasumori Houichi": "https://static.wikia.nocookie.net/bluelock/images/e/e1/Yasumori_Houichi.png/revision/latest?cb=20230305185350&path-prefix=es",
  "Hirotoshi Buratsuta": "https://static.wikia.nocookie.net/bluelock/images/9/9e/Hirotoshi_Buratsuta.png/revision/latest?cb=20230305185303&path-prefix=es",
  "Jinpachi Ego": "https://static.wikia.nocookie.net/bluelock/images/3/3b/Jinpachi_Ego.png/revision/latest?cb=20230304231234&path-prefix=es",
  "Anri Teieri": "https://static.wikia.nocookie.net/bluelock/images/1/15/Anri_Teieri.png/revision/latest?cb=20230305185524&path-prefix=es"
};

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
  kroningen: { p: "#2E7D32", s: "#ECEFF1", forma: "home" },
  bach_leverkuzen: { p: "#E32221", s: "#1A1A1A", forma: "escudo" },
  eintracht_frankfort: { p: "#1A1A1A", s: "#E32221", forma: "estrella" },
  schalcke_04: { p: "#004D9D", s: "#FFFFFF", forma: "cuadro" },
  stuttgard: { p: "#E32221", s: "#FFFFFF", forma: "circulo" },
  bach_glachbach: { p: "#0A7A3D", s: "#1A1A1A", forma: "rombo" },
  hoffenheym: { p: "#1469B0", s: "#FFFFFF", forma: "hexagono" },
  union_berlyn: { p: "#C8102E", s: "#F5F5F5", forma: "triangulo" },
  sc_freyburg: { p: "#C8102E", s: "#FFFFFF", forma: "octagono" },
  maynz_05: { p: "#C8102E", s: "#F5F5DC", forma: "pentagono" },
  koln_fc: { p: "#C8102E", s: "#FFFFFF", forma: "home" },
  augsburg_fc: { p: "#E32221", s: "#0A7A3D", forma: "gota" },
  hamburg_sv: { p: "#0F2C5C", s: "#FFFFFF", forma: "escudo" },
  paderborn_fc: { p: "#005CA9", s: "#1A1A1A", forma: "chevron" },
  elversberg_sv: { p: "#1A1A1A", s: "#C8102E", forma: "estrella" },
  brightneon: { p: "#0057B7", s: "#FFD700", forma: "estrella" },
  start_reims: { p: "#B32B2B", s: "#F4E9DC", forma: "escudo" },
  aaa_holanda: { p: "#005CA9", s: "#E8112D", forma: "triangulo" },
  shin_troy: { p: "#C8102E", s: "#F5C800", forma: "rombo" },
  omiya_arcadia: { p: "#1B3A6B", s: "#7BC4FF", forma: "circulo" },
  v_phiten_nagasaki: { p: "#6A1B9A", s: "#FF8A00", forma: "hexagono" },
  bachi_united_chiba: { p: "#00897B", s: "#FFD54F", forma: "cuadro" }
};

// ===== GENERADOR DE PLANTILLAS ALEATORIAS PARA EQUIPOS INCOMPLETOS =====

const BANDERAS_PAIS = {
  "Afganistán": "🇦🇫", "Albania": "🇦🇱", "Alemania": "🇩🇪", "Andorra": "🇦🇩", "Angola": "🇦🇴",
  "Antigua y Barbuda": "🇦🇬", "Arabia Saudita": "🇸🇦", "Argelia": "🇩🇿", "Argentina": "🇦🇷", "Armenia": "🇦🇲",
  "Australia": "🇦🇺", "Austria": "🇦🇹", "Azerbaiyán": "🇦🇿", "Bahamas": "🇧🇸", "Bangladés": "🇧🇩",
  "Barbados": "🇧🇧", "Baréin": "🇧🇭", "Bélgica": "🇧🇪", "Belice": "🇧🇿", "Benín": "🇧🇯",
  "Bielorrusia": "🇧🇾", "Birmania": "🇲🇲", "Bolivia": "🇧🇴", "Bosnia y Herzegovina": "🇧🇦", "Botsuana": "🇧🇼",
  "Brasil": "🇧🇷", "Brunéi": "🇧🇳", "Bulgaria": "🇧🇬", "Burkina Faso": "🇧🇫", "Burundi": "🇧🇮",
  "Bután": "🇧🇹", "Cabo Verde": "🇨🇻", "Camboya": "🇰🇭", "Camerún": "🇨🇲", "Canadá": "🇨🇦",
  "Catar": "🇶🇦", "Chad": "🇹🇩", "Chile": "🇨🇱", "China": "🇨🇳", "Chipre": "🇨🇾",
  "Colombia": "🇨🇴", "Comoras": "🇰🇲", "Congo": "🇨🇬", "Corea del Norte": "🇰🇵", "Corea del Sur": "🇰🇷",
  "Costa de Marfil": "🇨🇮", "Costa Rica": "🇨🇷", "Croacia": "🇭🇷", "Cuba": "🇨🇺", "Dinamarca": "🇩🇰",
  "Dominica": "🇩🇲", "Ecuador": "🇪🇨", "Egipto": "🇪🇬", "El Salvador": "🇸🇻", "Emiratos Árabes Unidos": "🇦🇪",
  "Eritrea": "🇪🇷", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Eslovaquia": "🇸🇰", "Eslovenia": "🇸🇮", "España": "🇪🇸",
  "Estados Unidos": "🇺🇸", "Estonia": "🇪🇪", "Etiopía": "🇪🇹", "Filipinas": "🇵🇭", "Finlandia": "🇫🇮",
  "Fiyi": "🇫🇯", "Francia": "🇫🇷", "Gabón": "🇬🇦", "Gambia": "🇬🇲", "Georgia": "🇬🇪",
  "Ghana": "🇬🇭", "Granada": "🇬🇩", "Grecia": "🇬🇷", "Guatemala": "🇬🇹", "Guinea": "🇬🇳",
  "Guinea-Bisáu": "🇬🇼", "Guinea Ecuatorial": "🇬🇶", "Guyana": "🇬🇾", "Haití": "🇭🇹", "Holanda": "🇳🇱",
  "Honduras": "🇭🇳", "Hungría": "🇭🇺", "India": "🇮🇳", "Indonesia": "🇮🇩", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Irak": "🇮🇶", "Irán": "🇮🇷", "Irlanda": "🇮🇪", "Islandia": "🇮🇸", "Islas Marshall": "🇲🇭",
  "Islas Salomón": "🇸🇧", "Israel": "🇮🇱", "Italia": "🇮🇹", "Jamaica": "🇯🇲", "Japón": "🇯🇵",
  "Jordania": "🇯🇴", "Kazajistán": "🇰🇿", "Kenia": "🇰🇪", "Kirguistán": "🇰🇬", "Kiribati": "🇰🇮",
  "Kuwait": "🇰🇼", "Laos": "🇱🇦", "Lesoto": "🇱🇸", "Letonia": "🇱🇻", "Líbano": "🇱🇧",
  "Liberia": "🇱🇷", "Libia": "🇱🇾", "Liechtenstein": "🇱🇮", "Lituania": "🇱🇹", "Luxemburgo": "🇱🇺",
  "Madagascar": "🇲🇬", "Malasia": "🇲🇾", "Malaui": "🇲🇼", "Maldivas": "🇲🇻", "Malí": "🇲🇱",
  "Malta": "🇲🇹", "Marruecos": "🇲🇦", "Mauricio": "🇲🇺", "Mauritania": "🇲🇷", "México": "🇲🇽",
  "Micronesia": "🇫🇲", "Moldavia": "🇲🇩", "Mónaco": "🇲🇨", "Mongolia": "🇲🇳", "Montenegro": "🇲🇪",
  "Mozambique": "🇲🇿", "Namibia": "🇳🇦", "Nauru": "🇳🇷", "Nepal": "🇳🇵", "Nicaragua": "🇳🇮",
  "Níger": "🇳🇪", "Nigeria": "🇳🇬", "Noruega": "🇳🇴", "Nueva Zelanda": "🇳🇿", "Omán": "🇴🇲",
  "Pakistán": "🇵🇰", "Palaos": "🇵🇼", "Panamá": "🇵🇦", "Papúa Nueva Guinea": "🇵🇬",
  "Paraguay": "🇵🇾", "Perú": "🇵🇪", "Polonia": "🇵🇱", "Portugal": "🇵🇹", "Reino Unido": "🇬🇧",
  "República Checa": "🇨🇿", "República Democrática del Congo": "🇨🇩", "República Dominicana": "🇩🇴", "Ruanda": "🇷🇼", "Rumania": "🇷🇴",
  "Rusia": "🇷🇺", "Samoa": "🇼🇸", "San Cristóbal y Nieves": "🇰🇳", "San Marino": "🇸🇲", "San Vicente y las Granadinas": "🇻🇨",
  "Santa Lucía": "🇱🇨", "Santo Tomé y Príncipe": "🇸🇹", "Senegal": "🇸🇳", "Serbia": "🇷🇸", "Seychelles": "🇸🇨",
  "Sierra Leona": "🇸🇱", "Singapur": "🇸🇬", "Siria": "🇸🇾", "Somalia": "🇸🇴", "Sri Lanka": "🇱🇰",
  "Suazilandia": "🇸🇿", "Sudáfrica": "🇿🇦", "Sudán": "🇸🇩", "Sudán del Sur": "🇸🇸", "Suecia": "🇸🇪",
  "Suiza": "🇨🇭", "Surinam": "🇸🇷", "Tailandia": "🇹🇭", "Taiwán": "🇹🇼", "Tanzania": "🇹🇿",
  "Tayikistán": "🇹🇯", "Timor Oriental": "🇹🇱", "Togo": "🇹🇬", "Tonga": "🇹🇴", "Trinidad y Tobago": "🇹🇹",
  "Túnez": "🇹🇳", "Turkmenistán": "🇹🇲", "Turquía": "🇹🇷", "Tuvalu": "🇹🇻", "Ucrania": "🇺🇦",
  "Uganda": "🇺🇬", "Uruguay": "🇺🇾", "Uzbekistán": "🇺🇿", "Vanuatu": "🇻🇺", "Vaticano": "🇻🇦",
  "Venezuela": "🇻🇪", "Vietnam": "🇻🇳", "Yibuti": "🇩🇯", "Yemen": "🇾🇪", "Zambia": "🇿🇲", "Zimbabue": "🇿🇼"
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
   Escocia: { nombres: ["Callum","Finlay","Angus","Ewan","Fraser","Rory","Logan","Liam","Lewis","Kyle","Ross","Craig"], apellidos: ["MacDonald","Campbell","Stewart","Robertson","Thomson","Anderson","Scott","Murray","MacKenzie","Reid","Marshall","Ferguson"] },
   Bélgica: { nombres: ["Arthur","Louis","Noah","Lucas","Théo","Liam","Victor","Hugo","Jules","Ethan","Nathan","Gabriel"], apellidos: ["Peeters","Janssens","Maes","Jacobs","Mertens","Willems","Claes","Goossens","Wouters","De Smet","Dupont","Dubois"] }
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
  Escocia: ["Escocia","Escocia","Escocia","Escocia","Inglaterra","Francia","Alemania"],
  Bélgica: ["Bélgica","Bélgica","Bélgica","Bélgica","Francia","Holanda","Inglaterra"]
};

const POSICIONES_POR_LINEA = [
  { pos: "POR", peso: 1 },
  { pos: "DFC", peso: 3 }, { pos: "LD", peso: 2 }, { pos: "LI", peso: 2 }, { pos: "CAD", peso: 1 }, { pos: "CAI", peso: 1 },
  { pos: "MCD", peso: 2 }, { pos: "MC", peso: 3 }, { pos: "MCO", peso: 2 }, { pos: "MI", peso: 1 }, { pos: "MD", peso: 1 },
  { pos: "EI", peso: 2 }, { pos: "ED", peso: 2 }, { pos: "DC", peso: 3 }, { pos: "SD", peso: 1 }
];

const PAIS_EQUIPO = {
  rpb: "Alemania", vesper_bremen: "Alemania",
  bach_leverkuzen: "Alemania", eintracht_frankfort: "Alemania", schalcke_04: "Alemania", stuttgard: "Alemania",
  bach_glachbach: "Alemania", hoffenheym: "Alemania", union_berlyn: "Alemania", sc_freyburg: "Alemania",
  maynz_05: "Alemania", koln_fc: "Alemania", augsburg_fc: "Alemania", hamburg_sv: "Alemania", paderborn_fc: "Alemania", elversberg_sv: "Alemania",
  arsenali: "Inglaterra", manshine_united: "Inglaterra", chelblue: "Inglaterra", livers: "Inglaterra", miraclester: "Inglaterra", brightneon: "Inglaterra",
  chicorid: "España",
  ac_milanoia: "Italia", napolin: "Italia", palmaro: "Italia", bolos: "Italia",
  marseille: "Francia", monao: "Francia", nandat: "Francia", start_reims: "Francia",
  fc_portimion: "Portugal",
  ajajax: "Holanda", kroningen: "Holanda", aaa_holanda: "Holanda",
  shin_troy: "Bélgica",
  celticoss: "Escocia",
  urawa_rubies: "Japón", kawasaki_breakerz: "Japón", roar_kumamoto: "Japón", dosankoro_sapporo: "Japón",
  sunflame_hiroshima: "Japón", gohonzon_kamakura: "Japón", jubilee_iwata: "Japón",
  omiya_arcadia: "Japón", v_phiten_nagasaki: "Japón", bachi_united_chiba: "Japón",
  ichinan_hs: "Japón", matsukaze_hs: "Japón", kitsunezaka_hs: "Japón", kanau_academy: "Japón",
  gunma_hs: "Japón", saitama_hs: "Japón", senshindo_hs: "Japón", aomori_hs: "Japón"
};

const NOMBRE_EQUIPO = {
  rpb: "RPB", vesper_bremen: "Vesper Bremen",
  bach_leverkuzen: "Balsam Leverk", eintracht_frankfort: "Eisen Frankfurt", schalcke_04: "Stahlk 04", stuttgard: "Sturmgarte",
  bach_glachbach: "Besta Glachbach", hoffenheym: "Hassheim", union_berlyn: "Urgewalt Berlin", sc_freyburg: "Frostburg SC",
  maynz_05: "Macht 05", koln_fc: "Kaiserlich FC", augsburg_fc: "Albtraum FC", hamburg_sv: "Hanseat SV", paderborn_fc: "Panzerborn FC", elversberg_sv: "Eisberg SV",
  arsenali: "Arsenali", manshine_united: "Manshine United", chelblue: "Chelblue", livers: "Livers", miraclester: "Miraclester", brightneon: "Brightneon",
  chicorid: "Chicorid",
  ac_milanoia: "AC Milanoia", napolin: "Napolin", palmaro: "Palmaro", bolos: "Bolos",
  marseille: "Marseille", monao: "Monao", nandat: "Nandat", start_reims: "Start Reims",
  fc_portimion: "FC Portimion",
  ajajax: "Ajajax", kroningen: "Kroningen", aaa_holanda: "AAA",
  shin_troy: "Shin-Troy",
  celticoss: "Celticoss",
  urawa_rubies: "Urawa Rubies", kawasaki_breakerz: "Kawasaki Breakerz", roar_kumamoto: "Roar Kumamoto", dosankoro_sapporo: "Dosankoro Sapporo",
  sunflame_hiroshima: "Sunflame Hiroshima", gohonzon_kamakura: "Gohonzon Kamakura", jubilee_iwata: "Jubilee Iwata",
  omiya_arcadia: "Omiya Arcadia", v_phiten_nagasaki: "V-Phiten Nagasaki", bachi_united_chiba: "Bachi United Chiba",
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

// Once de cada formación (para generar plantillas de 22 duplicando el once)
const FORMACIONES_ONCE = {
  "4-3-3": ["POR", "LI", "DFC", "DFC", "LD", "MCD", "MC", "MCO", "EI", "DC", "ED"],
  "4-4-2": ["POR", "LI", "DFC", "DFC", "LD", "EI", "MC", "MC", "ED", "DC", "DC"],
  "3-5-2": ["POR", "DFC", "DFC", "DFC", "LI", "MC", "MCD", "MC", "LD", "DC", "DC"],
  "4-1-4-1": ["POR", "LI", "DFC", "DFC", "LD", "MCD", "EI", "MCO", "MCO", "ED", "DC"],
  "4-2-3-1": ["POR", "LI", "DFC", "DFC", "LD", "MCD", "MCD", "EI", "MCO", "ED", "DC"],
  "3-4-3": ["POR", "DFC", "DFC", "DFC", "MI", "MC", "MC", "MD", "EI", "DC", "ED"],
  "5-2-3": ["POR", "CAD", "DFC", "DFC", "DFC", "CAI", "MCD", "MCD", "EI", "DC", "ED"],
  "4-3-1-2": ["POR", "LI", "DFC", "DFC", "LD", "MC", "MCD", "MC", "MCO", "DC", "DC"],
  "5-3-2": ["POR", "CAD", "DFC", "DFC", "DFC", "CAI", "MC", "MCD", "MC", "DC", "DC"],
  "3-4-2-1": ["POR", "DFC", "DFC", "DFC", "MI", "MC", "MC", "MD", "SD", "SD", "DC"],
  "4-2-2-2": ["POR", "LI", "DFC", "DFC", "LD", "MCD", "MCD", "MCO", "MCO", "DC", "DC"],
  "4-5-1": ["POR", "LI", "DFC", "DFC", "LD", "MI", "MC", "MCD", "MC", "MD", "DC"],
  "4-3-2-1": ["POR", "LI", "DFC", "DFC", "LD", "MCD", "MC", "MCD", "MCO", "MCO", "DC"]
};

function statsPorPosicion(pos, grl) {
  if (pos === 'POR') {
    const basePOR = { div: 65, han: 60, kic: 50, ref: 60, spd: 55, pos: 60 };
    const keysPOR = ["div", "han", "kic", "ref", "spd", "pos"];
    const statsPOR = {};
    let sumaPOR = 0;
    keysPOR.forEach(k => {
      const ruido = Math.floor(Math.random() * 15) - 7;
      statsPOR[k] = Math.max(20, Math.min(92, basePOR[k] + Math.round((grl - 60) * 0.8) + ruido));
      sumaPOR += statsPOR[k];
    });
    const grlCalcPOR = Math.round(sumaPOR / 6);
    keysPOR.forEach(k => {
      statsPOR[k] = Math.max(20, Math.min(95, statsPOR[k] + (grl - grlCalcPOR)));
    });
    return statsPOR;
  }
  const base = {
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
  const formacion = (NEO_EQUIPOS && NEO_EQUIPOS.find(e => e.id === teamId))?.formation || '4-3-3';
  const once = FORMACIONES_ONCE[formacion] || FORMACIONES_ONCE['4-3-3'];
  const objetivo = once.concat(once); // 22 jugadores: 11 titulares + 11 suplentes
  const usados = new Set(actuales.map(p => p.dorsal));
  const liga = (typeof DIVISIONES !== 'undefined' && DIVISIONES.primera?.equipos?.includes(teamId))
    ? "Liga Neo Egotísta"
    : "Liga Nacional de Institutos";
  const eqInfo = (typeof NEO_EQUIPOS !== 'undefined') ? NEO_EQUIPOS.find(e => e.id === teamId) : null;
  const nombreEquipo = eqInfo?.name || NOMBRE_EQUIPO[teamId] || teamId;
  const paisEquipo = (eqInfo && eqInfo.domesticLeague && eqInfo.domesticLeague !== 'Institutos')
    ? eqInfo.domesticLeague
    : (PAIS_EQUIPO[teamId] || "Japón");
  const rangoGrl = liga === "Liga Neo Egotísta" ? [58, 72] : [50, 66];

  const falta = Math.max(0, 22 - actuales.length);

  // Contar posiciones ya cubiertas por jugadores existentes (solo las de la formación)
  const contador = {};
  objetivo.forEach(p => { contador[p] = (contador[p] || 0) + 1; });
  actuales.forEach(j => {
    if (contador[j.posicion] > 0) contador[j.posicion]--;
  });

  const nuevos = [];
  objetivo.forEach(posicion => {
    if (nuevos.length >= falta) return;
    if (contador[posicion] <= 0) return;
    const dorsal = dorsalLibre(teamId, usados);
    usados.add(dorsal);
    const nacionalidad = elegirNacionalidad(paisEquipo);
    const grl = rangoGrl[0] + Math.floor(Math.random() * (rangoGrl[1] - rangoGrl[0] + 1));
    const pies = ["Derecha", "Derecha", "Derecha", "Derecha", "Izquierda", "Izquierda", "Ambas"];
    nuevos.push({
      id: `${teamId}_npc_${dorsal}`,
      nombre: nombreAleatorio(nacionalidad),
      dorsal,
      posicion,
      grl,
      edad: 17 + Math.floor(Math.random() * 6),
      pierna: pies[Math.floor(Math.random() * pies.length)],
      nacionalidad,
      bandera: BANDERAS_PAIS[nacionalidad] || "🌍",
      equipo: nombreEquipo,
      liga,
      stats: statsPorPosicion(posicion, grl)
    });
    contador[posicion]--;
  });
  return nuevos;
}

// Inicializar estamina: 100 en todos los jugadores de la base de datos
(function inicializarEstamina() {
  Object.keys(PLANTILLAS_EQUIPO).forEach(teamId => {
    (PLANTILLAS_EQUIPO[teamId] || []).forEach(p => {
      if (typeof p.estamina !== 'number') p.estamina = 100;
      if (String(p.id).includes('_npc_') && !p.pierna) {
        const pies = ["Derecha", "Derecha", "Derecha", "Derecha", "Izquierda", "Izquierda", "Ambas"];
        p.pierna = pies[Math.floor(Math.random() * pies.length)];
      }
    });
  });
})();

// ===== CATÁLOGO DE EQUIPOS (MODO CARRERA PIRAMIDAL) =====
const NEO_EQUIPOS = [
  // 🇩🇪 Alemania (Neo Bundesliga Completa)
  { id: "bastard_munchen", name: "Bastard München", domesticLeague: "Alemania", stars: 4.5, grl: 86, budget: 7000000000, formation: "4-3-3", bandera: "🇩🇪", escudo: "assets/logos/bastard_munchen.png", players: [] },
  { id: "berserk_dortmund", name: "Berserk Dortmund", domesticLeague: "Alemania", stars: 3.5, grl: 82, budget: 5800000000, formation: "4-2-3-1", bandera: "🇩🇪", escudo: "assets/logos/berserk_dortmund.png", players: [] },
  { id: "rpb", name: "RPB", domesticLeague: "Alemania", stars: 3, grl: 80, budget: 5100000000, formation: "4-4-2", bandera: "🇩🇪", escudo: "assets/logos/rpb.png", players: [] },
  { id: "vesper_bremen", name: "Vesper Bremen", domesticLeague: "Alemania", stars: 3, grl: 77, budget: 4800000000, formation: "4-1-4-1", bandera: "🇩🇪", escudo: "assets/logos/vesper_bremen.png", players: [] },
  { id: "bach_leverkuzen", name: "Balsam Leverk", domesticLeague: "Alemania", stars: 4, grl: 83, budget: 9500000000, formation: "3-4-2-1", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "eintracht_frankfort", name: "Eisen Frankfurt", domesticLeague: "Alemania", stars: 3, grl: 79, budget: 4800000000, formation: "3-4-3", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "schalcke_04", name: "Stahlk 04", domesticLeague: "Alemania", stars: 3, grl: 78, budget: 4000000000, formation: "4-4-2", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "stuttgard", name: "Sturmgarte", domesticLeague: "Alemania", stars: 3, grl: 79, budget: 4500000000, formation: "4-2-3-1", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "bach_glachbach", name: "Besta Glachbach", domesticLeague: "Alemania", stars: 3, grl: 77, budget: 2500000000, formation: "4-3-3", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "hoffenheym", name: "Hassheim", domesticLeague: "Alemania", stars: 3, grl: 76, budget: 2800000000, formation: "3-5-2", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "union_berlyn", name: "Urgewalt Berlin", domesticLeague: "Alemania", stars: 3, grl: 76, budget: 7000000000, formation: "5-3-2", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "sc_freyburg", name: "Frostburg SC", domesticLeague: "Alemania", stars: 3, grl: 76, budget: 2200000000, formation: "4-4-2", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "maynz_05", name: "Macht 05", domesticLeague: "Alemania", stars: 2.5, grl: 75, budget: 1500000000, formation: "4-3-2-1", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "koln_fc", name: "Kaiserlich FC", domesticLeague: "Alemania", stars: 2.5, grl: 75, budget: 3500000000, formation: "4-2-3-1", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "augsburg_fc", name: "Albtraum FC", domesticLeague: "Alemania", stars: 2.5, grl: 74, budget: 900000000, formation: "4-5-1", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "hamburg_sv", name: "Hanseat SV", domesticLeague: "Alemania", stars: 2.5, grl: 75, budget: 1800000000, formation: "4-3-3", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "paderborn_fc", name: "Panzerborn FC", domesticLeague: "Alemania", stars: 2, grl: 73, budget: 700000000, formation: "4-4-2", bandera: "🇩🇪", escudo: "", players: [] },
  { id: "elversberg_sv", name: "Eisberg SV", domesticLeague: "Alemania", stars: 2, grl: 72, budget: 500000000, formation: "4-1-4-1", bandera: "🇩🇪", escudo: "", players: [] },
  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra
  { id: "manshine_city", name: "Manshine City", domesticLeague: "Inglaterra", stars: 4, grl: 85, budget: 12000000000, formation: "4-4-2", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/manshine_city.png", players: [] },
  { id: "arsenali", name: "Arsenali", domesticLeague: "Inglaterra", stars: 4, grl: 83, budget: 8200000000, formation: "4-3-3", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/arsenali.png", players: [] },
  { id: "manshine_united", name: "Manshine United", domesticLeague: "Inglaterra", stars: 3, grl: 82, budget: 9500000000, formation: "4-2-3-1", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/manshine_united.png", players: [] },
  { id: "chelblue", name: "Chelblue", domesticLeague: "Inglaterra", stars: 3, grl: 81, budget: 7000000000, formation: "4-3-3", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/chelblue.png", players: [] },
  { id: "livers", name: "Livers", domesticLeague: "Inglaterra", stars: 4, grl: 84, budget: 7800000000, formation: "4-3-3", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/livers.png", players: [] },
  { id: "miraclester", name: "Miraclester", domesticLeague: "Inglaterra", stars: 3, grl: 78, budget: 1500000000, formation: "4-4-2", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "assets/logos/miraclester.png", players: [] },
  { id: "brightneon", name: "Brightneon", domesticLeague: "Inglaterra", stars: 3, grl: 79, budget: 3500000000, formation: "4-2-3-1", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "", players: [] },
  { id: "topspur_fc", name: "Topspur FC", domesticLeague: "Inglaterra", stars: 3, grl: 80, budget: 5000000000, formation: "4-3-3", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", escudo: "", players: [] },
  // 🇪🇸 España
  { id: "fc_barcha", name: "FC Barcha", domesticLeague: "España", stars: 4, grl: 85, budget: 8500000000, formation: "4-3-3", bandera: "🇪🇸", escudo: "assets/logos/barcha.png", players: [] },
  { id: "re_al", name: "Re Al", domesticLeague: "España", stars: 4, grl: 85, budget: 11500000000, formation: "4-3-1-2", bandera: "🇪🇸", escudo: "assets/logos/real_bastard.png", players: [] },
  { id: "chicorid", name: "Chicorid", domesticLeague: "España", stars: 3, grl: 80, budget: 1200000000, formation: "4-2-3-1", bandera: "🇪🇸", escudo: "assets/logos/chicorid.png", players: [] },
  // 🇮🇹 Italia
  { id: "ubers_fc", name: "Ubers FC", domesticLeague: "Italia", stars: 4, grl: 85, budget: 9000000000, formation: "3-5-2", bandera: "🇮🇹", escudo: "assets/logos/ubers.png", players: [] },
  { id: "ac_milanoia", name: "AC Milanoia", domesticLeague: "Italia", stars: 3, grl: 80, budget: 6500000000, formation: "4-3-1-2", bandera: "🇮🇹", escudo: "assets/logos/ac_milanoia.png", players: [] },
  { id: "napolin", name: "Napolin", domesticLeague: "Italia", stars: 3, grl: 80, budget: 4500000000, formation: "4-3-3", bandera: "🇮🇹", escudo: "assets/logos/napolin.png", players: [] },
  { id: "palmaro", name: "Palmaro", domesticLeague: "Italia", stars: 3, grl: 80, budget: 900000000, formation: "5-3-2", bandera: "🇮🇹", escudo: "assets/logos/palmaro.png", players: [] },
  { id: "bolos", name: "Bolos", domesticLeague: "Italia", stars: 3, grl: 80, budget: 2000000000, formation: "3-4-2-1", bandera: "🇮🇹", escudo: "assets/logos/bolos.png", players: [] },
  // 🇫🇷 Francia
  { id: "paris_x_gen", name: "Paris X Gen", domesticLeague: "Francia", stars: 4, grl: 86, budget: 11000000000, formation: "4-2-2-2", bandera: "🇫🇷", escudo: "assets/logos/paris_x_gen.png", players: [] },
  { id: "marseille", name: "Marseille", domesticLeague: "Francia", stars: 3, grl: 80, budget: 3800000000, formation: "4-3-3", bandera: "🇫🇷", escudo: "assets/logos/marseille.png", players: [] },
  { id: "monao", name: "Monao", domesticLeague: "Francia", stars: 3, grl: 79, budget: 3000000000, formation: "3-5-2", bandera: "🇫🇷", escudo: "assets/logos/monao.png", players: [] },
  { id: "start_reims", name: "Start Reims", domesticLeague: "Francia", stars: 3, grl: 76, budget: 1400000000, formation: "4-4-2", bandera: "🇫🇷", escudo: "", players: [] },
  { id: "nandat", name: "Nandat", domesticLeague: "Francia", stars: 2.5, grl: 75, budget: 800000000, formation: "4-5-1", bandera: "🇫🇷", escudo: "assets/logos/nandat.png", players: [] },
  // 🇵🇹 Portugal
  { id: "fc_portimion", name: "FC Portimion", domesticLeague: "Portugal", stars: 3, grl: 80, budget: 2500000000, formation: "4-4-2", bandera: "🇵🇹", escudo: "assets/logos/FC Portimion.png", players: [] },
  // 🇳🇱 Holanda
  { id: "ajajax", name: "Ajajax", domesticLeague: "Holanda", stars: 3, grl: 80, budget: 2800000000, formation: "4-3-3", bandera: "🇳🇱", escudo: "assets/logos/ajajax.png", players: [] },
  { id: "kroningen", name: "Kroningen", domesticLeague: "Holanda", stars: 2, grl: 73, budget: 900000000, formation: "4-4-2", bandera: "🇳🇱", escudo: "", players: [] },
  { id: "aaa_holanda", name: "AAA", domesticLeague: "Holanda", stars: 2.5, grl: 75, budget: 500000000, formation: "4-3-3", bandera: "🇳🇱", escudo: "", players: [] },
  // 🇧🇪 Bélgica
  { id: "shin_troy", name: "Shin-Troy", domesticLeague: "Bélgica", stars: 2.5, grl: 74, budget: 750000000, formation: "4-2-3-1", bandera: "🇧🇪", escudo: "", players: [] },
  // 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia
  { id: "celticoss", name: "Celticoss", domesticLeague: "Escocia", stars: 3, grl: 80, budget: 1800000000, formation: "4-1-4-1", bandera: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", escudo: "assets/logos/celticoss.png", players: [] },
  // 🇯🇵 Japón Pro
  { id: "urawa_rubies", name: "Urawa Rubies", domesticLeague: "Japón_Pro", stars: 3, grl: 80, budget: 2200000000, formation: "4-2-3-1", bandera: "🇯🇵", escudo: "assets/logos/urawa_rubies.png", players: [] },
  { id: "kawasaki_breakerz", name: "Kawasaki Breakerz", domesticLeague: "Japón_Pro", stars: 3, grl: 80, budget: 2000000000, formation: "4-3-3", bandera: "🇯🇵", escudo: "assets/logos/kawasaki_breakerz.png", players: [] },
  { id: "roar_kumamoto", name: "Roar Kumamoto", domesticLeague: "Japón_Pro", stars: 2, grl: 73, budget: 700000000, formation: "4-4-2", bandera: "🇯🇵", escudo: "assets/logos/roar_kumamoto.png", players: [] },
  { id: "dosankoro_sapporo", name: "Dosankoro Sapporo", domesticLeague: "Japón_Pro", stars: 2, grl: 73, budget: 900000000, formation: "5-3-2", bandera: "🇯🇵", escudo: "assets/logos/dosankoro_sapporo.png", players: [] },
  { id: "sunflame_hiroshima", name: "Sunflame Hiroshima", domesticLeague: "Japón_Pro", stars: 2, grl: 73, budget: 1700000000, formation: "3-4-3", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "gohonzon_kamakura", name: "Gohonzon Kamakura", domesticLeague: "Japón_Pro", stars: 2, grl: 73, budget: 600000000, formation: "4-1-4-1", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "jubilee_iwata", name: "Jubilee Iwata", domesticLeague: "Japón_Pro", stars: 2, grl: 73, budget: 1500000000, formation: "4-4-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "omiya_arcadia", name: "Omiya Arcadia", domesticLeague: "Japón_Pro", stars: 2.5, grl: 73, budget: 1000000000, formation: "4-4-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "v_phiten_nagasaki", name: "V-Phiten Nagasaki", domesticLeague: "Japón_Pro", stars: 2, grl: 72, budget: 850000000, formation: "4-2-3-1", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "bachi_united_chiba", name: "Bachi United Chiba", domesticLeague: "Japón_Pro", stars: 2.5, grl: 73, budget: 1200000000, formation: "4-3-3", bandera: "🇯🇵", escudo: "", players: [] },
  // 🎓 Institutos
  { id: "ichinan_hs", name: "Instituto Ichinan", domesticLeague: "Institutos", stars: 2, grl: 67, budget: 0, formation: "4-4-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "matsukaze_hs", name: "Matsukaze Kokuou", domesticLeague: "Institutos", stars: 2, grl: 67, budget: 0, formation: "4-3-3", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "kitsunezaka_hs", name: "Instituto Kitsunezaka", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-2-3-1", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "kanau_academy", name: "Academia Kanau", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-4-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "gunma_hs", name: "Instituto Gunma", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-5-1", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "saitama_hs", name: "Instituto Saitama", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-3-3", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "senshindo_hs", name: "Instituto Senshindo", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-4-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "aomori_hs", name: "Aomori Dadada", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "3-5-2", bandera: "🇯🇵", escudo: "", players: [] },
  { id: "sennou_hs", name: "Instituto Sennou", domesticLeague: "Institutos", stars: 1, grl: 63, budget: 0, formation: "4-3-3", bandera: "🇯🇵", escudo: "", players: [] }
];

(function completarPlantillas() {
  if (typeof DIVISIONES === 'undefined') return;
  Object.keys(DIVISIONES).forEach(divKey => {
    (DIVISIONES[divKey].equipos || []).forEach(teamId => {
      if (!PLANTILLAS_EQUIPO[teamId]) PLANTILLAS_EQUIPO[teamId] = [];
      if (PLANTILLAS_EQUIPO[teamId].length < 22) {
        PLANTILLAS_EQUIPO[teamId] = PLANTILLAS_EQUIPO[teamId].concat(generarPlantillaCompleta(teamId));
      }
    });
  });
})();

// Derivar players desde PLANTILLAS_EQUIPO (tras completarPlantillas)
NEO_EQUIPOS.forEach(eq => {
  eq.players = (PLANTILLAS_EQUIPO[eq.id] || []).map(p => p.id);
});

// ===== CONFIGURACIÓN DE PAÍSES, LIGAS Y EQUIPOS (sincronizado con NEO_EQUIPOS) =====
const NEO_LIGAS = {
  "Inglaterra":  { name: "Neo Premier League", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra" },
  "España":      { name: "Neo Liga E", country: "🇪🇸 España" },
  "Alemania":    { name: "Neo Bundesliga", country: "🇩🇪 Alemania" },
  "Italia":      { name: "Neo Serie A", country: "🇮🇹 Italia" },
  "Francia":     { name: "Neo Ligue 1", country: "🇫🇷 Francia" },
  "Holanda":     { name: "Neo Eredivisie", country: "🇳🇱 Holanda" },
  "Portugal":    { name: "Neo Liga Portu", country: "🇵🇹 Portugal" },
  "Escocia":     { name: "Neo Scottish Liga", country: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia" },
  "Bélgica":     { name: "Neo Pro League (Bélgica)", country: "🇧🇪 Bélgica" },
  "Japón_Pro":   { name: "J-Pro League", country: "🇯🇵 Japón" },
  "Institutos":  { name: "Copa Nacional de Institutos", country: "🎓 Japón (Escolar)" }
};

// CONFIG_PAISES se construye a partir de NEO_EQUIPOS + NEO_LIGAS (una sola fuente de verdad)
// Japón_Pro e Institutos comparten país "🇯🇵 Japón" (2 ligas dentro del mismo país).
const CONFIG_PAISES = (() => {
  const agruparPais = {
    "Japón_Pro": "🇯🇵 Japón",
    "Institutos": "🇯🇵 Japón"
  };
  const paises = {};
  const guardarPais = (paisKey, bandera) => {
    if (!paises[paisKey]) {
      const nombre = paisKey.replace(bandera, '').trim();
      paises[paisKey] = { id: paisKey, nombre, bandera, ligas: {} };
    }
  };
  NEO_EQUIPOS.forEach(eq => {
    const ligaKey = eq.domesticLeague;
    const ligaInfo = NEO_LIGAS[ligaKey] || { name: ligaKey, country: ligaKey };
    const paisKey = agruparPais[ligaKey] || ligaInfo.country;
    const bandera = paisKey.split(' ')[0];
    guardarPais(paisKey, bandera);
    const nombreLiga = ligaInfo.name;
    if (!paises[paisKey].ligas[nombreLiga]) paises[paisKey].ligas[nombreLiga] = [];
    paises[paisKey].ligas[nombreLiga].push({
      id: eq.id,
      name: eq.name,
      escudo: eq.escudo,
      stars: eq.stars,
      grl: eq.grl,
      budget: eq.budget,
      formation: eq.formation,
      players: eq.players
    });
  });
  return Object.keys(paises).map(key => {
    const p = paises[key];
    return {
      id: p.id,
      nombre: p.nombre,
      bandera: p.bandera,
      ligas: Object.keys(p.ligas).map(lk => ({ nombre: lk, equipos: p.ligas[lk] }))
    };
  });
})();

// ===== VALORES DE MERCADO EN YENES (¥) PARA JUGADORES REALES =====
const VALORES_JUGADOR = {
  isagi_bm: 240000000,
  noel_noa: 850000000,
  chris_prince: 820000000,
  lavinho: 800000000,
  leonardo_luna: 780000000,
  marc_snuffy: 750000000,
  julian_loki: 720000000,
  itoshi_sae: 300000000,
  don_lorenzo: 650000000,
  michael_kaiser: 400000000,
  rin_pxg: 240000000,
  barou_ubers: 150000000,
  ryusei_shidou: 160000000,
  nagi_seishiro: 24000000,
  chigiri_mc: 90000000,
  oliver_aiku: 60000000,
  tabito_karasu: 55000000,
  charles_chevalier: 300000000,
  gagamaru_bm: 50000000,
  reo_mikage: 78000000,
  alexis_ness: 130000000,
  kunigami_bm: 66000000,
  bachira_fcb: 120000000,
  hiori_yo: 39000000,
  agi: 220000000,
  ikki_niko: 40000000,
  yukimiya_kenyu: 42000000,
  jyubei_aryu: 45000000,
  kurona_ranze: 35000000,
  real_sergio: 155000000,
  eita_otoya: 63000000,
  gen_fukaku: 28000000,
  raichi_bm: 27000000,
  benedict_grim: 40000000,
  real_valdes: 142000000,
  shuuto_sendou: 37000000,
  aoshi_tokimitsu: 22000000,
  zantetsu_tsurugi: 33000000,
  birkenstock: 30000000,
  mensah: 27000000,
  kazuma_nio: 50000000,
  gonzalo_real: 118000000,
  real_marcelo: 126000000,
  real_hugo: 120000000,
  real_marco: 130000000,
  haru_hayate: 20000000,
  ignacio_lara: 122000000,
  kiyora_jin: 26000000,
  erik_gesner: 110000000,
  mc_rook: 112000000,
  real_fernando: 108000000,
  real_isco: 116000000,
  real_dani: 114000000,
  miroku_darai: 15000000,
  ali_bm: 95000000,
  bachman: 92000000,
  ndiaye: 88000000,
  reiji_hiiragi: 11000000,
  neru_teppei: 82000000,
  igor_schneider: 80000000,
  theo_sachs: 78000000,
  hajime_nishioka: 3000000,
  mc_driver: 80000000,
  mc_arthur: 82000000,
  nijiro_nanase: 25000000,
  junichi_wanima: 74000000,
  mc_swift: 72000000,
  mc_young: 70000000,
  mc_damon: 73000000,
  teru_kitsunezato: 4000000,
  mc_busby: 68000000,
  igarashi_bm: 3000000,
  kairu_saramadara: 2400000,
  taiga_tsunzaki: 2300000,
  ryosuke_kira: 22000000,
  shohei_inaba: 45000000,
  ryo_nameoka: 9500000,
  tomonari_tada: 38000000,
  hibiki_okawa: 32000000,
  hibiki_ookawa: 18000000,
  naruhaya: 22000000,
  imamura: 4000000,
  kuon: 5000000,
  iemon: 4500000,
  aiki_himizu: 7000000,
  akira_endoji: 3800000,
  haruhiko_yuzu: 3200000,
  kyohei_shiguma: 3700000,
  shizuka_haiji: 6000000,
  shingen_tanaka: 2500000,
  tetsu_sokura: 2200000,
  yukio_ishikari: 2900000
};

// ===== ARMAS PRINCIPALES DE JUGADORES =====
const ARMAS_DATABASE = {
  ryo_nameoka: [
    { name: "Cuerpo de Acero", stats: { phy: 12 }, desc: "Utiliza su envergadura para dominar el área rival y ganar balones divididos." }
  ],
  naruhaya: [
    { name: "Movimientos sin balón", stats: { dri: 10 }, desc: "Se desliza instantáneamente en los puntos ciegos de la defensa para recibir libre de marca." }
  ],
  isagi_bm: [
    { name: "Metavisión × Flujo de Reflejos", stats: { pas: 22 }, desc: "Devora el campo con una visión periférica absoluta, anticipando el futuro del partido para rematar de primeras o interceptar el balón por puro instinto." },
    { name: "Metavisión", stats: { pas: 20 }, desc: "Recopila información constante del campo para predecir las jugadas." },
    { name: "Tiro Directo", stats: { sho: 18 }, desc: "Impacto fulminante al primer toque sin dar tiempo a la defensa." },
    { name: "Movimiento sin Balón", stats: { dri: 12 }, desc: "Se desliza de forma invisible en los puntos ciegos defensivos." },
    { name: "Tiro Zurdo Secundario", stats: { sho: 12 }, desc: "Gana un recurso de disparo con la pierna izquierda para burlar bloqueos." }
  ],
  gagamaru_bm: [
    { name: "Reacción explosiva", stats: { phy: 15 }, desc: "Estiradas fulminantes para alcanzar balones imposibles antes de que crucen la línea." },
    { name: "Flexibilidad", stats: { def: 12 }, desc: "Cuerpo elástico que se adapta a cualquier ángulo del disparo rival." }
  ],
  igarashi_bm: [
    { name: "Zambullidas", stats: { def: 12 }, desc: "Lanzamientos en barrena que anticipan el pase rival para cortar el juego en el último instante." },
    { name: "Malicia", stats: { dri: 10, def: 8 }, desc: "Faltas y provocaciones calculadas para desestabilizar al rival sin que el árbitro lo vea." }
  ],
  chigiri_mc: [
    { name: "Velocidad Increíble", stats: { pac: 15 }, desc: "Sprint puro en línea recta que deja atrás a cualquier defensa." },
    { name: "Control de Balón en Carrera", stats: { dri: 12 }, desc: "Mantiene la pelota pegada al pie sin perder un solo km/h de aceleración." },
    { name: "Disparo desde la Zona Dorada", stats: { sho: 18 }, desc: "Tiro milimétrico imparable desde su sector favorito del área izquierda." }
  ],
  raichi_bm: [
    { name: "Marcaje Individual Sexy", stats: { def: 12 }, desc: "Se pega al rival como una lapa, anulando su capacidad de pase o tiro." },
    { name: "Estamina Ilimitada", stats: { phy: 15 }, desc: "Mantiene su rendimiento físico al 100% sin importar el desgaste del partido." }
  ],
  bachira_fcb: [
    { name: "Regate del Monstruo (Flow)", stats: { dri: 20 }, desc: "Desata un estilo de regate libre e impredecible que rompe el equilibrio de cualquier defensa en el uno contra uno." },
    { name: "Regate Egocéntrico", stats: { dri: 18 }, desc: "Fintas e hiperagilidad salvaje para avanzar en solitario." },
    { name: "Pases de Fantasía", stats: { pas: 15 }, desc: "Asistencias creativas e inesperadas con cualquier parte del pie." }
  ],
  iemon: [
    { name: "Habilidad Todoterreno", stats: { pos: 10 }, desc: "Su capacidad para adaptarse a cualquier rol le otorga una colocación defensiva óptima en jugadas a balón parado." }
  ],
  kunigami_bm: [
    { name: "Cuerpo Completo Ambidiestro", stats: { sho: 20 }, desc: "Desata disparos devastadores y milimétricos con cualquiera de las dos piernas, blindado por una fuerza física inamovible." },
    { name: "Superioridad Física", stats: { phy: 18 }, desc: "Domina el juego aéreo y el choque contra los centrales rivales." },
    { name: "Disparo de Larga Distancia", stats: { sho: 15 }, desc: "Trallazos potentes desde fuera del área con una trayectoria limpia." }
  ],
  kuon: [
    { name: "Salto Vertical y Remate de Cabeza", stats: { phy: 15 }, desc: "Se eleva por encima de los defensas con un salto descomunal para clavar remates de cabeza inapelables." }
  ],
  imamura: [
    { name: "Velocidad y Agilidad", stats: { pac: 10 }, desc: "Aprovecha su ligereza y aceleración para romper la línea defensiva en sprints cortos." }
  ],
  ikki_niko: [
    { name: "Conciencia espacial", stats: { def: 5 }, desc: "Lee el espacio y anticipa los movimientos rivales para cortar el ataque." },
    { name: "Posicionamiento defensivo", stats: { phy: 6 }, desc: "Se coloca siempre en la línea correcta, compensando su físico con inteligencia." },
    { name: "Metavisión", stats: { pas: 8 }, desc: "Procesa toda la información del campo para predecir la jugada y filtrar pases letales." }
  ],
  hibiki_ookawa: [
    { name: "Super disparo", stats: { sho: 6 }, desc: "Remate demoledor y potencia de golpeo." }
  ],
  junichi_wanima: [
    { name: "Contacto visual", stats: { pas: 10 }, desc: "Detecta la intención del rival y de su compañero con una sola mirada." }
  ],
  keisuke_wanima: [
    { name: "Combinación de los Hermanos Wanima", stats: { pas: 8, pac: 4 }, desc: "Pases instantáneos y sincronía absoluta con su hermano." },
    { name: "Contacto Visual Telepático", stats: { pas: 10 }, desc: "Anticipa los movimientos de su compañero sin necesidad de mirar." }
  ],
  barou_ubers: [
    { name: "Disparo de media distancia", stats: { sho: 8, phy: 2 }, desc: "Fusila desde fuera del área con una potencia descomunal." },
    { name: "Carga", stats: { phy: 10, pac: 3 }, desc: "Usa su imponente físico para desplazar a los defensas en carrera." },
    { name: "Dribleo agresivo", stats: { dri: 6, phy: 4 }, desc: "Avanza por potencia pura destrozando el bloque defensivo." },
    { name: "Finta de corte", stats: { dri: 8, pac: 4 }, desc: "Recorte seco hacia dentro para perfilarse de cara a portería." },
    { name: "Ojo del Depredador", stats: { sho: 12, dri: 2 }, desc: "Calcula el milisegundo exacto en que el portero parpadea para tirar." }
  ],
  nagi_seishiro: [
    { name: "Control de Balón de Genio", stats: { dri: 15, sho: 4 }, desc: "Controla el balón con la naturalidad de un genio, neutralizando cualquier presión y quedándose la pelota muerta al primer toque." },
    { name: "Uso extremo del Atrape", stats: { dri: 12 }, desc: "Atrapa pases y balones imposibles con total calma, incluso en el espacio más reducido." }
  ],
  reo_mikage: [
    { name: "Destreza Equilibrada", stats: { pac: 3, sho: 3, pas: 3, dri: 3, def: 3, phy: 3 }, desc: "Su equilibrio le permite sostener un nivel competitivo estable en cada faceta del juego." },
    { name: "Estilo Camaleón", stats: { pac: 4, sho: 4, pas: 4, dri: 4, def: 4, phy: 4 }, desc: "Se adapta al instante a cualquier estilo rival, reflejando sus técnicas a un nivel superior." }
  ],
  zantetsu_tsurugi: [
    { name: "Aceleración Explosiva", stats: { pac: 15 }, desc: "Arrancada fulgurante desde parado que deja atrás a cualquier defensa." },
    { name: "Tiro Colocado", stats: { sho: 10 }, desc: "Golpeo preciso y colocado que ajusta la escuadra desde cualquier distancia." }
  ],
  aoshi_tokimitsu: [
    { name: "Cuerpo Fornido y Musculatura Absoluta", stats: { phy: 33 }, desc: "Su cuerpo imponente intimida y desplaza a cualquier rival en el cuerpo a cuerpo." },
    { name: "Carga de Ansiedad", stats: { pac: 10, def: 12 }, desc: "Imprime presión agresiva que desestabiliza al rival y acelera sus transiciones." }
  ],
  rin_pxg: [
    { name: "Tiro de Alta Precisión con Efecto Calibrado", stats: { sho: 18 }, desc: "Golpeos milimétricos con efecto imposibles de detener para el portero." },
    { name: "Ego de Destrucción Hidráulica", stats: { dri: 15, phy: 10 }, desc: "Desata su instinto destructor para romper defensas con fuerza bruta." },
    { name: "Fútbol de Marionetas (Metavisión)", stats: { def: 30 }, desc: "Lee y controla el ritmo del partido, anticipando cada movimiento rival." }
  ],
  ryusei_shidou: [
    { name: "Conciencia Espacial en el Área de Penalti", stats: { def: 18 }, desc: "Se posiciona en el punto exacto para recibir y finalizar antes que nadie." },
    { name: "Chilena y Voleas de Conclusión Extrema", stats: { sho: 17, phy: 14 }, desc: "Finaliza de chilena o volea con una explosividad que rompe cualquier bloqueo." }
  ],
  nijiro_nanase: [
    { name: "Soporte Ambidiestro de Transición", stats: { pas: 11, def: 9 }, desc: "Usa ambas piernas para filtrar pases y cubrir el espacio en las transiciones." }
  ],
  tabito_karasu: [
    { name: "Fijación y Retención Física con Brazos", stats: { phy: 14, dri: 13 }, desc: "Agarró y sostiene al rival con brazos para robar y girar con control." },
    { name: "Análisis y Desmantelado de Puntos Débiles", stats: { def: 25 }, desc: "Estudia y anula los puntos débiles del rival cortando su circuito de juego." }
  ],
  eita_otoya: [
    { name: "Pasos Sigilosos / Juego Sombra", stats: { def: 14, dri: 12 }, desc: "Se mueve en las zonas muertas del rival para aparecer donde no lo esperan." },
    { name: "Asociación en Paredes Rápidas", stats: { pas: 10 }, desc: "Combinaciones de uno-dos fulminantes que desmontan la línea defensiva." }
  ],
  kiyora_jin: [
    { name: "Tiro del Eje Rompedor / Breakdance", stats: { sho: 12, dri: 12 }, desc: "Giro de breakdance y tiro imposible de leer para la defensa." },
    { name: "Pases de Precisión en Amplitud", stats: { pas: 11 }, desc: "Abre el campo con pases largos medidos al milímetro." }
  ],
  yukimiya_kenyu: [
    { name: "Regate Callejero / Tijeras de Alta Velocidad", stats: { dri: 16, pac: 10 }, desc: "Tijeras velocísimas que desequilibran a cualquier marcador en el uno contra uno." },
    { name: "Tiro de Espada (Tiro con Efecto Descendente)", stats: { sho: 13 }, desc: "Disparo con efecto descendente que se cuela por la escuadra." }
  ],
  kurona_ranze: [
    { name: "Giros de Agilidad Extrema (Planetas)", stats: { dri: 25 }, desc: "Gira alrededor del rival con movimientos circulares imposibles de seguir." },
    { name: "Asociación en Corto a Alta Velocidad", stats: { pas: 13, pac: 11 }, desc: "Combinaciones veloces en espacios cortos para desbordar en banda." }
  ],
  hiori_yo: [
    { name: "Pase Curvado de Alta Velocidad (Metavisión)", stats: { pas: 18, def: 14 }, desc: "Lanza pases curvados vertiginosos con una lectura de juego superior." },
    { name: "Giro de Control Reflejo", stats: { dri: 24 }, desc: "Controla y gira con el balón en un solo movimiento, esquivando la presión." }
  ],
  hajime_nishioka: [
    { name: "Regate de Conducción Corta", stats: { dri: 24 }, desc: "Conduce el balón pegado al pie con fintas cortas que desarman al rival." }
  ],
  reiji_hiiragi: [
    { name: "Trampa de Desviación / Amortiguación Directa", stats: { dri: 12, pas: 10 }, desc: "Amortigua y desvía el balón en un toque para filtrar el pase definitivo." }
  ],
  jyubei_aryu: [
    { name: "Alcance de Extremidades Largas", stats: { def: 25 }, desc: "Sus piernas larguísimas le permiten interceptar balones inalcanzables." },
    { name: "Dominio Aéreo Absoluto", stats: { phy: 15, sho: 14 }, desc: "Gana todos los duelos aéreos con su envergadura y golpea de cabeza con precisión." }
  ],
  yukio_ishikari: [
    { name: "Punto de Impacto más Alto (Estatura Extrema)", stats: { phy: 13, sho: 12 }, desc: "Su estatura descomunal le da el punto de impacto más alto en cada balón aéreo." }
  ]
};

// ===== AGENTES LIBRES (jugadores gratis para el Mercado) =====
const AGENTES_LIBRES = [
  {
    id: "ashime_suzuki",
    nombre: "Ashime Suzuki",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 2,
    posicion: "LI",
    grl: 55,
    altura: "178cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/9/9c/Ashime_Suzuki.png/revision/latest?cb=20231111002157&path-prefix=es",
    stats: { pac: 68, dri: 52, sho: 38, def: 60, pas: 54, phy: 58 }
  },
  {
    id: "fuma_rokkaku",
    nombre: "Fuma Rokkaku",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 8,
    posicion: "MC",
    grl: 57,
    altura: "185cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/f/f1/Fuma_Rokkaku.png/revision/latest?cb=20231111004408&path-prefix=es",
    stats: { pac: 64, dri: 53, sho: 45, def: 62, pas: 58, phy: 60 }
  },
  {
    id: "iori_sato",
    nombre: "Iori Sato",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 5,
    posicion: "POR",
    grl: 52,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5400000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/0/05/Iori_Sato.png/revision/latest?cb=20231111004709&path-prefix=es",
    stats: { div: 55, han: 52, kic: 50, ref: 58, spd: 45, pos: 54 }
  },
  {
    id: "hyuga_koshiba",
    nombre: "Hyuga Koshiba",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 11,
    posicion: "MI",
    grl: 55,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/9/93/Hyuga_Koshiba.png/revision/latest?cb=20231111005340&path-prefix=es",
    stats: { pac: 69, dri: 55, sho: 42, def: 52, pas: 57, phy: 56 }
  },
  {
    id: "juraki_ito",
    nombre: "Juraki Ito",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 1,
    posicion: "LD",
    grl: 55,
    altura: "189cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/2/2a/Juraki_Ito.png/revision/latest?cb=20231111010206&path-prefix=es",
    stats: { pac: 66, dri: 51, sho: 35, def: 61, pas: 53, phy: 65 }
  },
  {
    id: "mareto_takeyama",
    nombre: "Mareto Takeyama",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 10,
    posicion: "MD",
    grl: 56,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/3/30/Mareto_Takeyama.png/revision/latest?cb=20231111011230&path-prefix=es",
    stats: { pac: 70, dri: 56, sho: 44, def: 50, pas: 58, phy: 58 }
  },
  {
    id: "shinichi_konan",
    nombre: "Shinichi Konan",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 4,
    posicion: "DFC",
    grl: 53,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/a/af/Shinichi_Konan.png/revision/latest?cb=20231111012525&path-prefix=es",
    stats: { pac: 60, dri: 48, sho: 35, def: 62, pas: 52, phy: 63 }
  },
  {
    id: "soshi_kagura",
    nombre: "Soshi Kagura",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 6,
    posicion: "MC",
    grl: 57,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5600000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/e/e6/Soshi_Kagura.png/revision/latest?cb=20231111013141&path-prefix=es",
    stats: { pac: 63, dri: 54, sho: 40, def: 61, pas: 59, phy: 62 }
  },
  {
    id: "tobio_madoka",
    nombre: "Tobio Madoka",
    instituto: "Desconocido",
    edad: 16,
    dorsal: 3,
    posicion: "DFC",
    grl: 53,
    altura: "—",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/1/1f/Tobio_Madoka.png/revision/latest?cb=20231111014320&path-prefix=es",
    stats: { pac: 61, dri: 47, sho: 34, def: 63, pas: 51, phy: 64 }
  },
  {
    id: "yuza_dokomo",
    nombre: "Yuza Dokomo",
    apodo: "El Guardián",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 1,
    posicion: "POR",
    grl: 52,
    altura: "182cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 5000000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/e/e8/Yuza_Dokomo.png/revision/latest?cb=20231112012820&path-prefix=es",
    stats: { div: 48, han: 54, kic: 45, ref: 56, spd: 48, pos: 51 }
  },
  {
    id: "chihiro_ezaki",
    nombre: "Chihiro Ezaki",
    apodo: "Lateral Defensivo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 2,
    posicion: "LD",
    grl: 58,
    altura: "174cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4100000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/f/f8/Chihiro_Ezaki.png/revision/latest?cb=20231112021042&path-prefix=es",
    stats: { pac: 63, sho: 35, pas: 52, dri: 46, def: 62, phy: 58 }
  },
  {
    id: "yawara_banku",
    nombre: "Yawara Banku",
    apodo: "Central Corpulento",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 3,
    posicion: "DFC",
    grl: 60,
    altura: "185cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/5/5c/Yawara_Banku.png/revision/latest?cb=20231112032632&path-prefix=es",
    stats: { pac: 54, sho: 40, pas: 46, dri: 40, def: 64, phy: 70 }
  },
  {
    id: "tsukoteru_eiyu",
    nombre: "Tsukoteru Eiyu",
    apodo: "Fuerza Cuerpo a Cuerpo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 4,
    posicion: "DFC",
    grl: 59,
    altura: "179cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4300000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/9/9c/Tsukoteru_Eiyu.png/revision/latest?cb=20231112030622&path-prefix=es",
    stats: { pac: 56, sho: 38, pas: 48, dri: 42, def: 61, phy: 68 }
  },
  {
    id: "daiya_morinaga",
    nombre: "Daiya Morinaga",
    apodo: "Salida desde el Fondo",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 5,
    posicion: "LI",
    grl: 57,
    altura: "183cm",
    pierna: "Izquierda",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4400000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/1/16/Daiya_Morinaga.png/revision/latest?cb=20231112020506&path-prefix=es",
    stats: { pac: 60, sho: 42, pas: 61, dri: 50, def: 58, phy: 56 }
  },
  {
    id: "ruto_kora",
    nombre: "Ruto Kora",
    apodo: "El Cinco Clásico",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 6,
    posicion: "MCD",
    posicionSecundaria: "MC",
    grl: 57,
    altura: "175cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4600000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/9/9e/Ruto_Kora.png/revision/latest?cb=20231112020104&path-prefix=es",
    stats: { pac: 59, sho: 45, pas: 58, dri: 48, def: 63, phy: 60 }
  },
  {
    id: "kosei_otsuka",
    nombre: "Kosei Otsuka",
    apodo: "Box-to-Box",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 7,
    posicion: "MC",
    grl: 58,
    altura: "178cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/7/76/Kosei_Otsuka.png/revision/latest?cb=20231112015632&path-prefix=es",
    stats: { pac: 66, sho: 51, pas: 59, dri: 54, def: 53, phy: 61 }
  },
  {
    id: "burai_daido",
    nombre: "Burai Daido",
    apodo: "El Enganche",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 8,
    posicion: "MCO",
    posicionSecundaria: "MC",
    grl: 56,
    altura: "180cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4800000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/9/9f/Burai_Daido.png/revision/latest?cb=20231112014441&path-prefix=es",
    stats: { pac: 62, sho: 55, pas: 63, dri: 58, def: 40, phy: 52 }
  },
  {
    id: "rian_sanga",
    nombre: "Rian Sanga",
    apodo: "Extremo Asistidor",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 9,
    posicion: "ED",
    posicionSecundaria: "MD",
    grl: 54,
    altura: "176cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4700000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/7/7e/Rian_Sanga.png/revision/latest?cb=20231112015136&path-prefix=es",
    stats: { pac: 72, sho: 48, pas: 62, dri: 57, def: 38, phy: 50 }
  },
  {
    id: "haato_meiji",
    nombre: "Haato Meiji",
    apodo: "Extremo con Llegada",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 10,
    posicion: "EI",
    posicionSecundaria: "MI",
    grl: 61,
    altura: "181cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 4900000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/d/d2/Haato_Meiji.png/revision/latest?cb=20231112031318&path-prefix=es",
    stats: { pac: 70, sho: 63, pas: 54, dri: 60, def: 35, phy: 55 }
  },
  {
    id: "keisuke_wanima",
    nombre: "Keisuke Wanima",
    apodo: "DC Derecho (Falso 9)",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 0,
    posicion: "DC",
    posicionSecundaria: "MCO",
    grl: 73,
    altura: "177cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 7500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/a/a6/Keisuke_Wanima.png/revision/latest?cb=20231116194124&path-prefix=es",
    stats: { pac: 76, sho: 75, pas: 78, dri: 74, def: 40, phy: 68 }
  },
  {
    id: "raito_fuwa",
    nombre: "Raito Fuwa",
    apodo: "El Arquero Defensivo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "POR",
    grl: 52,
    altura: "174cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3200000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/6/65/Raito_Fuwa.png/revision/latest?cb=20231116182644&path-prefix=es",
    stats: { div: 52, han: 50, kic: 45, ref: 53, spd: 46, pos: 54 }
  },
  {
    id: "kei_shishiya",
    nombre: "Kei Shishiya",
    apodo: "Lateral Reactivo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "LD",
    grl: 58,
    altura: "173cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/c/c4/Kei_Shishiya.png/revision/latest?cb=20231116172059&path-prefix=es",
    stats: { pac: 60, sho: 36, pas: 52, dri: 46, def: 62, phy: 58 }
  },
  {
    id: "koki_mera",
    nombre: "Koki Mera",
    apodo: "Central Aéreo/Destructivo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "DFC",
    grl: 59,
    altura: "180cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3800000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/8/8f/Koki_Mera.png/revision/latest?cb=20231116184432&path-prefix=es",
    stats: { pac: 54, sho: 38, pas: 45, dri: 40, def: 63, phy: 69 }
  },
  {
    id: "kai_tokita",
    nombre: "Kai Tokita",
    apodo: "Zaguero Expeditivo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "DFC",
    grl: 58,
    altura: "175cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3600000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/3/34/Kai_Tokita.png/revision/latest?cb=20231116185317&path-prefix=es",
    stats: { pac: 56, sho: 35, pas: 48, dri: 42, def: 61, phy: 66 }
  },
  {
    id: "yujin_koshinaka",
    nombre: "Yujin Koshinaka",
    apodo: "Lateral de Repliegue",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 0,
    posicion: "LI",
    grl: 57,
    altura: "179cm",
    pierna: "Izquierda",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3400000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/0/0f/Yujin_Koshinaka.png/revision/latest?cb=20231116185838&path-prefix=es",
    stats: { pac: 65, sho: 40, pas: 54, dri: 49, def: 59, phy: 56 }
  },
  {
    id: "takuma_isezaki",
    nombre: "Takuma Isezaki",
    apodo: "Volante de Apoyo",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "MD",
    grl: 58,
    altura: "178cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/e/ea/Takuma_Isezaki.png/revision/latest?cb=20231116180742&path-prefix=es",
    stats: { pac: 68, sho: 45, pas: 59, dri: 55, def: 51, phy: 58 }
  },
  {
    id: "noboru_jigen",
    nombre: "Noboru Jigen",
    apodo: "Pivote de Contención",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 0,
    posicion: "MCD",
    grl: 56,
    altura: "184cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3700000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/3/35/Noboru_Jigen.png/revision/latest?cb=20231116200827&path-prefix=es",
    stats: { pac: 58, sho: 44, pas: 56, dri: 48, def: 62, phy: 64 }
  },
  {
    id: "hiromu_munakata",
    nombre: "Hiromu Munakata",
    apodo: "Conector de la Medular",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "MC",
    grl: 58,
    altura: "176cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3900000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/8/85/Hiromu_Munakata.png/revision/latest?cb=20231116173325&path-prefix=es",
    stats: { pac: 64, sho: 50, pas: 63, dri: 58, def: 50, phy: 56 }
  },
  {
    id: "yusei_amazora",
    nombre: "Yusei Amazora",
    apodo: "Volante de Amplitud",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "MI",
    grl: 58,
    altura: "179cm",
    pierna: "Izquierda",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3800000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/4/4c/Yusei_Amazora.png/revision/latest?cb=20231116175632&path-prefix=es",
    stats: { pac: 67, sho: 48, pas: 60, dri: 57, def: 47, phy: 56 }
  },
  {
    id: "rikiya_hohai",
    nombre: "Rikiya Hohai",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 0,
    posicion: "POR",
    grl: 52,
    altura: "184cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3300000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/b/bc/Rikiya_Hohai.png/revision/latest?cb=20231113031934&path-prefix=es",
    stats: { div: 53, han: 51, kic: 46, ref: 54, spd: 48, pos: 52 }
  },
  {
    id: "sota_nemoto",
    nombre: "Sota Nemoto",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "LD",
    grl: 59,
    altura: "185cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3500000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/e/e7/Sota_Nemoto.png/revision/latest?cb=20231113023404&path-prefix=es",
    stats: { pac: 62, sho: 38, pas: 50, dri: 46, def: 61, phy: 64 }
  },
  {
    id: "shuhei_ebina",
    nombre: "Shuhei Ebina",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "DFC",
    grl: 59,
    altura: "182cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3800000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/f/f9/Shuhei_Ebina.png/revision/latest?cb=20231113024434&path-prefix=es",
    stats: { pac: 55, sho: 40, pas: 46, dri: 42, def: 63, phy: 68 }
  },
  {
    id: "masumi_atatame",
    nombre: "Masumi Atatame",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "DFC",
    grl: 58,
    altura: "180cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3600000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/f/ff/Masumi_Atatame.png/revision/latest?cb=20231113025035&path-prefix=es",
    stats: { pac: 56, sho: 37, pas: 48, dri: 44, def: 62, phy: 65 }
  },
  {
    id: "kisaburo_hijikata",
    nombre: "Kisaburo Hijikata",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "LI",
    grl: 59,
    altura: "178cm",
    pierna: "Izquierda",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3500000,
    stats: { pac: 63, sho: 39, pas: 52, dri: 48, def: 60, phy: 62 }
  },
  {
    id: "kanji_torikai",
    nombre: "Kanji Torikai",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "MC",
    grl: 57,
    altura: "176cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3600000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/d/de/Kanji_Torikai.png/revision/latest?cb=20231113030130&path-prefix=es",
    stats: { pac: 61, sho: 45, pas: 58, dri: 52, def: 59, phy: 63 }
  },
  {
    id: "hirakazu_midorikawa",
    nombre: "Hirakazu Midorikawa",
    instituto: "Desconocido",
    edad: 18,
    dorsal: 0,
    posicion: "MC",
    grl: 59,
    altura: "181cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3900000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/a/a9/Hirakazu_Midorikawa.png/revision/latest?cb=20231113031048&path-prefix=es",
    stats: { pac: 65, sho: 48, pas: 62, dri: 55, def: 54, phy: 61 }
  },
  {
    id: "retsu_nerima",
    nombre: "Retsu Nerima",
    instituto: "Desconocido",
    edad: 17,
    dorsal: 0,
    posicion: "EI",
    grl: 57,
    altura: "179cm",
    pierna: "Derecha",
    nacionalidad: "Japón",
    bandera: "🇯🇵",
    equipo: "Agente Libre",
    liga: "Agente Libre",
    agenteLibre: true,
    valor: 3700000,
    foto: "https://static.wikia.nocookie.net/bluelock/images/f/fe/Retsu_Nerima.png/revision/latest?cb=20231113031437&path-prefix=es",
    stats: { pac: 71, sho: 50, pas: 56, dri: 61, def: 38, phy: 58 }
  }
];
