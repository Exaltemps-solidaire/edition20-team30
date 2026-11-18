// Données d'exemple : des donateurs et communications fictifs (aucune donnée réelle de l'association).

import type { NiveauBadge } from "./badges";

export type Profil = "nouveau" | "prelevement" | "reactiver";

export type Persona = {
  id: string;
  nom: string;
  role: string;
};

export type Communication = {
  id: string;
  profil: Profil;
  cibleBadge: NiveauBadge;
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
  {
    id: "c1",
    profil: "nouveau",
    cibleBadge: "bronze",
    date: "2026-11-23",
    canal: "email",
    contenu: "Merci pour votre premier don : faites-en un nouveau pour prolonger son effet",
  },
  {
    id: "c2",
    profil: "reactiver",
    cibleBadge: "argent",
    date: "2026-11-25",
    canal: "email",
    contenu: "Votre soutien régulier change des vies : renouvelez votre don ce mois-ci",
  },
  {
    id: "c3",
    profil: "prelevement",
    cibleBadge: "or",
    date: "2026-11-30",
    canal: "email",
    contenu: "Votre générosité exceptionnelle mérite un projet à sa mesure : un don supplémentaire ?",
  },
  {
    id: "c4",
    profil: "nouveau",
    cibleBadge: "bronze",
    date: "2026-11-30",
    canal: "sms",
    contenu: "Chaque don compte : merci d'envisager un nouveau geste de soutien",
  },
];
