import { describe, expect, it } from "vitest";
import type { Communication } from "./donnees";
import { ajouterCommunication, deplacerCommunication } from "./communications";

const liste: Communication[] = [
  { id: "c1", profil: "nouveau", date: "2026-11-23", canal: "email", contenu: "Bienvenue" },
];

describe("ajouterCommunication", () => {
  it("ajoute une communication avec un id et conserve les existantes", () => {
    const resultat = ajouterCommunication(liste, {
      profil: "reactiver",
      date: "2026-12-01",
      canal: "sms",
      contenu: "Relance",
    });
    expect(resultat).toHaveLength(2);
    expect(resultat[1]).toMatchObject({ profil: "reactiver", date: "2026-12-01" });
  });

  it("rejette une communication sans date ni contenu", () => {
    expect(() =>
      ajouterCommunication(liste, { profil: "nouveau", date: "", canal: "email", contenu: "" }),
    ).toThrow();
  });
});

describe("deplacerCommunication", () => {
  it("change la date de la communication ciblée sans toucher aux autres", () => {
    const autre: Communication = { id: "c2", profil: "prelevement", date: "2026-11-30", canal: "email", contenu: "Reçu" };
    const resultat = deplacerCommunication([...liste, autre], "c1", "2026-12-05");
    expect(resultat.find((c) => c.id === "c1")?.date).toBe("2026-12-05");
    expect(resultat.find((c) => c.id === "c2")?.date).toBe("2026-11-30");
  });
});
