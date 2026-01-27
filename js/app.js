let POLICY=null;
let WIRELESS=null;
let policyType='wired';
let wirelessState={network:null, join:null, brand:null, tier:null, modelCode:null};

const $ = (id)=>document.getElementById(id);

function money(v){
  if(v===null || v===undefined || v==="") return "-";
  const n = Number(v);
  if(Number.isNaN(n)) return String(v);
  return (n/10000).toLocaleString("ko-KR")+"만원";
}

function uniq(arr){ return [...new Set(arr.filter(v=>v!==null && v!==undefined && v!==""))]; }

function buildGroups(){
  const ORDERED_GROUPS = ['I 단품','I+T','M+I','U+I','M+I+T','U+I+T'];
  const LABEL = {'I 단품':'인터넷 단독'};

  const groups = uniq([
    ...POLICY.wired_table.map(r=>r.group),
    ...POLICY.uit_table.map(r=>r.group)
  ]);
  const wrap = $("groupBtns");
  wrap.innerHTML="";
  sorted.forEach((g,idx)=>{
    const b=document.createElement("button");
    b.className="btn"+(idx===0?" on":"");
    b.textContent=g;
    b.dataset.g=g;
    b.onclick=()=>{
      [...wrap.querySelectorAll(".btn")].forEach(x=>x.classList.remove("on"));
      b.classList.add("on");
      refreshSelectors();
    };
    wrap.appendChild(b);
  });
}

function currentGroup(){
  const b = document.querySelector("#groupBtns .btn.on");
  return b ? b.dataset.g : null;
}

function refreshSelectors(){
  const g = currentGroup();
  const isUIT = POLICY.uit_table.some(r=>r.group===g);
  $("mobileTierRow").style.display = isUIT ? "" : "none";

  const table = isUIT ? POLICY.uit_table.filter(r=>r.group===g) : POLICY.wired_table.filter(r=>r.group===g);

  const internetList = uniq(table.map(r=>r.internet));
  $("internetSel").innerHTML = internetList.map(v=>`<option value="${v}">${v}</option>`).join("");

  const tvList = uniq(table.map(r=>r.tv));
  // tv가 아예 없는 구분이면 '없음' 고정
  if(tvList.length===0){
    $("tvSel").innerHTML = `<option value="">없음</option>`;
    $("tvSel").disabled = true;
  }else{
    $("tvSel").disabled = false;
    $("tvSel").innerHTML = [`<option value="">없음</option>`, ...tvList.map(v=>`<option value="${v}">${v}</option>`)].join("");
  }

  if(isUIT){
    const tiers = uniq(table.map(r=>r.mobile_tier));
    $("mobileTierSel").innerHTML = tiers.map(v=>`<option value="${v}">${v}</option>`).join("");
  }

  // reset options
  $("optOnestop").checked=false;
  $("optGenie3").checked=false;

  calc();
}

function findRow(){
  const g=currentGroup();
  const internet=$("internetSel").value;
  const tv=$("tvSel").disabled ? null : ($("tvSel").value || null);

  const isUIT = POLICY.uit_table.some(r=>r.group===g);
  if(isUIT){
    const tier=$("mobileTierSel").value;
    const rows = POLICY.uit_table.filter(r=>r.group===g && r.internet===internet && (r.tv||null)===(tv||null) && r.mobile_tier===tier);
    return rows[0] || null;
  }else{
    const rows = POLICY.wired_table.filter(r=>r.group===g && r.internet===internet && (r.tv||null)===(tv||null));
    return rows[0] || null;
  }
}

function calc(){
  const row=findRow();
  if(!row){
    $("vBase").textContent="-";
    $("vBundle").textContent="-";
    $("vU").textContent="-";
    $("vTotal").textContent="-";
    $("vTotalOnestop").textContent="-";
    $("vTotalGenie3").textContent="-";
    $("noteLine").textContent="해당 조합 데이터가 없습니다. 엑셀(유선정책표/UIT)을 확인하세요.";
    return;
  }

  $("vBase").textContent = money(row.base_policy);
  $("vBundle").textContent = money(row.bundle_policy);
  $("vU").textContent = money(row.u_policy ?? 0);

  $("vTotal").textContent = money(row.total_no_gift);

  const useOnestop = $("optOnestop").checked;
  const useGenie3 = $("optGenie3").checked;

  $("vTotalOnestop").textContent = useOnestop ? money(row.total_with_onestop) : "-";
  $("vTotalGenie3").textContent = useGenie3 ? money(row.total_with_genie3) : "-";

  const parts=[];
  parts.push(`구분: ${row.group}`);
  parts.push(`인터넷: ${row.internet}`);
  if(row.tv) parts.push(`TV: ${row.tv}`);
  if(row.mobile_tier) parts.push(`모바일구간: ${row.mobile_tier}`);
  $("noteLine").textContent = parts.join(" / ");
}

async function init(){
  $('tabWired').addEventListener('click', ()=>setActiveTab('wired'));
  $('tabWireless').addEventListener('click', ()=>{ setActiveTab('wireless'); initWireless(); });
  setActiveTab('wired');

  const res = await fetch("data/wired/policy.json");
  POLICY = await res.json();

  buildGroups();
  refreshSelectors();

  $("internetSel").addEventListener("change", calc);
  $("tvSel").addEventListener("change", calc);
  $("mobileTierSel").addEventListener("change", calc);
  $("optOnestop").addEventListener("change", calc);
  $("optGenie3").addEventListener("change", calc);

  $("resetBtn").onclick=()=>refreshSelectors();

  $("copyBtn").onclick=async ()=>{
    const row=findRow();
    if(!row) return;
    const lines=[];
    lines.push(`[유선정책 자동화]`);
    lines.push(`- 구분: ${row.group}`);
    lines.push(`- 인터넷: ${row.internet}`);
    if(row.tv) lines.push(`- TV: ${row.tv}`);
    if(row.mobile_tier) lines.push(`- 모바일구간: ${row.mobile_tier}`);
    lines.push(`- 기본정책: ${money(row.base_policy)}`);
    lines.push(`- 결합정책: ${money(row.bundle_policy)}`);
    if(row.u_policy!==undefined && row.u_policy!==null) lines.push(`- U정책: ${money(row.u_policy)}`);
    lines.push(`- 합계(사은품 미포함): ${money(row.total_no_gift)}`);
    if($("optOnestop").checked) lines.push(`- 원스톱 포함 합계: ${money(row.total_with_onestop)}`);
    if($("optGenie3").checked) lines.push(`- 지니3 포함 합계: ${money(row.total_with_genie3)}`);
    const text = lines.join("\n");
    await navigator.clipboard.writeText(text);
    alert("복사 완료");
  };
}

init();

function setActiveTab(type){
  policyType = type;
  const wiredTab = $("tabWired");
  const wirelessTab = $("tabWireless");
  const wiredPanel = $("wiredPanel");
  const wirelessPanel = $("wirelessPanel");
  if(type==="wired"){
    wiredTab.classList.add("active");
    wirelessTab.classList.remove("active");
    wiredPanel.style.display = "";
    wirelessPanel.style.display = "none";
  }else{
    wiredTab.classList.remove("active");
    wirelessTab.classList.add("active");
    wiredPanel.style.display = "none";
    wirelessPanel.style.display = "";
  }
}

function renderBtnGroup(containerId, items, activeKey, onClick){
  const el = $(containerId);
  el.innerHTML = "";
  items.forEach(it=>{
    const b = document.createElement("button");
    b.type="button";
    b.className = "btn" + (it.key===activeKey ? " active" : "");
    if(it.img!==undefined){
      const img=document.createElement("img");
      img.alt = it.label + " 로고";
      img.src = it.img || "";
      if(!it.img) img.style.display="none";
      b.appendChild(img);
    }
    const span=document.createElement("span");
    span.textContent=it.label;
    b.appendChild(span);
    b.addEventListener("click", ()=>onClick(it.key));
    el.appendChild(b);
  });
}

function initWirelessButtons(){
  renderBtnGroup("wirelessNetworkBtns", [
    {key:"5g", label:"5G"},
    {key:"lte", label:"LTE"},
  ], wirelessState.network, (k)=>{ wirelessState.network=k; refreshWireless(); });

  renderBtnGroup("wirelessJoinBtns", [
    {key:"new", label:"신규"},
    {key:"change", label:"기변"},
    {key:"mnp", label:"번호이동(MNP)"},
  ], wirelessState.join, (k)=>{ wirelessState.join=k; refreshWireless(); });

  renderBtnGroup("wirelessBrandBtns", [
    {key:"samsung", label:"삼성", img:""},
    {key:"apple", label:"애플", img:""},
  ], wirelessState.brand, (k)=>{ wirelessState.brand=k; refreshWireless(); });
}

function initWireless(){
  if(!WIRELESS) return;
  if(!wirelessState.network) wirelessState.network="5g";
  if(!wirelessState.join) wirelessState.join="new";
  if(!wirelessState.brand) wirelessState.brand="samsung";
  if(!wirelessState.tier) wirelessState.tier=WIRELESS.meta.tiers[0]?.key || "110";

  initWirelessButtons();

  const tierSel=$("wirelessTierSel");
  tierSel.innerHTML="";
  WIRELESS.meta.tiers.forEach(t=>{
    const o=document.createElement("option");
    o.value=t.key;
    o.textContent=t.label;
    tierSel.appendChild(o);
  });
  tierSel.value=wirelessState.tier;
  tierSel.addEventListener("change", ()=>{ wirelessState.tier=tierSel.value; refreshWireless(); });

  $("wirelessModelSel").addEventListener("change", (e)=>{ wirelessState.modelCode=e.target.value; refreshWireless(); });

  refreshWireless();
}

function refreshWireless(){
  initWirelessButtons();

  const tierSel=$("wirelessTierSel");
  tierSel.value=wirelessState.tier;

  const sel=$("wirelessModelSel");
  const models = WIRELESS.models
    .filter(m=>m.network===wirelessState.network)
    .filter(m=>wirelessState.brand ? m.brand===wirelessState.brand : true);

  sel.innerHTML="";
  const ph=document.createElement("option");
  ph.value="";
  ph.textContent="모델 선택";
  sel.appendChild(ph);

  models.forEach(m=>{
    const o=document.createElement("option");
    o.value=m.model_code;
    o.textContent = m.name + (m.model_code ? ` (${m.model_code})` : "");
    sel.appendChild(o);
  });

  if(wirelessState.modelCode && !models.some(m=>m.model_code===wirelessState.modelCode)){
    wirelessState.modelCode="";
  }
  sel.value=wirelessState.modelCode || "";

  let amt=null;
  if(wirelessState.modelCode){
    const m=models.find(x=>x.model_code===wirelessState.modelCode);
    if(m && m.amounts && m.amounts[wirelessState.tier]){
      amt=m.amounts[wirelessState.tier][wirelessState.join];
    }
  }
  $("wirelessPolicyAmt").textContent = money(amt);
}

// ===== POLICY TAB HANDLER =====
function switchPolicy(type){
  policyType = type;
  document.getElementById('wired-section').style.display = type==='wired'?'block':'none';
  document.getElementById('wireless-section').style.display = type==='wireless'?'block':'none';
}
document.addEventListener('DOMContentLoaded', ()=>{
  const wiredBtn = document.getElementById('btn-wired');
  const wirelessBtn = document.getElementById('btn-wireless');
  if(wiredBtn) wiredBtn.addEventListener('click', ()=>switchPolicy('wired'));
  if(wirelessBtn) wirelessBtn.addEventListener('click', ()=>switchPolicy('wireless'));
});
