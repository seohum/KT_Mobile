let devices=[];

fetch('data/devices.json')
 .then(r=>r.json())
 .then(d=>{devices=d;render();});

function render(){
 const list=document.getElementById('list');
 list.innerHTML='';
 devices.forEach(dev=>{
  dev.storages.forEach(st=>{
   const price=dev.prices[st];
   list.innerHTML+=`
   <div class="card">
     <img src="images/${dev.image||'placeholder.png'}">
     <div class="info">
       <h3>${dev.model} (${st})</h3>
       <div>출고가 ${price.toLocaleString()}원</div>
       <div class="price">실구매가 ${price.toLocaleString()}원</div>
       <button onclick="order('${dev.model}','${st}',${price})">주문하기</button>
     </div>
   </div>`;
  });
 });
}

function order(m,s,p){
 document.getElementById('summary').innerText=
  `단말기: ${m}\n용량: ${s}\n출고가: ${p.toLocaleString()}원`;
 document.getElementById('modal').style.display='block';
}
function closeModal(){document.getElementById('modal').style.display='none';}
