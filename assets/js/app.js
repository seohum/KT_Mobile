document.addEventListener('DOMContentLoaded', init);
let ALL=[];

async function init(){
  const res = await fetch('./data/devices.json');
  const json = await res.json();
  ALL = json.devices;
  render('all');
  bindTabs();
}

function bindTabs(){
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    }
  });
}

function render(filter){
  const grid=document.getElementById('deviceGrid');
  grid.innerHTML='';
  ALL.filter(d=> filter==='all' || d.segment===filter)
     .forEach(d=>{
       const el=document.createElement('div');
       el.className='card';
       let storageUI='';
       if(d.storages.length>0){
         storageUI='<select>'+d.storages.map(s=>`<option>${s}GB</option>`).join('')+'</select>';
       }
       el.innerHTML=`
         <img src="${d.img}">
         <h3>${d.name}</h3>
         <div class="price">출고가 ${priceText(d)}</div>
         ${storageUI}
         ${d.segment==='budget' ? '<span class="badge">보급형</span>' : ''}
         <button class="btn" onclick="openModal('${d.name}','${priceText(d)}')">주문하기</button>
       `;
       grid.appendChild(el);
     });
}

function priceText(d){
  if(d.storages.length===0) return d.msrp.default.toLocaleString()+'원';
  const min=Math.min(...d.storages.map(s=>d.msrp[s]));
  return min.toLocaleString()+'원~';
}

function openModal(name,price){
  document.getElementById('modalTitle').innerText=name;
  document.getElementById('modalPrice').innerText='예상 출고가 '+price;
  document.getElementById('orderModal').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('orderModal').classList.add('hidden');
}