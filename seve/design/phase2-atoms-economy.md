# SÈVE — Phase 2 : Game Atoms & Économie

> Références : `mechanics.md` (économies internes Adams & Dormans, Ch.4), `balancing.md` (feedback loops, runaway leader).
> Tilt central : **un seul anneau de mancala partagé**. Semer = choisir son action **et** distribuer les graines qui nourriront les voisins.

---

## 1. Les atomes du jeu

### Objets (Lens #22 Dynamic State)
- **L'Anneau** : 12 parcelles en cercle. Chaque parcelle a un **type de culture** (4 types × 3 parcelles) : 🫘 Haricot, 🍅 Tomate, 🌽 Maïs, 🍆 Aubergine. Type = **couleur + icône** (accessibilité).
- **Graines** : cubes neutres posés dans les parcelles. Ressource qui circule.
- **Récoltes** : graines récoltées → deviennent des **légumes du type de la parcelle** dans le panier du joueur (= une graine récoltée *est* un légume marqué). Unification composant : pas de jeton séparé.
- **Panier** : la réserve personnelle de chaque joueur, triée par type.

### Tour de jeu (Lens #24 Action) — UNE action par tour, sens horaire
1. **Semer** : choisir une parcelle non vide, prendre **toutes** ses graines en main, les déposer **une par une** dans les parcelles suivantes (sens horaire).
2. **Récolter** : la parcelle où tombe la **dernière** graine est la *parcelle de récolte*. Le joueur prend **toutes les graines** qui s'y trouvent ; elles deviennent des légumes **du type de cette parcelle** dans son panier. Ces graines **quittent l'anneau** (drain).

> Conséquence : grosse pile visée = grosse récolte, mais en chemin tu **engraisses** les parcelles intermédiaires → cadeaux aux suivants. **Le tilt et l'interaction directe sont la même règle.**

### Condition de victoire (Lens #25 Goals)
- La partie se termine quand l'**anneau est vide** (plus aucune graine) ou tombe sous un **seuil** (réglé en Phase 3).
- **Scoring** (Lens #32 Meaningful Choices + #33 Triangularity) :
  - Chaque **bouquet arc-en-ciel** (1 de chaque des 4 types) = **8 pts**.
  - Chaque légume **restant** (hors bouquet) = **1 pt**.
- Le plus de points gagne. Égalité → le plus de bouquets, puis le moins de graines semées « gaspillées ».

---

## 2. Cartographie de l'économie (Adams & Dormans, Ch.4)

```
                    ┌─────────────────────────────────────────┐
                    │              L'ANNEAU (12 parcelles)      │
   (pas de source   │   graines neutres circulent en cercle     │
    de graines →    │   ── semer : déplace, ne crée ni détruit ─┤
    économie        │                                           │
    DESCENDANTE)    │   parcelle de récolte ──► DRAIN ──────────┼──► PANIER du joueur
                    └─────────────────────────────────────────┘      (graine ► légume typé)
                              │                                              │
                       CONVERTER                                      fin de partie
                  (graine neutre → légume typé,                            │
                   lors de la récolte)                                     ▼
                                                                    SCORING (bouquets/restes)
```

| Élément éco. | Dans SÈVE | Rôle |
|--------------|-----------|------|
| **Source** | *aucune* (graines en réserve initiale uniquement) | économie **descendante** → fin de partie garantie, tension crescendo (Schell, « forme descendante ») |
| **Drain** | la récolte vide la parcelle de récolte | retire ≥1 graine/tour → **terminaison prouvée** (l'anneau perd strictement des graines à chaque tour) |
| **Converter** | récolte : graine neutre → légume typé | seul point où la valeur se « fige » |
| **Trader** | le semis lui-même (tu déplaces des graines vers les parcelles des autres) | **l'interaction directe est structurelle** |

**Terminaison garantie** : chaque tour draine ≥ 1 graine (la parcelle de récolte contient au moins ta dernière graine). Avec S graines initiales, partie ≤ S tours. Longueur réglée par S en Phase 3.

---

## 3. Feedback loops (balancing.md + mechanics.md Adams & Dormans)

### Voulus
- **Négatif (stabilisateur, anti-runaway intégré)** : récolter draine l'anneau → les grosses piles disparaissent → les récoltes futures **rétrécissent pour tout le monde** → les scores se resserrent en fin de partie. *Le catch-up est dans le cœur de règle, zéro mécanique ajoutée.*
- **Négatif #2 (scoring par bouquets)** : sur-spécialiser un type ne vaut que 1 pt/unité ; la valeur (8 pts) exige la diversité → plafonne le « toujours récolter la plus grosse pile ».
- **Positif (léger, moteur de tension)** : engraisser une parcelle pour viser une grosse récolte = mise en place → satisfaction quand elle aboutit. Tenu court par le drain.

### Mécanisme anti-runaway-leader (balancing.md, « reinforcing relationships »)
1. **Drain global** (ci-dessus) : le leader qui récolte gros assèche la ressource commune.
2. **Déni direct** : un joueur en retard peut **vider la parcelle** que le leader engraissait, ou semer pour disperser la pile. La nature partagée de l'anneau empêche le leader de jouer en vase clos.
3. *Levier de réserve* (si la simulation révèle un runaway) : bonus de majorité par type, ou « la dernière place sème +1 graine ». **À n'activer que sur preuve chiffrée** (Phase 3).

### Triangularité (Lens #33)
- **Voie sûre** : récolter régulièrement des légumes isolés (1 pt fiable).
- **Voie risquée** : engraisser puis viser le 4ᵉ type pour compléter un bouquet à 8 pts — mais un adversaire peut sniper la parcelle, ou l'anneau peut se vider avant.

---

## 4. Garde-fou scope (budget ≤ 12 règles)

Décompte v0.1 : (1) installation, (2) ordre horaire, (3) semer une parcelle non vide, (4) déposer 1/parcelle horaire, (5) dernière graine = parcelle de récolte, (6) récolter = graines→légumes typés, (7) graines récoltées quittent l'anneau, (8) fin quand anneau vide/seuil, (9) scoring bouquets+restes. **= 9 règles.** Marge de 3 pour un éventuel levier d'équilibrage.

> Toute règle ajoutée en Phase 3 devra **remplacer ou fusionner** une règle existante, ou être justifiée par un red flag chiffré.

---

## Résumé Phase 2 (5 lignes)
- Atomes : anneau de 12 parcelles (4 cultures), semer-puis-récolter, fin quand l'anneau se vide.
- Économie **descendante** : pas de source, le drain de récolte garantit la fin et resserre les scores (anti-runaway intégré).
- Tilt = interaction : semer nourrit les voisins ; déni direct possible.
- Triangularité via bouquets arc-en-ciel (8 pts) vs légumes isolés (1 pt).
- 9 règles seulement → marge scope confortable. → Phase 3 : moteur + IA + 1000 parties.
