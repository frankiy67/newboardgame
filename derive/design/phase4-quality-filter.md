# DÉRIVE — Phase 4 : Filtre Qualité

> Réfs : `pitfalls.md`, `lenses.md`, `accessibility.md`.

## 1. Crible des 20 erreurs — verdict

| # | Erreur | Verdict DÉRIVE |
|---|--------|----------------|
| 1 | Règles trop complexes | ✅ 9 règles (1 de moins après retrait des majorités), 1 page. |
| 2 | Règles ambiguës | ⚠️ playtest à venir ; cas-limites (égalité de position, marché vide → dérive) tranchés dans le moteur → FAQ. |
| 3 | Exceptions sur exceptions | ✅ une seule action (prendre une carte) ; la règle d'égalité « dessus de pile » gère tous les cas. |
| 4 | Règles sans conséquence | ✅ majorités **retirées** car source de bruit (c4) — scope guard appliqué. |
| 5 | Règles ≠ thème | ✅ fusion : le temps = avancer = dériver vers l'aube ; le retardataire pagaie ; cargaison = collection. |
| 6 | Stratégie dominante | ✅ test à skill égal (miroir 4j) équilibré ; gagnant change selon n. |
| 7 | **Runaway leader** | ✅ **le tilt EST l'anti-runaway** : le retardataire rejoue toujours → scores resserrés (gap 17-19, jamais d'écrasement). |
| 8 | Élimination précoce | ✅ aucune élimination ; tout le monde dérive jusqu'à l'aube. |
| 9 | Trop long / king-making | ✅ durée 38-42 tours (~30-40 min) ; chacun marque jusqu'au bout. |
| 10 | **1er joueur** | ✅ tiré au sort ; écart <4.4 pts (le tilt équilibre déjà). |
| 11 | Proto trop beau | ✅ cartes manuscrites + pions suffisent. |
| 12 | Irréalisable production | ✅ print-and-play : 56 cartes + 4 pions + 1 piste. |
| 13 | Changelog | ✅ `phase3-balancing.md` (4 cycles). |
| 14-17 | Playtest (expliquer/amis/non-verbal/multi-fix) | ➡️ proto HTML Phase 5 + protocole Fullerton ; 1 variable/cycle déjà respecté. |
| 18-20 | Soumission (inachevé/one-liner/cible) | ➡️ Phase 6 ; one-liner prêt ; cible familial (Iello, Gigamic, Blue Orange). |

**0 erreur bloquante.**

## 2. Stress-test — 10 lenses

| Lens | Réponse DÉRIVE |
|------|----------------|
| **#1 Essential Experience** ★ | *« Gagner ce tour me coûte mon tour suivant. »* — livrée : coûts t1-t4 tous utilisés (21-30 %) = le dilemme tempo est réel. |
| **#32 Meaningful Choices** ★ | ✅ chaque tour : quelle couleur creuser, payer le tempo ou rester en amont, affamer le set adverse. |
| **#43 Elegance** ★ | ✅ une règle (« le plus en retard joue ») fait l'ordre du tour, le rythme **et** le catch-up anti-runaway. |
| **#2 Surprise** ★ | ✅ le marché qui se renouvelle ; les rafales de tours quand un rival fonce ; les renversements de fin. |
| #33 Triangularity | ✅ temps 1 sûr/lent vs temps 4 cher/précieux. |
| #7 Runaway/Balance | ✅ catch-up intrinsèque ; gap stable. |
| #34 Skill vs Chance | ✅ **dosé pour l'accessibilité** : balanced bat random 65 % en duel, mais un débutant reste en course (random 20 % @2j). |
| #16 The Player | ✅ cible familiale ; tension douce, tout le monde finit la nuit. |
| #49 Visible Progress | ✅ barques sur le fleuve + cargaisons qui s'empilent. |
| #48 Accessibility | ✅ règles core <5 min ; setup <2 min. |

★ = les 4 obligatoires. Toutes franchies.

## 3. Accessibilité
- **Daltonisme** : 4 couleurs encodées **couleur + icône + forme** (●▲■◆), jamais la couleur seule. Palette daltonien-safe.
- **Iconographie** : carte = temps (chiffre) + couleur/forme + PV (chiffre). Lecture immédiate.
- **Setup <2 min** : poser la piste, empiler les barques, révéler 5 cartes.
- **Règles apprenables <5 min** : 1 action (prendre une carte), 1 règle d'ordre (le plus en retard), 1 scoring (set + PV).
- **Poids** : ~1.8 (plus léger que Sève) — pendant familial du portfolio.

## Résumé Phase 4 (5 lignes)
- 20 pitfalls : 0 bloquant ; le tilt règle nativement runaway + 1er joueur.
- 4 lenses obligatoires franchies ; tempo réel (coûts tous utilisés).
- Skill/chance dosé pour l'accessibilité familiale (assumé).
- Daltonisme couvert, setup <2 min, règles <5 min.
- → Phase 5 : prototype HTML illustré.
