import React from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@prisma/client';

type GalleryMediaProps = Pick<GalleryItem, 'mediaType' | 'imageUrl' | 'videoUrl' | 'posterUrl' | 'width' | 'height' | 'altText'>;

export default function GalleryMedia({ item }: { item: GalleryMediaProps }) {
  const width = item.width || (item.mediaType === 'VIDEO' ? 720 : 700);
  const height = item.height || (item.mediaType === 'VIDEO' ? 1280 : 875);
  const aspectRatio = `${width}/${height}`;

  return (
    <div className="gallery-media" style={{ aspectRatio }}>
      {item.mediaType === 'VIDEO' && item.videoUrl ? (
        <video
          aria-label={item.altText}
          controls
          playsInline
          preload="none"
          poster={item.posterUrl || undefined}
          width={width}
          height={height}
        >
          <source src={item.videoUrl} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      ) : item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.altText}
          width={width}
          height={height}
          loading="lazy"
          sizes="(max-width: 430px) 100vw, (max-width: 760px) 50vw, 33vw"
          unoptimized={item.imageUrl.startsWith('http')}
        />
      ) : null}
    </div>
  );
}
