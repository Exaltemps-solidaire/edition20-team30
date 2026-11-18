// Données d'exemple : des donateurs et communications fictifs (aucune donnée réelle de l'association).

export type Profil = "nouveau" | "prelevement" | "reactiver";

export type Persona = {
  id: string;
  nom: string;
  role: string;
};

export type Communication = {
  id: string;
  profil: Profil;
  date: string;
  canal: "email" | "sms";
  contenu: string;
};

export const libellesProfil: Record<Profil, string> = {
  nouveau: "Nouveau donateur",
  prelevement: "Donateur en prélèvement automatique",
  reactiver: "Donateur à réactiver",
};

export const personas: Persona[] = [
  { id: "p1", nom: "Claire Dubois", role: "Responsable communication" },
];

export const communications: Communication[] = [
  { id: "c1", profil: "nouveau", date: "2026-11-23", canal: "email", contenu: "Bienvenue et merci pour votre premier don" },
  { id: "c2", profil: "reactiver", date: "2026-11-25", canal: "email", contenu: "Des nouvelles de la recherche" },
  { id: "c3", profil: "prelevement", date: "2026-11-30", canal: "email", contenu: "Votre reçu fiscal annuel" },
  { id: "c4", profil: "nouveau", date: "2026-11-30", canal: "sms", contenu: "Merci encore pour votre soutien" },
];
