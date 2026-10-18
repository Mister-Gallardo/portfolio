import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { defaultLocale, isLocale } from '@/i18n/config';
import { loadDictionary } from '@/i18n/dictionary';

const size = { width: 1200, height: 630 };

// Static assets read once at build time. The background (glow + portrait) is
// pre-rendered, Satori only sets the type on top of it.
const assets = join(process.cwd(), 'src/assets/og');
const [background, serif, sans] = await Promise.all([
  readFile(join(assets, 'background.jpg')),
  readFile(join(assets, 'og-cormorant-400.ttf')),
  readFile(join(assets, 'og-inter-tight-400.ttf')),
]);
const backgroundSrc = `data:image/jpeg;base64,${background.toString('base64')}`;

const resolveLocale = (value: string) => (isLocale(value) ? value : defaultLocale);

export async function generateImageMetadata({ params }: { params: { locale: string } }) {
  const { meta } = await loadDictionary(resolveLocale(params.locale));
  return [{ id: 'card', alt: meta.ogAlt, size, contentType: 'image/jpeg' }];
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { hero } = await loadDictionary(resolveLocale((await params).locale));

  const card = new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        color: '#e8e3d9',
        fontFamily: 'Inter Tight',
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori renders plain <img>, next/image does not exist here. */}
      <img
        src={backgroundSrc}
        alt=""
        width={size.width}
        height={size.height}
        style={{ position: 'absolute' }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 640,
          padding: '60px 0 60px 72px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#a8a093' }}>{hero.role}</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Cormorant',
            fontSize: 136,
            lineHeight: 0.9,
          }}
        >
          <span>{hero.firstName}</span>
          <span>{hero.lastName}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 26, lineHeight: 1.4 }}>
          <div style={{ width: 72, height: 1, marginBottom: 20, backgroundColor: '#c9a35b' }} />
          <span>{hero.stack}</span>
          <span style={{ color: '#a8a093' }}>{hero.location}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: serif, style: 'normal', weight: 400 },
        { name: 'Inter Tight', data: sans, style: 'normal', weight: 400 },
      ],
    },
  );

  // ImageResponse only renders PNG, which stores the photographic background poorly
  // (about 700 KB). As JPEG the card is a fraction of that, well within the ~300 KB
  // some messengers accept for link previews (WhatsApp shows none above it). The native
  // module loads only here: the page's metadata imports this file too.
  const { default: sharp } = await import('sharp');
  const jpeg = await sharp(Buffer.from(await card.arrayBuffer()))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
}
