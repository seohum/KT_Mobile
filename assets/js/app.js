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
       el.innerHTML=`
         <img src="${d.img}" alt="${d.name}">
         <h3>${d.name}</h3>
         <div class="price">출고가 ${priceText(d)}</div>
         ${d.segment==='budget' ? '<span class="badge">보급형</span>' : ''}
       `;
       grid.appendChild(el);
     });
}

function priceText(d){
  if(d.storages.length===0) return d.msrp.default.toLocaleString()+'원';
  const min=Math.min(...d.storages.map(s=>d.msrp[s]));
  return min.toLocaleString()+'원~';
}
