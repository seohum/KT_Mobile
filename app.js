let devices=[],plans=[],gongsi={},special={};

Promise.all([
 fetch('devices.json').then(r=>r.json()),
 fetch('plans.json').then(r=>r.json()),
 fetch('gongsi.json').then(r=>r.json()),
 fetch('special.json').then(r=>r.json())
]).then(([d,p,g,s])=>{devices=d;plans=p;gongsi=g;special=s;init();});

function planGroup(price){
 if(price>=110000)return'110K';
 if(price>=90000)return'90K';
 if(price>=61000)return'61K';
 return'37K';
}

function init(){
 deviceSelect.innerHTML=devices.map((d,i)=>`<option value="${i}">${d.model}</option>`).join('');
 deviceSelect.onchange=updateStorage;
 updateStorage();
}

function updateStorage(){
 const d=devices[deviceSelect.value];
 storageSelect.innerHTML=d.storages.map(s=>`<option>${s}</option>`).join('');
 updatePlans();
}

function updatePlans(){
 planSelect.innerHTML=plans.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('');
 planSelect.onchange=calc;
 calc();
}

function calc(){
 const d=devices[deviceSelect.value];
 const st=storageSelect.value;
 const p=plans[planSelect.value];
 const g=planGroup(p.price);
 const gs=gongsi[d.model]?.[st]?.[g]||0;
 const sp=special[d.model]?.[st]?.[g]||0;
 gongsi.innerText=gs.toLocaleString();
 special.innerText=sp.toLocaleString();
 finalPrice.innerText=(d.prices[st]-gs-sp).toLocaleString();
}

function openOrder(){
 modal.style.display='block';
 orderSummary.innerText=`${deviceSelect.options[deviceSelect.selectedIndex].text} / ${storageSelect.value} / ${planSelect.options[planSelect.selectedIndex].text}`;
}
function closeOrder(){modal.style.display='none';}
