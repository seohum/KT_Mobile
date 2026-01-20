
document.addEventListener('DOMContentLoaded', init);
let DEVICES=[],GONGSI={},SPECIAL={},ORDER={};

function storageLabel(s){return s==1024?'1TB':s+'GB';}
function won(n){return n.toLocaleString()+'원';}

async function init(){
  DEVICES = (await (await fetch('./data/devices.json')).json()).devices;
  GONGSI = await (await fetch('./data/gongsi.json')).json();
  SPECIAL = await (await fetch('./data/special.json')).json();
  ORDER = await (await fetch('./data/orderLink.json')).json();
  bindTabs(); render('all');
}

function bindTabs(){
 document.querySelectorAll('.tabs button').forEach(b=>{
  b.onclick=()=>{
   document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
   b.classList.add('active'); render(b.dataset.filter);
  }
 });
}

function render(filter){
 const g=document.getElementById('deviceGrid'); g.innerHTML='';
 DEVICES.filter(d=>filter=='all'||d.brand==filter).forEach(d=>{
  let s=d.storages[0],p=d.msrp[s];
  let card=document.createElement('div'); card.className='card';
  card.innerHTML=`
   <img src="${d.img}">
   <h3>${d.name}</h3>
   <div id="price-${d.code}" class="price">${won(p)}</div>
   ${d.storages.length>1?'<select id="st-'+d.code+'">'+d.storages.map(x=>`<option value="${x}">${storageLabel(x)}</option>`).join('')+'</select>':''}
   <button onclick="order('${d.code}')">주문하기</button>
  `;
  g.appendChild(card);
  if(d.storages.length>1){
   document.getElementById('st-'+d.code).onchange=e=>{
    let v=+e.target.value;
    document.getElementById('price-'+d.code).innerText=won(d.msrp[v]);
   }
  }
 });
}

function order(code){
 const d=DEVICES.find(x=>x.code==code);
 let s=d.storages.length>1?+document.getElementById('st-'+code).value:d.storages[0];
 let url=ORDER.base+`?model=${encodeURIComponent(d.name)}&storage=${storageLabel(s)}&price=${d.msrp[s]}`;
 window.open(url,'_blank');
}
