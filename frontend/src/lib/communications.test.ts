import { describe, expect, it } from "vitest";
import type { Communication } from "./donnees";
import { ajouterCommunication, deplacerCommunication } from "./communications";

const liste: Communication[] = [
  { id: "c1", cibleBadge: "bronze", date: "2026-11-23", contenu: "Bienvenue" },
];

describe("ajouterCommunication", () => {
  it("ajoute une communication avec un id et conserve les existantes", () => {
    const resultat = ajouterCommunication(liste, {
      cibleBadge: "argent",
      date: "2026-12-01",
      contenu: "Relance",
    });
    expect(resultat).toHaveLength(2);
    expect(resultat[1]).toMatchObject({ cibleBadge: "argent", date: "2026-12-01" });
  });

  it("ajoute une communication datée du jour quand aucune date n'est fournie", () => {
    const resultat = ajouterCommunication(liste, { cibleBadge: "or", contenu: "Relance" });
    const aujourdHui = new Date().toISOString().slice(0, 10);
    expect(resultat[1].date).toBe(aujourdHui);
  });

  it("rejette une communication sans contenu", () => {
    expect(() =>
      ajouterCommunication(liste, { cibleBadge: "bronze", date: "2026-12-01", contenu: "" }),
    ).toThrow();
  });
});

describe("deplacerCommunication", () => {
  it("change la date de la communication ciblée sans toucher aux autres", () => {
    const autre: Communication = {
      id: "c2",
      cibleBadge: "or",
      date: "2026-11-30",
      contenu: "Reçu",
    };
    const resultat = deplacerCommunication([...liste, autre], "c1", "2026-12-05");
    expect(resultat.find((c) => c.id === "c1")?.date).toBe("2026-12-05");
    expect(resultat.find((c) => c.id === "c2")?.date).toBe("2026-11-30");
  });
});
