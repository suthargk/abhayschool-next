const HEIC_TYPES = new Set(["image/heic", "image/heif"]);
const HEIC_EXTENSION_RE = /\.hei[cf]$/i;

const MAX_SIZE_MB = 1.5;
const MAX_DIMENSION = 2000;

function isHeic(file) {
  return HEIC_TYPES.has(file.type) || HEIC_EXTENSION_RE.test(file.name);
}

function withJpegName(name) {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}

/**
 * Converts HEIC/HEIF photos to JPEG and compresses images client-side before
 * upload. GIFs are passed through untouched so animation isn't flattened.
 */
export async function prepareImageForUpload(file) {
  let working = file;

  if (isHeic(file)) {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const blob = Array.isArray(result) ? result[0] : result;
    working = new File([blob], withJpegName(file.name), { type: "image/jpeg" });
  }

  if (working.type === "image/gif") {
    return working;
  }

  const imageCompression = (await import("browser-image-compression")).default;
  const compressedBlob = await imageCompression(working, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    initialQuality: 0.6,
  });

  return new File([compressedBlob], working.name, {
    type: compressedBlob.type || working.type,
  });
}
