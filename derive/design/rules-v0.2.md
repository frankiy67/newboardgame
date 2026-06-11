# DÉRIVE — Règles v0.2 (post-équilibrage, une page)

> 2–4 joueurs · 30–40 min · *La barque la plus en retard pagaie. Avancer rapporte… mais rend la main aux autres.*
> Changements vs v0.1 (4 cycles de simulation) : scoring **par set de couleur** (au lieu de majorités), marché de **5**, fleuve de longueur variable.

## Matériel
- **Le Fleuve** : piste 0 → **T** (T = **50 / 30 / 22** cases à 2 / 3 / 4 joueurs). Une **barque** par joueur.
- **Pioche de cartes Offre** (56). Chaque carte : **temps** (1-4) · **couleur** (🔵🟠🟢🟣, + forme ●▲■◆) · **PV** (0-2).
- **Marché** : 5 cartes Offre face visible.

## But
Le plus de points à l'aube : **PV des cartes** + **bonus de set** (votre plus grande collection d'une seule couleur, à rendements croissants).

| Taille du plus gros set | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Bonus** | 0 | 1 | 4 | 9 | 16 | 25 | 36 | 49 |

## Mise en place
1. Toutes les barques sur la case 0 (empilées). **Tirez au sort** l'ordre ; la barque du 1ᵉʳ joueur sur le dessus.
2. Révélez 5 cartes Offre (le Marché).

## Déroulement
> **La barque la plus en amont (case la plus basse) joue.** Égalité → la barque **sur le dessus de la pile** (arrivée la plus récemment) joue.

À ton tour, **une action** :
1. **Prends une carte du Marché.**
2. **Avance ta barque** du **temps** indiqué (empile-toi sur le dessus en arrivant).
3. **Ajoute la carte à ta cargaison** (devant toi, triée par couleur).
4. **Réapprovisionne** le Marché (révèle une carte).

Puis on regarde **qui est le plus en amont** : ça peut être encore toi → tu **rejoues**. Sinon, c'est au plus en retard.

> Le dilemme : **temps 1** = tu restes en amont et rejoues, mais petit pas ; **temps 4** = grosse carte, mais tu sautes en aval et offres plusieurs tours à tes rivaux. Et le marché est **commun** : prendre une couleur que vise un adversaire, c'est **affamer son set**.

## Fin de la nuit
Quand **toutes les barques ont franchi la case T**, on compte les points.

## Score
- **PV** de toutes tes cartes.
- **Bonus de set** : regarde ta couleur la plus nombreuse → bonus du tableau ci-dessus.
- Le plus haut total gagne. Égalité → plus grand set, puis victoire partagée.

---
*v1.0 — toutes les valeurs (T, pioche, tableau de set, marché 5) sont issues de ~14 000 parties simulées (voir `phase3-balancing.md`).*
