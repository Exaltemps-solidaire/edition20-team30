import type { Communication } from "./donnees";

export type NouvelleCommunication = Omit<Communication, "id">;

// Logique pure d'ajout/déplacement : testable sans rendu, réutilisée par l'écran Plan de comm.
export function ajouterCommunication(
  liste: Communication[],
  nouvelle: NouvelleCommunication,
): Communication[] {
  if (!nouvelle.date || !nouvelle.contenu.trim()) {
    throw new Error("La date et le contenu sont obligatoires");
  }
  const id = `c-${Date.now()}-${liste.length}`;
  return [...liste, { ...nouvelle, id }];
}

export function deplacerCommunication(
  liste: Communication[],
  id: string,
  nouvelleDate: string,
): Communication[] {
  if (!nouvelleDate) {
    throw new Error("La nouvelle date est obligatoire");
  }
  return liste.map((comm) => (comm.id === id ? { ...comm, date: nouvelleDate } : comm));
}
