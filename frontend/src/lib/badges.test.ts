import { describe, expect, it } from "vitest";
import { calculerBadge, reglesParDefaut, validerRegles } from "./badges";
import type { Donateur } from "./donateurs";

function donateur(partiel: Partial<Donateur>): Donateur {
  return { id: "x", nom: "Test", nombreDons: 0, montantAnnuel: 0, ...partiel };
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
