/* Tests del motor de cálculo. Corre en Node.js: node motor.test.js */
require("./motor.js");
const CF = globalThis.CF;

let pass = 0, fail = 0;
function eq(label, got, expected, tol = 0.01) {
  if (Math.abs(got - expected) < tol) { pass++; console.log("  ✓", label); }
  else { fail++; console.error("  ✗", label, "— esperado", expected, "obtuvo", got); }
}
function ok(label, cond) {
  if (cond) { pass++; console.log("  ✓", label); }
  else { fail++; console.error("  ✗", label, "— fue falsy"); }
}

const BASE = {
  superficie: 400, uso: 30, ventilacion: "nat", riesgo: 3, r2B: true,
  materiales: [
    { q: 1200, u: "kg", pci: 4400,  c: "A" },
    { q:  800, u: "kg", pci: 4000,  c: "A" },
    { q:  300, u: "kg", pci: 4400,  c: "A" },
    { q:  600, u: "kg", pci: 10000, c: "A" },
    { q:  150, u: "kg", pci: 10000, c: "A" },
    { q:  400, u: "l",  pci: 10000, c: "B", dens: 0.84, inflam: 2 },
    { q:  600, u: "l",  pci: 9500,  c: "B", dens: 0.88, inflam: 2 },
  ]
};

console.log("=== Caso base: pañol 400 m², riesgo 3, ventilación natural ===");
const r = CF.calcSector(BASE);
eq("qf ≈ 14.59 kg/m²",   r.qf,   14.59);
eq("nExt = 2",            r.nExt, 2);
eq("n salidas = 2",       r.n,    2);
ok("F = 'F 30'",          r.F === "F 30");
ok("hasB = true",         r.hasB === true);
ok("Anum = 1",            r.Anum === 1);
ok("Bnum = 6",            r.Bnum === 6);

console.log("\n=== Bug corregido: inflam:2 no activa inflam1 ===");
ok("inflam1=false para inflam:2", r.inflam1 === false);
const rNafta = CF.calcSector({ ...BASE, materiales: [{ q: 10, u: "l", pci: 10000, c: "B", dens: 0.74, inflam: 1 }] });
ok("inflam1=true para inflam:1",  rNafta.inflam1 === true);

console.log("\n=== Bug corregido: nExt mínimo 1 (no 0) ===");
const r200 = CF.calcSector({ ...BASE, superficie: 200 });
eq("nExt = 1 para 200 m²", r200.nExt, 1);
const r201 = CF.calcSector({ ...BASE, superficie: 201 });
eq("nExt = 2 para 201 m²", r201.nExt, 2);

console.log("\n=== Bug corregido: n = ceil, mínimo 2 ===");
const r50 = CF.calcSector({ ...BASE, superficie: 50 });
eq("n = 2 para sector pequeño", r50.n, 2);

console.log("\n=== Ventilación mecánica ===");
const rMec = CF.calcSector({ ...BASE, ventilacion: "mec" });
ok("F mecánica riesgo 3 iT=0 → 'F 60'", rMec.F === "F 60");

console.log("\n=== Riesgo sin columna en cuadro ===");
const r6 = CF.calcSector({ ...BASE, riesgo: 6 });
ok("F = '—' para riesgo 6", r6.F === "—");
ok("Fnote no vacío para riesgo 6", r6.Fnote.length > 0);

console.log("\n=== Índice de rangos ===");
ok("idx(15)  = 0", CF.idx(15)  === 0);
ok("idx(16)  = 1", CF.idx(16)  === 1);
ok("idx(30)  = 1", CF.idx(30)  === 1);
ok("idx(31)  = 2", CF.idx(31)  === 2);
ok("idx(100) = 3", CF.idx(100) === 3);
ok("idx(101) = 4", CF.idx(101) === 4);

console.log("\n=== LIB: materiales presentes ===");
["madera","carton","papel","caucho","film","gasoil","aceite","nafta","glp","otro"].forEach(id => {
  ok(`LIB.${id} existe`, !!CF.LIB[id]);
});

console.log(`\n${pass} pasaron, ${fail} fallaron.`);
if (fail) process.exit(1);
