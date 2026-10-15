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
      path.resolve(process.cwd(), 'dorabox-4bbcb-firebase-adminsdk-fbsvc-d81bef5cc4.json'),
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
          sound: 'default',
        },
      },
    });

    console.log(`✅ [FCM v1 Success] Message ID: ${messageId} to: ${params.token.slice(0, 10)}...`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('❌ Error sending FCM v1 push:', error);
    return { success: false, error: error.message || 'FCM v1 dispatch error' };
  }
}
