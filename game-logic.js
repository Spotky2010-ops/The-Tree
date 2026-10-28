// ------------------------------------------------------------
// Roborock layer (Layer 4 / "r")
// ------------------------------------------------------------

const ROBOROCK_LAYER = "r";

const LAYERS = [
  "p",
  "b",
  "g",
  "e",
  "t",
  "s",
  ROBOROCK_LAYER
];

const LAYER_RES = {
  p: "prestige points",
  b: "boosters",
  g: "generators",
  e: "enhance points",
  t: "time capsules",
  s: "space energy",
  r: "Roborock points",
};

const LAYER_TYPE = {
  p: "normal",
  b: "normal",
  g: "normal",
  e: "normal",
  t: "normal",
  s: "normal",
  r: "normal",
};

function layerUnl(layer) {
  if (layer === "r") return player.s.unl && player.s.points.gte(1e18);
  // other layers...
  return true;
}

function getLayerReq(layer) {
  const req = {
    p: D(0),
    b: D(10),
    g: D(1e3),
    e: D(1e6),
    t: D(1e9),
    s: D(1e12),
    r: D(1e18),
  };
  return req[layer] || D(0);
}

// ------------------------------------------------------------
// Roborock data
// ------------------------------------------------------------

function getRoborockGain() {
  return player.points.add(player.s.points.div(1e9)).pow(0.5).floor();
}

function getRoborockBoost() {
  return player.r.points.add(1).sqrt();
}

// Add to initial player state:
function initPlayer() {
  player.r = {
    unl: false,
    points: D(0),
    best: D(0),
    buyables: Array(2).fill(0),
    photo: Array(10).fill(0),
    upgs: Array(10).fill(0),
  };
}

// If your game already creates player object elsewhere, just add these entries.


// ------------------------------------------------------------
// Upgrades: 10 Roborock upgrades
// ------------------------------------------------------------

LAYER_UPGS.r = {
  rows: 2,
  cols: 5,
  0: { unl: () => true, cost: () => D(1), effect: () => D(1) }, // placeholder
  1: { unl: () => true, cost: () => D(2), effect: () => D(1) },
  2: { unl: () => true, cost: () => D(4), effect: () => D(1) },
  3: { unl: () => true, cost: () => D(8), effect: () => D(1) },
  4: { unl: () => true, cost: () => D(16), effect: () => D(1) },
  5: { unl: () => true, cost: () => D(32), effect: () => D(1) },
  6: { unl: () => true, cost: () => D(64), effect: () => D(1) },
  7: { unl: () => true, cost: () => D(128), effect: () => D(1) },
  8: { unl: () => true, cost: () => D(256), effect: () => D(1) },
  9: { unl: () => true, cost: () => D(512), effect: () => D(1) },
};

function getRoborockUpgradeCost(id) {
  const costs = [
    D(1), D(2), D(4), D(8), D(16),
    D(32), D(64), D(128), D(256), D(512)
  ];
  return costs[id] || D(1);
}

function buyRoborockUpgrade(id) {
  const cost = getRoborockUpgradeCost(id);
  if (player.r.points.lt(cost)) return;
  if (player.r.upgs[id]) return;

  player.r.points = player.r.points.sub(cost);
  player.r.upgs[id] = 1;
}

// ------------------------------------------------------------
// 2 Roborock buyables
// ------------------------------------------------------------

LAYER_BUYABLES.r = [
  {
    cost(x) {
      return D(10).mul(D(10).pow(x));
    },
    effect(x) {
      return D(1).add(x).mul(1.5);
    },
    unl() {
      return true;
    }
  },
  {
    cost(x) {
      return D(100).mul(D(10).pow(x));
    },
    effect(x) {
      return D(1).add(x).mul(2);
    },
    unl() {
      return true;
    }
  }
];

function buyRoborockBuyable(id) {
  const buyable = LAYER_BUYABLES.r[id];
  if (!buyable) return;

  const owned = player.r.buyables[id] || 0;
  const cost = buyable.cost(owned);
  if (player.r.points.lt(cost)) return;

  player.r.points = player.r.points.sub(cost);
  player.r.buyables[id] = owned + 1;
}

// ------------------------------------------------------------
// 10 photo upgrades
// ------------------------------------------------------------

PHOTO_UPGRADES.r = [
  { name: "Photo 1", cost: D(5), effect: () => D(1) },
  { name: "Photo 2", cost: D(10), effect: () => D(1) },
  { name: "Photo 3", cost: D(20), effect: () => D(1) },
  { name: "Photo 4", cost: D(40), effect: () => D(1) },
  { name: "Photo 5", cost: D(80), effect: () => D(1) },
  { name: "Photo 6", cost: D(160), effect: () => D(1) },
  { name: "Photo 7", cost: D(320), effect: () => D(1) },
  { name: "Photo 8", cost: D(640), effect: () => D(1) },
  { name: "Photo 9", cost: D(1280), effect: () => D(1) },
  { name: "Photo 10", cost: D(2560), effect: () => D(1) },
];

function buyPhotoUpgrade(id) {
  const photo = PHOTO_UPGRADES.r[id];
  if (!photo) return;
  if (player.r.photo[id]) return;
  if (player.r.points.lt(photo.cost)) return;

  player.r.points = player.r.points.sub(photo.cost);
  player.r.photo[id] = 1;
}

// ------------------------------------------------------------
// Example reset logic
// ------------------------------------------------------------

function doReset(layer) {
  if (layer === "r") {
    player.r.points = D(0);
    player.r.best = player.r.best.max(player.r.points);
    return;
  }

  // existing reset logic...
}

// ------------------------------------------------------------
// Example layer tab rendering
// ------------------------------------------------------------

function renderRoborockTab() {
  // your Vue template can read:
  // player.r.points
  // player.r.upgs
  // player.r.buyables
  // player.r.photo
}
