
document.addEventListener('DOMContentLoaded', init);

let DEVICES = [];

/* ===== 공통 유틸 ===== */
function storageLabel(size){
  return size === 1024 ? '1TB' : size + 'GB';
}
function won(n){ return n.toLocaleString() + '원'; }

/* ===== 초기화 ===== */
async function init(){
  const res = await fetch('./data/devices.json');
  const json = await res.json();
  DEVICES = json.devices;
  bindTabs();
  renderDevices('all');
}

/* ===== 탭 (전체 / 아이폰 / 삼성) ===== */
function bindTabs(){
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderDevices(btn.dataset.filter);
    };
  });
}

/* ===== 렌더링 ===== */
function renderDevices(filter){
  const grid = document.getElementById('deviceGrid');
  grid.innerHTML = '';

  DEVICES
    .filter(d => filter === 'all' || d.brand === filter)
    .forEach(d => {
      const defaultStorage = d.storages[0];
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${d.img}" alt="${d.name}">
        <h3>${d.name}</h3>
        <div class="price" id="price-${d.code}">
          출고가 ${won(d.msrp[defaultStorage])}
        </div>
        ${renderStorageSelect(d)}
        <button class="btn" onclick="openOrder('${d.code}')">주문하기</button>
      `;

      grid.appendChild(card);

      if(d.storages.length > 1){
        document.getElementById(`storage-${d.code}`)
          .addEventListener('change', e=>{
            const size = Number(e.target.value);
            document.getElementById(`price-${d.code}`).innerText =
              '출고가 ' + won(d.msrp[size]);
          });
      }
    });
}

/* ===== 용량 선택 ===== */
function renderStorageSelect(d){
  if(d.storages.length <= 1) return '';
  return `
    <select id="storage-${d.code}">
      ${d.storages.map(s =>
        `<option value="${s}">${storageLabel(s)}</option>`
      ).join('')}
    </select>
  `;
}

/* ===== 주문하기 ===== */
function openOrder(code){
  const d = DEVICES.find(x=>x.code===code);
  let storage = d.storages[0];
  if(d.storages.length>1){
    storage = Number(document.getElementById(`storage-${code}`).value);
  }
  alert(
    '단말: ' + d.name + '\n' +
    '용량: ' + storageLabel(storage) + '\n' +
    '출고가: ' + won(d.msrp[storage])
  );
}
