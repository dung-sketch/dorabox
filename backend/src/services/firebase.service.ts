import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';
import path from 'path';

let firebaseApp: App | null = null;
let activeProjectId: string = 'dorabox-c4c55';

export function getFirebaseProjectId(): string {
  return activeProjectId;
}

/**
 * Khởi tạo Firebase Admin SDK chuẩn HTTP v1 bằng Service Account
 */
export function initFirebaseAdmin(): boolean {
  if (firebaseApp || getApps().length > 0) {
    firebaseApp = getApps()[0];
    return true;
  }

  try {
    // 1. Kiểm tra chuỗi JSON từ biến môi trường
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountEnv) {
      const serviceAccount = JSON.parse(serviceAccountEnv);
      if (serviceAccount.project_id) {
        activeProjectId = serviceAccount.project_id;
      }
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK (HTTP v1) initialized via ENV key');
      return true;
    }

    // 2. Tự động tìm kiếm file firebase-adminsdk hoặc service-account trong thư mục backend
    const possiblePaths = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      path.resolve(process.cwd(), 'dorabox-c4c55-firebase-adminsdk-fbsvc-78fa551501.json'),
      path.resolve(process.cwd(), 'backend/dorabox-c4c55-firebase-adminsdk-fbsvc-78fa551501.json'),
      path.resolve(__dirname, '../../dorabox-c4c55-firebase-adminsdk-fbsvc-78fa551501.json'),
      path.resolve(__dirname, '../dorabox-c4c55-firebase-adminsdk-fbsvc-78fa551501.json'),
      path.resolve(process.cwd(), 'firebase-service-account.json'),
      path.resolve(process.cwd(), 'service-account.json'),
      path.resolve(process.cwd(), '../firebase-service-account.json'),
    ].filter(Boolean) as string[];

    // Tìm kiếm các file json có chứa firebase-adminsdk
    try {
      const files = fs.readdirSync(process.cwd());
      for (const f of files) {
        if (f.includes('firebase-adminsdk') && f.endsWith('.json')) {
          possiblePaths.unshift(path.resolve(process.cwd(), f));
        }
      }
    } catch (_) {}

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const serviceAccount = JSON.parse(fileContent);
        if (serviceAccount.project_id) {
          activeProjectId = serviceAccount.project_id;
        }
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
        });
        console.log(`✅ Firebase Admin SDK (HTTP v1) initialized via file: ${filePath} (Project: ${activeProjectId})`);
        return true;
      }
    }

    // 3. Fallback: Embedded Service Account Credential (đảm bảo luôn hoạt động trên Vercel Serverless)
    const fallbackCredential = {
      type: 'service_account',
      project_id: 'dorabox-c4c55',
      private_key_id: '78fa5515013dd27bbf30fa47f9b75bcb7da52077',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGWLF06tKo/jPq\nS/uNHGOG6tUyRm1nlzXWskspU/C0GlP2eu3JVa9orNNR8w1quJDo5oG3EcZqufsK\ntJ+IzEhTZhTeasOtUkl+fiElUng71ymiEonlDajgzVooko3hM0Bk8j8xn5YS2K3U\nCt8EBiNdqBYOyTwJTXH1Qa9196QqYH3gqCPnpUQT+CY9+BlGzRx3ztJ8eXqBqsOS\nzZkxyzHN9fH9AN/LnZQdJSiNtzxAihyaG/CMZnEWYytULxiXf4ZPC73f2SRGw+XI\nHIj7lYyKEMbV4+UFugybvOwylsunLYE5L3TU10tqb/wPYfEq4vEDF6kK/0lYbxjG\nCGIIKZcpAgMBAAECggEAHukTlApEajGzcCqx49EuHDMx+8kd+QGHp73Ww3S2vlqc\nBdLX29iOotwhfVPzc1OawbD/5hfPDt2M/KN0I/gyDU01/gjawIK3vA7L+5UD8noa\n8uG7Zlw1RVNmCYyir8Xc8zO4Gsj+tPvaRdar4A9U055Y/FTqwPMLdL1CgDqSSvLD\nD3llNssv5IDNfP6duqMst8xJe1qeM/419iA6EqoXlB7EDNn+AvKYGI/Zyo98rg04\ntUmgUBbXKtoS7qJzEV/TBwEHSQiotSbOKmdPQVuc99Wbl17Nr+PwK+n52nz6rVzo\nFrii76gWHFJ6aWZDzEfT7IIHTJhorMKXUl3KsL5aQQKBgQDpI7zcia5s49KAE83Y\nN8pkH4Zueo/SlCm0XMiW0XdJyToWyMyibTg8sUbokdE1vUUq71b3awzrQ8GEQ9Q7\nv2HsT9hKLoi7lztUaS+v8i5zyqY4tL9RHNo/HSTu2oywBW0L+F0JrvL6MkI+CnKa\nM+TSZAsnPMhUnNsrx+488wTXywKBgQDZy5REsE1MbzovpPt21YFECMixWefyJ+EP\ngNwZB5exhXGXiYq6CVv5ble1GGhRKzFB0CRIBrOTanZlNT/zNPOmH9ntoBIR2Pyn\nZd+BQhQfWGq8l7mjt4FJ0mzMtKSl3dofNIFMmC47c9pKOITdpuS3CwxHJ2M0xTAY\n2XqaW6JmWwKBgQDMDfSSjos1UV3/rdXABmzFn3YZInrZU8cAzyjeIG4pDdAi+xNo\novHS5VLr4hzbzVJJ1vwmR/Mhw8cPzhJnTQYXQHdNzlbs4dwS8JHFjNItlNRR05mU\nFA3NqeOWj4EN22HrVTGRdSfD5tNl290crIj9wISmjiPFMxj9w9r4S7gUawJ/JW7Y\nDPZAUuLLHWU90y7fCNJ5rAHH29b+16tOKP8lE13cKC97qH3zUOumJ3oKc+j4jlc3\n5SlBtBSYRMziMOro9aSD0FOyx16EDkF0KMMysjCAJ+nr/jeMASQpjwV9RwTaeIKN\ntpxxVcaTvi34qCAHL262rYQXiPpbSeoXKHCXeQKBgQDD7WkoMDFR4bNfKnJgfs0G\nAnwDu6OuUqcqp3sJLnjVGMHkKHJj4vyZMd/N41P3c9VpzWqZxYlMnipEjAQ1bUjr\ntdnKHN+R2WD7Lm9E/qaElmxMQQk/S+eAkYO9nR3Lbxyq+Txwn2UkdicN9FY8rOIv\nm/dl5SGmJl4FduMP6Bya4Q==\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk-fbsvc@dorabox-c4c55.iam.gserviceaccount.com',
      client_id: '116399039886650347154',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dorabox-c4c55.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    };

    activeProjectId = fallbackCredential.project_id;
    firebaseApp = initializeApp({
      credential: cert(fallbackCredential as any),
    });
    console.log(`✅ Firebase Admin SDK (HTTP v1) initialized via embedded fallback (Project: ${activeProjectId})`);
    return true;
  } catch (err: any) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
  }

  return false;
}

/**
 * Gửi thông báo đẩy qua Firebase Cloud Messaging chuẩn HTTP v1 mới nhất
 */
export async function sendFcmHttpV1Message(params: {
  token: string;
  title: string;
  body: string;
  channelId?: string;
  data?: Record<string, any>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!initFirebaseAdmin() || !firebaseApp) {
      return {
        success: false,
        error: 'Firebase Admin SDK chưa được cấu hình Service Account (HTTP v1)',
      };
    }

    // FCM HTTP v1 yêu cầu toàn bộ value trong data phải là dạng chuỗi (string)
    const stringData: Record<string, string> = {};
    if (params.data) {
      for (const [k, v] of Object.entries(params.data)) {
        stringData[k] = typeof v === 'string' ? v : String(v);
      }
    }

    const channel = params.channelId || 'dorabox_general_v3';
    let soundName = 'ting';
    if (channel.includes('messages')) {
      soundName = 'tingtingmes';
    } else if (channel.includes('calls')) {
      soundName = 'goiden';
    }

    const messageId = await getMessaging(firebaseApp).send({
      token: params.token,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: stringData,
      android: {
        priority: 'high',
        notification: {
          channelId: channel,
          sound: soundName,
          defaultSound: false,
          defaultVibrateTimings: true,
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: `${soundName}.caf`,
            badge: 1,
          },
        },
      },
    });

    console.log(`✅ [FCM v1 Success] Message ID: ${messageId} to: ${params.token.slice(0, 10)}... (Channel: ${channel})`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('❌ Error sending FCM v1 push:', error);
    return { success: false, error: error.message || 'FCM v1 dispatch error' };
  }
}
