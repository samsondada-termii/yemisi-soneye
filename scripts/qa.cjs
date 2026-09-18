const {chromium}=require('playwright');
const fs=require('fs');
const widths=[1440,1280,1024,768,430,390];
const routes=['/','/work/','/about/','/contact/','/work/logos-and-heart/','/work/egfm/','/work/singlz-summit/','/work/nlwc/','/work/emmy-homes-realty/'];
(async()=>{
 const browser=await chromium.launch({headless:true});const results=[];
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
  for(const route of routes){
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(const im of document.querySelectorAll('img[src]')){im.loading='eager';await im.decode().catch(()=>{})}});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.querySelectorAll('img[src]')].filter(im=>!im.complete||im.naturalWidth===0).map(im=>im.src),h1:document.querySelector('h1')?.textContent}));
   const key=route==='/'?'home':route.replace(/^\/|\/$/g,'').replaceAll('/','-');
   await page.screenshot({path:`screenshots/${key}-${width}.png`,fullPage:true});
   results.push({width,route,status:response.status(),...state,errors});
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://127.0.0.1:4173/work/logos-and-heart/');
 await page.locator('[data-enlarge]').first().click();
 const dialogOpened=await page.locator('dialog').evaluate(d=>d.open);
 await page.keyboard.press('Escape');
 const dialogClosed=await page.locator('dialog').evaluate(d=>!d.open);
 await page.locator('.back-link').click();
 const backWorks=page.url().endsWith('/work/');
 await page.getByRole('link',{name:'Contact',exact:true}).click();
 const email=await page.locator('a[href^="mailto:"]').getAttribute('href');
 await page.goto('http://127.0.0.1:4173/work/nlwc/');
 await page.locator('.next-project a').click();const nextWorks=page.url().includes('/work/emmy-homes-realty/');
 const failed=results.filter(r=>r.status!==200||r.overflow||r.broken.length||r.errors.length);
 fs.writeFileSync('QA-RESULTS.json',JSON.stringify({results,interactions:{dialogOpened,dialogClosed,backWorks,nextWorks,email},failures:failed},null,2));
 console.log(JSON.stringify({pages:routes.length,widths,checks:results.length,failures:failed,interactions:{dialogOpened,dialogClosed,backWorks,nextWorks,email}},null,2));
 await browser.close();if(failed.length||!dialogOpened||!dialogClosed||!backWorks||!nextWorks)process.exitCode=1;
})();
