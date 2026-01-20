document.addEventListener('DOMContentLoaded', init);

async function init(){
  try{
    const res = await fetch('./data/devices.json');
    if(!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    render(json.devices);
  }catch(e){
    document.getElementById('deviceGrid').innerHTML =
      '<p style="padding:16px">단말 데이터를 불러오지 못했습니다.</p>';
    console.error(e);
  }
}

function render(list){
  const grid=document.getElementById('deviceGrid');
  grid.innerHTML='';
  list.forEach(d=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`
      <img src="${d.img}" alt="${d.name}">
      <h3>${d.name}</h3>
      <div class="price">출고가 ${Number(d.msrp).toLocaleString()}원</div>
      <button class="btn">주문하기</button>
    `;
    grid.appendChild(el);
  });
}
