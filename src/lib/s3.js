import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function publicUrlForKey(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export function keyFromPublicUrl(url) {
  const marker = ".amazonaws.com/";
  const index = url?.indexOf(marker) ?? -1;
  return index === -1 ? null : url.slice(index + marker.length);
}

export async function putObject(key, body, contentType) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return publicUrlForKey(key);
}

export async function uploadToS3(prefix, file) {
  const ext = file.name.split(".").pop() || "bin";
  const key = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  return putObject(key, bytes, file.type);
}

export async function deleteFromS3(urls) {
  const keys = urls.map(keyFromPublicUrl).filter(Boolean);
  if (keys.length === 0) return;

  await s3Client.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    }),
  );
}
