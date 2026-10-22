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
    let serviceAccount: any = null;

    // 1. Kiểm tra chuỗi JSON hoặc Base64 từ biến môi trường FIREBASE_SERVICE_ACCOUNT_KEY
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountEnv) {
      try {
        const raw = serviceAccountEnv.trim();
        if (raw.startsWith('{')) {
          serviceAccount = JSON.parse(raw);
        } else {
          const decoded = Buffer.from(raw, 'base64').toString('utf-8');
          serviceAccount = JSON.parse(decoded);
        }
      } catch (e: any) {
        console.error('⚠️ Không thể parse FIREBASE_SERVICE_ACCOUNT_KEY từ ENV:', e.message);
      }
    }

    // 2. Nếu chưa có, nạp từ đường dẫn file chỉ định bởi biến môi trường
    if (!serviceAccount) {
      const possiblePaths = [
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
        process.env.GOOGLE_APPLICATION_CREDENTIALS,
      ].filter(Boolean) as string[];

      for (const filePath of possiblePaths) {
        const resolvedPath = path.isAbsolute(filePath)
          ? filePath
          : path.resolve(process.cwd(), filePath);
        if (fs.existsSync(resolvedPath)) {
          const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
          serviceAccount = JSON.parse(fileContent);
          break;
        }
      }
    }

    // 3. Khởi tạo khi tìm thấy credentials hợp lệ
    if (serviceAccount) {
      if (serviceAccount.project_id) {
        activeProjectId = serviceAccount.project_id;
      }
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log(`✅ Firebase Admin SDK (HTTP v1) initialized successfully (Project: ${activeProjectId})`);
      return true;
    }

    console.warn(
      '⚠️ Firebase Admin SDK chưa được cấu hình. Cần cung cấp FIREBASE_SERVICE_ACCOUNT_KEY (JSON/Base64) hoặc FIREBASE_SERVICE_ACCOUNT_PATH trong .env'
    );
    return false;
  } catch (err: any) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
    return false;
  }
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

    let channel = params.channelId || 'dorabox_general_v4';
    // Tự động nâng cấp channel sang v4 nếu request gửi v3
    if (channel.endsWith('_v3')) {
      channel = channel.replace('_v3', '_v4');
    }

    const isCall = channel.includes('calls') || stringData.type === 'call';
    const isMessage = channel.includes('messages') || stringData.type === 'message' || stringData.conversation_id != null;

    const messagePayload: any = {
      token: params.token,
      data: {
        ...stringData,
        title: params.title,
        body: params.body,
      },
      android: {
        priority: 'high',
      },
    };

    messagePayload.notification = {
      title: params.title,
      body: params.body,
    };

    if (isCall) {
      // Cuộc gọi: phát chuông cuộc gọi đặc thù goiden và ưu tiên cao nhất
      messagePayload.android.notification = {
        channelId: 'dorabox_calls_v4',
        sound: 'goiden',
        defaultSound: false,
        defaultVibrateTimings: true,
        priority: 'max',
        visibility: 'public',
      };
      messagePayload.android.ttl = 60 * 1000;
      messagePayload.apns = {
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'voip',
        },
        payload: {
          aps: {
            'content-available': 1,
            sound: 'goiden.caf',
          },
        },
      };
    } else {
      // Tin nhắn & thông báo: Cho phép phát TIẾNG CHUÔNG THÔNG BÁO MẶC ĐỊNH CỦA THIẾT BỊ (defaultSound: true)
      messagePayload.android.notification = {
        channelId: isMessage ? 'dorabox_messages_v4' : 'dorabox_general_v4',
        sound: 'default',
        defaultSound: true,
        defaultVibrateTimings: true,
        priority: 'max',
        visibility: 'public',
      };
      messagePayload.apns = {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      };
    }

    const messageId = await getMessaging(firebaseApp).send(messagePayload);

    console.log(`✅ [FCM v1 Success] Message ID: ${messageId} to: ${params.token.slice(0, 10)}... (Channel: ${channel})`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('❌ Error sending FCM v1 push:', error);
    return { success: false, error: error.message || 'FCM v1 dispatch error' };
  }
}
