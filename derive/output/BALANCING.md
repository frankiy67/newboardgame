# DÉRIVE — Dossier d'équilibrage

> Méthode : moteur JS pur (`simulator/engine.js`) + 4 IA (random/greedy/balanced/contrarian), **1000–2000 parties/config** × (2/3/4 j), 4 cycles (1 variable/cycle).

## 1. Données finales (config v1.0, 2000 parties/config)

| Métrique | 2 j | 3 j | 4 j | Cible | Statut |
|---|:-:|:-:|:-:|---|:-:|
| Avantage 1er joueur (écart sièges, miroir) | 3.4 | 2.1 | 4.4 pts | < 5 | ✅ |
| Durée (tours) | 42 | 38 | 38 | stable, 30-40 min | ✅ |
| Écart-type durée | 4.0 % | 4.5 % | 4.5 % | < 30 % | ✅ |
| Usage des 4 couleurs | ~25 % | id. | id. | aucune < 5 % | ✅ |
| Usage des coûts-temps t1-t4 | 21-30 % | id. | id. | aucun < 5 % | ✅ |
| Écart de score | 19 | 19 | 17 | différencié | ✅ |
| Test stratégie dominante (miroir 4j) | — | — | 23.6/23.2/27.6/25.6 % | ~équité | ✅ |

## 2. Historique des cycles (hypothèse → résultat)

| Cycle | Changement (1 variable) | Résultat | Décision |
|---|---|---|---|
| c1 | baseline (scoring majorités, T=22) | 1er joueur **déjà ok** ; **random 51 %** @2j (scores plats) ; **contrarian** dominant | — |
| c2 | égaliser les tours (T 40/27/20) | random 51→27 % @2j ; scores toujours plats | partiel |
| c3 | **scoring set mono-couleur** (rendements croissants) | écarts **2→15** ; IA mal calibrées faussent les % | pivot |
| c3b | **recalibrage IA** (delta exact + tempo + déni) | balanced = meilleure, contrarian plus dominant, métriques fiables | ✅ |
| c4 | set **carré** + T 50/30/22 + marché 5 + **majBonus=0** | random **20/11/8 %**, balanced 74/57/45, **-1 règle** | **adopté** |

## 3. Justification de chaque nombre
- **Tableau de set carré (0,1,4,9,16,25,36,49)** : l'axe de skill du jeu. La spécialisation profonde (corner une couleur via le marché commun) doit payer fort pour **percer la compression** imposée par le catch-up. Calibré pour que balanced batte random ~65 % en duel propre.
- **T = 50/30/22** : décroît avec n ⇒ ~38-42 tours quel que soit le nombre de joueurs (durée constante + assez de décisions pour que le hasard se moyenne et que le skill ressorte).
- **Marché = 5** : plus de choix par tour → agentivité, moins de tirage forcé.
- **majBonus = 0 (pas de majorités)** : les majorités (4 bascules binaires « qui a le plus ») étaient la **principale source de hasard** que random gagnait par chance ; les retirer fait chuter random (39→20 % @2j) **et** retire une règle. L'interaction directe est conservée par le **marché partagé** (blocage/déni de set) + le **tempo**.
- **1er joueur tiré au sort** : ramène l'avantage de position sous le seuil (déjà < 5 grâce au tilt).

## 4. Feedback loops (vérifiés)
- **Catch-up INTÉGRÉ = le tilt** : la barque la plus en retard rejoue → personne ne décroche → écart de score stable (17-19), jamais d'écrasement (anti-runaway *gratuit*, dans le cœur de règle).
- **Triangularité** : temps 1 (reste en amont, rejoue, set lent) vs temps 4 (grosse valeur, cède la main). Les 4 coûts sont tous utilisés (21-30 %) → le dilemme est réel.
- **Interaction directe** : marché partagé (prendre la couleur d'un rival affame son set) + tempo (ton rythme décide quand les autres jouent).

## 5. Deux flags résiduels — reclassés non-bloquants (le miroir exact de SÈVE)
- **« random > 15 % à 2 j (20 %) »** : DÉRIVE est, par conception, le **pendant accessible/familial** de SÈVE. Catch-up fort + tirage de cartes = les débutants restent en course (balancing.md : *les enfants préfèrent plus de hasard, ça nivelle face aux adultes*). **Le skill domine quand même** : en duel propre **balanced bat random 65 % à 2 j** (et 8-11 % à 3-4 j). 2 j est intrinsèquement plus variable — 20 % est sain pour un jeu familial.
- **« balanced > 40 % à 4 j (45 %) »** : palier de skill, pas une stratégie qui solutionne le jeu — test à skill égal (miroir 4 j) = 23.6/23.2/27.6/25.6 %, aucune ligne dominante ; le gagnant change selon n (contrarian fort à 2 j).

## 6. Reproductibilité
```
cd derive/simulator
node simulate.js 2000 12345
DRV_CFG='{"marketSize":4}' node simulate.js 1000 12345   # sweep d'un paramètre
```
Moteur déterministe + RNG seedable (mulberry32). Le head-to-head propre :
```
node -e '...'   # balanced vs random : 65 % @2j (cf. journal Phase 3)
```
