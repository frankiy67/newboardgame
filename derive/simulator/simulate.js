/* ============================================================================
 * DÉRIVE — Simulateur d'équilibrage (Node)
 *   usage: node simulate.js [gamesPerConfig] [seed]
 * ========================================================================== */
const E = require('./engine.js');

const GAMES = parseInt(process.argv[2] || '1000', 10);
const SEED0 = parseInt(process.argv[3] || '12345', 10);
const STRATS = ['random', 'greedy', 'balanced', 'contrarian'];

const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const std = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
const pct = x => (100 * x).toFixed(1) + '%';
function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

function runMixed(nPlayers, cfg, games, seed) {
  const seatWins = new Array(nPlayers).fill(0);
  const stratWins = {}, stratGames = {}; STRATS.forEach(s => { stratWins[s] = 0; stratGames[s] = 0; });
  const turnsArr = [], gapArr = [], colorTaken = [0, 0, 0, 0], costHist = {};
  let majSum = 0, vpSum = 0;
  for (let g = 0; g < games; g++) {
    const rng = E.makeRng(seed + g * 2654435761);
    const pool = shuffle(STRATS, rng), seats = [];
    for (let i = 0; i < nPlayers; i++) seats.push(pool[i % pool.length]);
    const res = E.playGame(nPlayers, cfg, seats, rng, {});
    seatWins[res.winner]++;
    seats.forEach((s, i) => { stratGames[s]++; if (i === res.winner) stratWins[s]++; });
    turnsArr.push(res.turns);
    const pts = res.scores.map(s => s.points);
    gapArr.push(Math.max(...pts) - Math.min(...pts));
    res.state.colorTaken.forEach((v, i) => colorTaken[i] += v);
    Object.entries(res.state.costHist).forEach(([k, v]) => costHist[k] = (costHist[k] || 0) + v);
    res.scores.forEach(s => { majSum += s.maj; vpSum += s.vp; });
  }
  const stratWR = {}; STRATS.forEach(s => stratWR[s] = stratGames[s] ? stratWins[s] / stratGames[s] : 0);
  return { nPlayers, games, seatWR: seatWins.map(w => w / games), stratWR,
    turnsMean: mean(turnsArr), turnsStd: std(turnsArr), gapMean: mean(gapArr), gapStd: std(gapArr),
    colorTaken, costHist, majShare: majSum / (majSum + vpSum) };
}

function runMirror(nPlayers, cfg, games, seed) {
  const seatWins = new Array(nPlayers).fill(0);
  for (let g = 0; g < games; g++) {
    const rng = E.makeRng(seed + 7 + g * 40503);
    const res = E.playGame(nPlayers, cfg, new Array(nPlayers).fill('balanced'), rng, {});
    seatWins[res.winner]++;
  }
  return seatWins.map(w => w / games);
}

function redFlags(mx, mir) {
  const flags = [], n = mx.nPlayers;
  if (n === 4) for (const s of STRATS) if (mx.stratWR[s] > 0.40) flags.push(`STRATÉGIE DOMINANTE: ${s} ${pct(mx.stratWR[s])} > 40% (4j)`);
  const spread = (Math.max(...mir) - Math.min(...mir)) * 100;
  if (spread > 5) flags.push(`AVANTAGE POSITION: écart sièges ${spread.toFixed(1)} pts > 5 (miroir) [${mir.map(pct).join(' ')}]`);
  const totC = mx.colorTaken.reduce((a, b) => a + b, 0);
  mx.colorTaken.forEach((v, i) => { if (v / totC < 0.05) flags.push(`ACTION MORTE: couleur ${E.COL_NAMES[i]} ${pct(v / totC)} < 5%`); });
  // coût-temps mort : un temps proposé mais quasi jamais pris
  const totK = Object.values(mx.costHist).reduce((a, b) => a + b, 0);
  [1, 2, 3, 4].forEach(t => { const v = mx.costHist[t] || 0; if (v / totK < 0.05) flags.push(`COÛT MORT: temps ${t} pris ${pct(v / totK)} < 5%`); });
  if (mx.turnsStd / mx.turnsMean > 0.30) flags.push(`DURÉE INSTABLE: std ${pct(mx.turnsStd / mx.turnsMean)} > 30%`);
  const rw = mx.stratWR.random;
  if (rw > 0.15) flags.push(`TROP DE HASARD: random ${pct(rw)} > 15%`);
  if (rw < 0.05) flags.push(`ZÉRO ACCESSIBILITÉ: random ${pct(rw)} < 5%`);
  return flags;
}

function report(cfg, label) {
  const L = [];
  L.push(`\n══════════ DÉRIVE — ${label} (${GAMES} parties/config, seed ${SEED0}) ══════════`);
  L.push(`config: T=${JSON.stringify(cfg.trackByCount)} market=${cfg.marketSize} maj=${cfg.maj1}/${cfg.maj2}`);
  let all = [];
  for (const n of [2, 3, 4]) {
    const mx = runMixed(n, cfg, GAMES, SEED0), mir = runMirror(n, cfg, GAMES, SEED0);
    const f = redFlags(mx, mir); all = all.concat(f.map(x => `[${n}j] ${x}`));
    L.push(`\n── ${n} joueurs ──`);
    L.push(`  winrate/stratégie : ` + STRATS.map(s => `${s} ${pct(mx.stratWR[s])}`).join('  '));
    L.push(`  winrate/siège(mixte): ` + mx.seatWR.map(pct).join('  '));
    L.push(`  winrate/siège(miroir): ` + mir.map(pct).join('  ') + `  (écart ${((Math.max(...mir) - Math.min(...mir)) * 100).toFixed(1)} pts)`);
    L.push(`  durée tours        : moy ${mx.turnsMean.toFixed(1)}  std ${mx.turnsStd.toFixed(1)} (${pct(mx.turnsStd / mx.turnsMean)})`);
    L.push(`  écart de score     : moy ${mx.gapMean.toFixed(1)}  std ${mx.gapStd.toFixed(1)}  | part majorités ${pct(mx.majShare)}`);
    const totC = mx.colorTaken.reduce((a, b) => a + b, 0);
    L.push(`  prise/couleur      : ` + mx.colorTaken.map((v, i) => `${E.COL_ICONS[i]} ${pct(v / totC)}`).join('  '));
    const totK = Object.values(mx.costHist).reduce((a, b) => a + b, 0);
    L.push(`  prise/temps        : ` + [1, 2, 3, 4].map(t => `t${t}:${pct((mx.costHist[t] || 0) / totK)}`).join('  '));
    if (f.length) f.forEach(x => L.push(`  🚩 ${x}`)); else L.push(`  ✅ aucun red flag`);
  }
  L.push(`\n── BILAN ${label} ──`);
  if (all.length) all.forEach(x => L.push(`  🚩 ${x}`)); else L.push(`  ✅ AUCUN RED FLAG`);
  L.push(`\nTOTAL red flags: ${all.length}`);
  return L.join('\n');
}

const cfg = E.defaultConfig(JSON.parse(process.env.DRV_CFG || '{}'));
console.log(report(cfg, process.env.DRV_LABEL || 'v0.1'));
