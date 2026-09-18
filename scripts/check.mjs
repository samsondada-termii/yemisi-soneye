import fs from 'node:fs/promises';
import path from 'node:path';
const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(d=>d.isDirectory()?walk(path.join(dir,d.name)):path.join(dir,d.name)))).flat();
const files=await walk('dist');let checks=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await fs.readFile(file,'utf8');
 if(!html.includes('<title>')||!html.includes('Yemisi Soneye')||!html.includes('id="main"'))throw new Error('Missing metadata or main: '+file);
 for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)){
  let p='dist'+url.split('#')[0];if(p.endsWith('/'))p+='index.html';await fs.access(p);checks++;
 }
 if(/SOURCE-NOTES|YOUR EMAIL|lorem ipsum|TODO/i.test(html))throw new Error('Internal content leaked: '+file);
}
for(const file of files)if(/SOURCE-NOTES|manifest\.json|\.psd$|contact\.config|web-research/.test(file))throw new Error('Private source in public output: '+file);
console.log(`${files.filter(f=>f.endsWith('.html')).length} pages verified; ${checks} internal references valid; internal research excluded.`);
