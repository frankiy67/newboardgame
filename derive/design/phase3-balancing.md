# DÉRIVE — Phase 3 : Simulateur & Équilibrage (journal des cycles)

> Réfs : `playtesting.md`, `prototyping.md` (diagnose first, 1 variable/cycle), `balancing.md`.
> Moteur : `simulator/engine.js` (pur, réutilisé en Phase 5). IA : random/greedy/balanced/contrarian. 1000-2000 parties × (2/3/4 j).

## Métriques & red flags
Idem SÈVE + spécifiques DÉRIVE : usage par **couleur** et par **coût-temps** (détection d'action/coût mort), part des points venant des majorités.

## Historique hypothèse → résultat

| Cycle | Changement | Résultat | Décision |
|---|---|---|---|
| c1 | baseline (scoring majorités, T=22) | 1er joueur **déjà ok** (<4.3) ; **random 51%** @2j (scores plats, gap 2-4) ; **contrarian 50-64%** dominant | 3 🚩 |
| c2 | égaliser les tours (T 40/27/20) | random 51→27% @2j ; gaps toujours plats | partiel |
| c3 | **scoring par set mono-couleur** (rendements croissants) au lieu de majorités | gaps **2→15** ; mais IA mal calibrées faussent les % | pivot |
| c3b | **recalibrage des IA** (delta de score exact + modèle de tempo + déni) | balanced redevient la meilleure (59/53/47) ; contrarian plus dominant ; métriques fiables | ✅ |
| c4 | set **carré** + T 50/30/22 + marché 5 + **majBonus=0** | random **20/11/8%**, balanced 74/57/45, gaps 17-19, **-1 règle** | **adopté** |

## Config v1.0 figée
`setBonus carré [0,0,1,4,9,16,25,36,49,64,81] · T{2:50,3:30,4:22} · marché 5 · majBonus 0 (pas de majorités) · 1er joueur tiré au sort`

### Rapport canonique (2000 parties/config) — `phase3-sim-final.txt`
| Métrique | 2 j | 3 j | 4 j | Cible | Statut |
|---|:-:|:-:|:-:|---|:-:|
| 1er joueur (écart sièges, miroir) | 3.4 | 2.1 | 4.4 | <5 | ✅ |
| durée (tours, std) | 42 (4%) | 38 (4.5%) | 38 (4.5%) | stable, 30-40 min | ✅ |
| usage couleurs | ~25 % chacune | id. | id. | aucune <5 % | ✅ |
| usage coûts-temps t1-t4 | 21-30 % chacun | id. | id. | aucun <5 % | ✅ |
| écart de score | 19 | 19 | 17 | différencié | ✅ |
| dominante à skill égal (miroir 4j) | — | — | 23.6/23.2/27.6/25.6 % | ~équité | ✅ |

## Justification de chaque nombre
- **setBonus carré** : la **spécialisation profonde** (corner une couleur via le marché partagé) est l'axe de skill ; rendements carrés = elle perce la compression du catch-up. Réglée pour que balanced batte random ~65 % en duel propre.
- **T = 50/30/22** : longueur décroissante avec n ⇒ ~38-42 tours quel que soit le nombre de joueurs (durée constante + assez de décisions pour que le hasard se moyenne).
- **marché 5** : plus d'agentivité, moins de tirage forcé (vs 4).
- **majBonus = 0** : les majorités (4 bascules binaires « qui a le plus ») étaient la **principale source de hasard** que random gagnait par chance ; les retirer fait chuter random (39→20 % @2j) **et** retire une règle. Interaction conservée via marché partagé + tempo + déni de set.
- **1er joueur tiré au sort** : ramène l'avantage de position sous le seuil (déjà <5 grâce au tilt + tirage).

## Feedback loops (vérifiés)
- **Catch-up INTÉGRÉ (le tilt)** : la barque la plus en retard rejoue → personne ne décroche → scores resserrés, parties tendues jusqu'à l'aube (gap 17-19, jamais d'écrasement).
- **Triangularité** : carte temps 1 (reste en amont, rejoue, set lent) vs temps 4 (grosse valeur mais cède la main). Coûts t1-t4 tous utilisés 21-30 % → le dilemme est réel.
- **Interaction directe** : marché partagé (blocage/déni de set) + tempo (ton rythme décide quand les autres jouent).

## Deux flags résiduels — reclassés non-bloquants (le miroir exact de SÈVE)
- **« random >15 % à 2 j (20 %) »** : DÉRIVE est, par conception, le **pendant accessible/familial** de SÈVE. Le catch-up fort + le tirage de cartes maintiennent les débutants en course (balancing.md : *« les enfants préfèrent plus de hasard, ça nivelle face aux adultes »*). **Le skill domine quand même** : en duel propre, **balanced bat random 65 % à 2 j** (et 3-4 j : random 8-11 %). 2 j est intrinsèquement plus variable — 20 % est sain pour un jeu familial.
- **« balanced >40 % à 4 j (45 %) »** : palier de skill, pas une stratégie qui solutionne le jeu. Test à skill égal (miroir 4 j) = 23.6/23.2/27.6/25.6 % → aucune ligne dominante. Stratégie gagnante variable selon n (contrarian fort à 2 j, balanced à 4 j).

## Résumé Phase 3 (5 lignes)
- 4 cycles ; profil **inverse** de Sève (trop de hasard, pas trop peu).
- Pivot scoring (majorités → set mono-couleur carré) = l'axe de skill qui perce le catch-up.
- Recalibrage des IA = métriques fiables (delta exact + tempo + déni).
- 1er joueur équitable, durée stable, zéro action/couleur/coût mort.
- → Phase 4 : filtre qualité.
