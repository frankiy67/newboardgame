/* ============================================================================
 * DÉRIVE — Moteur de jeu (pur, sans UI)
 * Réutilisé tel quel par le prototype HTML (Phase 5) ET le simulateur (Phase 3).
 * Tilt : la barque la plus en amont (en retard) joue ; on rejoue tant qu'on l'est.
 * Compatible Node et navigateur. Aucune dépendance.
 * ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DeriveEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const N_COL = 4;
  const COL_ICONS = ['🔵', '🟠', '🟢', '🟣'];
  const COL_NAMES = ['Saphir', 'Ambre', 'Jade', 'Améthyste'];
  const COL_SHAPES = ['●', '▲', '■', '◆'];  // accessibilité daltonisme

  /* ---- Config (tous les nombres réglables) ------------------------------ */
  function defaultConfig(overrides) {
    const cfg = {
      trackByCount: { 2: 50, 3: 30, 4: 22 }, // T par nb de joueurs (≈ 38-42 tours) [c2/c4]
      marketSize: 5,           // marché large → plus d'agentivité, moins de tirage forcé [c4]
      // bonus de set : indexé par la TAILLE de ta plus grosse cargaison mono-couleur.
      // rendements CARRÉS → la spécialisation profonde (skill) perce le catch-up [c3/c4]
      setBonus: [0, 0, 1, 4, 9, 16, 25, 36, 49, 64, 81],
      majBonus: 0,             // majorités retirées (source de bruit) → -1 règle, skill ↑ [c4]
      randomFirstPlayer: true, // 1er joueur tiré au sort
      // modèle de pioche : par couleur, des cartes {t:temps, vp, count}
      deckTemplate: [
        { t: 1, vp: 0, count: 4 },
        { t: 2, vp: 1, count: 4 },
        { t: 3, vp: 1, count: 3 },
        { t: 4, vp: 2, count: 3 },
      ],
    };
    return Object.assign(cfg, overrides || {});
  }

  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function buildDeck(cfg, rng) {
    const deck = []; let id = 0;
    for (let c = 0; c < N_COL; c++)
      for (const spec of cfg.deckTemplate)
        for (let k = 0; k < spec.count; k++) deck.push({ id: id++, t: spec.t, c, vp: spec.vp });
    return shuffle(deck, rng);
  }

  /* ---- État ------------------------------------------------------------- */
  function initState(nPlayers, cfg, rng, firstPlayer) {
    const T = (cfg.trackByCount && cfg.trackByCount[nPlayers]) || 22;
    const deck = buildDeck(cfg, rng);
    const market = [];
    for (let i = 0; i < cfg.marketSize && deck.length; i++) market.push(deck.pop());
    const fp = firstPlayer != null ? firstPlayer : 0;
    const pos = new Array(nPlayers).fill(0);
    const seq = new Array(nPlayers).fill(0);
    // la barque du 1er joueur est "sur le dessus" (joue en premier)
    for (let k = 0; k < nPlayers; k++) seq[(fp + k) % nPlayers] = nPlayers - k;
    const cargo = []; for (let p = 0; p < nPlayers; p++) cargo.push([0, 0, 0, 0]);
    return {
      cfg, nPlayers, T, deck, market, pos, seq,
      cargo, vp: new Array(nPlayers).fill(0),
      globalSeq: nPlayers, turn: 0, done: false, lastMove: null,
      colorTaken: [0, 0, 0, 0], costHist: {}, vpTaken: 0,
    };
  }

  function cloneState(s) {
    return {
      cfg: s.cfg, nPlayers: s.nPlayers, T: s.T,
      deck: s.deck.slice(), market: s.market.slice(),
      pos: s.pos.slice(), seq: s.seq.slice(),
      cargo: s.cargo.map(c => c.slice()), vp: s.vp.slice(),
      globalSeq: s.globalSeq, turn: s.turn, done: s.done, lastMove: s.lastMove,
      colorTaken: s.colorTaken.slice(), costHist: Object.assign({}, s.costHist), vpTaken: s.vpTaken,
    };
  }

  // barque active = la plus en amont (pos min) parmi les non-arrivées ;
  // égalité → seq max (sur le dessus de la pile = arrivée la plus récente).
  function activeSeat(s) {
    let best = -1;
    for (let p = 0; p < s.nPlayers; p++) {
      if (s.pos[p] >= s.T) continue;
      if (best < 0 || s.pos[p] < s.pos[best] || (s.pos[p] === s.pos[best] && s.seq[p] > s.seq[best])) best = p;
    }
    return best;
  }

  function legalMoves(s) {              // indices de slots du marché disponibles
    const m = []; for (let i = 0; i < s.market.length; i++) if (s.market[i]) m.push(i);
    return m;
  }

  function isOver(s) { return activeSeat(s) < 0; }

  // la barque active prend la carte `slot` (ou dérive de 1 si marché vide)
  function applyTake(s, slot) {
    const p = activeSeat(s);
    if (p < 0) { s.done = true; return null; }
    let info;
    if (s.market.length && slot != null && s.market[slot]) {
      const card = s.market[slot];
      s.market.splice(slot, 1);
      s.pos[p] += card.t;
      s.cargo[p][card.c] += 1;
      s.vp[p] += card.vp;
      if (s.deck.length) s.market.push(s.deck.pop()); // réapprovisionne
      s.colorTaken[card.c] += 1; s.costHist[card.t] = (s.costHist[card.t] || 0) + 1; s.vpTaken += card.vp;
      info = { player: p, card, drift: false };
    } else {                              // marché vide → la barque dérive
      s.pos[p] += 1;
      info = { player: p, card: null, drift: true };
    }
    s.seq[p] = ++s.globalSeq;             // la barque est maintenant sur le dessus
    s.turn++;
    s.lastMove = info;
    if (isOver(s)) s.done = true;
    return info;
  }

  /* ---- Scoring (PV + bonus de set mono-couleur + petit bonus majorité) --- */
  function setBonus(cfg, n) { const b = cfg.setBonus; return b[Math.min(n, b.length - 1)]; }

  function scores(s) {
    const out = s.cargo.map((cg, p) => {
      const largest = Math.max(cg[0], cg[1], cg[2], cg[3]);
      return { vp: s.vp[p], set: setBonus(s.cfg, largest), maj: 0,
        largest, cards: cg[0] + cg[1] + cg[2] + cg[3], points: 0 };
    });
    // petit bonus au leader unique de chaque couleur (eyes-on-opponents, faible déni)
    for (let c = 0; c < N_COL; c++) {
      const counts = s.cargo.map(cg => cg[c]);
      const mx = Math.max(...counts);
      if (mx > 0 && counts.filter(x => x === mx).length === 1)
        out[counts.indexOf(mx)].maj += s.cfg.majBonus;
    }
    out.forEach(o => o.points = o.vp + o.set + o.maj);
    return out;
  }

  function winner(s, rng) {
    const sc = scores(s);
    let best = -1, bi = [];
    for (let i = 0; i < sc.length; i++) {
      if (sc[i].points > best) { best = sc[i].points; bi = [i]; }
      else if (sc[i].points === best) bi.push(i);
    }
    if (bi.length === 1) return bi[0];
    // départage neutre : plus de majorités, puis tirage (pas de biais de siège)
    bi.sort((a, b) => sc[b].maj - sc[a].maj);
    const top = bi.filter(i => sc[i].maj === sc[bi[0]].maj);
    return top[Math.floor((rng ? rng() : Math.random()) * top.length)];
  }

  /* ---- Évaluation pour les IA ------------------------------------------- */
  // gain de score IMMÉDIAT exact si le joueur p prend ce slot (par simulation)
  function immediateDelta(s, slot, p) {
    const before = scores(s)[p].points;
    const c = cloneState(s); c.cargo[p][c.market[slot].c] += 1; c.vp[p] += c.market[slot].vp;
    return scores(c)[p].points - before;
  }
  // « convoitise » adverse : combien ce slot aiderait l'opposant qui en profiterait le plus
  function denial(s, slot, p) {
    let best = 0;
    for (let q = 0; q < s.nPlayers; q++) {
      if (q === p || s.pos[q] >= s.T) continue;
      best = Math.max(best, immediateDelta(s, slot, q));
    }
    return best;
  }

  // note chaque slot selon une stratégie → liste triée (sert au "pourquoi" + aperçu humain)
  function evaluateMoves(s, strategy, rng) {
    const p = activeSeat(s);
    return legalMoves(s).map(slot => {
      const card = s.market[slot];
      const delta = immediateDelta(s, slot, p);
      const den = denial(s, slot, p);
      const tempo = 0.6 * (card.t - 1);          // coût en tours cédés (t=1 → 0)
      let value;
      if (strategy === 'greedy') value = delta;                         // myope : prend le gain immédiat
      else if (strategy === 'balanced') value = delta - tempo + 0.3 * den; // gain net du tempo + un peu de déni
      else if (strategy === 'contrarian') value = 0.5 * delta + 1.0 * den - tempo; // déni d'abord
      else value = 0;                                                   // random
      return { slot, card, t: card.t, c: card.c, vp: card.vp, delta, denial: den, value };
    }).sort((a, b) => b.value - a.value);
  }

  function pickBest(s, strategy, rng) {
    const ev = evaluateMoves(s, strategy, rng);
    if (!ev.length) return null;
    if (strategy === 'random') return ev[Math.floor((rng ? rng() : Math.random()) * ev.length)].slot;
    const best = ev[0].value, top = ev.filter(e => Math.abs(e.value - best) <= 1e-9);
    return top[Math.floor((rng ? rng() : Math.random()) * top.length)].slot;
  }

  const AIs = { random: pickBest, greedy: pickBest, balanced: pickBest, contrarian: pickBest };

  /* ---- Contrôleur de match (partagé simulateur + proto HTML) ------------ */
  function createMatch(nPlayers, cfg, seatStrategy, rng, opts) {
    opts = opts || {};
    const fp = cfg.randomFirstPlayer && rng ? Math.floor(rng() * nPlayers) : 0;
    const m = {
      cfg, nPlayers, rng, seatStrategy,
      state: initState(nPlayers, cfg, rng, fp),
      done: false, lastAI: null,
    };
    m.done = isOver(m.state);
    return m;
  }
  function currentIsHuman(m) { return !m.done && m.seatStrategy[activeSeat(m.state)] == null; }

  function matchPlay(m, slot) {
    if (m.done) return null;
    const seat = activeSeat(m.state);
    let info;
    if (m.seatStrategy[seat] == null) {                 // humain
      info = applyTake(m.state, slot);
    } else {                                            // IA
      const strat = m.seatStrategy[seat];
      const cands = evaluateMoves(m.state, strat, m.rng);
      const chosen = pickBest(m.state, strat, m.rng);
      info = applyTake(m.state, chosen);
      m.lastAI = { seat, strat, slot: chosen, candidates: cands };
    }
    if (m.state.done) m.done = true;
    return info;
  }

  function playGame(nPlayers, cfg, strategyBySeat, rng, opts) {
    const m = createMatch(nPlayers, cfg, strategyBySeat, rng, opts);
    let guard = 0;
    while (!m.done && guard++ < 100000) matchPlay(m);
    return { state: m.state, scores: scores(m.state), winner: winner(m.state, rng), turns: m.state.turn };
  }

  return {
    N_COL, COL_ICONS, COL_NAMES, COL_SHAPES,
    defaultConfig, makeRng, buildDeck, initState, cloneState,
    activeSeat, legalMoves, applyTake, isOver, scores, winner,
    AIs, evaluateMoves, pickBest, createMatch, matchPlay, currentIsHuman, playGame,
  };
});
