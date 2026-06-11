# DÉRIVE — Règles complètes

> **2 à 4 joueurs · 30–40 min · dès 8 ans · poids ~1,8/5**
> *Sur le fleuve nocturne, vos barques-lanternes dérivent vers l'aube. La barque la plus en retard pagaie — avancer rapporte une cargaison, mais rend la main aux autres.*

---

## 1. Matériel
- **1 piste Fleuve** : cases 0 → T (l'aube). *T dépend du nombre de joueurs (voir §5).*
- **4 barques** (pions, 1 par joueur).
- **56 cartes Offre** (la pioche). Chaque carte : un **temps** (1-4), une **couleur** (1 sur 4), des **PV** (0-2).
- **1 zone Marché** (5 cartes face visible).

Les 4 couleurs, identifiables par **couleur + forme** (accessibilité) :

| Couleur | Forme | Teinte |
|---|:-:|---|
| Saphir | ● | bleu |
| Ambre | ▲ | orange |
| Jade | ■ | vert |
| Améthyste | ◆ | violet |

Composition de la pioche (par couleur, ×4 couleurs = 56) :
| Temps | PV | Nombre |
|:-:|:-:|:-:|
| 1 | 0 | 4 |
| 2 | 1 | 4 |
| 3 | 1 | 3 |
| 4 | 2 | 3 |

## 2. But
Le plus de points à l'aube : **PV de vos cartes** + **bonus de set** (votre plus grande collection d'**une seule couleur**, à rendements croissants).

| Taille du plus gros set mono-couleur | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Bonus** | 0 | 1 | 4 | 9 | 16 | 25 | 36 | 49 |

## 3. Mise en place (< 2 min)
1. Posez la piste Fleuve. Empilez **toutes les barques sur la case 0**.
2. **Tirez au sort l'ordre** : la barque du premier joueur est placée **sur le dessus** de la pile.
3. Mélangez la pioche, révélez **5 cartes** : le Marché.

## 4. Déroulement
> **La barque la plus en amont (case la plus basse) joue.**
> En cas d'égalité (plusieurs barques sur la même case), **celle qui est sur le dessus de la pile** (arrivée le plus récemment) joue.

À votre tour, **une seule action** :
1. **Prenez une carte du Marché.**
2. **Avancez votre barque** du **temps** indiqué (posez-la **sur le dessus** des barques déjà présentes sur la case d'arrivée).
3. **Ajoutez la carte à votre cargaison**, devant vous, triée par couleur.
4. **Réapprovisionnez** le Marché (révélez une carte de la pioche).

Puis on regarde de nouveau **qui est le plus en amont**. Ce peut être encore **vous** → vous **rejouez**. Sinon, c'est à la barque la plus en retard.

> **Le dilemme (cœur du jeu)** : une carte **temps 1** vous garde en amont — vous rejouerez sûrement — mais avance peu. Une carte **temps 4** est précieuse, mais vous propulse en aval et **offre plusieurs tours à vos rivaux**. Et le Marché est **commun** : prendre une couleur que vise un adversaire, c'est **affamer son set**.

## 5. Fin de la nuit
La case d'arrivée **T** dépend du nombre de joueurs :

| Joueurs | T (longueur du fleuve) |
|:-:|:-:|
| 2 | 50 |
| 3 | 30 |
| 4 | 22 |

*(T décroît avec le nombre de joueurs pour une durée constante d'environ 30-40 min.)*

Dès que **toutes les barques ont franchi la case T**, l'aube se lève : on compte les points. *(Une barque qui a franchi T est arrivée : elle ne joue plus.)*

## 6. Décompte
1. **PV** : additionnez les PV de toutes vos cartes.
2. **Bonus de set** : repérez votre **couleur la plus nombreuse** → bonus du tableau (§2).
3. Le plus haut total gagne. **Égalité** : plus grand set, puis victoire **partagée**.

---

## 7. FAQ — cas limites (rencontrés en simulation)
**Plusieurs barques sur la même case : qui joue ?**
Celle du **dessus de la pile** (la dernière arrivée). En la déplaçant, elle se repose sur le dessus de sa nouvelle case.

**Le Marché est vide (pioche épuisée en fin de nuit) ?**
La barque active **dérive** : avancez-la d'**1 case** sans prendre de carte. (Rare : la pioche de 56 suffit presque toujours.)

**Puis-je refuser d'avancer / passer ?**
Non : à votre tour vous prenez une carte (ou dérivez si le Marché est vide). Le jeu progresse toujours vers l'aube.

**Une barque arrivée (≥ T) peut-elle encore jouer ?**
Non, elle a fini sa nuit. La partie continue tant qu'une barque n'a pas franchi T.

**Deux couleurs à égalité pour mon plus gros set ?**
Vous ne marquez qu'**un** bonus de set (votre plus grande pile, peu importe la couleur).

**Pourquoi prendre une carte temps 1 à 0 PV ?**
Elle vous garde en amont (vous **rejouez**) et **construit votre set** (la couleur compte, même sans PV). Le tempo est une ressource.

---
*Règles v1.0 — toutes les valeurs (T, pioche, tableau de set, marché de 5) sont issues de ~14 000 parties simulées (voir `BALANCING.md`).*
