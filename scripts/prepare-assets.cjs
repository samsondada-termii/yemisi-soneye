const fs = require('node:fs');
const sharp = require('sharp');
const manifest = JSON.parse(fs.readFileSync('assets/portfolio/manifest.json'));
async function processImage(name, source) {
  const metadata = await sharp(source).metadata();
  for (const width of [640,1280,1920]) {
    await sharp(source).rotate().resize({width:Math.min(width,metadata.width),withoutEnlargement:true}).webp({quality:86,effort:5}).toFile(`assets/portfolio/${name}-${width}.webp`);
  }
  return {name,source,width:metadata.width,height:metadata.height};
}
(async()=>{
  const records=[];
  for (const {name,source} of manifest) records.push(await processImage(name,source));
  fs.writeFileSync('assets/portfolio/manifest.json',JSON.stringify(records,null,2));
  console.log(`Prepared ${records.length} selected assets in three responsive sizes.`);
})();
