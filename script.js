// ===== ОСНОВНЫЕ ДАННЫЕ =====
let level = 1;

let maxHp = 100;
let bossHp = maxHp;

let money = 0;
let damage = 5;
let reward = 10;

// ===== ПРОКАЧКИ =====
let crit = 0;        // %
let critMult = 2;
let multi = 1;
let rage = 0;

let explosion = 0;
let fire = 0;
let shock = 0;
let bleed = 0;

// ===== ЦЕНЫ =====
let prices = {
  damage: 20,
  crit: 40,
  critMult: 80,
  multi: 60,
  gold: 50,
  rage: 70,
  explosion: 100,
  fire: 120,
  shock: 140,
  bleed: 160
};

// ===== DOM =====
const monster = document.getElementById("monster");
const attackBtn = document.getElementById("attackBtn");

const hpText = document.getElementById("bossHp");
const moneyText = document.getElementById("money");
const dmgText = document.getElementById("damage");
const lvlText = document.getElementById("level");
const hpFill = document.getElementById("hpFill");
const hyperText = document.getElementById("hyperText");

// ===== ЗВУКИ =====
const hitSound = document.getElementById("hitSound");
const buySound = document.getElementById("buySound");
const bgSound = document.getElementById("bgSound");
const hyperSound = document.getElementById("hyperSound");

// ===== ФУНКЦИИ =====
function play(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function updateUI() {
  hpText.textContent = Math.max(0, Math.floor(bossHp));
  moneyText.textContent = Math.floor(money);
  dmgText.textContent = damage;
  lvlText.textContent = level;

  let percent = (bossHp / maxHp) * 100;
  if (percent < 0) percent = 0;
  hpFill.style.width = percent + "%";
}

function updatePrices() {
  document.getElementById("priceDamage").textContent = prices.damage;
  document.getElementById("priceCrit").textContent = prices.crit;
  document.getElementById("priceCritMult").textContent = prices.critMult;
  document.getElementById("priceMulti").textContent = prices.multi;
  document.getElementById("priceGold").textContent = prices.gold;
  document.getElementById("priceRage").textContent = prices.rage;
  document.getElementById("priceExplosion").textContent = prices.explosion;
  document.getElementById("priceFire").textContent = prices.fire;
  document.getElementById("priceShock").textContent = prices.shock;
  document.getElementById("priceBleed").textContent = prices.bleed;
}

// ===== АТАКА =====
function attack() {
  play(hitSound);

  monster.classList.add("shake");
  setTimeout(() => monster.classList.remove("shake"), 200);

  let totalDamage = 0;

  for (let i = 0; i < multi; i++) {
    let d = damage;

    if (Math.random() * 100 < crit) d *= critMult;
    if (Math.random() * 100 < explosion) d += 20;
    if (Math.random() * 100 < fire) d += 10;
    if (Math.random() * 100 < shock) d += 15;
    if (Math.random() * 100 < bleed) d += 12;

    d *= (1 + rage / 100);
    totalDamage += d;
  }

  bossHp -= totalDamage;

  if (bossHp <= 0) {
    money += reward;
    level++;
    spawnBoss();
  }

  updateUI();
}

// ===== НОВЫЙ БОСС =====
function spawnBoss() {
  if (level % 5 === 0) {
    document.body.classList.add("hyper");
    hyperText.style.display = "block";
    play(hyperSound);
    maxHp += 250;
  } else {
    document.body.classList.remove("hyper");
    hyperText.style.display = "none";
    maxHp += 80;
  }

  bossHp = maxHp;
}

// ===== ПОКУПКИ =====
function buy(key, action) {
  if (money < prices[key]) return;

  money -= prices[key];
  prices[key] = Math.floor(prices[key] * 1.4);
  action();

  play(buySound);
  updatePrices();
  updateUI();
}

// ===== КНОПКИ ПРОКАЧЕК =====
document.getElementById("upDamage").onclick = () =>
  buy("damage", () => damage += 5);

document.getElementById("upCrit").onclick = () =>
  buy("crit", () => crit += 5);

document.getElementById("upCritMult").onclick = () =>
  buy("critMult", () => critMult += 0.5);

document.getElementById("upMulti").onclick = () =>
  buy("multi", () => multi++);

document.getElementById("upGold").onclick = () =>
  buy("gold", () => reward += 5);

document.getElementById("upRage").onclick = () =>
  buy("rage", () => rage += 5);

document.getElementById("upExplosion").onclick = () =>
  buy("explosion", () => explosion += 5);

document.getElementById("upFire").onclick = () =>
  buy("fire", () => fire += 5);

document.getElementById("upShock").onclick = () =>
  buy("shock", () => shock += 5);

document.getElementById("upBleed").onclick = () =>
  buy("bleed", () => bleed += 5);

// ===== КЛИК + TOUCH =====
attackBtn.addEventListener("click", attack);
attackBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  attack();
});

// ===== ФОНОВЫЙ ЗВУК НА МОБИЛКЕ =====
document.body.addEventListener("touchstart", () => {
  if (bgSound.paused) bgSound.play().catch(()=>{});
}, { once: true });

// ===== СТАРТ =====
spawnBoss();
updatePrices();
updateUI();
