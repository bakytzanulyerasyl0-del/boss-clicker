let money = 0;
let damage = 1;

let critChance = 0;
let critPower = 2;

let goldBonus = 1;
let passiveIncome = 0;

let bossMaxHp = 20;
let bossHp = bossMaxHp;

let autoAttack = false;
let autoSpeed = 1200;
let autoCount = 1;
let autoTimer = null;

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
function updateUI(text = "") {
  document.getElementById("money").innerText = money;
  document.getElementById("damage").innerText = damage;
  document.getElementById("bossHp").innerText = bossHp;
  document.getElementById("crit").innerText =
    Math.floor(critChance * 100) + "%";

  document.getElementById("hpFill").style.width =
    Math.max(0, bossHp / bossMaxHp * 100) + "%";

  if (text) document.getElementById("text").innerText = text;
}

// ---------- АТАКА ----------
function attack() {
  hitSound.currentTime = 0;
  hitSound.play().catch(()=>{});

  let dmg = damage;
  let crit = Math.random() < critChance;

  if (crit) dmg *= critPower;

  bossHp -= dmg;

  if (bossHp <= 0) {
    bossHp = bossMaxHp;
    money += Math.floor(5 * goldBonus);
    updateUI("👹 Босс побеждён!");
  } else {
    updateUI(crit ? "💥 КРИТ!" : "⚔️ Урон " + dmg);
  }
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

function buyDamage(){ buy(10, ()=>damage+=1, "⚔️ Урон +1"); }
function buyDamage5(){ buy(50, ()=>damage+=5, "⚔️ Урон +5"); }
function buyDamage10(){ buy(120, ()=>damage+=10, "⚔️ Урон +10"); }
function buyDamageX2(){ buy(300, ()=>damage*=2, "🔥 Урон x2"); }
function buyDamageX5(){ buy(1200, ()=>damage*=5, "💀 Урон x5"); }

function buyCrit(){ buy(100, ()=>critChance+=0.05, "💥 Крит +5%"); }
function buyCritPower(){ buy(250, ()=>critPower=3, "💣 Крит x3"); }
function buyUltraCrit(){ buy(600, ()=>critChance+=0.15, "☄️ Ультра-крит"); }

function buyGold(){ buy(150, ()=>goldBonus*=1.5, "💰 Золото x1.5"); }
function buyPassive(){ buy(200, ()=>passiveIncome+=1, "🕰️ Пассив +1"); }

function buyAuto(){
  if (!autoAttack) {
    buy(200, ()=>{
      autoAttack = true;
      autoTimer = setInterval(()=>{
        for(let i=0;i<autoCount;i++) attack();
      }, autoSpeed);
    }, "🤖 Авто-удар включён");
  }
}

function buyAutoSpeed(){ buy(400, ()=>autoSpeed=Math.max(300, autoSpeed-200), "⚡ Авто быстрее"); }
function buySecondAuto(){ buy(800, ()=>autoCount=2, "🤖🤖 2 авто-удара"); }

// ---------- ПАССИВ ----------
setInterval(()=>{
  money += passiveIncome;
  updateUI();
},1000);

updateUI("Ткни по монстру");
