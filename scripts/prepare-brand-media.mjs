// Produce web-ready editorial photos from the studio's original files.
// The originals stay untouched; the published pages use these light WebP versions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.join(root,'public','brand','editorial');
const assets={
  Ke:[
    'IMG_0104.JPG','IMG_0455.JPG','IMG_1710.HEIC','IMG_2256_Original.HEIC',
    'IMG_2724.JPG','IMG_2743.HEIC','IMG_2747.HEIC','IMG_9173.JPG',
    'Dolphin_Radar_20261111082823.png',
    'Dolphin_Radar_20261111082827.png',
    'Dolphin_Radar_20261111082842.png'
  ],
  Titi:[
    'IMG_1718.png','IMG_1720.png','IMG_6519.png'
  ]
};

await fs.mkdir(destination,{recursive:true});
await fs.rm(path.join(destination,'titi-IMG_1714.webp'),{force:true});
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
      let input=source;
      if(/\.heic$/i.test(name)){
        input=path.join(destination,`${folder.toLowerCase()}-${path.parse(name).name}-conversion.jpg`);
        execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-frames:v','1','-q:v','3',input]);
      }
      await sharp(input,{limitInputPixels:100_000_000})
        .rotate(name==='Dolphin_Radar_20261111082823.png'?180:undefined)
        .resize({width:1400,height:1800,fit:'inside',withoutEnlargement:true})
        .webp({quality:79,effort:4})
        .toFile(output);
      if(input!==source)await fs.unlink(input);
      console.log(`Optimized: ${folder}/${name}`);
    }catch(error){
      console.error(`Could not prepare brand image: ${folder}/${name}`,error);
      throw error;
    }
  }
}
for(const [name,video,second] of [
  ['cee-hero','11116604-C8BC-46E4-A638-46E23C1E9138.mp4','10.8'],
  ['cee-booking','7EACAEFE-4995-4049-8792-1FAF4518A447.mp4','10.3']
]){
  const source=path.join(root,'public','brand','Titi',video);
  const output=path.join(destination,`${name}.webp`);
  const [a,b]=await Promise.all([fs.stat(source),fs.stat(output).catch(()=>null)]);
  if(b&&b.mtimeMs>=a.mtimeMs)continue;
  const frame=path.join(destination,`${name}-frame.jpg`);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',second,'-i',source,'-frames:v','1',frame]);
  await sharp(frame).resize({width:1400,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:83,effort:4}).toFile(output);
  await fs.unlink(frame);
}
for(const [name,folder,video,start,duration] of [
  ['cee-cornrows','Titi','11116604-C8BC-46E4-A638-46E23C1E9138.mp4','3','15'],
  ['cee-beaded-bun','Titi','7EACAEFE-4995-4049-8792-1FAF4518A447.mp4','3','13'],
  ['ke-loc-reveal','Ke','IMG_1755.mp4','1','9']
]){
  const source=path.join(root,'public','brand',folder,video);
  const output=path.join(destination,`${name}.mp4`);
  const [a,b]=await Promise.all([fs.stat(source),fs.stat(output).catch(()=>null)]);
  if(b&&b.mtimeMs>=a.mtimeMs)continue;
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',start,'-i',source,'-t',duration,'-vf','scale=720:-2','-c:v','libx264','-preset','veryfast','-crf','27','-pix_fmt','yuv420p','-an','-movflags','+faststart',output]);
}
for(const [name,video,second] of [
  ['ke-IMG_1755-poster','IMG_1755.mp4','5.5'],
  ['ke-recorded-poster','recorded-31849307613849.mp4','2.5'],
  ['ke-esti-poster','Dolphin_Radar_20261111082815.mp4','2.9'],
  ['ke-esti-treatment-poster','Dolphin_Radar_20261111082840.mp4','9.3']
]){
  const source=path.join(root,'public','brand','Ke',video);
  const output=path.join(destination,`${name}.webp`);
  const [a,b]=await Promise.all([fs.stat(source),fs.stat(output).catch(()=>null)]);
  if(b&&b.mtimeMs>=a.mtimeMs)continue;
  const frame=path.join(destination,`${name}-frame.jpg`);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',second,'-i',source,'-frames:v','1',frame]);
  await sharp(frame).resize({width:900,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:78}).toFile(output);
  await fs.unlink(frame);
}
