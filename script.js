// ===== ОСНОВА =====
let maxHp = 100;
let hp = maxHp;

let money = 0;
let damage = 1;
let goldReward = 10;

// ===== ПРОКАЧКИ =====
let critChance = 0;
let critMult = 2;
let multiHit = 1;
let fire = 0;
let rage = 0;
let autoDps = 0;

// ===== ЦЕНЫ =====
let prices = {
  Damage: 10,
  Gold: 25,
  Crit: 40,
  CritMult: 60,
  Multi: 80,
  Fire: 100,
  Rage: 120,
  Auto: 150
};

// ===== DOM =====
const hpText = document.getElementById("hpText");
const moneyText = document.getElementById("money");
const damageText = document.getElementById("damage");
const hpFill = document.getElementById("hpFill");
const monster = document.getElementById("monster");

const hitSound = document.getElementById("hitSound");
const buySound = document.getElementById("buySound");
const bgSound = document.getElementById("bgSound");

// ===== ЗВУК =====
function play(s){
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(()=>{});
}

// ===== UI =====
function updateUI(){
  hpText.textContent = hp;
  moneyText.textContent = money;
  damageText.textContent = damage;
  hpFill.style.width = (hp / maxHp * 100) + "%";

  for (let k in prices){
    const el = document.getElementById("price" + k);
    if (el) el.textContent = prices[k];
  }
}

// ===== ТЕКСТ УРОНА (ВОЗЛЕ БОССА) =====
function showDamageText(text){
  const dmg = document.createElement("div");
  dmg.textContent = text;
  dmg.className = "damage-text";

  const rect = monster.getBoundingClientRect();
  const offsetX = Math.random() * 100 - 50;
  const offsetY = Math.random() * 60 - 30;

  dmg.style.left = rect.left + rect.width / 2 + offsetX + "px";
  dmg.style.top = rect.top + rect.height / 2 + offsetY + "px";

  document.body.appendChild(dmg);
  setTimeout(() => dmg.remove(), 1000);
}

// ===== АТАКА ПО МОНСТРУ =====
function attack(){
  play(hitSound);

  monster.classList.add("shake");
  setTimeout(()=>monster.classList.remove("shake"),200);

  let total = 0;
  let crit = false;

  for (let i = 0; i < multiHit; i++){
    let d = damage;

    if (Math.random() * 100 < critChance){
      d *= critMult;
      crit = true;
    }

    if (Math.random() * 100 < fire) d += 5;
    d *= (1 + rage / 100);

    total += Math.floor(d);
  }

  hp -= total;
  showDamageText((crit ? "CRIT " : "") + "-" + total);

  if (hp <= 0){
    money += goldReward;
    maxHp += 30;
    hp = maxHp;
  }

  updateUI();
}

// ===== КЛИК ПО КАРТИНКЕ =====
monster.addEventListener("click", attack);
monster.addEventListener("touchstart", e => {
  e.preventDefault();
  attack();
});

// ===== ПОКУПКИ =====
function buy(key, action){
  if (money < prices[key]) return;
  money -= prices[key];
  prices[key] = Math.floor(prices[key] * 1.6);
  play(buySound);
  action();
  updateUI();
}

document.getElementById("upDamage").onclick =
()=>buy("Damage", ()=>damage++);

document.getElementById("upGold").onclick =
()=>buy("Gold", ()=>goldReward += 5);

document.getElementById("upCrit").onclick =
()=>buy("Crit", ()=>critChance += 5);

document.getElementById("upCritMult").onclick =
()=>buy("CritMult", ()=>critMult += 0.5);

document.getElementById("upMulti").onclick =
()=>buy("Multi", ()=>multiHit++);

document.getElementById("upFire").onclick =
()=>buy("Fire", ()=>fire += 5);

document.getElementById("upRage").onclick =
()=>buy("Rage", ()=>rage += 5);

document.getElementById("upAuto").onclick =
()=>buy("Auto", ()=>autoDps++);

// ===== АВТО УРОН =====
setInterval(()=>{
  if (autoDps > 0){
    hp -= autoDps;
    showDamageText("-" + autoDps);

    if (hp <= 0){
      money += goldReward;
      maxHp += 30;
      hp = maxHp;
    }
    updateUI();
  }
},1000);

// ===== ФОНОВЫЙ ЗВУК =====
document.body.addEventListener("touchstart",()=>{
  if (bgSound && bgSound.paused){
    bgSound.play().catch(()=>{});
  }
},{once:true});

updateUI();
