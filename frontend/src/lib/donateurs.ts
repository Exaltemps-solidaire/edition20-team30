// Données d'exemple : des donateurs fictifs (aucune donnée réelle de l'association).

export type Donateur = {
  id: string;
  nom: string;
  nombreDons: number;
  montantAnnuel: number;
};

export const donateurs: Donateur[] = [
  { id: "d1", nom: "Amélie Rousseau", nombreDons: 2, montantAnnuel: 40 },
  { id: "d2", nom: "Karim Belkacem", nombreDons: 8, montantAnnuel: 60 },
  { id: "d3", nom: "Sophie Lemaire", nombreDons: 3, montantAnnuel: 150 },
  { id: "d4", nom: "Jean Petit", nombreDons: 20, montantAnnuel: 400 },
  { id: "d5", nom: "Nadia Haddad", nombreDons: 4, montantAnnuel: 2500 },
  { id: "d6", nom: "Marc Lefebvre", nombreDons: 1, montantAnnuel: 25 },
];
