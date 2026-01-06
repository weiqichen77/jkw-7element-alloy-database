async function fetchData() {
  const q = document.getElementById('q').value;
  const r = await fetch('/api/materials?q='+encodeURIComponent(q)).then(r=>r.json());
  let html='<table><tr><th>ID</th><th>Name</th><th>Type</th><th>Elements</th><th>Density</th></tr>';
  for(const x of r.results) html+='<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+x.type+'</td><td>'+x.elements.join(',')+'</td><td>'+(x.density||'')+'</td></tr>';
  html+='</table>'; document.getElementById('table').innerHTML=html;
}
document.getElementById('search').onclick=fetchData;
