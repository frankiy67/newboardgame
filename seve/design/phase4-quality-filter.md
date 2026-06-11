# SÈVE — Phase 4 : Filtre Qualité

> Réfs : `pitfalls.md` (20 erreurs), `lenses.md` (stress-test), `accessibility.md` (checklist).

## 1. Crible des 20 erreurs (`pitfalls.md`) — verdict explicite

| # | Erreur | Verdict SÈVE |
|---|--------|--------------|
| 1 | Règles trop complexes | ✅ **9-10 règles, 1 page** (cf. rules-v0.2). |
| 2 | Règles ambiguës | ⚠️ à confirmer en playtest (Phase 5) ; cas-limites (semis qui boucle, parcelle vide) déjà tranchés dans le moteur → iront en FAQ. |
| 3 | Exceptions sur exceptions | ✅ zéro exception : une seule règle « semer→récolter » gère tout. |
| 4 | Règles sans conséquence | ✅ scope guard appliqué ; `lastPlaceBonus` testé puis **supprimé** (c8) car sans effet. |
| 5 | Règles ≠ thème | ✅ fusion forte : semer nourrit le voisin = partage réel d'un potager ; pluie = aléa météo ; saison = fin naturelle. |
| 6 | **Stratégie dominante** | ✅ test à skill égal (miroir) : aucune ligne dominante ; gagnant change selon nb joueurs. (Phase 3) |
| 7 | **Runaway leader** | ✅ feedback négatif intégré (récolte draine la ressource commune) ; écart de score se resserre 78→43 à mesure que n monte ; déni direct possible. |
| 8 | Élimination précoce | ✅ aucune élimination : tout le monde joue chaque manche jusqu'à la fin. |
| 9 | Partie trop longue / king-making | ✅ durée verrouillée (40-48 tours, ~25-40 min) ; tout le monde marque jusqu'au bout. |
| 10 | **Avantage 1er joueur** | ✅ **résolu** : tirage au sort + rotation + saison multiple de n → écart <2.5 pts. (Phase 3) |
| 11 | Prototype trop beau trop tôt | ✅ prototype = anneau carton + cubes ; aucun art. |
| 12 | Irréalisable en production | ✅ print-and-play pur : 1 plateau circulaire + ~60 cubes + jetons légumes papier. |
| 13 | Pas de changelog | ✅ `phase3-balancing.md` = journal hypothèse→résultat des 8 cycles. |
| 14 | Expliquer/défendre en test | ➡️ protocole Fullerton prêt pour Phase 5 (grille de feedback, observation muette). |
| 15 | Tester qu'avec des amis | ➡️ Phase 5 : prototype HTML jouable par n'importe qui, IA comme adversaires. |
| 16 | Corriger trop à la fois | ✅ déjà respecté (1 variable/cycle) ; sera maintenu en Phase 5. |
| 17 | Ignorer le non-verbal | ➡️ grille de feedback Phase 5 inclut AP/hésitations/désengagement. |
| 18 | Soumettre inachevé | ➡️ Phase 6 : livrables complets avant tout pitch. |
| 19 | Pitch sans one-liner | ✅ déjà : *« Un mancala partagé où semer, c'est tendre le plateau à l'adversaire. »* (peaufiné en Phase 6). |
| 20 | Mauvais éditeur cible | ➡️ Phase 6 (`publishers.md`) : cible cozy/nature/familial+ (Iello, Bombyx, Repos…). |

**Bilan : 0 erreur bloquante.** Les ⚠️/➡️ sont des points de process traités aux Phases 5-6.

## 2. Stress-test — 10 lenses (`lenses.md`)

| Lens | Question | Réponse SÈVE |
|------|----------|--------------|
| **#1 Essential Experience** ★ | Quelle expérience ? | *« Chaque action que je prends, je la tends à mon rival. »* — **livrée** : semer engraisse les parcelles du suivant (vérifié structurellement). |
| **#32 Meaningful Choices** ★ | Choix significatifs ? | ✅ chaque tour : quelle parcelle scooper (distance → où atterrir), récolter gros maintenant vs nourrir le voisin, viser le 4ᵉ type pour un bouquet. Distances 1→8 utilisées (pas de choix mort). |
| **#43 Elegance** ★ | Combiner des éléments ? | ✅ **une règle = action + dépense + interaction + scoring setup**. Sommet d'élégance (Lens #43). |
| **#2 Surprise** ★ | Surprises ? | ✅ la pluie aléatoire reconfigure le potager chaque manche ; les piles que l'adversaire engraisse créent des renversements. |
| #33 Triangularity | Risque/récompense ? | ✅ sûr (légumes isolés, 1 pt fiable) vs risqué (compléter un bouquet à 8 pts, sniper possible). |
| #47 Balance | Trop fort/faible ? | ✅ 4 cultures symétriques (~25% usage) ; aucune dominante (Phase 3). |
| #29 Chance | Le hasard est-il intéressant ? | ✅ la pluie = aléa *partagé* que tous lisent et exploitent (skill>chance, random ~0%). |
| #16 The Player | Qu'aiment-ils ? | ✅ cible cozy/nature/familial+ : gratification de récolte + interaction maligne sans agression. |
| #49 Visible Progress | Progrès visible ? | ✅ paniers qui se remplissent, bouquets qui se forment, saison qui s'égrène. |
| #48 Accessibility | Apprenable seul ? | ✅ règles core <5 min (voir §3). |

★ = les 4 lenses obligatoires du plan. **Toutes franchies.**

## 3. Accessibilité (`accessibility.md`)

- **Daltonisme** : les 4 cultures encodées sur **3 dimensions** — couleur + icône (🫘🍅🌽🍆) + **forme** (●▲■◆, déjà dans `TYPE_SHAPES` du moteur). Jamais la couleur seule. Palette daltonien-safe (bleu/orange/vert/violet) en Phase 6.
- **Iconographie** : 4 icônes-légumes universelles + 2 actions (semer/récolter). Feuille de référence d'une ligne.
- **Setup < 2 min** : poser l'anneau + 4 graines/parcelle = ~1 min (cible <3 min pour <30 min de jeu : ✅ large).
- **Règles apprenables en 5 min** : 1 action (semer→récolter), 1 scoring (bouquets/restes). Niveau core atteint en <5 min ; la profondeur (gift/déni) s'apprend en jouant.
- **Poids** : ~2.0 (Splendor/Azul) — conforme au cadre.

## Résumé Phase 4 (5 lignes)
- 20 pitfalls : **0 bloquant** ; points restants = process Phases 5-6.
- 10 lenses dont les 4 obligatoires (#1, Meaningful Choices, Elegance, Surprise) : **toutes franchies**.
- Accessibilité : daltonisme couvert (couleur+icône+forme), setup ~1 min, règles core <5 min.
- Élégance confirmée : une règle fait action+dépense+interaction+scoring.
- → Phase 5 : prototype HTML jouable (STOP playtest).
