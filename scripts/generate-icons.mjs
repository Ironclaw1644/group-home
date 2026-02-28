import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(process.cwd());
const source = resolve(root, 'public/brand/AHFS_logo.png');

const outputs = [
  { path: 'public/brand/logo.png', size: 1024 },
  { path: 'app/icon.png', size: 512 },
  { path: 'app/apple-icon.png', size: 180 },
  { path: 'public/favicon-16x16.png', size: 16 },
  { path: 'public/favicon-32x32.png', size: 32 },
  { path: 'public/android-chrome-192x192.png', size: 192 },
  { path: 'public/android-chrome-512x512.png', size: 512 }
];

function getImageCommand() {
  try {
    execFileSync('magick', ['-version'], { stdio: 'ignore' });
    return 'magick';
  } catch {
    return 'convert';
  }
}

const imageCmd = getImageCommand();

function renderPng(input, output, size) {
  const inner = Math.max(1, Math.round(size * 0.84));
  execFileSync(imageCmd, [
    input,
    '-background',
    'none',
    '-gravity',
    'center',
    '-resize',
    `${inner}x${inner}`,
    '-extent',
    `${size}x${size}`,
    output
  ]);
}

async function main() {
  for (const { path, size } of outputs) {
    const output = resolve(root, path);
    await mkdir(dirname(output), { recursive: true });
    renderPng(source, output, size);
  }

  const favicon16 = resolve(root, 'public/favicon-16x16.png');
  const favicon32 = resolve(root, 'public/favicon-32x32.png');
  const faviconIco = resolve(root, 'public/favicon.ico');

  try {
    execFileSync(imageCmd, [favicon16, favicon32, faviconIco]);
  } catch {
    await copyFile(favicon32, faviconIco);
  }

  const webmanifest = {
    name: 'At Home Family Services, LLC',
    short_name: 'AHFS',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#0f2d45',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  };

  await writeFile(resolve(root, 'public/site.webmanifest'), `${JSON.stringify(webmanifest, null, 2)}\n`);
  console.log('Generated app icons, favicons, and webmanifest from public/brand/AHFS_logo.png');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
