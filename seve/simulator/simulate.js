/* ============================================================================
 * SÈVE — Simulateur d'équilibrage (Node)
 * Lance 1000 parties par configuration, mesure les métriques, signale les
 * red flags définis dans le plan de la Phase 3.
 *   usage: node simulate.js [gamesPerConfig] [seed]
 * ========================================================================== */
const E = require('./engine.js');

const GAMES = parseInt(process.argv[2] || '1000', 10);
const SEED0 = parseInt(process.argv[3] || '12345', 10);
const STRATS = ['random', 'greedy', 'balanced', 'contrarian'];

// ---- utilitaires stats -----------------------------------------------------
function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
function std(a) { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); }
function pct(x) { return (100 * x).toFixed(1) + '%'; }

// permutation aléatoire (Fisher-Yates) avec rng
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- expérience MIXTE : stratégies assignées au hasard aux sièges ----------
function runMixed(nPlayers, cfg, games, seed) {
  const seatWins = new Array(nPlayers).fill(0);
  const stratWins = {}, stratGames = {};
  STRATS.forEach(s => { stratWins[s] = 0; stratGames[s] = 0; });
  const turnsArr = [], gapArr = [];
  const typeHarvest = [0, 0, 0, 0];
  const distHist = {};

  for (let g = 0; g < games; g++) {
    const rng = E.makeRng(seed + g * 2654435761);
    // assigne nPlayers stratégies (permutation du pool, tronquée/répétée si besoin)
    let pool = shuffle(STRATS, rng);
    const seats = [];
    for (let i = 0; i < nPlayers; i++) seats.push(pool[i % pool.length]);
    const res = E.playGame(nPlayers, cfg, seats, rng, { jitter: false });
    seatWins[res.winner]++;
    seats.forEach((s, i) => { stratGames[s]++; if (i === res.winner) stratWins[s]++; });
    turnsArr.push(res.turns);
    const pts = res.scores.map(s => s.points);
    gapArr.push(Math.max(...pts) - Math.min(...pts));
    res.state.harvestTypeCount.forEach((v, i) => typeHarvest[i] += v);
    Object.entries(res.state.distanceCount).forEach(([k, v]) => distHist[k] = (distHist[k] || 0) + v);
  }
  const stratWR = {};
  STRATS.forEach(s => stratWR[s] = stratGames[s] ? stratWins[s] / stratGames[s] : 0);
  return {
    nPlayers, games,
    seatWR: seatWins.map(w => w / games),
    stratWR,
    turnsMean: mean(turnsArr), turnsStd: std(turnsArr),
    gapMean: mean(gapArr), gapStd: std(gapArr),
    typeHarvest, distHist,
  };
}

// ---- expérience MIROIR : tous 'balanced' -> avantage de siège pur ----------
function runMirror(nPlayers, cfg, games, seed) {
  const seatWins = new Array(nPlayers).fill(0);
  for (let g = 0; g < games; g++) {
    const rng = E.makeRng(seed + 7 + g * 40503);
    const seats = new Array(nPlayers).fill('balanced');
    // jitter ON : variété nécessaire car miroir déterministe sinon
    const res = E.playGame(nPlayers, cfg, seats, rng, { jitter: true });
    seatWins[res.winner]++;
  }
  return seatWins.map(w => w / games);
}

// ---- détection des red flags ----------------------------------------------
function redFlags(mixed, mirrorSeatWR) {
  const flags = [];
  const n = mixed.nPlayers;
  // 1. stratégie dominante (>40% à 4j ; baseline 25%)
  if (n === 4) {
    for (const s of STRATS) if (mixed.stratWR[s] > 0.40)
      flags.push(`STRATÉGIE DOMINANTE: ${s} ${pct(mixed.stratWR[s])} > 40% (4j)`);
  }
  // 2. avantage 1er joueur : écart winrate entre sièges > 5 pts (miroir)
  const spread = (Math.max(...mirrorSeatWR) - Math.min(...mirrorSeatWR)) * 100;
  const fair = 100 / n;
  if (spread > 5)
    flags.push(`AVANTAGE POSITION: écart sièges ${spread.toFixed(1)} pts > 5 (miroir, équité=${fair.toFixed(1)}%) [${mirrorSeatWR.map(pct).join(' ')}]`);
  // 3. action morte : un type récolté <5% ou une distance <5% du volume total
  const totT = mixed.typeHarvest.reduce((a, b) => a + b, 0);
  mixed.typeHarvest.forEach((v, i) => {
    if (v / totT < 0.05) flags.push(`ACTION MORTE: type ${E.TYPE_NAMES[i]} ${pct(v / totT)} récolté <5%`);
  });
  // 4. durée instable : std > 30% de la moyenne
  if (mixed.turnsStd / mixed.turnsMean > 0.30)
    flags.push(`DURÉE INSTABLE: std ${mixed.turnsStd.toFixed(1)} = ${pct(mixed.turnsStd / mixed.turnsMean)} de la moyenne > 30%`);
  // 5. hasard : random >15% (trop de hasard) ou <5% (zéro accessibilité)
  const rw = mixed.stratWR.random;
  if (rw > 0.15) flags.push(`TROP DE HASARD: random gagne ${pct(rw)} > 15%`);
  if (rw < 0.05) flags.push(`ZÉRO ACCESSIBILITÉ: random gagne ${pct(rw)} < 5%`);
  return flags;
}

// ---- rapport ---------------------------------------------------------------
function report(cfg, label) {
  const lines = [];
  lines.push(`\n══════════ SÈVE — ${label} (${GAMES} parties/config, seed ${SEED0}) ══════════`);
  lines.push(`config: seedsPerPlot=${cfg.seedsPerPlot} bouquet=${cfg.bouquetValue} single=${cfg.singleValue} endThreshold=${cfg.endThreshold} lastPlaceBonus=${cfg.lastPlaceBonus}`);
  let allFlags = [];
  for (const n of [2, 3, 4]) {
    const mixed = runMixed(n, cfg, GAMES, SEED0);
    const mirror = runMirror(n, cfg, GAMES, SEED0);
    const flags = redFlags(mixed, mirror);
    allFlags = allFlags.concat(flags.map(f => `[${n}j] ${f}`));
    lines.push(`\n── ${n} joueurs ──`);
    lines.push(`  winrate/stratégie : ` + STRATS.map(s => `${s} ${pct(mixed.stratWR[s])}`).join('  '));
    lines.push(`  winrate/siège(mixte): ` + mixed.seatWR.map(pct).join('  '));
    lines.push(`  winrate/siège(miroir): ` + mirror.map(pct).join('  ') + `  (écart ${((Math.max(...mirror) - Math.min(...mirror)) * 100).toFixed(1)} pts)`);
    lines.push(`  durée tours        : moyenne ${mixed.turnsMean.toFixed(1)}  std ${mixed.turnsStd.toFixed(1)} (${pct(mixed.turnsStd / mixed.turnsMean)})`);
    lines.push(`  écart de score     : moyenne ${mixed.gapMean.toFixed(1)}  std ${mixed.gapStd.toFixed(1)}`);
    const totT = mixed.typeHarvest.reduce((a, b) => a + b, 0);
    lines.push(`  récolte/type       : ` + mixed.typeHarvest.map((v, i) => `${E.TYPE_ICONS[i]} ${pct(v / totT)}`).join('  '));
    const dk = Object.keys(mixed.distHist).map(Number).sort((a, b) => a - b);
    const totD = Object.values(mixed.distHist).reduce((a, b) => a + b, 0);
    lines.push(`  distance de semis  : ` + dk.map(d => `${d}:${pct(mixed.distHist[d] / totD)}`).join(' '));
    if (flags.length) flags.forEach(f => lines.push(`  🚩 ${f}`));
    else lines.push(`  ✅ aucun red flag`);
  }
  lines.push(`\n── BILAN red flags ${label} ──`);
  if (allFlags.length) allFlags.forEach(f => lines.push(`  🚩 ${f}`));
  else lines.push(`  ✅ AUCUN RED FLAG sur toutes les configurations`);
  return { text: lines.join('\n'), flags: allFlags };
}

// ---- main ------------------------------------------------------------------
const cfg = E.defaultConfig(JSON.parse(process.env.SEVE_CFG || '{}'));
const out = report(cfg, process.env.SEVE_LABEL || 'v0.1');
console.log(out.text);
console.log(`\nTOTAL red flags: ${out.flags.length}`);
