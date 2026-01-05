const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'..','data'),DATA_PATH=path.join(DATA_DIR,'materials.json');
function load(){if(!fs.existsSync(DATA_PATH))return[];try{return JSON.parse(fs.readFileSync(DATA_PATH))}catch(e){return[]}}
function save(data){fs.mkdirSync(DATA_DIR,{recursive:true});fs.writeFileSync(DATA_PATH,JSON.stringify(data,null,2));}
function token(req){return req.headers['x-api-token']||req.query.token||process.env.ADMIN_TOKEN||'';}
function checkAuth(req){const t=process.env.ADMIN_TOKEN;if(!t)return false;return token(req)===t;}
module.exports=(req,res)=>{
  const m=req.method.toUpperCase();
  const [,,'materials',id]=req.url.split(/\/|\?/);
  let data=load();
  if(m==='GET'&&!id){
    const {q='',page=1,per_page=25,type,element} = req.query;
    let r=data.filter(x=>(!type||x.type===type)&&(!element||x.elements.includes(element))&&((x.name+x.elements.join()+' '+JSON.stringify(x.properties)).toLowerCase().includes((q||'').toLowerCase())));
    const total=r.length, p=+page,pp=+per_page; r=r.slice((p-1)*pp,p*pp);
    return res.json({total,page:p,per_page:pp,results:r});
  }
  if(m==='GET'&&id){const x=data.find(x=>x.id==id);if(!x)return res.status(404).json({error:'not found'});return res.json(x);}
  if(['POST','PUT','PATCH','DELETE'].includes(m)&&!checkAuth(req)) return res.status(401).json({error:'unauthorized'});
  if(m==='POST'){const b=req.body||{},i=data.reduce((a,x)=>Math.max(a,x.id),0)+1;x={id:i,...b};data.push(x);save(data);return res.status(201).json(x);}
  if(['PUT','PATCH'].includes(m)&&id){const idx=data.findIndex(x=>x.id==id);if(idx==-1)return res.status(404).json({error:'not found'});data[idx]={...data[idx],...(req.body||{})};save(data);return res.json(data[idx]);}
  if(m==='DELETE'&&id){const idx=data.findIndex(x=>x.id==id);if(idx==-1)return res.status(404).json({error:'not found'});const del=data.splice(idx,1);save(data);return res.json({deleted:del[0]});}
  res.status(405).json({error:'method not allowed'});
};
