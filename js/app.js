
let devices=[], plans=[];

Promise.all([
 fetch('data/devices.json').then(r=>r.json()),
 fetch('data/plans.json').then(r=>r.json())
]).then(([d,p])=>{
 devices=d; plans=p;
 renderDevices();
});

function renderDevices(){
 const list=document.getElementById('deviceList');
 list.innerHTML='';
 devices.forEach(dev=>{
  const final=dev.base-dev.gongsi;
  list.innerHTML+=`
   <div class="card">
    <img src="images/${dev.image}" onerror="this.src='images/placeholder.png'">
    <h4>${dev.model} ${dev.storage}</h4>
    <div class="price">실구매가 ${final.toLocaleString()}원</div>
    <button onclick='openSheet(${JSON.stringify(dev)})'>가입 신청하기</button>
   </div>`;
 });
}

function openSheet(d){
 document.getElementById('sheetTitle').innerText=\`\${d.model} \${d.storage}\`;
 document.getElementById('sheetImage').src=\`images/\${d.image}\`;
 document.getElementById('sheetBase').innerText=d.base.toLocaleString();
 document.getElementById('sheetGongsi').innerText=d.gongsi.toLocaleString();
 document.getElementById('sheetFinal').innerText=(d.base-d.gongsi).toLocaleString()+'원';

 const ul=document.getElementById('planList');
 ul.innerHTML='';
 plans.forEach(p=>{
  ul.innerHTML+=`<li>${p.name} · ${p.price.toLocaleString()}원 · ${p.data}</li>`;
 });

 document.getElementById('sheet').style.display='flex';
}

function closeSheet(){
 document.getElementById('sheet').style.display='none';
}
