const fs = require('fs'), path = require('path');
const OUT_DIR = path.join(__dirname,'..','backend','data');
fs.mkdirSync(OUT_DIR,{recursive:true});
const OUT_FILE = path.join(OUT_DIR,'materials.json');
const ELEMENTS = ['Al','Ni','Cu','Zr','Nb','Ta','W'];
function rn(a,b){return Math.round((Math.random()*(b-a)+a)*10000)/10000;}
function pick(arr,n){ const s=new Set(); while(s.size<n)s.add(arr[~~(Math.random()*arr.length)]);return Array.from(s);}
const N=50;const types=['amorphous','crystalline','interface'];const out=[];
for(let i=1;i<=N;i++){ const t=types[i%3]; out.push({ id:i, name:t+'-Sample-'+i, type:t, elements:pick(ELEMENTS,2+(i%3)), density:rn(2.0,9.5), properties:{specific_heat:rn(100,900)} });}
fs.writeFileSync(OUT_FILE,JSON.stringify(out,null,2),'utf8');
console.log('Wrote',N,'records to',OUT_FILE);
