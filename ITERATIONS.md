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

## Itération 2 : Le plan de comm devient réel (ajouter/déplacer une communication) + habillage visuel inspiré d'Ant Design

- **Temps restant annoncé** : moins de 30 minutes, demandé le 2026-11-18 à 17:05.
- **✂️ Flag de découpage** : cette itération combine deux objectifs (interactivité + style), ce qui dépasse la règle « un seul objectif par itération ». Proposé de scinder en deux itérations (style seul maintenant, interactivité en itération 3, ou l'inverse) ; **le développeur a choisi explicitement de les combiner** malgré le temps restant annoncé (<30 min, soit une seule itération complète de marge). Risque assumé : si le budget de 10 minutes de codage est dépassé, priorité donnée à finir le style (visible immédiatement) plutôt que l'interactivité.
- **❗️ Déviation du plan initial** : pour tenir le budget, la persistance reste **en mémoire côté frontend** (état React), pas côté API comme prévu initialement — perdue au rechargement de la page. Aucun appel réseau nouveau n'est introduit. À remettre en question si la démo doit survivre à un rafraîchissement de page.
- **❗️ Pas de dépendance nouvelle** : le style « inspiré d'Ant Design » est réalisé en CSS pur (palette, rayons, ombres, typographie système), sans installer le paquet `antd` — une dépendance React supplémentaire dans un export statique n'aurait pas tenu dans 10 minutes et n'était pas demandée explicitement.
- **Dans le périmètre** :
  - Sur l'écran Plan de comm : formulaire d'ajout d'une communication (profil, date, canal, contenu) et déplacement d'une communication existante à une autre date, avec logique de validation extraite en fonctions pures testables.
  - Sur les deux écrans existants (persona, Plan de comm) : palette, boutons, cartes, badges et typographie inspirés d'Ant Design (bleu primaire `#1677ff`, rayons 6-8px, ombres légères, pile de polices système).
- **Hors périmètre** : règles de fréquence, détection de conflits, détail d'une comm en écran séparé, persistance durable (API/base), paquet `antd`.
- **Critères d'acceptation** :
  - Étant donné le Plan de comm affiché, quand le responsable communication ajoute une communication (profil, date, canal, contenu valides), alors elle apparaît dans le calendrier sans recharger la page.
  - Étant donné une communication existante, quand le responsable communication la déplace à une autre date, alors le calendrier reflète la nouvelle date sans toucher aux autres communications.
  - Étant donné les deux écrans (persona, Plan de comm), quand on les affiche, alors ils partagent une palette et des composants visuellement cohérents inspirés d'Ant Design.
- **Hypothèse de l'équipe couverte** : aucune directement — prépare la mesure de l'itération suivante (détection de conflits).
- **Codage estimé** : 10 minutes (risque de dépassement assumé, cf. flag ✂️ ci-dessus)
- **Fichiers prévus** : `frontend/src/lib/communications.ts` (nouveau, logique pure), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`, `frontend/src/app/globals.css` (jetons de couleur partagés) — 4 fichiers hors tests
- **Tests unitaires prévus** : 2 à 3 tests Vitest sur `ajouterCommunication`/`deplacerCommunication` (validation des champs, non-régression des autres éléments)
- **Étapes ajoutées à la démo** : ajout d'une communication, déplacement d'une communication
- **Bilan** :
  - Durée de codage réelle : 1 minute (17:05 → 17:06), aucun dépassement — malgré le cumul des deux objectifs, aucune alarme des 8 minutes déclenchée.
  - Critères d'acceptation : les 3 satisfaits (ajout visible sans rechargement, déplacement reflété sans affecter les autres éléments, palette/composants cohérents inspirés d'Ant Design sur les deux écrans) — vérifiés par `npm test` (7 tests, dont 3 nouveaux sur `ajouterCommunication`/`deplacerCommunication`) et par la démo Playwright rejouée contre `localhost:8080` (ajout + déplacement en conditions réelles de navigateur).
  - Reporté : rien de nouveau. Les reports déjà actés (règles de fréquence, détection de conflits) restent en « À venir ».
  - Ce que le harnais a signalé : `verifier-deployabilite.sh` propre (aucune borne, aucune alarme). Pas de refus de signalement.
  - Publication : nettement plus rapide que l'itération 1, comme anticipé (plateforme déjà démarrée, images de base déjà en cache/sur le miroir ECR) — seul le frontend a été reconstruit (l'API n'a pas changé ce tour-ci).
  - **Déviations assumées, à suivre** :
    - Persistance en mémoire côté frontend seulement (perdue au rechargement) — acceptable pour la démo, à revoir si une itération future a besoin de survivre à un refresh ou d'être partagée entre personas.
    - Pas de paquet `antd` installé : le style est du CSS pur inspiré de sa palette par défaut, pas le composant-kit réel. À signaler si l'équipe attendait la bibliothèque elle-même plutôt qu'un look inspiré.
  - **Modifications** :
    - `frontend/src/lib/communications.ts` + `communications.test.ts` : logique pure d'ajout/déplacement avec validation — sert les critères 1 et 2.
    - `frontend/src/app/page.tsx` : formulaire d'ajout, champ de date par communication pour la déplacer, état React pour la liste — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css`, `frontend/src/app/globals.css` : jetons de couleur/rayon/ombre inspirés d'Ant Design, restylage des cartes, boutons, champs, badges — sert le critère 3.
    - `e2e/demo.spec.ts` : étapes d'ajout et de déplacement d'une communication.

**Replanification après l'itération 2** : codage et publication très rapides (~3 minutes au total), capacité réelle bien supérieure à l'estimation initiale de ~25 min/itération une fois la plateforme chaude. Avec moins de 30 minutes annoncées en début d'itération, il reste probablement de la marge pour une itération 3 ciblée — à reconfirmer en demandant le temps restant au début de `/iteration 3`. Priorité proposée pour la suite : la détection de conflits (point 2 ci-dessous), qui porte l'hypothèse mesurée par l'équipe, plutôt que les règles de fréquence seules — à valider par les cadreurs (⚠️).

## Itération 3 : Badges donateurs (bronze/argent/or) — calcul, écran Donateurs, règles éditables, filtre

- **Temps restant annoncé** : moins de 30 minutes, demandé le 2026-11-18 à 17:10.
- **❓ Écart de passation** : « badge », « bronze », « argent » n'apparaissent dans aucun document de la passation (`cadrage/`, `contexte/`, `PASSATION.md`). Ce n'est pas une fonctionnalité demandée par l'association mais une idée nouvelle du développeur. **Décision explicite du développeur** : coder quand même pour le pitch, validation avec les cadreurs au prochain tour de test PM Lab — à leur signaler clairement, ce n'est pas acquis côté association.
- **❓ Modèle de données** : l'app n'avait que des personas (équipe interne) et des communications (messages envoyés), aucune notion de donateur avec historique de dons. **Décision** : nouvelle entité `Donateur` (nom, nombre de dons, montant annuel), données d'exemple en dur, nouvel écran dédié — distinct des personas.
- **✂️ Flag de découpage** : la demande combine calcul des badges + sectionnement de l'app + UI d'édition des règles de badge + filtre, soit 4 objectifs pour une itération. Proposé de réduire à « calcul + affichage » seul ; **le développeur a choisi explicitement de tout combiner**, malgré le temps restant annoncé (<30 min, soit une marge très faible). Risque assumé : si le budget de 10 minutes est dépassé, priorité donnée dans l'ordre calcul → affichage → sectionnement → filtre → édition des règles (du plus structurant au plus accessoire).
- **Interprétation du « sectionnement »** (pas de précision donnée, jugement de l'agent à confirmer) : séparer l'app en sections navigables — onglets « Plan de comm » / « Donateurs » après le choix de persona — plutôt qu'un seul écran qui s'enchaîne.
- **Dans le périmètre** :
  - Règle de badge, en dur par défaut mais éditable : bronze (1 à 5 dons), argent (6 à 15 dons OU 100 €/an), or (16 dons ou plus OU 2000 €/an ou plus) — logique pure, testable.
  - Écran « Donateurs » (nouvel onglet) : liste de donateurs d'exemple avec leur badge calculé et affiché.
  - Filtre par badge (tous/bronze/argent/or) sur cette liste.
  - Panneau d'édition des seuils des 3 badges, avec validation (ordre des seuils cohérent), recalcul immédiat des badges affichés.
- **Hors périmètre** : persistance des règles ou des donateurs côté API, lien entre badge et Plan de comm (ex. cibler une communication par badge — pourrait être une itération suivante), suppression/ajout de donateurs.
- **Critères d'acceptation** :
  - Étant donné un donateur avec son nombre de dons et son montant annuel, quand son badge est calculé, alors il correspond à la règle (bronze/argent/or) y compris quand c'est le montant plutôt que le nombre de dons qui qualifie.
  - Étant donné l'écran Donateurs affiché, quand on choisit un badge dans le filtre, alors seuls les donateurs de ce badge restent visibles.
  - Étant donné le panneau de règles, quand on modifie un seuil avec une valeur incohérente (ex. seuil argent ≤ seuil bronze), alors une erreur s'affiche et les badges ne changent pas.
- **Hypothèse de l'équipe couverte** : aucune — fonctionnalité hors passation (cf. ❓ ci-dessus).
- **Codage estimé** : 10 minutes (risque de dépassement assumé, cf. flag ✂️)
- **Fichiers prévus** : `frontend/src/lib/donateurs.ts` (nouveau), `frontend/src/lib/badges.ts` (nouveau), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css` — 4 fichiers hors tests
- **Tests unitaires prévus** : 2 à 3 tests Vitest sur `calculerBadge` (seuil par nombre de dons, seuil par montant, cas limite) et/ou la validation des règles
- **Étapes ajoutées à la démo** : passage sur l'onglet Donateurs, filtre par badge
- **Bilan** :
  - Durée de codage réelle : 1 minute (17:10 → 17:11), aucun dépassement — les 4 objectifs combinés ont quand même tenu largement dans le budget.
  - Critères d'acceptation : les 3 satisfaits — `calculerBadge` qualifie par nombre de dons et par montant annuel (testé), le filtre par badge masque les autres niveaux (vérifié par la démo Playwright : Jean Petit visible, Amélie Rousseau non, sur le filtre « or »), le panneau de règles refuse un seuil incohérent et n'applique pas le changement (`validerRegles`, testé).
  - Reporté : rien de nouveau. Hors périmètre dès le départ : persistance des règles/donateurs côté API, lien badge ↔ Plan de comm (ajouté en « À venir »).
  - Ce que le harnais a signalé : `verifier-deployabilite.sh` propre. Pas de refus de signalement.
  - Publication : seul le frontend reconstruit (API inchangée), rapide comme à l'itération 2.
  - **Incident de démo (résolu dans le budget de publication)** : le premier test Playwright ciblait `getByText("Or", { exact: true })`, qui matchait aussi l'`<option>` caché du filtre — échec `toBeVisible`. Corrigé en scopant la recherche au `<li>` du donateur concerné (`Jean Petit`).
  - **⚠️ Rappel pour le tour de test PM Lab** : les badges sont une fonctionnalité hors passation (cf. ❓ en tête de section), à faire valider explicitement par les cadreurs — ce n'est pas un acquis de l'association.
  - **Modifications** :
    - `frontend/src/lib/badges.ts` + `badges.test.ts` : calcul du badge (dons ou montant) et validation des seuils — sert les critères 1 et 3.
    - `frontend/src/lib/donateurs.ts` : données d'exemple couvrant les 3 badges — sert le critère 1.
    - `frontend/src/app/page.tsx` : onglets Plan de comm/Donateurs (sectionnement), écran Donateurs avec panneau de règles et filtre — sert les 3 critères.
    - `frontend/src/app/page.module.css` : styles des onglets, du panneau de règles et des badges (bronze/argent/or) — support visuel des critères 1 et 2.
    - `e2e/demo.spec.ts` : étapes de consultation des badges et de filtre.

**Replanification après l'itération 3** : codage très rapide à nouveau (~1 minute), la contrainte reste le temps restant annoncé en dehors du codage (publication + tour de test), pas le budget de 10 minutes. À redemander en début d'itération 4. Les badges n'étant pas dans la passation, la priorité reste la détection de conflits pour couvrir l'hypothèse mesurée par l'équipe — sauf si les cadreurs valident les badges et demandent de les approfondir en premier (⚠️ à confirmer avec eux).

## Itération 4 : Cibler l'envoi des communications par badge, avec plafond anti-spam

- **Temps restant annoncé** : 15 à 30 minutes, demandé le 2026-11-18 à 17:30.
- **⚠️ Continuation d'une fonctionnalité hors passation** : cette itération approfondit les badges (cf. ❓ de l'itération 3, toujours non validé par les cadreurs). Même rappel : à faire confirmer au prochain tour de test, ce n'est pas une demande de l'association.
- **Dans le périmètre** :
  - Chaque communication programmée cible un badge (bronze/argent/or) plutôt qu'un profil générique.
  - Anti-spam : chaque donateur a un nombre d'emails déjà reçus ; un plafond (réglable) exclut des destinataires calculés les donateurs qui l'ont atteint.
  - Écran Donateurs : filtre supplémentaire pour repérer les donateurs au plafond.
  - Contenu : les communications (existantes et nouvelles) sont formulées comme des sollicitations de don ; un contenu par défaut adapté au badge est proposé à la création (modifiable).
- **Hors périmètre** : envoi réel des emails, ciblage individuel (un donateur précis plutôt qu'un badge entier), historique détaillé des envois par communication, persistance API.
- **Critères d'acceptation** :
  - Quand on crée une communication programmée, on choisit un badge cible (bronze/argent/or) ; un contenu par défaut de sollicitation de don adapté à ce badge est proposé et reste modifiable.
  - Étant donné un plafond d'emails déjà reçus, quand un donateur l'a atteint, alors il est exclu du nombre de destinataires éligibles affiché pour toute communication ciblant son badge.
  - Sur l'écran Donateurs, on peut filtrer les donateurs ayant atteint le plafond d'emails, en plus du filtre par badge existant.
- **Hypothèse de l'équipe couverte** : aucune — prolonge une fonctionnalité hors passation (cf. ⚠️ ci-dessus).
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `frontend/src/lib/badges.ts` (destinataires éligibles + messages de sollicitation par badge), `frontend/src/lib/donateurs.ts` (champ emails reçus), `frontend/src/lib/donnees.ts` (badge cible par communication, contenu reformulé), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css` — 5 fichiers hors tests
- **Tests unitaires prévus** : 2 à 3 tests Vitest sur le calcul des destinataires éligibles (filtre par badge, exclusion au plafond)
- **Étapes ajoutées à la démo** : vérifier qu'un donateur au plafond n'est plus compté comme destinataire
- **Bilan** :
  - Durée de codage réelle : environ 5 minutes (chrono `.iterations/4.debut`/`.fin`), sous le plafond de 10 minutes — pas d'alarme à 8 minutes, pas d'arbitrage à demander.
  - Critères d'acceptation : les 3 sont satisfaits — sélection du badge cible avec contenu par défaut de sollicitation modifiable, nombre de destinataires éligibles affiché par communication et qui exclut les donateurs au plafond, filtre « Plafond atteint uniquement » sur l'écran Donateurs.
  - Ce que le harnais a bloqué ou refusé : rien. `verifier-deployabilite.sh` ne signale aucune borne, `npm test` passe (13 tests), le signal `version-prete 4` a été accepté par PM Lab sans blocage.
  - Reporté : rien de nouveau dans cette itération. Les reports déjà actés (détection de conflits, règles de fréquence, vue hebdomadaire, envoi réel) restent en « À venir », inchangés.
  - ⚠️ Rappel inchangé : les badges et leur ciblage restent une fonctionnalité hors passation (itérations 3 et 4), à faire valider explicitement par les cadreurs au prochain tour de test PM Lab.
  - **Modifications** :
    - `frontend/src/lib/badges.ts` — ajout de `messageSollicitation` (contenu par défaut par badge), `calculerDestinataires` (filtre badge + plafond anti-spam) et `aAtteintLePlafond` ; sert les 3 critères.
    - `frontend/src/lib/donateurs.ts` — ajout du champ `emailsRecus` et de la constante `plafondEmailsParDefaut` ; sert le critère d'exclusion au plafond.
    - `frontend/src/lib/donnees.ts` — ajout du champ obligatoire `cibleBadge` sur `Communication`, contenu des 4 communications d'exemple reformulé en sollicitations de don ; sert le critère de ciblage par badge.
    - `frontend/src/lib/communications.test.ts`, `frontend/src/lib/semaine.test.ts`, `frontend/src/lib/badges.test.ts` — mise à jour des fixtures pour le nouveau champ `cibleBadge`/`emailsRecus`, et ajout de 3 tests Vitest sur `calculerDestinataires`/`aAtteintLePlafond`.
    - `frontend/src/app/page.tsx` — sélecteur de badge cible et autofill du contenu dans le formulaire d'ajout, affichage du nombre de destinataires éligibles par communication, champ plafond et filtre « Plafond atteint uniquement » sur l'écran Donateurs.
    - `frontend/src/app/page.module.css` — style `.tagPlafond` pour l'indicateur « Plafond atteint ».
    - `e2e/demo.spec.ts` — étapes démo : filtre plafond anti-spam (Nadia Haddad visible, Jean Petit exclu) et ciblage d'une communication par badge.

## Replanification après l'itération 4

Le ciblage par badge et le plafond anti-spam sont en place et démontrables. Avec le temps restant annoncé (15 à 30 minutes au lancement de cette itération), et sans nouvelle demande du développeur, la priorité proposée reste la détection de conflits (item 1 ci-dessous) : elle porte l'hypothèse mesurée par l'équipe et n'a toujours pas été codée. ⚠️ Cette priorité reste à valider par les cadreurs, comme signalé après l'itération 2.

## Itération 5 : Campagnes marketing ciblées par badge (création via modal façon filtres)

- **Plan validé** (découpage choisi par le développeur face au ✂️ ci-dessous).
- **Temps restant annoncé** : moins de 15 minutes, demandé le 2026-11-18 à 16:45.
- **⚠️ Budget serré** : moins de 15 minutes ne couvre normalement pas codage (≤10 min) + publication (~5 min) + tour de test de l'équipe (≥10 min, le goulot). Cette itération privilégie donc le codage et la publication ; le tour de test complet par l'équipe pourrait devoir attendre après la fin annoncée du build. Signalé au développeur.
- **✂️ Découpage** : la demande initiale (campagnes + ciblage multi-badge + modal de création + programmation + activer/désactiver + modal de réglage des seuils de badges) dépassait largement une itération. Le développeur a choisi de garder, pour cette itération : la nouvelle entité Campagne et sa modal de création avec ciblage multi-badge. Sont reportés à l'itération 6 : programmation (date), activation/désactivation, et la modal de réglage des seuils de badges (actuellement un panneau inline, pas une modal — mais la mise à jour des utilisateurs est déjà automatique puisque le badge est recalculé dynamiquement depuis les règles).
- **Dans le périmètre** :
  - Nouvelle entité Campagne : nom, type (ex. anniversaire du don, fin d'année, remerciement don récurrent — inspirés de la passation), contenu, un ou plusieurs badges cibles (bronze/argent/or).
  - Écran Campagnes (nouvel onglet) : liste des campagnes avec leurs badges cibles affichés.
  - Modal de création : ciblage présenté comme des filtres (cases à cocher par badge, sélectionnables à plusieurs), plutôt qu'un simple select.
- **Hors périmètre** : programmation/date d'envoi, activer/désactiver une campagne, modal de réglage des seuils de badges, lien entre campagnes et calcul des destinataires du Plan de comm.
- **Critères d'acceptation** :
  - Je peux créer une campagne (nom, type, contenu) via une modal façon filtres, en lui assignant un ou plusieurs badges cibles.
  - La campagne créée apparaît dans la liste de l'onglet Campagnes, avec ses badges cibles affichés.
  - Une campagne sans nom, sans contenu ou sans aucun badge coché est refusée, avec un message d'erreur.
- **Hypothèse de l'équipe couverte** : partiellement — l'email anniversaire du don et « une outil de campagne marketing ciblage/contenu » sont l'idée retenue dans la passation (`passation/passation.json`), mais le ciblage par badge reste une extension du harnais (cf. ⚠️ des itérations 3/4), à faire valider par les cadreurs.
- **Codage estimé** : 8 minutes
- **Fichiers prévus** : `frontend/src/lib/campagnes.ts` (nouveau), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css` — 3 fichiers hors tests
- **Tests unitaires prévus** : 2 à 3 tests Vitest sur `ajouterCampagne` (validation nom/contenu/badges, conservation des badges multiples)
- **Étapes ajoutées à la démo** : reportées si le temps manque (non bloquant)
- **Bilan** :
  - Durée de codage réelle : ~1 minute (chrono `.iterations/5.debut`/`.fin`), très sous le plafond de 8 minutes estimé.
  - Critères d'acceptation : les 3 sont satisfaits — création via modal avec cases à cocher par badge (filtre à choix multiples), apparition dans la liste de l'onglet Campagnes avec badges affichés, et rejet (message d'erreur) sans nom/contenu/badge.
  - Ce que le harnais a bloqué ou refusé : rien. `verifier-deployabilite.sh` ne signale aucune borne, `npm test` passe (16 tests), le signal `version-prete 5` a été accepté par PM Lab.
  - ⚠️ Non vérifié dans ce tour, comme annoncé : avec moins de 15 minutes restantes au lancement, le tour de test complet de l'équipe dans PM Lab n'a pas pu être garanti avant la fin du build. À suivre avec le développeur.
  - Reporté à l'itération 6 : programmation (date) d'une campagne, activer/désactiver, modal de réglage des seuils de badges (déplacer le panneau existant), étapes de démo Playwright pour les campagnes.
  - **Modifications** :
    - `frontend/src/lib/campagnes.ts` (nouveau) — type `Campagne`, types de campagne inspirés de la passation (anniversaire du don, fin d'année, remerciement récurrent, réactivation), fonction pure `ajouterCampagne` (validation nom/contenu/badges).
    - `frontend/src/lib/campagnes.test.ts` (nouveau) — 3 tests Vitest sur `ajouterCampagne`.
    - `frontend/src/app/page.tsx` — nouvel onglet Campagnes, `SectionCampagnes` (liste) et `ModalCampagne` (création avec ciblage multi-badge façon filtres à cocher).
    - `frontend/src/app/page.module.css` — styles `.modalFond`, `.modal`, `.filtreBadgeOption`.

## Itération 6 : Lier une campagne au Plan de comm, formulaire d'ajout en modal façon filtres

- **Plan validé** (découpage reformulé par le développeur après ma question sur la nature du lien).
- **Temps restant annoncé** : moins de 15 minutes, redemandé le 2026-11-18 à 16:51 — toujours aussi serré qu'à l'itération 5 ; même réserve sur le tour de test complet de l'équipe.
- **✂️ Une seule itération pour deux changements** : ils touchent la même interaction (le formulaire d'ajout de communication), donc regroupés plutôt que scindés.
- **Dans le périmètre** :
  - Le formulaire « Ajouter une communication » de l'onglet Plan de comm devient une modal (comme celle des Campagnes), avec les mêmes champs présentés façon filtres.
  - Nouveau champ optionnel : Campagne. La sélectionner pré-remplit le badge cible et le contenu depuis la campagne (badge = premier badge ciblé par la campagne, contenu = contenu de la campagne) ; les deux restent modifiables.
  - La communication créée affiche, si elle est liée, le nom de la campagne dans sa liste (Plan de comm).
- **Hors périmètre** : conversion inverse (campagne → plusieurs communications programmées automatiquement), programmation/activation des campagnes elles-mêmes (toujours reportées), calcul de pression combiné campagnes+communications.
- **Critères d'acceptation** :
  - Le bouton « Ajouter » de Plan de comm ouvre une modal avec un sélecteur de campagne (optionnel), en plus des champs existants.
  - Choisir une campagne pré-remplit le badge cible et le contenu, que je peux ensuite modifier avant de valider.
  - La communication créée affiche le nom de sa campagne liée, si elle en a une, dans la liste du Plan de comm.
- **Hypothèse de l'équipe couverte** : aucune nouvelle — prolonge le lien badges/campagnes déjà hors passation (cf. ⚠️ itérations 3-5), à faire valider par les cadreurs.
- **Codage estimé** : 6 minutes
- **Fichiers prévus** : `frontend/src/lib/donnees.ts` (champ `campagneId` optionnel sur `Communication`), `frontend/src/app/page.tsx` (modal du formulaire, sélecteur de campagne, tag campagne dans la liste) — 2 fichiers hors tests
- **Tests unitaires prévus** : aucun nouveau test métier (le champ est une simple donnée optionnelle transportée telle quelle par `ajouterCommunication`, déjà couvert) ; les tests existants restent verts
- **Étapes ajoutées à la démo** : reportées si le temps manque (non bloquant)
- **Bilan** :
  - Codage réel : environ 3 minutes, sous le budget estimé — aucun dépassement, alarme des 8 minutes non atteinte.
  - Les 3 critères d'acceptation sont satisfaits : modal d'ajout avec sélecteur de campagne optionnel, pré-remplissage badge+contenu modifiable, tag campagne affiché sur la communication créée.
  - Rien n'a été bloqué par le harnais : `npm test` (16 tests, tous verts, aucun nouveau test comme prévu), `npx eslint src` sans erreur, `npm run build` sans erreur TypeScript, `./scripts/verifier-deployabilite.sh` sans BORNE.
  - Déployé (image frontend reconstruite et republiée, conteneur recréé) et vérifié localement : `/` et `/sante` répondent 200. Version 6 signalée à PM Lab.
  - ⚠️ Même réserve qu'aux itérations précédentes : le temps restant annoncé (moins de 15 minutes) reste serré pour un tour de test complet de l'équipe après publication.
  - Étapes de démo (`e2e/demo.spec.ts`) non mises à jour cette itération, faute de temps — reporté, non bloquant.
  - **Modifications** :
    - `frontend/src/lib/donnees.ts` — ajout du champ optionnel `campagneId?: string` sur `Communication`, pour lier une communication à une campagne (critère 3).
    - `frontend/src/app/page.tsx` — formulaire d'ajout du Plan de comm converti en modal (`ModalCommunication`, même style que `ModalCampagne`) ; ajout du sélecteur de campagne optionnel avec pré-remplissage badge/contenu (critères 1 et 2) ; affichage d'un tag avec le nom de la campagne liée dans la liste des communications (critère 3).

## Replanification après l'itération 5

Le développeur a priorisé le lien Campagnes ↔ Plan de comm (itération 6 ci-dessus) avant de revenir aux reports de l'itération 5 (programmation/activation des campagnes, modal de seuils de badges) et à la détection de conflits.

## Replanification après l'itération 6

Le lien Campagnes ↔ Plan de comm est posé. Les reports de l'itération 5 (programmation/activation des campagnes, modal de seuils de badges) restent en tête de la liste « À venir », suivis de la détection de conflits qui porte l'hypothèse mesurée par l'équipe. Le temps restant annoncé (toujours moins de 15 minutes) laisse penser qu'une seule itération supplémentaire sera possible avant la fin du build (⚠️ à reconfirmer au prochain `/iteration`) : à envisager de la consacrer directement à la stabilisation pour le pitch plutôt que d'ouvrir un nouveau périmètre.

## À venir (non détaillé, à affiner au fil de l'eau)

1. Campagnes : programmation (date), activer/désactiver, modal de réglage des seuils de badges — reporté de l'itération 5.
2. Détection de conflits (Alertes) : signaler les semaines où un donateur recevrait plusieurs emails, permettre de déplacer/désactiver l'envoi en conflit — **porte l'hypothèse mesurée par l'équipe**. Priorité proposée (⚠️ à valider).
3. Règles de fréquence par profil : définir une règle (ex. 1 email/semaine max), l'afficher et l'appliquer au calendrier.
4. Vue hebdomadaire consolidée du Plan de comm (vérifier qu'aucun donateur ne reçoit plus d'un email sur une semaine donnée).
5. Envoi réel / historique détaillé par communication (qui a reçu quoi), si le temps et le périmètre le permettent.
6. Stabilisation finale pour le pitch, si le temps restant ne permet plus qu'une itération.
