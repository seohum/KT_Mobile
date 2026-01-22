
let devices=[];
fetch('data/devices.json').then(r=>r.json()).then(d=>{devices=d;render();});

function render(){
 const list=document.getElementById('deviceList');
 list.innerHTML='';
 devices.forEach(dev=>{
  const final=dev.base-dev.gongsi;
  list.innerHTML+=`
   <div class="card">
    <img src="images/${dev.image}" onerror="this.src='images/placeholder.png'">
    <h4>${dev.model} ${dev.storage}</h4>
    <div>출고가 ${dev.base.toLocaleString()}원</div>
    <div class="price">실구매가 ${final.toLocaleString()}원</div>
    <button onclick='openApply(${JSON.stringify(dev)})'>가입 신청하기</button>
   </div>`;
 });
}

function openApply(d){
 document.getElementById('applyTitle').innerText=`${d.model} ${d.storage}`;
 document.getElementById('applyImage').src=`images/${d.image}`;
 document.getElementById('basePrice').innerText=d.base.toLocaleString();
 document.getElementById('gongsiPrice').innerText=d.gongsi.toLocaleString();
 document.getElementById('finalPrice').innerText=(d.base-d.gongsi).toLocaleString();
 document.getElementById('applyModal').style.display='flex';
}

function closeApply(){
 document.getElementById('applyModal').style.display='none';
}
