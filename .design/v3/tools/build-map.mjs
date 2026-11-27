// Gera v3/images/world-map.svg para o banner Multi-moeda: uma malha sutil de paralelos e meridianos e, por cima,
// os continentes numa silhueta só (sem fronteiras, sem a Antártida), em geoNaturalEarth1, já recortados no quadro
// da mídia e com a cor embutida. Imprime também a posição das cidades (em % do quadro) e os arcos até a conta,
// para colar na parte 13: as 7 cidades com pílula e as das outras 10 moedas da lista de 16 (rede de fundo).
// O repo não ganha dependência: as libs vêm do cache do npx.
// Uso: npx -y -p d3-geo@3 -p topojson-server@3 -p topojson-client@3 node .design/v3/tools/build-map.mjs
import assert from "node:assert";
import { createRequire } from "node:module";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const bin = process.env.PATH.split(delimiter).find((p) => p.endsWith("node_modules/.bin") && existsSync(join(p, "../d3-geo")));
if (!bin) { console.error("rode pelo npx (veja o cabeçalho): o d3-geo não está no PATH"); process.exit(2); }
const require = createRequire(join(bin, "x.js"));
const { geoNaturalEarth1, geoPath, geoGraticule } = await import(pathToFileURL(require.resolve("d3-geo")));
const { topology } = require("topojson-server");
const { merge } = require("topojson-client");

// Quadro = caixa de mídia do banner alto em px de design (1008 × 454). No mobile o banner mostra a metade esquerda.
const W = 1008, H = 454;
const WORLD_W = 1370;        // largura dos 360° nessa escala: o mapa passa das duas laterais
const CENTER = [20, 18];     // longitude e latitude que caem no centro do quadro
const FILL = "#0a0a0b", OPACITY = 0.1;
const EPS = 0.45;            // tolerância da simplificação, em px de design
const ACCOUNT = [-14, -3];   // "Sua conta": Atlântico equatorial, onde os arcos convergem
// [nome, lon, lat, flecha do arco em fração da corda (positivo curva para a direita de quem vai da cidade à conta)]
const CITIES = [
  ["São Paulo", -46.63, -23.55, -0.24],
  ["Nova York", -74.0, 40.71, -0.2],
  ["Cidade do México", -99.13, 19.43, 0.16],
  ["Lisboa", -9.14, 38.72, -0.1],
  ["Berlim", 13.4, 52.52, -0.2],
  ["Varsóvia", 21.01, 52.23, -0.34],
  ["Tóquio", 139.69, 35.68, -0.2],
];
// as outras 10 moedas da lista de 16: ponto pequeno e arco tênue, sem pílula
const MINOR = [
  ["Bogotá", -74.07, 4.71, 0.12],
  ["Lima", -77.04, -12.05, 0.1],
  ["La Paz", -68.15, -16.5, -0.1],
  ["Buenos Aires", -58.38, -34.6, 0.14],
  ["Montevidéu", -56.16, -34.9, -0.08],
  ["Praga", 14.42, 50.08, -0.12],
  ["Budapeste", 19.04, 47.5, -0.24],
  ["Bucareste", 26.1, 44.43, -0.36],
  ["Istambul", 28.98, 41.01, -0.44],
  ["Seul", 126.98, 37.57, -0.12],
];

const projection = geoNaturalEarth1().rotate([-CENTER[0], 0]).fitWidth(WORLD_W, { type: "Sphere" }).translate([0, 0]);
const c = projection(CENTER);
projection.translate([W / 2 - c[0], H / 2 - c[1]]).clipExtent([[-6, -6], [W + 6, H + 6]]);

// dissolve as fronteiras: uma topologia dos países e a união de todos eles
const world = JSON.parse(readFileSync(join(repo, "v2/images/world-countries.json"), "utf8"));
const features = world.features.filter((f) => f.properties.n !== "Antarctica");
assert(features.length === world.features.length - 1, "não achei a Antártida para tirar");
const topo = topology({ land: { type: "FeatureCollection", features } });
const land = merge(topo, topo.objects.land.geometries);

// Douglas-Peucker num anel fechado
function simplify(pts) {
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], dx = pts[b][0] - ax, dy = pts[b][1] - ay, len = Math.hypot(dx, dy);
    let far = -1, max = EPS;
    for (let i = a + 1; i < b; i++) {
      // anel que o d3 já fechou (primeiro ponto = último): a corda tem tamanho zero, vale a distância ao ponto
      const d = len ? Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
      if (d > max) { max = d; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = (r) => Math.abs(r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0)) / 2;

// o d3 devolve "Mx,yLx,y…Z" por trecho; cada um vira inteiros relativos, que é o formato mais curto
const num = (n, first) => (n < 0 || first ? "" : " ") + n;
let points = 0;
function compact(path, closed) {
  let d = "";
  for (const piece of path.split("M").slice(1)) {
    let pts = piece.replace("Z", "").split("L").map((p) => p.split(",").map(Number));
    pts = simplify(pts).map((p) => p.map(Math.round)).filter((p, i, a) => !i || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
    if (closed && pts.length > 1 && pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1]) pts.pop();
    if (closed ? pts.length < 3 || area(pts) < 2 : pts.length < 2) continue; // ilhota menor que 2 px² some
    points += pts.length;
    d += "M" + pts[0][0] + num(pts[0][1]) + "l" + pts.slice(1).map((p, i) => num(p[0] - pts[i][0], !i) + num(p[1] - pts[i][1])).join("") + (closed ? "z" : "");
  }
  assert(d && !/NaN/.test(d), "coordenada inválida no caminho");
  return d;
}
const d = compact(geoPath(projection)(land), true);
const grid = compact(geoPath(projection)(geoGraticule().step([20, 20])()), false);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path fill="none" stroke="${FILL}" stroke-opacity="0.07" d="${grid}"/><path fill="${FILL}" fill-opacity="${OPACITY}" d="${d}"/></svg>\n`;
const out = join(repo, "v3/images/world-map.svg");
writeFileSync(out, svg);
assert(svg.length < 60000, "world-map.svg passou de 60 KB");
console.log(`${out}: ${(svg.length / 1024).toFixed(1)} KB, ${points} pontos, viewBox 0 0 ${W} ${H}`);

// cidades em % do quadro e arcos no mesmo viewBox. O arco sai da conta e termina na cidade, porque o CSS
// desenha do fim para o começo do caminho: assim ele cresce da cidade até a conta.
const acc = projection(ACCOUNT).map(Math.round);
console.log(`\nSua conta: left ${(acc[0] / W * 100).toFixed(2)}% top ${(acc[1] / H * 100).toFixed(2)}%  (${acc})`);
let longest = 0;
for (const [name, lon, lat, bow] of [...CITIES, ["— rede de fundo —"], ...MINOR]) {
  if (lon === undefined) { console.log(name); continue; }
  const [x, y] = projection([lon, lat]).map(Math.round);
  // as de fundo podem cair fora (Buenos Aires e Montevidéu ficam abaixo da borda): o arco delas sai pelo quadro
  assert(MINOR.some((m) => m[0] === name) || (x > 0 && x < W && y > 0 && y < H), name + " caiu fora do quadro");
  const cx = Math.round((x + acc[0]) / 2 - (acc[1] - y) * bow), cy = Math.round((y + acc[1]) / 2 + (acc[0] - x) * bow);
  const at = (t) => [(1 - t) ** 2 * acc[0] + 2 * t * (1 - t) * cx + t * t * x, (1 - t) ** 2 * acc[1] + 2 * t * (1 - t) * cy + t * t * y];
  let len = 0;
  for (let i = 1; i <= 64; i++) { const a = at((i - 1) / 64), b = at(i / 64); len += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  longest = Math.max(longest, len);
  console.log(`${name.padEnd(17)} left ${(x / W * 100).toFixed(2)}% top ${(y / H * 100).toFixed(2)}%  <path d="M${acc[0]} ${acc[1]}Q${cx} ${cy} ${x} ${y}"/>  (${Math.round(len)})`);
}
console.log(`arco mais longo: ${Math.round(longest)} (o tracejado do CSS precisa cobrir isso)`);
