/* Wrapper sobre motor.js (CF). Agrega img, col y cap para la visualización de la guía. */
var FF = (function () {
  "use strict";
  const C = window.CF;

  const VISUAL = {
    madera:  { img: "madera",   col: "--m-madera",  cap: "Pilas de pallets de madera a 1 m del muro norte." },
    carton:  { img: "carton",   col: "--m-carton",  cap: "Cajas de cartón en la estantería metálica." },
    papel:   { img: "papel",    col: "--m-papel",   cap: "Cajas de archivo con papel." },
    caucho:  { img: "caucho",   col: "--m-caucho",  cap: "Pilas de neumáticos en el centro del pañol." },
    film:    { img: "film",     col: "--m-film",    cap: "Rollos de film de polietileno." },
    gasoil:  { img: "liquidos", col: "--m-gasoil",  cap: "Tambores de gasoil y aceite sobre bateas de contención." },
    aceite:  { img: "liquidos", col: "--m-aceite",  cap: "Tambores de gasoil y aceite sobre bateas de contención." },
  };
  const LIB = Object.fromEntries(
    Object.entries(C.LIB).map(([id, m]) => [id, Object.assign({}, m, VISUAL[id] || { col: "--m-otro" })])
  );

  const EJEMPLO = [["madera",1200],["carton",800],["papel",300],["caucho",600],["film",150],["gasoil",400],["aceite",600]];

  function calc(mats, s) {
    return C.calcSector({ superficie: s.sup, uso: s.uso, ventilacion: s.vent, riesgo: s.R, r2B: s.r2, materiales: mats });
  }

  return Object.assign({}, C, { LIB, EJEMPLO, calc });
})();
if (typeof module !== "undefined") module.exports = FF;
