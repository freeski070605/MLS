import {describe,expect,it} from 'vitest';
import {brandCollections,locCollection,isRejectedBrandMedia} from './brand-media';
import {ceePortfolioPhotos} from '../../prisma/artist-media';

describe('curated brand media',()=>{
  it('never publishes the rejected Cee photograph through the manifest or seed list',()=>{
    expect(ceePortfolioPhotos.map(photo=>String(photo.filename))).not.toContain('IMG_1714.png');
    for(const collection of [...Object.values(brandCollections),locCollection]){
      expect(collection.photos.some(photo=>isRejectedBrandMedia(photo.original)||isRejectedBrandMedia(photo.src))).toBe(false);
    }
  });
});
