import { describe, expect, it } from "vitest";
import type { Communication } from "./donnees";
import { lundiDeLaSemaine, regrouperParSemaine } from "./semaine";

describe("lundiDeLaSemaine", () => {
  it("renvoie le lundi de la semaine pour n'importe quel jour", () => {
    expect(lundiDeLaSemaine("2026-11-18")).toBe("2026-11-16");
    expect(lundiDeLaSemaine("2026-11-23")).toBe("2026-11-23");
  });
});

describe("regrouperParSemaine", () => {
  it("regroupe les communications de la même semaine ensemble", () => {
    const communications: Communication[] = [
      { id: "c1", profil: "nouveau", date: "2026-11-23", canal: "email", contenu: "a" },
      { id: "c2", profil: "reactiver", date: "2026-11-25", canal: "email", contenu: "b" },
      { id: "c3", profil: "prelevement", date: "2026-11-30", canal: "email", contenu: "c" },
    ];
    const parSemaine = regrouperParSemaine(communications);
    expect(parSemaine.get("2026-11-23")).toHaveLength(2);
    expect(parSemaine.get("2026-11-30")).toHaveLength(1);
  });
});
