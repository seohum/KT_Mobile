document.addEventListener('DOMContentLoaded', init);

let DEVICES = [];

function storageLabel(size){
  return size === 1024 ? '1TB' : size + 'GB';
}

function won(num){
  return num.toLocaleString() + '원';
}

async function init(){
  const res = await fetch('./data/devices.json');
  const json = await res.json();
  DEVICES = json.devices;
  bindTabs();
  renderDevices('all');
}

function bindTabs(){
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderDevices(btn.dataset.filter);
    };
  });
}

function renderDevices(filter){
  const grid = document.getElementById('deviceGrid');
  grid.innerHTML = '';

  DEVICES.filter(d => filter === 'all' || d.segment === filter)
    .forEach(d => {
      const defaultStorage = d.storages[0];
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${d.img}">
        <h3>${d.name}</h3>
        <div class="price" id="price-${d.code}">
          출고가 ${won(d.msrp[defaultStorage])}
        </div>
        ${renderStorageSelect(d)}
        ${d.segment === 'budget' ? '<div class="badge">보급형</div>' : ''}
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

function renderStorageSelect(d){
  if(d.storages.length <= 1) return '';
  return `<select id="storage-${d.code}">
    ${d.storages.map(s=>`<option value="${s}">${storageLabel(s)}</option>`).join('')}
  </select>`;
}

function openOrder(code){
  const d = DEVICES.find(x=>x.code===code);
  let storage = d.storages[0];
  if(d.storages.length>1){
    storage = Number(document.getElementById(`storage-${code}`).value);
  }
  alert(`${d.name}\n${storageLabel(storage)}\n출고가 ${won(d.msrp[storage])}`);
}
