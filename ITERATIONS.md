# Plan d'itérations — Imagine for Margo (Table 08 / X6HDAZ)

**Plan validé le 2026-11-18.**

- **Source du plan** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation — `cadrage/` ne contient pas de fichier `*iteration*`, et `passation.json` n'a pas de clé `iterations`).
- **Temps restant annoncé** : 60 minutes, demandé le 2026-11-18 à 16:38. Au début de l'itération 1 : 45 minutes, redemandé le 2026-11-18.
- **Durée du tour de test PM Lab** : non précisée par le développeur (question posée mais réponse portant sur un autre sujet) → valeur par défaut retenue : **10 minutes**.
- **Capacité estimée** : codage (≤10 min) + publication (~5 min) + tour de test (~10 min) ≈ **25 min / itération** → environ **2 itérations complètes** tiennent dans les 60 minutes, avec peu ou pas de marge pour un dépassement.
- **Hors périmètre dès maintenant** (cf. `documents-association` et `matiere/arbitrages.md`) : conversion vers le prélèvement automatique, gestion des entreprises, choix d'éditeur CRM, refonte du site, envoi réel des emails, données réelles des familles, délivrabilité.
- **✂️ Risque de périmètre** : au rythme estimé (~25 min/itération), seules les itérations 1 et 2 ci-dessous sont sûres d'aboutir dans les 60 minutes. Les règles de fréquence et surtout la **détection de conflits — qui porte l'hypothèse mesurée par l'équipe (zéro donateur avec plusieurs mails/semaine)** — risquent fortement de ne pas être atteintes sans un temps restant revu à la hausse ou un tour de test plus court. À trancher avec les cadreurs : soit accepter de ne montrer que le calendrier au prochain pitch, soit déjà envisager de sauter l'itération 2 (interactivité du plan de comm) pour foncer vers la détection de conflits dès l'itération 2.
- **❗️ Tests unitaires** : le développeur a demandé de sauter les tests Vitest de l'application. La DoD du hackathon (`CLAUDE.md` §3, point 2) en fait une borne, pas une option — je ne peux pas la lever seul. Le champ "Tests unitaires prévus" reste donc rempli ci-dessous ; à confirmer explicitement avant `/iteration 1` si tu veux vraiment t'en passer (le harnais ne bloque le signalement que si `npm test` échoue, pas s'il n'y a aucun test — mais ce serait s'écarter de la DoD écrite).
- **⚠️ Écart de passation** : `cadrage/3-solution.md` ne décrit pas les écrans lui-même et `prototype/index.html` n'existe pas (seule une version non retenue existe). Le détail écran par écran utilisé ci-dessous vient du PRD validé (`cadrage/7-prd.md`, repris dans `PASSATION.md`).

## Itération 1 : L'application démarre et montre le plan de comm (lecture seule, données en dur)

- **Dans le périmètre** :
  - `.env.example` et `DEPLOIEMENT.md` à la racine (contrat de déployabilité).
  - Écran « Qui êtes-vous ? » : liste de personas en dur (au moins le responsable communication), bouton pour en changer.
  - Écran Plan de comm : vue calendrier des communications prévues (profil, date, canal), données en dur.
  - Déploiement selon `docs/guidelines-deploiement.md` (ports 8080/8081, chemins relatifs `/api/v1/...`).
- **Hors périmètre** : ajout/déplacement d'une communication, détail d'une comm, règles de fréquence, détection de conflits, API dynamique (les données peuvent rester statiques côté frontend ou servies telles quelles par l'API).
- **Critères d'acceptation** :
  - Étant donné l'application ouverte, quand aucun persona n'est choisi, alors l'écran « Qui êtes-vous ? » propose une liste d'au moins un persona (le responsable communication) avec ses données d'exemple.
  - Étant donné un persona choisi, quand on arrive sur le Plan de comm, alors on voit au moins deux communications prévues (profil, date, canal) en vue calendrier.
  - Étant donné l'application déployée, quand on appelle `/health` (8080) et `/sante` (8081), alors les deux répondent 200 avec un corps vérifiable (pas seulement le code).
- **Hypothèse de l'équipe couverte** : aucune — itération fondatrice, sans mesure encore.
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `frontend/src/app/page.tsx`, un composant d'écran Plan de comm + un fichier de données en dur (personas/communications) (~5 fichiers)
- **Tests unitaires prévus** : 1 test Vitest sur la fonction qui regroupe les communications en dur par semaine (logique métier minimale de cette itération, pas de test sur le balisage)
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`) : ouverture de l'app → choix du persona responsable communication → affichage du Plan de comm
- **Bilan** :
  - Durée de codage réelle : 2 minutes (16:40 → 16:42), aucun dépassement.
  - Critères d'acceptation : les 3 satisfaits (persona, calendrier avec 4 communications sur 3 semaines, `/health` et `/sante` 200 avec corps sur les deux services).
  - Reporté : rien — l'itération tient entièrement dans son périmètre.
  - Ce que le harnais a signalé : `verifier-deployabilite.sh` propre (aucune borne, aucune alarme). Pas de refus de signalement.
  - Incidents de publication (hors codage, dans le budget de publication) :
    - **Plateforme jamais démarrée sur cette VM** : premier démarrage à froid (~5 min, pull des images Postgres/OpenBao/Valkey/registre).
    - **Rate-limit Docker Hub anonyme** sur `docker.io/library/node` et `nginx` : aucune registries.conf mirror configurée, aucun identifiant Docker Hub disponible. Contourné en repointant les deux `Dockerfile` sur `public.ecr.aws/docker/library/...` (miroir public AWS ECR Gallery, non rate-limité, images identiques) — accessible depuis la VM, vérifié avant usage. ⚠️ À confirmer avec l'équipe/la Forge que ce miroir est acceptable à terme (le `CLAUDE.md` racine demandait `docker.io/library/...` pour éviter l'échec de résolution des noms courts, pas spécifiquement ce registre).
    - **CSP trop stricte** : ma première `Content-Security-Policy` (`default-src 'self'` sans `script-src`) bloquait les scripts inline de Next.js (hydratation) — page blanche sans erreur serveur, détectée seulement via `e2e/demo.spec.ts` (React error #412 en console). Corrigée en ajoutant `script-src 'self' 'unsafe-inline'`. Le premier signal PM Lab avait été envoyé avant cette correction ; **résolu** : `signaler-version.sh 1` a été rejoué après le correctif (`npm test` au vert, `verifier-deployabilite.sh` sans borne, `/health` et `/sante` revérifiés en 200), l'enregistrement PM Lab porte maintenant `updated_at: 2026-11-18T16:00:31Z`, postérieur au correctif — plus de risque de page blanche pour l'équipe.
  - **Modifications** :
    - `frontend/src/lib/donnees.ts` : données d'exemple (personas, communications) — sert les 3 critères.
    - `frontend/src/lib/semaine.ts` + `semaine.test.ts` : logique de regroupement par semaine (lundi de la semaine) — sert le critère « vue calendrier » et prépare la détection de conflits.
    - `frontend/src/app/page.tsx`, `page.module.css`, `layout.tsx` (titre) : écran « Qui êtes-vous ? » puis Plan de comm — sert les 3 critères.
    - `frontend/nginx.conf` : en-têtes de sécurité + CSP (avec `script-src` corrigé), repli des routes profondes vers `index.html` — sert le critère de déploiement, pas un critère d'acceptation direct.
    - `api/Dockerfile`, `frontend/Dockerfile` : image de base `public.ecr.aws/docker/library/...` — sert le déploiement (contournement du rate-limit Docker Hub).
    - `.env.example`, `DEPLOIEMENT.md`, `podman-compose.yml` : contrat de déployabilité et recette du serveur.
    - `e2e/demo.spec.ts` : étapes de la démo (ouverture, choix persona, Plan de comm).

**Replanification après l'itération 1** : la publication a pris nettement plus que les ~5 minutes estimées (démarrage à froid de la plateforme + contournement du rate-limit Docker Hub, voir bilan ci-dessus), consommant une bonne partie des 45 minutes annoncées. Ces deux coûts ne se répéteront pas (plateforme déjà démarrée, images de base déjà en cache local et sur le miroir ECR) : la publication de l'itération 2 devrait se rapprocher des ~5 minutes prévues. Capacité révisée à redemander en début d'itération 2.

## Itération 2 : Le plan de comm devient réel — ajouter ou déplacer une communication

- **Dans le périmètre** : sur l'écran Plan de comm, ajouter une communication (profil, date, canal) et déplacer une communication existante à une autre date ; persistance au minimum en mémoire côté API pour tenir la démo.
- **Hors périmètre** : règles de fréquence, détection de conflits, détail d'une comm en écran séparé (peut rester une simple vue inline si le temps le permet), persistance durable en base (hors périmètre du hackathon sauf si trivial).
- **Critères d'acceptation** :
  - Étant donné le Plan de comm affiché, quand le responsable communication ajoute une communication (profil, date, canal), alors elle apparaît dans le calendrier sans recharger la page manuellement.
  - Étant donné une communication existante, quand le responsable communication la déplace à une autre date, alors le calendrier reflète la nouvelle date.
  - Étant donné deux communications ajoutées pour des profils différents, quand on revient sur le calendrier, alors les deux restent visibles avec leurs attributs corrects.
- **Hypothèse de l'équipe couverte** : aucune directement — prépare la mesure de l'itération suivante (détection de conflits).
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `api/src/routes.ts` (ou nouveau module de routes `/api/v1/communications`), le composant Plan de comm (formulaire d'ajout, glisser/choisir une date), le fichier de données partagé (~4-5 fichiers)
- **Tests unitaires prévus** : 1 à 3 tests Vitest sur la logique d'ajout/déplacement (validation des champs, pas de doublon trivial)
- **Étapes ajoutées à la démo** : ajout d'une communication, déplacement d'une communication
- **Bilan** : _à remplir en fin d'itération_

## À venir (non détaillé, à affiner au fil de l'eau)

1. Règles de fréquence par profil : définir une règle (ex. 1 email/semaine max), l'afficher et l'appliquer au calendrier.
2. Détection de conflits (Alertes) : signaler les semaines où un donateur recevrait plusieurs emails, permettre de déplacer/désactiver l'envoi en conflit — **porte l'hypothèse mesurée par l'équipe**.
3. Vue hebdomadaire consolidée du Plan de comm (vérifier qu'aucun donateur ne reçoit plus d'un email sur une semaine donnée).
4. Stabilisation finale pour le pitch, si le temps restant ne permet plus qu'une itération.
