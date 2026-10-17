/* Wrapper sobre motor.js (CF). Agrega img y col para la visualización de la guía. */
var FF = (function () {
  "use strict";
  const C = window.CF;

  const VISUAL = {
    madera:  { img: "madera",   col: "--m-madera"  },
    carton:  { img: "carton",   col: "--m-carton"  },
    papel:   { img: "papel",    col: "--m-papel"   },
    caucho:  { img: "caucho",   col: "--m-caucho"  },
    film:    { img: "film",     col: "--m-film"    },
    gasoil:  { img: "liquidos", col: "--m-gasoil"  },
    aceite:  { img: "liquidos", col: "--m-aceite"  },
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
