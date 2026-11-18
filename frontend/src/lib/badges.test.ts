import { describe, expect, it } from "vitest";
import {
  aAtteintLePlafond,
  calculerBadge,
  calculerDestinataires,
  reglesParDefaut,
  validerRegles,
} from "./badges";
import type { Donateur } from "./donateurs";

function donateur(partiel: Partial<Donateur>): Donateur {
  return { id: "x", nom: "Test", nombreDons: 0, montantAnnuel: 0, emailsRecus: 0, ...partiel };
}

describe("calculerBadge", () => {
  it("qualifie par nombre de dons (bronze/argent/or)", () => {
    expect(calculerBadge(donateur({ nombreDons: 3 }), reglesParDefaut)).toBe("bronze");
    expect(calculerBadge(donateur({ nombreDons: 8 }), reglesParDefaut)).toBe("argent");
    expect(calculerBadge(donateur({ nombreDons: 20 }), reglesParDefaut)).toBe("or");
  });

  it("qualifie par montant annuel même avec peu de dons", () => {
    expect(calculerBadge(donateur({ nombreDons: 2, montantAnnuel: 150 }), reglesParDefaut)).toBe(
      "argent",
    );
    expect(calculerBadge(donateur({ nombreDons: 1, montantAnnuel: 2500 }), reglesParDefaut)).toBe(
      "or",
    );
  });

  it("ne donne aucun badge sans don", () => {
    expect(calculerBadge(donateur({ nombreDons: 0, montantAnnuel: 0 }), reglesParDefaut)).toBeNull();
  });
});

describe("validerRegles", () => {
  it("rejette un seuil argent inférieur ou égal au seuil bronze", () => {
    expect(validerRegles({ ...reglesParDefaut, argentDonsMin: 1 })).not.toBeNull();
  });

  it("accepte les règles par défaut", () => {
    expect(validerRegles(reglesParDefaut)).toBeNull();
  });
});

describe("calculerDestinataires", () => {
  it("ne retient que les donateurs du badge ciblé", () => {
    const liste = [
      donateur({ id: "a", nombreDons: 3, emailsRecus: 0 }),
      donateur({ id: "b", nombreDons: 20, emailsRecus: 0 }),
    ];
    const resultat = calculerDestinataires(liste, reglesParDefaut, "bronze", 5);
    expect(resultat.map((d) => d.id)).toEqual(["a"]);
  });

  it("exclut un donateur qui a atteint le plafond anti-spam", () => {
    const liste = [
      donateur({ id: "a", nombreDons: 3, emailsRecus: 5 }),
      donateur({ id: "b", nombreDons: 3, emailsRecus: 1 }),
    ];
    const resultat = calculerDestinataires(liste, reglesParDefaut, "bronze", 5);
    expect(resultat.map((d) => d.id)).toEqual(["b"]);
  });
});

describe("aAtteintLePlafond", () => {
  it("détecte le dépassement et l'égalité au plafond", () => {
    expect(aAtteintLePlafond(donateur({ emailsRecus: 5 }), 5)).toBe(true);
    expect(aAtteintLePlafond(donateur({ emailsRecus: 4 }), 5)).toBe(false);
  });
});
