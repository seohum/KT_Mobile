let devices=[],plans=[],gongsi={},special={};

Promise.all([
 fetch('data/devices.json').then(r=>r.json()),
 fetch('data/plans.json').then(r=>r.json()),
 fetch('data/gongsi.json').then(r=>r.json()),
 fetch('data/special.json').then(r=>r.json())
]).then(([d,p,g,s])=>{devices=d;plans=p;gongsi=g;special=s;render();});

function planGroup(price){
 if(price>=110000)return'110K';
 if(price>=90000)return'90K';
 if(price>=61000)return'61K';
 return'37K';
}

function render(){
 const list=document.getElementById('productList');
 list.innerHTML='';
 devices.forEach(d=>{
  const st=d.storages[0];
  const p=plans[0];
  const g=planGroup(p.price);
  const gs=gongsi[d.model]?.[st]?.[g]||0;
  const sp=special[d.model]?.[st]?.[g]||0;
  const final=d.prices[st]-gs-sp;
  const img = d.image ? `images/${d.image}` : 'images/placeholder.png';
  list.innerHTML+=`
  <div class="product">
    <div class="thumb"><img src="${img}" alt="${d.model}"></div>
    <div class="info">
      <h3>${d.model}</h3>
      <div class="price">
        <div>출고가 ${d.prices[st].toLocaleString()}원</div>
        <div>공시지원금 -${gs.toLocaleString()}원</div>
        <div>특판가 -${sp.toLocaleString()}원</div>
        <div class="final">실구매가 ${final.toLocaleString()}원</div>
      </div>
      <button class="order-btn" onclick="openModal('${d.model}')">주문하기</button>
    </div>
  </div>`;
 });
}

function openModal(text){
 document.getElementById('orderText').innerText=text;
 document.getElementById('orderModal').style.display='block';
}
function closeModal(){
 document.getElementById('orderModal').style.display='none';
}
