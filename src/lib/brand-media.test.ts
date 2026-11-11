import {describe,expect,it} from 'vitest';
import {brandCollections,locCollection,isRejectedBrandMedia} from './brand-media';
import {ceePortfolioPhotos,ceePortfolioVideos} from '../../prisma/artist-media';

describe('curated brand media',()=>{
  it('never publishes rejected Cee media through the manifest or seed list',()=>{
    const seededPhotos=ceePortfolioPhotos.map(photo=>String(photo.filename));
    expect(seededPhotos).not.toContain('IMG_1714.png');
    expect(seededPhotos).not.toContain('IMG_1720.png');
    expect(ceePortfolioVideos).not.toContain('11116604-C8BC-46E4-A638-46E23C1E9138.mp4');
    expect(isRejectedBrandMedia('https://example.com/brand/Titi/IMG_1720.png?width=640')).toBe(true);
    expect(brandCollections.christina.photos[0].original).toBe('/brand/Titi/IMG_6519.png');
    for(const collection of [...Object.values(brandCollections),locCollection]){
      expect(collection.photos.some(photo=>isRejectedBrandMedia(photo.original)||isRejectedBrandMedia(photo.src))).toBe(false);
      expect(collection.films.some(film=>isRejectedBrandMedia(film.original)||isRejectedBrandMedia(film.src)||isRejectedBrandMedia(film.poster))).toBe(false);
    }
  });
});
