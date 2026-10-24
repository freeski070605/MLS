import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GalleryMedia from './gallery-media';

describe('GalleryMedia', () => {
  it('renders responsive inline video playback with controls, poster, and no eager preload', () => {
    const html = renderToStaticMarkup(
      <GalleryMedia
        item={{
          mediaType: 'VIDEO',
          imageUrl: null,
          videoUrl: '/brand/Titi/11116604-C8BC-46E4-A638-46E23C1E9138.mp4',
          posterUrl: '/brand/Titi/posters/11116604-C8BC-46E4-A638-46E23C1E9138.jpg',
          width: 720,
          height: 1280,
          altText: 'Braiding work video by Cee'
        }}
      />
    );

    expect(html).toContain('controls=""');
    expect(html).toContain('playsInline=""');
    expect(html).toContain('preload="none"');
    expect(html).toContain('aspect-ratio:720/1280');
    expect(html).toContain('poster="/brand/Titi/posters/11116604-C8BC-46E4-A638-46E23C1E9138.jpg"');
    expect(html).toContain('width="720"');
    expect(html).toContain('height="1280"');
    expect(html).toContain('type="video/mp4"');
  });
});
