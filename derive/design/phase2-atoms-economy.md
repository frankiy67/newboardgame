# DÉRIVE — Phase 2 : Game Atoms & Économie

> Réfs : `mechanics.md` (économies internes, ACT-01 piste/position), `balancing.md` (feedback négatif, catch-up), `creativity.md` (Platform + Tilt).
> **Platform** : piste de temps partagée (Patchwork). **Tilt** : *le joueur le plus en retard rejoue* — généralisé à 2-4 joueurs. Catch-up dans le cœur de règle.

## 0. Thème
**« La Longue Nuit »** — des barques-lanternes dérivent sur un fleuve nocturne. La barque la plus **en amont** (en retard) pagaie ; on récupère des **cargaisons** au marché de la rive avant l'aube.

## 1. Atomes
### Objets (Lens #22)
- **Le Fleuve** : une piste de temps 0→T, une **barque** par joueur (toutes au départ).
- **Le Marché** : 4 cartes Offre face visible ; une pioche derrière.
- **Carte Offre** : `temps` (1-4, = avancée sur le fleuve) + `couleur` (1 de 4) + `PV` (0-2).
- **Cargaison** : les cartes prises par chaque joueur (comptées par couleur).

### Tour de jeu (Lens #24) — LE tilt
> **C'est toujours la barque la plus en amont (position la plus basse) qui joue.** En cas d'égalité, la barque **arrivée le plus récemment (sur le dessus de la pile)** joue.
- Action unique : **prendre une carte du marché** → avancer sa barque de son `temps` → ajouter la carte à sa cargaison → **réapprovisionner** le marché.
- On **rejoue tant qu'on reste la barque la plus en amont.**

### Condition de victoire (Lens #25)
- La nuit s'achève quand **toutes les barques ont franchi la fin** du fleuve (position ≥ T).
- **Score** = Σ PV des cartes + **majorités de couleur** (1ᵉʳ d'une couleur +4, 2ᵉ +2).

## 2. Économie (Adams & Dormans)
```
   PIOCHE ──(source)──► MARCHÉ (4 cartes) ──(drain: prise)──► CARGAISON du joueur
                              ▲                                     │
                        réapprovisionnement                    PV + majorités
                                                                    │
   FLEUVE (temps) ◄──(le temps est la VRAIE monnaie)───────────────┘
   prendre une carte coûte du TEMPS = avancer = céder ses tours
```
| Élément | Dans DÉRIVE |
|---|---|
| **Source** | la pioche alimente le marché |
| **Drain** | prendre une carte la retire du marché (rareté) |
| **Monnaie cachée** | le **temps** : chaque carte avance la barque → te rapproche de la fin et **rend la main aux autres** |
| **Trader / interaction** | marché **partagé** (blocage : tu prends la carte qu'un rival visait) + **tempo** (ton rythme décide quand les autres jouent) + **majorités** (cargaisons en compétition) |

## 3. Feedback loops & anti-runaway
- **Négatif INTÉGRÉ (le tilt)** : avancer = jouer **moins souvent**. Le joueur qui « fonce » sur des cartes chères offre une **rafale de tours gratuits** aux retardataires. **Impossible de s'échapper** : celui qui est derrière rejoue toujours. *Catch-up = cœur de règle, zéro mécanique ajoutée.*
- **Triangularité (Lens #33)** : carte **temps 1** (reste en amont, rejoue, mais peu/pas de PV) vs **temps 4** (grosse valeur, mais saute en aval et cède la main). Le dilemme central de Patchwork.
- **Interaction directe** : (a) blocage de marché, (b) tempo, (c) majorités contestées.

## 4. Garde-fou scope (≤ 12 règles)
1. installation (barques au départ, marché de 4) · 2. la barque la plus en amont joue (égalité = dessus) · 3. prendre 1 carte du marché · 4. avancer du `temps` · 5. ajouter à la cargaison · 6. réapprovisionner · 7. rejouer tant qu'on est le plus en amont · 8. fin quand toutes les barques ont franchi T · 9. score = PV + majorités. **= 9 règles.** Marge de 3 (jalons « phares » en réserve si la simulation le réclame).

## Résumé Phase 2 (5 lignes)
- Tilt = « le plus en retard rejoue » → catch-up intrinsèque, anti-runaway gratuit.
- Le **temps** est la monnaie cachée : valeur ↔ tempo (triangularité de Patchwork).
- Interaction triple : blocage de marché + tempo + majorités de couleur.
- 9 règles ; jalons « phares » gardés en réserve.
- → Phase 3 : moteur + 4 IA + 1000 parties, mêmes red flags que SÈVE.
