const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function upload() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'dung-sketch-team-dorabox';

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const apkPath = path.resolve(__dirname, '../release/Dorabox-v2.10.11.apk');
  console.log('Reading APK file from:', apkPath);
  const fileStat = fs.statSync(apkPath);
  console.log(`APK Size: ${(fileStat.size / (1024 * 1024)).toFixed(2)} MB`);

  const fileStream = fs.createReadStream(apkPath);
  const key = 'apk/Dorabox-v2.10.11.apk';

  console.log(`Uploading to R2 [${bucketName}] / ${key} ...`);
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: 'application/vnd.android.package-archive',
    ContentLength: fileStat.size,
  });

  await s3.send(putCommand);
  console.log('Upload complete! Verifying with HeadObject...');

  const head = await s3.send(new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  }));

  console.log('Verified on R2:', {
    key,
    size: head.ContentLength,
    contentType: head.ContentType,
    lastModified: head.LastModified,
  });
  console.log(`Public URL: https://doraboxcdn.zpiltk.io.vn/${key}`);
}

upload().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

