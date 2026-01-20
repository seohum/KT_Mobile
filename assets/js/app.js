// ====== 상태 ======
const state = {
  deviceCode: null,
  planGroup: "5G",      // 5G | LTE | SENIOR
  planName: null,
  joinType: "기변",     // 기변 | MNP | 신규
  discountType: "gongsi", // gongsi | rate25
  months: 24
};

// ====== 데이터 ======
let DEVICES = [];
let PLANS = {};
let GONGSI = {};
let SPECIAL = {};

// ====== 유틸 ======
function won(n){
  if (n === null || n === undefined) return "-";
  return Number(n).toLocaleString() + "원";
}
function qs(sel){ return document.querySelector(sel); }

// ====== 정책 구간 자동 매핑 ======
function policyTierFromMonthlyFee(monthlyFee){
  const fee = Number(monthlyFee || 0);
  if (fee <= 37000) return 37;
  if (fee <= 61000) return 61;
  if (fee <= 90000) return 90;
  return 110;
}

// ====== 로딩 ======
async function loadAll(){
  const [d,p,g,s] = await Promise.all([
    fetch("data/devices.json").then(r=>r.json()),
    fetch("data/plans.json").then(r=>r.json()),
    fetch("data/gongsi.json").then(r=>r.json()),
    fetch("data/special.json").then(r=>r.json())
  ]);

  DEVICES = d.devices; // 핵심 수정
  PLANS = p;
  GONGSI = g;
  SPECIAL = s;

  renderDevices();
}
loadAll();

// ====== 단말 렌더 ======
function renderDevices(){
  const wrap = qs("#deviceGrid");
  if (!wrap) return;

  wrap.innerHTML = "";

  DEVICES.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${d.img}" alt="${d.name}">
      <h3>${d.name}</h3>
      <button>주문하기</button>
    `;
    card.querySelector("button").onclick = () => openModal(d.code);
    wrap.appendChild(card);
  });
}

// ====== 모달 ======
function openModal(code){
  state.deviceCode = code;
  qs("#orderModal").classList.add("on");
  recalc();
}
function closeModal(){
  qs("#orderModal").classList.remove("on");
}

// ====== 공시 / 특판 ======
function getGongsi(deviceCode, planName){
  return (GONGSI[deviceCode] && GONGSI[deviceCode][planName]) || 0;
}
function getSpecial(deviceCode, tier, joinType){
  return (SPECIAL[deviceCode] &&
          SPECIAL[deviceCode][tier] &&
          SPECIAL[deviceCode][tier][joinType]) || 0;
}

// ====== 계산 ======
function recalc(){
  const device = DEVICES.find(d=>d.code===state.deviceCode);
  if (!device) return;

  const planList = PLANS[state.planGroup] || [];
  const plan = planList.find(p=>p.name===state.planName) || planList[0];
  if (!plan) return;

  state.planName = plan.name;

  const tier = plan.tier || policyTierFromMonthlyFee(plan.monthly_fee);
  const gongsi = state.discountType==="gongsi" ? getGongsi(device.code, plan.name) : 0;
  const special = getSpecial(device.code, tier, state.joinType);

  let price = device.msrp - gongsi - special;
  if (price < 0) price = 0;

  qs("#p-msrp").innerText = won(device.msrp);
  qs("#p-gongsi").innerText = state.discountType==="gongsi" ? won(gongsi) : "-";
  qs("#p-special").innerText = won(special);

  const final = qs("#p-final");
  if (price === 0){
    final.innerText = "0원 (무료)";
    final.classList.add("free");
  } else {
    final.innerText = won(price);
    final.classList.remove("free");
  }
}

// ====== 이벤트 ======
document.addEventListener("change", e=>{
  if (e.target.name==="planGroup"){
    state.planGroup = e.target.value;
    state.planName = null;
    recalc();
  }
  if (e.target.name==="discountType"){
    state.discountType = e.target.value;
    recalc();
  }
  if (e.target.name==="joinType"){
    state.joinType = e.target.value;
    recalc();
  }
});
