# MahLovely Studio brand media

The public site uses an **editorial selection** of original photos and videos in `public/brand/Ke` and `public/brand/Titi`. It does not automatically dump every new file into every page.

## Portraits

- Shante: `/brand/Ke/IMG_0549.PNG`
- Cee: `/brand/Titi/IMG_0550.JPG`

The artist portrait positions are intentionally preserved. Admin-uploaded photos can override the default headshots.

## Campaign and portfolio imagery

- `src/lib/brand-media.ts`: selected photo and video paths, captions and sequence.
- `src/components/brand-portfolio.tsx`: photo stories and click-to-play videos.
- `src/app/page.tsx`: curated homepage placements for the two artists.
- `src/app/gallery/page.tsx`: full lookbooks by artist plus extra published admin gallery items.

Run `npm run dev` or `npm run build`. The `predev` and `prebuild` hooks run `scripts/prepare-brand-media.mjs`, which converts the selected large PNGs into lighter WebP images under `public/brand/editorial`. These generated files are not committed. The originals remain untouched and browser layout crops are controlled through CSS.

Videos are streamed from their existing MP4 source paths and have posters. They use `preload="none"`, meaning they do not load the entire video before a visitor presses play. Videos are not re-encoded or physically trimmed by the current build.

When new media is added, inspect and curate it first, then extend `src/lib/brand-media.ts` and `scripts/prepare-brand-media.mjs`. This keeps the homepage intentional while allowing the full portfolio to expand.

The admin Media uploader is separate from the static brand assets. In production its uploaded files are stored in the configured public Vercel Blob store.
