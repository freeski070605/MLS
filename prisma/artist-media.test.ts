import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { artistHeadshots, ceePortfolioPhotos, ceePortfolioVideos } from './artist-media';

const publicDirectory = path.join(process.cwd(), 'public');
const mediaDirectory = path.join(publicDirectory, 'brand');

describe('artist media inventory', () => {
  it('lists each supplied still portrait once for its artist', () => {
    expect(artistHeadshots).toHaveLength(2);
    expect(artistHeadshots.map((headshot) => headshot.artistSlug)).toEqual(['christina', 'shante']);
    expect(new Set(artistHeadshots.map((headshot) => headshot.imageUrl)).size).toBe(2);
    for (const headshot of artistHeadshots) {
      expect(existsSync(path.join(publicDirectory, ...headshot.imageUrl.split('/').slice(1)))).toBe(true);
    }
  });

  it('lists every available Cee portfolio image and video once', () => {
    expect(ceePortfolioPhotos).toHaveLength(8);
    expect(ceePortfolioVideos).toHaveLength(8);
    expect(new Set(ceePortfolioPhotos.map((photo) => photo.filename)).size).toBe(8);
    expect(new Set(ceePortfolioVideos).size).toBe(8);
    const ceeDirectory = path.join(mediaDirectory, 'Titi');
    const actualPhotos = readdirSync(ceeDirectory).filter((filename) => /\.(png|jpe?g)$/i.test(filename) && filename !== 'IMG_0550.JPG').sort();
    const actualVideos = readdirSync(ceeDirectory).filter((filename) => /\.mp4$/i.test(filename)).sort();
    expect(ceePortfolioPhotos.map((photo) => photo.filename).sort()).toEqual(actualPhotos);
    expect([...ceePortfolioVideos].sort()).toEqual(actualVideos);
    for (const filename of ceePortfolioVideos) {
      expect(existsSync(path.join(ceeDirectory, 'posters', filename.replace(/\.mp4$/i, '.jpg')))).toBe(true);
    }
  });

  it('accounts for all 18 supplied files without assigning a headshot to the portfolio', () => {
    expect(artistHeadshots.length + ceePortfolioPhotos.length + ceePortfolioVideos.length).toBe(18);
  });
});
