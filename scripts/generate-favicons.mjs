// Regenerates the site's favicon assets (src/app/icon.png, apple-icon.png,
// favicon.ico) from the school logo. Re-run this after replacing
// public/images/logo.png.
//
// Requires the `png-to-ico` package (not a project dependency — install it
// ad hoc before running):
//   npm install --no-save png-to-ico
//   node scripts/generate-favicons.mjs

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";

const SRC = "public/images/logo.png";

async function main() {
  // App-router favicon: transparent PNG, browsers scale as needed. 256px
  // comfortably clears Google's "square, >=48px, multiple of 48" favicon
  // guidance while keeping the file small since it loads on every page.
  await sharp(SRC)
    .resize(256, 256)
    .png({ compressionLevel: 9, palette: true })
    .toFile("src/app/icon.png");
  console.log("Wrote src/app/icon.png (256x256)");

  // Apple touch icon: solid white background per Apple convention (iOS
  // applies its own rounded mask, and a transparent PNG can render oddly).
  await sharp(SRC)
    .resize(180, 180)
    .flatten({ background: "#ffffff" })
    .png()
    .toFile("src/app/apple-icon.png");
  console.log("Wrote src/app/apple-icon.png (180x180)");

  // Legacy favicon.ico: multi-resolution so old browsers / crawlers that
  // request /favicon.ico directly (bypassing the <link> tags) get the real
  // logo instead of the default Next.js placeholder.
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map((size) => sharp(SRC).resize(size, size).png().toBuffer()),
  );
  const ico = await pngToIco(buffers);
  await writeFile("src/app/favicon.ico", ico);
  console.log("Wrote src/app/favicon.ico (16/32/48)");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
