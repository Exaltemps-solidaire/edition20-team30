import type { Donateur } from "./donateurs";

export type NiveauBadge = "bronze" | "argent" | "or";

export const libellesBadge: Record<NiveauBadge, string> = {
  bronze: "Bronze",
  argent: "Argent",
  or: "Or",
};

export type ReglesBadges = {
  bronzeDonsMin: number;
  argentDonsMin: number;
  argentMontantMin: number;
  orDonsMin: number;
  orMontantMin: number;
};

// Sketch du développeur : bronze 1-5 dons, argent 6-15 dons ou 100€/an, or 16+ dons ou 2000€/an.
export const reglesParDefaut: ReglesBadges = {
  bronzeDonsMin: 1,
  argentDonsMin: 6,
  argentMontantMin: 100,
  orDonsMin: 16,
  orMontantMin: 2000,
};

export function calculerBadge(donateur: Donateur, regles: ReglesBadges): NiveauBadge | null {
  if (donateur.nombreDons >= regles.orDonsMin || donateur.montantAnnuel >= regles.orMontantMin) {
    return "or";
  }
  if (
    donateur.nombreDons >= regles.argentDonsMin ||
    donateur.montantAnnuel >= regles.argentMontantMin
  ) {
    return "argent";
  }
  if (donateur.nombreDons >= regles.bronzeDonsMin) {
    return "bronze";
  }
  return null;
}

// Les seuils doivent être croissants pour que les badges restent cohérents entre eux.
export function validerRegles(regles: ReglesBadges): string | null {
  if (
    [regles.bronzeDonsMin, regles.argentDonsMin, regles.argentMontantMin, regles.orDonsMin, regles.orMontantMin].some(
      (v) => !Number.isFinite(v) || v < 0,
    )
  ) {
    return "Les seuils doivent être des nombres positifs";
  }
  if (regles.argentDonsMin <= regles.bronzeDonsMin) {
    return "Le seuil argent (dons) doit être supérieur au seuil bronze";
  }
  if (regles.orDonsMin <= regles.argentDonsMin) {
    return "Le seuil or (dons) doit être supérieur au seuil argent";
  }
  if (regles.orMontantMin <= regles.argentMontantMin) {
    return "Le seuil or (montant) doit être supérieur au seuil argent";
  }
  return null;
}
