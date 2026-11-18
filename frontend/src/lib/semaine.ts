import type { Communication } from "./donnees";

// Le lundi de la semaine ISO contenant la date donnée (YYYY-MM-DD) : sert à regrouper
// les communications par semaine, et plus tard à détecter les conflits de fréquence.
export function lundiDeLaSemaine(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const jour = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - jour);
  return d.toISOString().slice(0, 10);
}

export function regrouperParSemaine(communications: Communication[]): Map<string, Communication[]> {
  const parSemaine = new Map<string, Communication[]>();
  for (const comm of communications) {
    const semaine = lundiDeLaSemaine(comm.date);
    const liste = parSemaine.get(semaine) ?? [];
    liste.push(comm);
    parSemaine.set(semaine, liste);
  }
  return parSemaine;
}
