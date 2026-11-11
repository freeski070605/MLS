import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'..');
const output=path.join(root,'docs','media-review');
await fs.mkdir(output,{recursive:true});
const escape=(s)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
async function sheet(name,items,columns=4){
  const width=270,height=340,gap=12,rows=Math.ceil(items.length/columns);
  const layers=[];
  for(let i=0;i<items.length;i++){
    const [source,label]=items[i],x=(i%columns)*(width+gap)+gap,y=Math.floor(i/columns)*(height+gap)+gap;
    const thumb=await sharp(source).rotate().resize(250,290,{fit:'contain',background:'#e4ded5'}).jpeg({quality:75}).toBuffer();
    layers.push({input:thumb,left:x+10,top:y});
    const text=Buffer.from(`<svg width="${width}" height="40"><rect width="100%" height="100%" fill="#f7f3ec"/><text x="8" y="16" font-size="12" font-family="Arial" fill="#211b15">${escape(label.slice(0,38))}</text>${label.length>38?`<text x="8" y="31" font-size="11" font-family="Arial" fill="#211b15">${escape(label.slice(38,73))}</text>`:''}</svg>`);
    layers.push({input:text,left:x,top:y+294});
  }
  await sharp({create:{width:columns*(width+gap)+gap,height:rows*(height+gap)+gap,channels:3,background:'#ddd5ca'}}).composite(layers).jpeg({quality:84}).toFile(path.join(output,name));
}
for(const artist of ['Ke','Titi']){
  const dir=path.join(root,'public','brand',artist);
  const names=(await fs.readdir(dir)).filter(n=>/\.(jpe?g|png|heic)$/i.test(n)).sort();
  const photos=[];
  for(const name of names){
    let source=path.join(dir,name);
    if(/\.heic$/i.test(name)){
      const converted=path.join(output,`${artist.toLowerCase()}-${path.parse(name).name}-heic.jpg`);
      execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-frames:v','1','-q:v','3',converted]);
      source=converted;
    }
    photos.push([source,name]);
  }
  await sheet(`${artist.toLowerCase()}-photos.jpg`,photos);
  const videos=(await fs.readdir(dir)).filter(n=>/\.mp4$/i.test(n)).sort();
  const frames=[];
  for(const name of videos){
    const source=path.join(dir,name);
    const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',source],{encoding:'utf8'}).trim());
    for(const fraction of [.2,.5,.8]){
      const second=Math.max(0,duration*fraction);
      const frame=path.join(output,`${artist.toLowerCase()}-${path.parse(name).name}-${Math.round(fraction*100)}.jpg`);
      execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',second.toFixed(2),'-i',source,'-frames:v','1','-vf','scale=600:-2',frame]);
      frames.push([frame,`${name} @ ${second.toFixed(1)}s`]);
    }
  }
  await sheet(`${artist.toLowerCase()}-videos.jpg`,frames);
}
await sheet('shortlist.jpg',[
  ['Ke/IMG_9173.JPG','Ke / finished loc updo'],
  ['Ke/IMG_0455.JPG','Ke / copper loc updo'],
  ['Ke/IMG_0104.JPG','Ke / neat loc styling'],
  ['Ke/IMG_2724.JPG','Ke / copper loc back view'],
  ['Ke/Dolphin_Radar_20261111082823.png','Ke / MAH ESTI facial'],
  ['Ke/Dolphin_Radar_20261111082827.png','Ke / MAH ESTI treatment'],
  ['Titi/IMG_1718.png','Cee / back view of braids'],
  ['Titi/IMG_6519.png','Cee / owner selected homepage'],
  ['Titi/7EACAEFE-4995-4049-8792-1FAF4518A447.mp4 @ 10.3s','Cee / booking frame'],
  ['Titi/BC3ED02A-588C-4C69-8718-9950689904D5.mp4 @ 7.5s','Cee / radial braids in motion']
].map(([name,label])=>{
  const source=name.includes(' @ ')?path.join(output,`titi-${path.parse(name.split(' @ ')[0]).name}-50.jpg`):name.endsWith('82823.png')?path.join(root,'public','brand','editorial','ke-Dolphin_Radar_20261111082823.webp'):name.endsWith('.HEIC')?path.join(output,`ke-${path.parse(name).name}-heic.jpg`):path.join(root,'public','brand',name);
  return [source,label];
}));
