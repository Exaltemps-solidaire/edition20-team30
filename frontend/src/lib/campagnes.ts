import type { NiveauBadge } from "./badges";

export type TypeCampagne =
  | "anniversaire-don"
  | "fin-annee"
  | "remerciement-recurrent"
  | "reactivation";

export const libellesTypeCampagne: Record<TypeCampagne, string> = {
  "anniversaire-don": "Anniversaire du don",
  "fin-annee": "Campagne de fin d'année",
  "remerciement-recurrent": "Remerciement don récurrent",
  reactivation: "Réactivation",
};

export type Campagne = {
  id: string;
  nom: string;
  type: TypeCampagne;
  contenu: string;
  ciblesBadges: NiveauBadge[];
  actif: boolean;
};

export type NouvelleCampagne = Omit<Campagne, "id" | "actif">;

export const campagnesInitiales: Campagne[] = [
  {
    id: "camp-1",
    nom: "Un an après votre premier don",
    type: "anniversaire-don",
    contenu: "Il y a un an, vous faisiez votre premier don à Imagine for Margo : merci de prolonger votre soutien.",
    ciblesBadges: ["bronze", "argent"],
    actif: true,
  },
];

// Logique pure de création : testable sans rendu, réutilisée par l'écran Campagnes.
export function ajouterCampagne(liste: Campagne[], nouvelle: NouvelleCampagne): Campagne[] {
  if (!nouvelle.nom.trim() || !nouvelle.contenu.trim()) {
    throw new Error("Le nom et le contenu sont obligatoires");
  }
  if (nouvelle.ciblesBadges.length === 0) {
    throw new Error("Choisissez au moins un badge cible");
  }
  const id = `camp-${Date.now()}-${liste.length}`;
  return [...liste, { ...nouvelle, id, actif: true }];
}
