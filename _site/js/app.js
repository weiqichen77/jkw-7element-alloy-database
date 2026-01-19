async function fetchData() {
  const q = document.getElementById('q').value;
  try {
    const r = await fetch('/api/materials?q='+encodeURIComponent(q)).then(r=>r.json());
    let html='<table><tr><th>ID</th><th>Name</th><th>Type</th><th>Elements</th><th>Density</th></tr>';
    for(const x of r.results) {
      const elements = x.elements ? x.elements.join(',') : 'N/A';
      html+='<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+x.type+'</td><td>'+elements+'</td><td>'+(x.density||'')+'</td></tr>';
    }
    html+='</table>'; document.getElementById('table').innerHTML=html;
  } catch(e) {
    console.error('Error fetching data:', e);
    document.getElementById('table').innerHTML='<p>Error loading data: '+e.message+'</p>';
  }
}
document.getElementById('search').onclick=fetchData;
