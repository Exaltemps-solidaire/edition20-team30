# Déploiement

Outil pour Imagine for Margo : coordonner les communications envoyées aux donateurs
particuliers, pour qu'un même donateur ne reçoive pas plusieurs emails la même semaine.

## Services

- `frontend/` : site statique (export Next.js), servi par nginx sur le port 80 du
  conteneur (8080 sur la VM). **C'est le service exposé.**
- `api/` : service Node sur le port 8081 (variable `PORT`), routes `/health` et `/sante`.

## Services externes

Aucun pour l'instant : les données (personas, communications) sont en dur dans le
frontend. Aucun appel externe, aucune base de données encore branchée.

## Connu comme fragile ou inachevé

- Les communications affichées sont des données d'exemple, non persistées : ajouter ou
  déplacer une communication n'est pas encore possible (prévu à l'itération suivante).
- Pas de règles de fréquence ni de détection de conflits (prévues plus tard).

## Contact

- Équipe : Table 08 (`X6HDAZ`), hackathon eXaltemps Solidaire.
- Association : Imagine for Margo.
