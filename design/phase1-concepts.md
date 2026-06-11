# Phase 1 — Concept (divergence → convergence)

> Références chargées : `lenses.md`, `mechanics.md`, `trends.md`, `games/INDEX.md`, `creativity.md` (Platform + Tilt).
> Cadre : 2–4 j · 30–45 min · poids Splendor/Azul · print-and-play · interaction directe · UN tilt · budget ≤ 12 règles.

---

## 1. Divergence — 5 concepts radicalement différents

Chaque concept applique **Platform + Tilt** (creativity.md §5) : un genre maîtrisé, puis UNE règle centrale tordue.

### Concept A — « ESTRAN » · La roue partagée
- **Expérience essentielle (Lens #1)** : *« Chaque action que je prends, je la tends à mon rival. »* Le frisson de jouer pour la table.
- **Mécanique cœur** : ACT-10 (Rondel) **fusionné** avec ACT-08 (Follow).
- **Platform** : le rondel classique (Navegador/Imperial) — chaque joueur a son pion, avance 1–3 cases, prend l'action de la case.
- **Tilt** : *il n'y a qu'UN seul pion sur la roue, partagé par tous.* Quand tu l'avances, tu choisis ton action **et** tu poses le menu d'options du joueur suivant. La marée monte pour tout le monde.
- **Thème** : la marée descend puis remonte sur l'estran ; on ramasse coquillages, algues, bois flotté avant que l'eau ne recouvre les zones. (cozy/nature — porteur, trends.md §thèmes)
- **Réfs dossier** : `ark-nova.md` (position sur la piste = puissance, rotation forcée), `puerto-rico.md` (Follow : choisir une action profite aussi aux autres).

### Concept B — « MOSAÏQUE AVEUGLE » · Le draft à l'aveugle
- **Expérience essentielle** : *« Je sais ce que valent tes tuiles, jamais les miennes. »* La confiance et la trahison de l'information.
- **Mécanique cœur** : ACT-07 (Tile placement) **fusionné** avec ACT-18 (information inversée, Hanabi).
- **Platform** : pose de tuiles à la Azul (motifs personnels, scoring positionnel).
- **Tilt** : *tu vois la valeur de chaque tuile sauf celles de ta propre réserve.* Tu draftes selon ce que les autres laissent transparaître.
- **Thème** : restauration de vitraux d'une cathédrale, dos des verres opaques tant qu'ils ne sont pas sertis.
- **Réfs dossier** : `azul.md` (draft de tuiles + pénalité de surplus), `hanabi.md` (tu vois les mains des autres, pas la tienne).

### Concept C — « BAZAR » · L'enchère inversée
- **Expérience essentielle** : *« C'est moi qui fixe le prix que tu paieras. »*
- **Mécanique cœur** : ACT-14 (Enchères) tordu en enchère de coûts.
- **Platform** : moteur de gemmes type Splendor (cartes à acheter, engine de réduction).
- **Tilt** : *tu n'achètes pas dans un marché commun — tu approvisionnes la boutique de ton adversaire et fixes ses prix*, et réciproquement.
- **Thème** : deux marchands rivaux qui se vendent mutuellement leurs étals.
- **Réfs dossier** : `splendor.md` (réservation = bid implicite, engine de réduction), `modern-art.md` (5 types d'enchères, la valeur que tu crées profite aux autres).

### Concept D — « CONTRE-COURANT » · Le pli qui recule
- **Expérience essentielle** : *« Gagner ce pli va me coûter mon tempo. »* Le dilemme du vainqueur réticent.
- **Mécanique cœur** : Trick-taking **fusionné** avec ACT-01 (piste de position).
- **Platform** : levées classiques (suivre la couleur, plus forte carte gagne).
- **Tilt** : *remporter un pli te fait reculer sur la piste d'initiative* — il faut perdre les bons plis au bon moment.
- **Thème** : régate à voile, le vent te pousse mais te déporte.
- **Réfs dossier** : `the-crew.md` (trick-taking moderne, contrainte forte), `citadels.md` (ordre du tour comme ressource, désavantage du dernier).

### Concept E — « COMMUNE » · Le deck que l'on prête
- **Expérience essentielle** : *« Ma meilleure carte, l'ennemi peut s'en servir aussi — mais il me paie. »*
- **Mécanique cœur** : ACT-12 (Deck building) **fusionné** avec ACT-16 (Trading/Catan).
- **Platform** : deck building type Dominion (acheter des cartes dans une réserve commune).
- **Tilt** : *les cartes achetées vont dans un pool COMMUN ; n'importe qui peut les jouer, mais paie une taxe à l'acheteur d'origine.*
- **Thème** : guilde d'artisans partageant des outils contre redevance.
- **Réfs dossier** : `dominion.md` (Supply commun, deck building fondateur), `catan.md` (le commerce force l'interaction sociale).

---

## 2. Convergence — Notation /5

| Concept | Originalité | Élégance pot. | Simulabilité | Adéq. thème/méca | Position marché | **Total /25** |
|---------|:-:|:-:|:-:|:-:|:-:|:-:|
| **A — Estran (roue partagée)** | 4.5 | **5** | **5** | 4 | 4 | **22.5** |
| B — Mosaïque aveugle | 4 | 3.5 | 3 | 3.5 | 3.5 | 17.5 |
| C — Bazar (enchère inversée) | 4 | 3 | 4 | 3 | 3.5 | 17.5 |
| D — Contre-courant (pli/tempo) | 3.5 | 4 | 4.5 | 3.5 | 4 | 19.5 |
| E — Commune (deck prêté) | 4 | 3 | 4 | 3.5 | 3.5 | 18 |

**Justification des notes clés :**
- **A** domine sur élégance (5) et simulabilité (5) : le rondel partagé est **un seul objet qui fait trois choses** — ordre du tour, menu d'actions, et interaction directe structurelle (Lens #43 Élégance : « une règle qui en fait dix »). L'état du jeu = un seul entier (position du pion) + réserves : perfect information, idéal pour 1000 parties simulées. Originalité 4.5 car le rondel *partagé* est quasi inexistant (Glen More a une piste commune mais pas de pion unique).
- **B** plombée en simulabilité (3) : l'information inversée force à modéliser des états de croyance par IA — coûteux et bruité.
- **D** est le dauphin sérieux (trick-taking porteur post-The Crew, très simulable) mais perd en adéquation thème/méca et en élégance face à A.

---

## 3. Le choix : **CONCEPT A — « ESTRAN »**

**Pourquoi A :**
1. **Élégance maximale (Lens #43)** — le budget de 12 règles est respecté avec une marge énorme : un pion, une roue, des zones. Le tilt *est* l'interaction directe, donc zéro règle ajoutée pour forcer l'interaction (contrainte du brief satisfaite gratuitement).
2. **Simulabilité parfaite** — état discret et information complète : le moteur JS et les 4 IA seront propres et les red flags lisibles aux chiffres.
3. **Tilt honnête (creativity.md « Be Obvious »)** — « et si tout le monde partageait le même pion de rondel ? » est l'évidence non explorée, pas un gadget clever.
4. **Marché** — 2–4 j, 30–45 min, thème nature/cozy porteur, matériel 100 % print-and-play (une roue carton + jetons).

**Le tilt en une ligne :** un rondel classique, mais **un seul pion pour toute la table** — agir, c'est tendre le plateau à l'adversaire.

### Pitch (2 phrases)
> Sur l'estran que la marée découvre puis recouvre, deux à quatre ramasseurs se partagent **une seule roue des marées** : à chaque tour vous avancez le pion commun pour récolter, mais vous décidez du même geste ce que votre voisin pourra atteindre — et ce que la mer va engloutir.
> *Estran* transforme le rondel, mécanique solitaire par excellence, en duel de tempo où chaque action est un cadeau empoisonné.

---

## ⏸ STOP — Validation requise

Phase 1 terminée. **Concept retenu : ESTRAN — le rondel partagé.** J'attends ton feu vert (ou un pivot vers un autre concept) avant d'attaquer la Phase 2 (game atoms & économie).
