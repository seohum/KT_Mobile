let allPlans = [];

fetch('plans.json')
  .then(res => res.json())
  .then(data => {
    allPlans = data;
    render(allPlans);
  })
  .catch(err => {
    document.getElementById('app').innerHTML = '요금제 로딩 실패';
    console.error(err);
  });

function render(list){
  const app = document.getElementById('app');
  app.innerHTML = '';
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div><strong>${p.name}</strong></div>
      <div>${p.data}</div>
      <div class="price">${p.price.toLocaleString()}원</div>
    `;
    app.appendChild(div);
  });
}

function filterGroup(group){
  if(group === 'ALL') return render(allPlans);
  render(allPlans.filter(p => p.group === group));
}
