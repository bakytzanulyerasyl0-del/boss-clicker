// ===== ОСНОВА =====
let maxHp = 100;
let hp = maxHp;

let money = 0;
let damage = 1;
let goldReward = 10;

let kills = 0;              // убийства обычного монстра
let phase = 0;              // 0 = обычный, 1/2/3 = monster2/3/4
let chainActive = false;    // идёт ли цепочка монстров

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
const hyperSound = document.getElementById("hyperSound");

// ===== ЗВУК =====
function play(sound){
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(()=>{});
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

// ===== ТЕКСТ УРОНА =====
function showDamageText(text){
  const dmg = document.createElement("div");
  dmg.textContent = text;
  dmg.className = "damage-text";

  const r = monster.getBoundingClientRect();
  dmg.style.left = r.left + r.width/2 + (Math.random()*120-60) + "px";
  dmg.style.top = r.top + r.height/2 + (Math.random()*60-30) + "px";

  document.body.appendChild(dmg);
  setTimeout(()=>dmg.remove(),1000);
}

// ===== СМЕНА МОНСТРА =====
function spawnMonster(type){
  play(hyperSound);

  if (type === 0){
    monster.src = "images/monster.png";
    maxHp = 100;
    document.body.classList.remove("scary-bg");
  }

  if (type === 1){
    monster.src = "images/monster2.png";
    maxHp = 300;
    document.body.classList.add("scary-bg");
  }

  if (type === 2){
    monster.src = "images/monster3.png";
    maxHp = 400;
  }

  if (type === 3){
    monster.src = "images/monster4.png";
    maxHp = 500;
  }

  hp = maxHp;
}

// ===== АТАКА =====
function attack(){
  play(hitSound);

  monster.classList.add("shake");
  setTimeout(()=>monster.classList.remove("shake"),200);

  let total = 0;
  let crit = false;

  for(let i=0;i<multiHit;i++){
    let d = damage;

    if(Math.random()*100 < critChance){
      d *= critMult;
      crit = true;
    }

    if(Math.random()*100 < fire) d += 5;
    d *= (1 + rage/100);

    total += Math.floor(d);
  }

  hp -= total;
  showDamageText((crit ? "CRIT " : "") + "-" + total);

  // ===== СМЕРТЬ МОНСТРА =====
  if (hp <= 0){
    money += goldReward;

    // ----- ЕСЛИ ОБЫЧНЫЙ -----
    if (!chainActive){
      kills++;

      if (kills % 20 === 0){
        chainActive = true;
        phase = 1;
        spawnMonster(1);
      } else {
        spawnMonster(0);
      }
    }
    // ----- ЕСЛИ ЦЕПОЧКА -----
    else {
      phase++;

      if (phase <= 3){
        spawnMonster(phase);
      } else {
        chainActive = false;
        phase = 0;
        spawnMonster(0);
      }
    }
  }

  updateUI();
}

// ===== КЛИК ПО МОНСТРУ =====
monster.addEventListener("click", attack);
monster.addEventListener("touchstart", e=>{
  e.preventDefault();
  attack();
});

// ===== ПРОКАЧКИ =====
function buy(key, action){
  if (money < prices[key]) return;
  money -= prices[key];
  prices[key] = Math.floor(prices[key]*1.6);
  play(buySound);
  action();
  updateUI();
}

document.getElementById("upDamage").onclick = ()=>buy("Damage",()=>damage++);
document.getElementById("upGold").onclick = ()=>buy("Gold",()=>goldReward+=5);
document.getElementById("upCrit").onclick = ()=>buy("Crit",()=>critChance+=5);
document.getElementById("upCritMult").onclick = ()=>buy("CritMult",()=>critMult+=0.5);
document.getElementById("upMulti").onclick = ()=>buy("Multi",()=>multiHit++);
document.getElementById("upFire").onclick = ()=>buy("Fire",()=>fire+=5);
document.getElementById("upRage").onclick = ()=>buy("Rage",()=>rage+=5);
document.getElementById("upAuto").onclick = ()=>buy("Auto",()=>autoDps++);

// ===== АВТО УРОН =====
setInterval(()=>{
  if(autoDps > 0){
    hp -= autoDps;
    showDamageText("-"+autoDps);

    if(hp <= 0){
      money += goldReward;
      spawnMonster(chainActive ? phase : 0);
    }
    updateUI();
  }
},1000);

// ===== ФОН МУЗЫКА =====
document.body.addEventListener("touchstart",()=>{
  if(bgSound && bgSound.paused){
    bgSound.play().catch(()=>{});
  }
},{once:true});

updateUI();
