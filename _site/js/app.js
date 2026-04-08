const TYPE_CONFIG = [
  { value: 'amorphous', en: 'Amorphous', zh: '非晶' },
  { value: 'solid-solution', en: 'Alloy-Solid Solution', zh: '合金-固溶体' },
  { value: 'intermetallic', en: 'Alloy-Intermetallic', zh: '合金-金属间化合物' },
  { value: 'interface', en: 'Interface', zh: '界面' },
  { value: 'element', en: 'Element', zh: '单质' },
];

function isChineseUi() {
  return (document.documentElement.lang || '').toLowerCase().startsWith('zh');
}

function getTypeLabel(type) {
  const cfg = TYPE_CONFIG.find((x) => x.value === type);
  if (!cfg) return type || 'N/A';
  return isChineseUi() ? cfg.zh : cfg.en;
}

function initTypeOptions() {
  const typeSelect = document.getElementById('type');
  if (!typeSelect) return;
  const allLabel = isChineseUi() ? '全部' : 'All';
  typeSelect.innerHTML = `<option value="">${allLabel}</option>`;
  TYPE_CONFIG.forEach((cfg) => {
    const option = document.createElement('option');
    option.value = cfg.value;
    option.textContent = isChineseUi() ? cfg.zh : cfg.en;
    typeSelect.appendChild(option);
  });
}

async function fetchData() {
  const q = document.getElementById('q').value;
  const type = document.getElementById('type') ? document.getElementById('type').value : '';
  try {
    const params = new URLSearchParams({ q });
    if (type) params.set('type', type);
    const r = await fetch('/api/materials?'+params.toString()).then(r=>r.json());
    let html='<table><tr><th>ID</th><th>Name</th><th>Type</th><th>Elements</th><th>Density</th></tr>';
    for(const x of r.results) {
      const elements = x.elements ? x.elements.join(',') : 'N/A';
      html+='<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+getTypeLabel(x.type)+'</td><td>'+elements+'</td><td>'+(x.density||'')+'</td></tr>';
    }
    html+='</table>'; document.getElementById('table').innerHTML=html;
  } catch(e) {
    console.error('Error fetching data:', e);
    document.getElementById('table').innerHTML='<p>Error loading data: '+e.message+'</p>';
  }
}
initTypeOptions();
document.getElementById('search').onclick=fetchData;
if (document.getElementById('type')) {
  document.getElementById('type').onchange = fetchData;
}
