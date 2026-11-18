import { describe, expect, it } from "vitest";
import { ajouterCampagne, type Campagne } from "./campagnes";

const liste: Campagne[] = [];

describe("ajouterCampagne", () => {
  it("ajoute une campagne avec ses badges cibles multiples", () => {
    const resultat = ajouterCampagne(liste, {
      nom: "Anniversaire du don",
      type: "anniversaire-don",
      contenu: "Un an déjà : merci pour votre premier don.",
      ciblesBadges: ["bronze", "or"],
    });
    expect(resultat).toHaveLength(1);
    expect(resultat[0]).toMatchObject({ ciblesBadges: ["bronze", "or"], actif: true });
  });

  it("rejette une campagne sans nom ni contenu", () => {
    expect(() =>
      ajouterCampagne(liste, { nom: "", type: "fin-annee", contenu: "", ciblesBadges: ["or"] }),
    ).toThrow();
  });

  it("rejette une campagne sans aucun badge cible", () => {
    expect(() =>
      ajouterCampagne(liste, {
        nom: "Sans cible",
        type: "reactivation",
        contenu: "Contenu",
        ciblesBadges: [],
      }),
    ).toThrow();
  });
});
