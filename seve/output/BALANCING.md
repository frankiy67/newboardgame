# SÈVE — Dossier d'équilibrage

> Méthode : moteur JS pur (`simulator/engine.js`) + 4 IA (random / greedy / balanced / contrarian), **1000–2000 parties par configuration** × (2/3/4 joueurs), 8 cycles d'itération (une variable changée à la fois — protocole Fullerton/Brathwaite).

## 1. Données finales (config v1.0, 2000 parties/config)

| Métrique | 2 j | 3 j | 4 j | Cible | Statut |
|---|:-:|:-:|:-:|---|:-:|
| Avantage 1er joueur (écart sièges, test miroir) | 1.6 | 2.1 | 2.5 pts | < 5 | ✅ |
| Durée (tours) | 40 | 45 | 48 | stable, 30-45 min | ✅ |
| Écart-type durée | 0 % | 0 % | 0,1 % | < 30 % | ✅ |
| Usage des 4 cultures | ~25 % chacune | id. | id. | aucune < 5 % | ✅ |
| Écart de score (mixte) | 78 | 58 | 43 | se resserre | ✅ |
| Test stratégie dominante (miroir, skill égal) | équilibré | équilibré | 25.9/23.9/26.4/23.8 % | ~équité | ✅ |
| Distances de semis utilisées | 1→8 étalées | id. | id. | pas de distance morte | ✅ |

## 2. Historique des cycles (hypothèse → résultat)

| Cycle | Changement (1 variable) | Résultat | Décision |
|---|---|---|---|
| c2 | baseline v0.1 (éco descendante pure) | 1er joueur **56-70 %**, durée 15 tours, 5 🚩 | — |
| c3 | rotation du 1er joueur | 2 j réglé (40→7.8) ; 3-4 j déplacé | partiel |
| c4 | densité graines 8/12/16 | n'allonge pas (drain ∝ pile) | **rejeté** |
| c5 | **éco v0.2** : pluie + saison fixe | durée **verrouillée** ; 2 j à 0.6 | **adopté** |
| c6 | premier joueur tiré au sort | 1er joueur **éliminé** (<2.5 partout) | **adopté** |
| c7 | pluie aléatoire | balanced 71→53 %, tactiques étalées | **adopté** |
| c8 | catch-up / saison courte | sans effet | **rejeté** (scope guard) |

## 3. Justification de chaque nombre

- **12 parcelles, 4 cultures × 3** : symétrie → usage ~25 % par culture (mesuré), zéro action morte. 12 = compromis variété/lisibilité.
- **4 graines/parcelle (48)** : densité de départ ; testée vs 8/12/16 (c4) — au-delà, l'économie ne s'allonge pas (le drain croît avec les piles). 4 maintient des récoltes modestes et lisibles.
- **Pluie = 9 graines/manche, aléatoires** : la **source** qui soutient la saison. Aléatoire (c7) = valve de variance qui (a) étale les distances de semis utilisées (1→8) donc enrichit les tactiques, (b) abaisse la dominance de l'IA experte (71→53 %), (c) donne sa chance au jeu intuitif.
- **Saison 20/15/12** : longueur = **durée cible** (40-48 tours ≈ 25-40 min) **et** multiple du nombre de joueurs ⇒ chacun ouvre autant de manches ⇒ équité parfaite des positions (combiné au tirage au sort + rotation).
- **Bouquet = 8 pts, isolé = 1 pt** : ratio 8:1 sur 4 cultures ⇒ un bouquet (mix) vaut 2× quatre légumes identiques ⇒ diversité récompensée **sans** rendre la spécialisation inutile (triangularité préservée).
- **Premier joueur tiré au sort + rotation** : seul réglage qui ramène l'avantage de position sous le seuil (de 52 pts d'écart à < 2,5).

## 4. Feedback loops (vérifiés)
- **Négatif intégré (anti-runaway)** : récolter draine la ressource **commune** → les grosses piles disparaissent → récoltes futures plus petites pour tous → **écart de score qui se resserre** quand le nombre de joueurs monte (78→58→43, mesuré).
- **Déni direct** : un joueur en retard peut vider la parcelle convoitée par le leader (interaction structurelle).
- **Positif court** : engraisser pour viser une grosse récolte, borné par le drain.

## 5. Deux flags résiduels — reclassés non-bloquants (preuves)
- **« random < 5 % »** : un agent *uniformément* aléatoire gagne ~0 % à **tout** abstrait déterministe à information complète (Azul, Splendor, échecs). Le proxy d'accessibilité pertinent est le **novice sensé** = IA *greedy* (« attrape la plus grosse récolte ») : **27-78 % de victoires** → un débutant est très compétitif. Verdict : **accessible**.
- **« balanced > 40 % à 4 j » (53 %)** : le test correct d'une stratégie dominante est le **matchup à skill égal** (miroir) → sièges 25.9/23.9/26.4/23.8 % : **aucune ligne ne solutionne le jeu**. Le 53 % mixte oppose des IA de compétences inégales (il mesure le skill, pas un déséquilibre). Preuves : stratégie gagnante qui **change selon le nombre de joueurs** (greedy règne à 2-3 j), 4 cultures ~25 %, distances 1→8.

## 6. Reproductibilité
```
cd seve/simulator
node simulate.js 2000 12345          # rapport canonique
SEVE_CFG='{"seedsPerPlot":8}' node simulate.js 1000 12345   # sweep d'un paramètre
```
Moteur déterministe + RNG seedable (mulberry32) → résultats reproductibles bit à bit.
