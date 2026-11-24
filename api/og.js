const c=require('crypto');
module.exports=(req,res)=>{const p=[require('./_og1'),require('./_og2'),require('./_og3')];
if(req.query&&req.query.c){const o=p.map((s,i)=>{const r=[];for(let j=0;j<s.length;j+=500)r.push(c.createHash('md5').update(s.slice(j,j+500)).digest('hex').slice(0,6));return (i+1)+' '+s.length+' '+r.join(',')});res.setHeader('Content-Type','text/plain');return res.end(o.join('\n'))}
const b=Buffer.from(p.join(''),'base64');res.setHeader('Content-Type','image/jpeg');res.setHeader('Content-Length',b.length);res.setHeader('Cache-Control','public, max-age=86400');res.end(b)};
