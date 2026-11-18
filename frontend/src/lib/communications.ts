import type { Communication } from "./donnees";

export type NouvelleCommunication = Omit<Communication, "id" | "date"> & { date?: string };

function aujourdHui(): string {
  return new Date().toISOString().slice(0, 10);
}

// Logique pure d'ajout/déplacement : testable sans rendu, réutilisée par l'écran Plan de comm.
// Ajout immédiat : sans date fournie, la communication est datée du jour (pas de planification à la création).
export function ajouterCommunication(
  liste: Communication[],
  nouvelle: NouvelleCommunication,
): Communication[] {
  if (!nouvelle.contenu.trim()) {
    throw new Error("Le contenu est obligatoire");
  }
  const id = `c-${Date.now()}-${liste.length}`;
  return [...liste, { ...nouvelle, id, date: nouvelle.date || aujourdHui() }];
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
