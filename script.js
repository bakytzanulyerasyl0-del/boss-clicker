let level = 1;
let maxHp = 100;
let bossHp = 100;

let money = 0;
let damage = 5;
let reward = 10;

let crit = 0;
let critMult = 2;
let multi = 1;
let rage = 0;
let explosion = 0;
let fire = 0;
let shock = 0;
let bleed = 0;

let prices = {
  damage: 20,
  crit: 40,
  critMult: 80,
  multi: 60,
  gold: 50,
  rage: 70,
  explosion: 100,
  fire: 110,
  shock: 120,
  bleed: 130
};

const monster = document.getElementById("monster");
const hpText = document.getElementById("bossHp");
const moneyText = document.getElementById("money");
const dmgText = document.getElementById("damage");
const lvlText = document.getElementById("level");
const hpFill = document.getElementById("hpFill");
const hyperText = document.getElementById("hyperText");

const hitSound = document.getElementById("hitSound");
const buySound = document.getElementById("buySound");
const bgSound = document.getElementById("bgSound");
const hyperSound = document.getElementById("hyperSound");

function play(s){ s.currentTime=0; s.play().catch(()=>{}); }

function updateUI(){
  hpText.textContent = Math.max(0,bossHp);
  moneyText.textContent = Math.floor(money);
  dmgText.textContent = damage;
  lvlText.textContent = level;
  hpFill.style.width = (bossHp/maxHp*100)+"%";
}

function updatePrices(){
  for(let k in prices){
    document.getElementById("price"+k[0].toUpperCase()+k.slice(1)).textContent = prices[k];
  }
}

function attack(){
  play(hitSound);
  monster.classList.add("shake");
  setTimeout(()=>monster.classList.remove("shake"),200);

  let total = 0;
  for(let i=0;i<multi;i++){
    let d = damage;
    if(Math.random()*100<crit) d*=critMult;
    if(Math.random()*100<explosion) d+=20;
    if(Math.random()*100<fire) d+=10;
    if(Math.random()*100<shock) d+=15;
    if(Math.random()*100<bleed) d+=12;
    d*=1+rage/100;
    total+=d;
  }

  bossHp-=total;

  if(bossHp<=0){
    money+=reward;
    level++;
    spawnBoss();
  }
  updateUI();
}

function spawnBoss(){
  if(level%5===0){
    document.body.classList.add("hyper");
    hyperText.style.display="block";
    play(hyperSound);
    maxHp+=200;
  } else {
    document.body.classList.remove("hyper");
    hyperText.style.display="none";
    maxHp+=50;
  }
  bossHp=maxHp;
}

function buy(key,fn){
  if(money<prices[key])return;
  money-=prices[key];
  prices[key]=Math.floor(prices[key]*1.4);
  play(buySound);
  fn();
  updatePrices();
  updateUI();
}

document.getElementById("attackBtn").onclick=attack;
document.getElementById("upDamage").onclick=()=>buy("damage",()=>damage+=5);
document.getElementById("upCrit").onclick=()=>buy("crit",()=>crit+=5);
document.getElementById("upCritMult").onclick=()=>buy("critMult",()=>critMult+=0.5);
document.getElementById("upMulti").onclick=()=>buy("multi",()=>multi++);
document.getElementById("upGold").onclick=()=>buy("gold",()=>reward+=5);
document.getElementById("upRage").onclick=()=>buy("rage",()=>rage+=5);
document.getElementById("upExplosion").onclick=()=>buy("explosion",()=>explosion+=5);
document.getElementById("upFire").onclick=()=>buy("fire",()=>fire+=5);
document.getElementById("upShock").onclick=()=>buy("shock",()=>shock+=5);
document.getElementById("upBleed").onclick=()=>buy("bleed",()=>bleed+=5);

document.body.onclick=()=>{ if(bgSound.paused) bgSound.play(); };

spawnBoss();
updatePrices();
updateUI();
