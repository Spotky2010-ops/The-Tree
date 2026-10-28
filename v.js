var app;

window.player = window.player || {
  tab: "tree",
  points: 0,
  p: { unl: false, points: 0, best: 0 },
  b: { unl: false, points: 0, best: 0 },
  g: { unl: false, points: 0, best: 0 },
  e: { unl: false, points: 0, best: 0 },
  t: { unl: false, points: 0, best: 0 },
  s: { unl: false, points: 0, best: 0 },
  r: {
    unl: false,
    points: 0,
    best: 0,
    upgs: Array(10).fill(0),
    buyables: Array(2).fill(0),
    photo: Array(10).fill(0),
  },
};

if (typeof LAYERS === "undefined") {
  var LAYERS = ["p", "b", "g", "e", "t", "s", "r"];
}
if (!LAYERS.includes("r")) {
  LAYERS.push("r");
}

if (typeof LAYER_RES === "undefined") {
  var LAYER_RES = {};
}
LAYER_RES.r = LAYER_RES.r || "Roborock points";

if (typeof LAYER_TYPE === "undefined") {
  var LAYER_TYPE = {};
}
LAYER_TYPE.r = LAYER_TYPE.r || "normal";

if (typeof LAYER_UPGS === "undefined") {
  var LAYER_UPGS = {};
}
if (!LAYER_UPGS.r) {
  LAYER_UPGS.r = { rows: 2, cols: 5 };
  for (let i = 0; i < 10; i++) {
    LAYER_UPGS.r[i] = {
      unl: () => true,
      cost: () => Math.pow(2, i),
      effect: () => 1 + i,
    };
  }
}

if (typeof LAYER_BUYABLES === "undefined") {
  var LAYER_BUYABLES = {};
}
if (!LAYER_BUYABLES.r) {
  LAYER_BUYABLES.r = [
    {
      cost: (x) => 10 * Math.pow(10, x),
      effect: (x) => 1 + x * 1.5,
      unl: () => true,
    },
    {
      cost: (x) => 100 * Math.pow(10, x),
      effect: (x) => 1 + x * 2,
      unl: () => true,
    },
  ];
}

if (typeof PHOTO_UPGRADES === "undefined") {
  var PHOTO_UPGRADES = {};
}
if (!PHOTO_UPGRADES.r) {
  PHOTO_UPGRADES.r = Array.from({ length: 10 }, (_, i) => ({
    name: "Photo " + (i + 1),
    cost: Math.pow(2, i + 2),
    effect: () => 1 + i,
  }));
}

function layerUnl(layer) {
  if (typeof layer !== "string") return false;
  if (layer === "r") return !!(window.player && window.player.s && window.player.s.unl);
  if (typeof window.layerUnl === "function") return window.layerUnl(layer);
  return true;
}

function buyRoborockUpgrade(id) {
  if (!window.player || !window.player.r) return;
  if (!LAYER_UPGS.r || !LAYER_UPGS.r[id]) return;
  const cost = LAYER_UPGS.r[id].cost();
  if (window.player.r.points < cost) return;
  if (window.player.r.upgs[id]) return;
  window.player.r.points -= cost;
  window.player.r.upgs[id] = 1;
}

function buyRoborockBuyable(id) {
  if (!window.player || !window.player.r) return;
  const buyable = (LAYER_BUYABLES.r || [])[id];
  if (!buyable) return;
  const owned = window.player.r.buyables[id] || 0;
  const cost = buyable.cost(owned);
  if (window.player.r.points < cost) return;
  window.player.r.points -= cost;
  window.player.r.buyables[id] = owned + 1;
}

function buyPhotoUpgrade(id) {
  if (!window.player || !window.player.r) return;
  const photo = (PHOTO_UPGRADES.r || [])[id];
  if (!photo) return;
  if (window.player.r.photo[id]) return;
  if (window.player.r.points < photo.cost) return;
  window.player.r.points -= photo.cost;
  window.player.r.photo[id] = 1;
}

function load() {
  if (typeof loadVue === "function") {
    loadVue();
  }
}

function loadVue() {
  app = new Vue({
    el: "#app",
    data: {
      player: window.player,
      format,
      formatWhole,
      getResetGain,
      getLayerReq,
      getNextAt,
      layerUnl,
      getLayerEffDesc,
      doReset,
      buyUpg,
      getGenPowerEff,
      getEnhancerCost,
      getEnhancerEff,
      getEnhancerEff2,
      getTimeEnergyEff,
      getExtCapsuleCost,
      getSpace,
      getSpaceBuildingCost,
      getSpaceBuildingEffDesc,
      buyBuilding,
      LAYERS,
      LAYER_RES,
      LAYER_TYPE,
      LAYER_UPGS,
      LAYER_BUYABLES,
      PHOTO_UPGRADES,
      buyRoborockUpgrade,
      buyRoborockBuyable,
      buyPhotoUpgrade,
    },
  });
}
