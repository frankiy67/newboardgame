# 🎲 newboardgame — deux jeux originaux, conçus du concept au prototype

Deux jeux de société print-and-play (2-4 j, 30-45 min, poids léger), conçus avec un processus itératif rigoureux : concept → atomes & économie → simulateur d'équilibrage (1000+ parties) → filtre qualité → prototype jouable → livrables éditeur. Chacun applique **Platform + Tilt** : maîtriser un genre, puis tordre **une** règle centrale.

## Les deux jeux

| | 🌱 **SÈVE** | 🏮 **DÉRIVE** |
|---|---|---|
| **Pitch** | Le potager que l'on sème… pour l'adversaire. | La barque la plus en retard pagaie ; avancer rend la main aux autres. |
| **Platform** | Mancala (semis) | Piste de temps (Patchwork) |
| **Tilt** | un **seul anneau partagé** : semer nourrit le voisin | « le **retardataire rejoue** », généralisé à 2-4 j |
| **Identité** | abstrait de **skill** (info complète, random ~0 %) | **familial/accessible** (catch-up + tirage, random ~20 %) |
| **Poids** | ~2,0 (Splendor/Azul) | ~1,8 |
| **Innovation** | rondel solitaire → duel de tempo partagé | catch-up *gratuit* dans le cœur de règle |

Les deux partagent un même goût : **« mon action profite à mon rival »**.

## Structure du dépôt
```
seve/ , derive/
  ├── design/      # phases 1-4 : concepts, atomes/économie, journaux d'équilibrage, filtre qualité
  ├── simulator/   # engine.js (moteur pur) + simulate.js (1000+ parties, red flags)
  ├── playable/    # index.html : humain vs IA, réutilise engine.js (zéro divergence)
  └── output/      # RULES.md · COMPONENTS.md · BALANCING.md · PITCH.md · PRINT-AND-PLAY.html
design/phase1-concepts.md   # 5 concepts notés → choix
```

## Jouer / simuler
```bash
# Prototype jouable (humain vs IA) :
cd seve && python3 -m http.server 8000      # → http://localhost:8000/playable/
cd .. && python3 -m http.server 8001        # depuis la racine → http://localhost:8001/derive/playable/

# Équilibrage (Node, sans dépendance) :
node seve/simulator/simulate.js   2000 12345
node derive/simulator/simulate.js 2000 12345
```

## Méthode (résumé)
- **Skill `board-game-design`** : chaque phase route ses références (lenses, mechanics, balancing, playtesting, pitfalls, accessibility, narrative, publishers…).
- **Un moteur, deux usages** : le même `engine.js` pilote le simulateur **et** le prototype → l'équilibrage testé est exactement celui qu'on joue.
- **Chaque nombre justifié par les données** : ~30 000 parties simulées au total ; journaux hypothèse→résultat dans `*/design/phase3-balancing.md` et `*/output/BALANCING.md`.
- **Garde-fou scope** : ≤ 12 règles/jeu ; les deux jeux tiennent en 9 règles.

🤖 Conçu avec [Claude Code](https://claude.com/claude-code)
