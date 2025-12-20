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

function play(s){
  s.currentTime = 0;
  s.play().catch(()=>{});
}

function updateUI(){
  hpText.textContent = hp;
  moneyText.textContent = money;
  damageText.textContent = damage;
  hpFill.style.width = (hp/maxHp*100) + "%";

  for (let k in prices) {
    document.getElementById("price"+k).textContent = prices[k];
  }
}

// ===== АТАКА =====
function attack(){
  play(hitSound);
  monster.classList.add("shake");
  setTimeout(()=>monster.classList.remove("shake"),200);

  let total = 0;

  for(let i=0;i<multiHit;i++){
    let d = damage;

    if(Math.random()*100 < critChance) d *= critMult;
    if(Math.random()*100 < fire) d += 5;
    d *= (1 + rage/100);

    total += d;
  }

  hp -= total;

  if(hp <= 0){
    money += goldReward;
    maxHp += 30;
    hp = maxHp;
  }

  updateUI();
}

// ===== ПОКУПКА =====
function buy(key, action){
  if(money < prices[key]) return;
  money -= prices[key];
  prices[key] = Math.floor(prices[key]*1.6);
  play(buySound);
  action();
  updateUI();
}

// ===== КНОПКИ =====
document.getElementById("upDamage").onclick =
()=>buy("Damage", ()=>damage++);

document.getElementById("upGold").onclick =
()=>buy("Gold", ()=>goldReward+=5);

document.getElementById("upCrit").onclick =
()=>buy("Crit", ()=>critChance+=5);

document.getElementById("upCritMult").onclick =
()=>buy("CritMult", ()=>critMult+=0.5);

document.getElementById("upMulti").onclick =
()=>buy("Multi", ()=>multiHit++);

document.getElementById("upFire").onclick =
()=>buy("Fire", ()=>fire+=5);

document.getElementById("upRage").onclick =
()=>buy("Rage", ()=>rage+=5);

document.getElementById("upAuto").onclick =
()=>buy("Auto", ()=>autoDps++);

// ===== АВТО УРОН =====
setInterval(()=>{
  if(autoDps > 0){
    hp -= autoDps;
    if(hp <= 0){
      money += goldReward;
      maxHp += 30;
      hp = maxHp;
    }
    updateUI();
  }
},1000);

// ===== АТАКА (ПК + ТЕЛЕФОН) =====
const attackBtn = document.getElementById("attackBtn");
attackBtn.onclick = attack;
attackBtn.addEventListener("touchstart",e=>{
  e.preventDefault();
  attack();
});

// ===== ФОН =====
document.body.addEventListener("touchstart",()=>{
  if(bgSound.paused) bgSound.play().catch(()=>{});
},{once:true});

updateUI();
