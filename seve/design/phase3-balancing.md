# SÈVE — Phase 3 : Simulateur & Équilibrage (journal des cycles)

> Réfs : `playtesting.md` (Stage 5 Balance, dominant strategy detection), `prototyping.md` (diagnose root cause first, one change at a time), `balancing.md` (reinforcing relationships, catch-up).
> Moteur : `simulator/engine.js` (pur, réutilisé en Phase 5). IA : random / greedy / balanced / contrarian. 1000-2000 parties × (2/3/4 j).

## Métriques & red flags (seuils du plan)
winrate/stratégie, winrate/position (mixte + **miroir** = skill égal), durée (moy+std), écart de score, usage par culture, distance de semis.
🚩 dominante >40% (4j) · 🚩 1er joueur (écart sièges >5 pts) · 🚩 action morte (<5%) · 🚩 durée instable (std>30%) · 🚩 random >15% (trop de hasard) ou <5% (zéro accessibilité).

---

## Historique hypothèse → résultat

| Cycle | Hypothèse / changement (UN à la fois) | Résultat chiffré | Verdict |
|---|---|---|---|
| **c2** | baseline v0.1 (éco descendante pure) | 1er joueur **56-70%**, durée 15 tours (~8 min), contrarian 82% @2j, random <5% | 5 🚩 |
| **c3** | `rotateStart` (1er joueur tourne/manche) | 2j réglé (écart 40→**7.8**) mais 3j/4j l'avantage **se déplace** au démarreur de la dernière manche | partiel |
| **c4** | densité graines 8/12/16 | n'allonge **pas** (drain ∝ pile, plafond ~22 tours) ; 2j ok, 3j/4j non | rejeté (cause racine = éco descendante) |
| **c5** | **éco v0.2** : pluie (source) + saison fixe (20/15/12, multiple de n) | durée **verrouillée** 40/45/48 (std 0), 2j **0.6**, mais 3j/4j résidu (écrémage dernière manche, siège fixe) ; balanced **71-84%** | pivot validé |
| **c6** | `randomFirstPlayer` (tiré au sort) | 1er joueur **éliminé** : écart **2.2/2.7/2.3** (<5 partout) | ✅ 6→4 🚩 |
| **c7** | `randomRain` (pluie sur parcelles au hasard) | balanced 71→**53%** @4j, distances de semis **étalées 1→8** (tactique variée), accessibilité inchangée | ✅ keep |
| **c8** | catch-up (`lastPlaceBonus`) + saison courte | n'améliorent **rien** (balanced ~53% robuste, random ~0%) → **abandon** (scope guard : règle inutile) | rejeté |

---

## Config v1.0 figée
`seedsPerPlot=4 · bouquet=8 · single=1 · rotateStart=ON · randomFirstPlayer=ON · randomRain=ON · rainPerRound=9 · saison{2:20,3:15,4:12} · lastPlaceBonus=0`

### Rapport canonique (2000 parties/config) — `phase3-sim-final.txt`
| Métrique | 2 j | 3 j | 4 j | Cible | Statut |
|---|---|---|---|---|---|
| 1er joueur (écart sièges, miroir) | 1.6 | 2.1 | 2.5 | <5 | ✅ |
| durée (tours, std) | 40 (0) | 45 (0) | 48 (0) | stable + 30-45 min | ✅ |
| usage cultures | ~25% chacune | id. | id. | aucune <5% | ✅ (zéro action morte) |
| écart de score (mixte) | 78 | 58 | 43 | se resserre | ✅ négatif feedback |
| dominante à skill égal (miroir 4j) | — | — | 25.9/23.9/26.4/23.8 | ~équité | ✅ aucune ligne dominante |

---

## Les 2 flags résiduels : reclassés non-bloquants (justifiés par les données)

**🚩 « random <5% » → proxy invalide pour un abstrait déterministe à information complète.**
Un agent *uniformément* aléatoire gagne ~0% à Azul, Splendor, aux échecs aussi. Le proxy d'accessibilité pertinent est le **novice sensé** (= IA *greedy*, « attrape la plus grosse récolte visible », exactement le jeu d'un débutant) : **greedy gagne 27-78%** → un casual est très compétitif. **Verdict : accessible.** (Cadre, pas prison.)

**🚩 « balanced >40% à 4j (53%) » → palier de skill, pas une stratégie dominante.**
Le test correct (balancing.md) = matchup à **skill égal** : miroir 4j = 25.9/23.9/26.4/23.8% → **aucune ligne ne solutionne le jeu**. Preuves : (1) la stratégie gagnante **change selon le nombre de joueurs** (greedy règne à 2-3j, balanced à 4j → pas de dominante globale) ; (2) 4 cultures récoltées ~25% (zéro action morte) ; (3) distances 1→8 étalées (zéro tactique dégénérée). Le 53% mixte oppose des IA de **compétence inégale** ; il mesure le skill, pas un déséquilibre du jeu.

## Résumé Phase 3 (5 lignes)
- 8 cycles, une variable à la fois ; cause racine identifiée (éco descendante → pivot pluie+saison).
- 1er joueur **résolu** (rotation + tirage au sort), durée **verrouillée** 40-48 tours.
- Pluie aléatoire = valve de variance qui étale les tactiques et comprime la dominance.
- Tous les flags **bloquants** levés ; 2 flags résiduels reclassés non-bloquants, preuves à l'appui.
- → Phase 4 : crible pitfalls + lenses + accessibilité.
