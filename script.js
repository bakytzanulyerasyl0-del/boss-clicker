let money = 0;
let damage = 1;

let critChance = 0;
let critPower = 2;

let goldBonus = 1;
let passiveIncome = 0;

let bossLevel = 1;
let bossMaxHp = 20;
let bossHp = bossMaxHp;

let autoAttack = false;
let autoSpeed = 1200;
let autoTimer = null;

let isDead = false;

// ЗВУКИ
const bgMusic = document.getElementById("bgMusic");
const hitSound = document.getElementById("hitSound");
const buySound = document.getElementById("buySound");

let audioStarted = false;

function startAudio() {
  if (!audioStarted) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(()=>{});
    audioStarted = true;
  }
}

// ---------- UI ----------
function updateUI(text="") {
  if (bossHp < 0 || isNaN(bossHp)) bossHp = 0;

  document.getElementById("money").innerText = Math.floor(money);
  document.getElementById("damage").innerText = damage;
  document.getElementById("bossHp").innerText = bossHp;
  document.getElementById("crit").innerText =
    Math.floor(critChance * 100) + "%";

  document.getElementById("hpFill").style.width =
    Math.max(0, (bossHp / bossMaxHp) * 100) + "%";

  if (text) document.getElementById("text").innerText = text;
}

// ---------- АТАКА ----------
function attack() {
  if (isDead) return;

  hitSound.currentTime = 0;
  hitSound.play().catch(()=>{});

  let dmg = damage;
  if (Math.random() < critChance) {
    dmg = Math.floor(dmg * critPower);
  }

  bossHp -= dmg;

  if (bossHp <= 0) {
    bossHp = 0;
    killBoss();
  } else {
    updateUI("⚔️ Урон " + dmg);
  }
}

// ---------- СМЕРТЬ БОССА ----------
function killBoss() {
  isDead = true;

  let reward = Math.floor((5 + bossLevel * 2) * goldBonus);
  money += reward;

  updateUI("💀 Босс убит! +" + reward + " 💰");

  setTimeout(() => {
    bossLevel++;
    bossMaxHp = Math.floor(bossMaxHp * 1.3 + 15);
    bossHp = bossMaxHp;
    isDead = false;
    updateUI("👹 Новый босс • Уровень " + bossLevel);
  }, 600);
}

// ---------- ПРОКАЧКИ ----------
function buy(cost, action, text) {
  if (money >= cost) {
    money -= cost;
    action();
    buySound.currentTime = 0;
    buySound.play().catch(()=>{});
    updateUI(text);
  }
}

function buyDamage(){ buy(10, ()=>damage+=1, "+1 урон"); }
function buyDamage5(){ buy(50, ()=>damage+=5, "+5 урон"); }
function buyDamage10(){ buy(120, ()=>damage+=10, "+10 урон"); }
function buyDamageX2(){ buy(300, ()=>damage*=2, "x2 урон"); }
function buyDamageX5(){ buy(1200, ()=>damage*=5, "x5 урон"); }

function buyCrit(){ buy(100, ()=>critChance+=0.05, "+5% крит"); }
function buyCritPower(){ buy(250, ()=>critPower=3, "Крит x3"); }

function buyGold(){ buy(150, ()=>goldBonus*=1.5, "Золото x1.5"); }
function buyPassive(){ buy(200, ()=>passiveIncome+=1, "Пассив +1"); }

// ---------- AUTO ----------
function buyAuto(){
  if (!autoAttack) {
    buy(200, ()=>{
      autoAttack = true;
      autoTimer = setInterval(()=>{
        if (!isDead) attack();
      }, autoSpeed);
    }, "🤖 Авто-удар");
  }
}

function buyAutoSpeed(){
  buy(400, ()=>{
    autoSpeed = Math.max(300, autoSpeed-200);
    if (autoAttack) {
      clearInterval(autoTimer);
      autoTimer = setInterval(()=>{
        if (!isDead) attack();
      }, autoSpeed);
    }
  }, "⚡ Авто быстрее");
}

// ---------- ПАССИВ ----------
setInterval(()=>{
  money += passiveIncome;
  updateUI();
},1000);

// ---------- КЛИК (БЕЗ ДУБЛЕЙ) ----------
const monster = document.getElementById("monster");
monster.onclick = attack;

// ---------- СТАРТ ----------
updateUI("Ткни по монстру");
