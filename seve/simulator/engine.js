/* ============================================================================
 * SÈVE — Moteur de jeu (pur, sans UI)
 * Réutilisé tel quel par le prototype HTML (Phase 5) ET le simulateur (Phase 3).
 * Aucune dépendance, compatible Node et navigateur.
 * ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SeveEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const N_TYPES = 4;
  const TYPE_ICONS = ['🫘', '🍅', '🌽', '🍆'];
  const TYPE_NAMES = ['Haricot', 'Tomate', 'Maïs', 'Aubergine'];
  // Formes pour accessibilité daltonisme (couleur + forme + icône)
  const TYPE_SHAPES = ['●', '▲', '■', '◆'];

  /* ---- Configuration (tous les nombres réglables vivent ici) ------------- */
  function defaultConfig(overrides) {
    const nPlots = 12;
    const types = [];
    for (let i = 0; i < nPlots; i++) types.push(i % N_TYPES);
    const cfg = {
      nPlots,
      types,                // type de culture par parcelle (layout fixe)
      seedsPerPlot: 4,      // graines initiales par parcelle
      bouquetValue: 8,      // points d'un bouquet arc-en-ciel (1 de chaque)
      singleValue: 1,       // points d'un légume isolé
      endThreshold: 0,      // fin quand total graines anneau <= seuil (si pas de saison)
      lastPlaceBonus: 0,    // LEVIER catch-up : graines rendues au dernier (0 = off)
      rotateStart: true,    // le premier joueur tourne à chaque manche (anti 1er-joueur)
      rainPerRound: 9,      // SOURCE : graines ajoutées aux parcelles les plus vides/manche
      roundsByCount: { 2: 20, 3: 15, 4: 12 }, // longueur de saison (multiple de n → équité)
      randomFirstPlayer: true, // 1er joueur tiré au sort (distribue l'écrémage final) [c6 ✓]
      randomRain: true,     // la pluie tombe sur des parcelles AU HASARD (valve de variance) [c7 ✓]
    };
    return Object.assign(cfg, overrides || {});
  }

  /* ---- RNG seedable (mulberry32) pour reproductibilité ------------------- */
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- État ------------------------------------------------------------- */
  function initState(nPlayers, cfg, rng, jitter) {
    const ring = [];
    for (let i = 0; i < cfg.nPlots; i++) {
      let s = cfg.seedsPerPlot;
      if (jitter && rng) s += (Math.floor(rng() * 3) - 1); // -1/0/+1 (variété sim)
      if (s < 0) s = 0;
      ring.push(s);
    }
    const baskets = [];
    for (let p = 0; p < nPlayers; p++) baskets.push([0, 0, 0, 0]);
    return {
      cfg, nPlayers, ring, baskets,
      current: 0,
      turn: 0,
      sown: new Array(nPlayers).fill(0),
      harvestTypeCount: [0, 0, 0, 0],
      distanceCount: {},
      passesThisRound: 0,
      done: false,
      lastMove: null,
      log: [],
    };
  }

  function cloneState(s) {
    return {
      cfg: s.cfg, nPlayers: s.nPlayers,
      ring: s.ring.slice(),
      baskets: s.baskets.map(b => b.slice()),
      current: s.current, turn: s.turn,
      sown: s.sown.slice(),
      harvestTypeCount: s.harvestTypeCount.slice(),
      distanceCount: Object.assign({}, s.distanceCount),
      passesThisRound: s.passesThisRound,
      done: s.done, lastMove: s.lastMove, log: [],
    };
  }

  function ringTotal(state) { let s = 0; for (const v of state.ring) s += v; return s; }

  function legalMoves(state) {
    const m = [];
    for (let i = 0; i < state.ring.length; i++) if (state.ring[i] > 0) m.push(i);
    return m;
  }

  /* Applique un semis depuis la parcelle `start`. Mute l'état. */
  function applyMove(state, start) {
    const cfg = state.cfg, n = cfg.nPlots;
    const seeds = state.ring[start];
    state.ring[start] = 0;
    let j = start;
    for (let k = 0; k < seeds; k++) { j = (j + 1) % n; state.ring[j] += 1; }
    const landing = j;
    const type = cfg.types[landing];
    const gained = state.ring[landing];
    const player = state.current;
    state.baskets[player][type] += gained;
    state.ring[landing] = 0; // DRAIN : les graines récoltées quittent l'anneau
    // stats
    state.sown[player] += seeds;
    state.harvestTypeCount[type] += gained;
    state.distanceCount[seeds] = (state.distanceCount[seeds] || 0) + 1;
    state.turn++;
    state.lastMove = { player, start, seeds, landing, type, gained };
    return state.lastMove;
  }

  function advance(state) { state.current = (state.current + 1) % state.nPlayers; }

  function isOver(state) { return ringTotal(state) <= state.cfg.endThreshold; }

  /* ---- Scoring ---------------------------------------------------------- */
  function scorePlayer(basket, cfg) {
    const m = Math.min(basket[0], basket[1], basket[2], basket[3]);
    const total = basket[0] + basket[1] + basket[2] + basket[3];
    const leftovers = total - m * N_TYPES;
    return { bouquets: m, leftovers, points: m * cfg.bouquetValue + leftovers * cfg.singleValue };
  }
  function scores(state) { return state.baskets.map(b => scorePlayer(b, state.cfg)); }

  function winner(state) {
    const sc = scores(state);
    let best = -1, bi = [];
    for (let i = 0; i < sc.length; i++) {
      if (sc[i].points > best) { best = sc[i].points; bi = [i]; }
      else if (sc[i].points === best) bi.push(i);
    }
    if (bi.length === 1) return bi[0];
    bi.sort((a, b) => sc[b].bouquets - sc[a].bouquets || state.sown[a] - state.sown[b]);
    return bi[0];
  }

  /* ---- Outils d'évaluation pour les IA ---------------------------------- */
  function simulateMove(state, start) {
    const c = cloneState(state);
    const r = applyMove(c, start);
    return { next: c, result: r };
  }
  function myPoints(state, p) { return scorePlayer(state.baskets[p], state.cfg).points; }

  // meilleure récolte brute qu'un joueur pourrait prendre maintenant
  function bestHarvestAvailable(state) {
    const moves = legalMoves(state);
    let best = 0;
    for (const mv of moves) {
      const r = simulateMove(state, mv).result;
      if (r.gained > best) best = r.gained;
    }
    return best;
  }

  function pickBest(state, rng, evalFn) {
    const moves = legalMoves(state);
    let bestV = -Infinity, best = [];
    for (const mv of moves) {
      const v = evalFn(state, mv);
      if (v > bestV + 1e-9) { bestV = v; best = [mv]; }
      else if (Math.abs(v - bestV) <= 1e-9) best.push(mv);
    }
    const r = rng ? rng() : Math.random();
    return best[Math.floor(r * best.length)];
  }

  /* ---- Les 4 IA --------------------------------------------------------- */
  // Chaque IA : (state, rng) -> indice de parcelle à semer.
  const AIs = {
    // baseline : coup légal au hasard
    random(state, rng) {
      const m = legalMoves(state);
      return m[Math.floor((rng ? rng() : Math.random()) * m.length)];
    },
    // gloutonne : maximise la récolte brute immédiate (myope, ignore les bouquets)
    greedy(state, rng) {
      return pickBest(state, rng, (st, s) => simulateMove(st, s).result.gained);
    },
    // équilibrée : maximise le gain de SCORE réel (valorise les bouquets)
    //              moins une crainte de nourrir le joueur suivant
    balanced(state, rng) {
      const p = state.current, before = myPoints(state, p);
      return pickBest(state, rng, (st, s) => {
        const sim = simulateMove(st, s);
        const delta = myPoints(sim.next, p) - before;
        const giftRisk = bestHarvestAvailable(sim.next);
        return delta - 0.35 * giftRisk;
      });
    },
    // contrarienne : déni — minimise la meilleure récolte laissée au suivant
    contrarian(state, rng) {
      return pickBest(state, rng, (st, s) => {
        const sim = simulateMove(st, s);
        return -bestHarvestAvailable(sim.next) + 0.1 * sim.result.gained;
      });
    },
  };

  // Explication lisible (bouton "pourquoi l'IA a joué ça", Phase 5)
  function evaluateMoves(state, strategy, rng) {
    const p = state.current, before = myPoints(state, p);
    return legalMoves(state).map(s => {
      const sim = simulateMove(state, s);
      const delta = myPoints(sim.next, p) - before;
      const gift = bestHarvestAvailable(sim.next);
      let v;
      if (strategy === 'greedy') v = sim.result.gained;
      else if (strategy === 'contrarian') v = -gift + 0.1 * sim.result.gained;
      else if (strategy === 'random') v = 0;
      else v = delta - 0.35 * gift; // balanced
      return {
        start: s, seeds: sim.result.seeds, landing: sim.result.landing,
        type: sim.result.type, gained: sim.result.gained,
        deltaScore: delta, giftToNext: gift, value: v,
      };
    }).sort((a, b) => b.value - a.value);
  }

  /* ---- Boucle de partie ------------------------------------------------- */
  // strategyBySeat : tableau de noms d'IA, un par siège.
  function playGame(nPlayers, cfg, strategyBySeat, rng, opts) {
    opts = opts || {};
    const state = initState(nPlayers, cfg, rng, opts.jitter);
    const maxRounds = (cfg.roundsByCount && cfg.roundsByCount[nPlayers]) || 0;
    let starter = cfg.randomFirstPlayer && rng ? Math.floor(rng() * nPlayers) : 0;
    let round = 0, guard = 0;
    while (guard++ < 50000) {
      if (maxRounds > 0) { if (round >= maxRounds) break; }
      else if (isOver(state)) break;       // mode descendant (sans saison)
      // SOURCE : la pluie nourrit les parcelles (les plus vides, ou au hasard)
      if (cfg.rainPerRound > 0) rain(state, cfg.rainPerRound, cfg.randomRain ? rng : null);
      // LEVIER catch-up : rend des graines au joueur en dernière position
      if (cfg.lastPlaceBonus > 0) applyLastPlaceBonus(state, cfg.lastPlaceBonus);
      let passes = 0;
      for (let k = 0; k < nPlayers; k++) {
        state.current = (starter + k) % nPlayers;
        const moves = legalMoves(state);
        if (moves.length) {
          const mv = AIs[strategyBySeat[state.current]](state, rng);
          applyMove(state, mv);
        } else passes++;
      }
      round++;
      if (passes >= nPlayers && maxRounds === 0) break;
      if (cfg.rotateStart) starter = (starter + 1) % nPlayers;
    }
    state.rounds = round;
    state.done = true;
    return { state, scores: scores(state), winner: winner(state), turns: state.turn };
  }

  // SOURCE : ajoute `k` graines. Si rng fourni → parcelles au hasard (variance),
  // sinon → toujours la parcelle la plus vide (déterministe).
  function rain(state, k, rng) {
    for (let i = 0; i < k; i++) {
      let target;
      if (rng) target = Math.floor(rng() * state.ring.length);
      else {
        target = 0;
        for (let j = 1; j < state.ring.length; j++) if (state.ring[j] < state.ring[target]) target = j;
      }
      state.ring[target] += 1;
    }
  }

  // ajoute `k` graines à l'anneau pour aider le joueur le plus en retard :
  // déposées dans les parcelles juste avant son prochain semis idéal — ici,
  // simplement réparties sur les parcelles les plus vides (irrigation ciblée).
  function applyLastPlaceBonus(state, k) {
    const sc = scores(state).map(s => s.points);
    const minPts = Math.min(...sc);
    // n'aide que s'il y a un retard réel (>1 bouquet d'écart)
    if (Math.max(...sc) - minPts < state.cfg.bouquetValue) return;
    for (let i = 0; i < k; i++) {
      let lo = 0;
      for (let j = 1; j < state.ring.length; j++) if (state.ring[j] < state.ring[lo]) lo = j;
      state.ring[lo] += 1;
    }
  }

  return {
    N_TYPES, TYPE_ICONS, TYPE_NAMES, TYPE_SHAPES,
    defaultConfig, makeRng, initState, cloneState, ringTotal,
    legalMoves, applyMove, advance, isOver, rain,
    scorePlayer, scores, winner,
    AIs, evaluateMoves, bestHarvestAvailable, playGame,
  };
});
