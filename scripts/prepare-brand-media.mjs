// Produce web-ready editorial photos from the studio's original files.
// The originals stay untouched; the published pages use these light WebP versions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.join(root,'public','brand','editorial');
const assets={
  Ke:[
    'IMG_0104.JPG','IMG_0455.JPG',
    'IMG_2724.JPG','IMG_9173.JPG',
    'Dolphin_Radar_20261111082823.png',
    'Dolphin_Radar_20261111082827.png',
    'Dolphin_Radar_20261111082842.png'
  ],
  Titi:[
    'IMG_1718.png','IMG_6519.png'
  ]
};

await fs.mkdir(destination,{recursive:true});
for(const stale of ['titi-IMG_1714.webp','titi-IMG_1720.webp','cee-hero.webp','cee-cornrows.mp4']){
  await fs.rm(path.join(destination,stale),{force:true});
}
sharp.cache(false);
for(const [folder,files] of Object.entries(assets)){
  for(const name of files){
    const source=path.join(root,'public','brand',folder,name);
    const output=path.join(destination,`${folder.toLowerCase()}-${name.replace(/\.(png|jpe?g|heic)$/i,'.webp')}`);
    try{
      await fs.access(source);
      // Always regenerate when the source has changed; otherwise reuse the existing crop.
      const [a,b]=await Promise.all([fs.stat(source),fs.stat(output).catch(()=>null)]);
      if(b&&b.mtimeMs>=a.mtimeMs)continue;
      await sharp(source,{limitInputPixels:100_000_000})
        .rotate(name==='Dolphin_Radar_20261111082823.png'?180:undefined)
        .resize({width:1400,height:1800,fit:'inside',withoutEnlargement:true})
        .webp({quality:79,effort:4})
        .toFile(output);
      console.log(`Optimized: ${folder}/${name}`);
    }catch(error){
      console.error(`Could not prepare brand image: ${folder}/${name}`,error);
      throw error;
    }
  }
}
// HEIC and edited video derivatives must be prepared in a media-editing environment,
// not during Vercel builds. This build uses only portable Sharp-supported originals.
