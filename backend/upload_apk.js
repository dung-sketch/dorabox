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

  let apkPath = path.resolve(__dirname, '../Dorabox-v3.0.0-arm64.apk');
  if (!fs.existsSync(apkPath)) {
    apkPath = path.resolve(__dirname, '../release/Dorabox-v3.0.0-arm64.apk');
  }
  console.log('Reading APK file from:', apkPath);
  const fileStat = fs.statSync(apkPath);
  console.log(`APK Size: ${(fileStat.size / (1024 * 1024)).toFixed(2)} MB`);

  const targetKeys = [
    'apk/Dorabox-v3.0.0.apk',
    'apk/Dorabox-v3.0.0-arm64.apk',
    'apk/Dorabox-latest.apk'
  ];

  for (const key of targetKeys) {
    console.log(`Uploading to R2 [${bucketName}] / ${key} ...`);
    const fileStream = fs.createReadStream(apkPath);
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: 'application/vnd.android.package-archive',
      ContentLength: fileStat.size,
    });
    await s3.send(putCommand);
    console.log(`✅ Uploaded to ${key}`);
  }
  console.log(`Public URL: https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk`);
}

upload().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

