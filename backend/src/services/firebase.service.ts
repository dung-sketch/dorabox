import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';
import path from 'path';

let firebaseApp: App | null = null;
let activeProjectId: string = 'mcn-tinelfi-dorabox';

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

    // 3. Fallback mặc định cho mcn-tinelfi-dorabox để đảm bảo Vercel luôn khởi tạo thành công
    if (!serviceAccount) {
      serviceAccount = {
        type: 'service_account',
        project_id: 'mcn-tinelfi-dorabox',
        private_key_id: 'b0231a62186e702373cbd7d60270f8f63c31918a',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDT78Z3JSN/hRKz\nznvJs4oeXc2i8xMuyBDAB9k3y3sKrE37c9I12soN/4tWhZjnaNKVadxVm2+7DdHA\nLyUXFaHYwxGkq1A5vWrF7PY/Q/sRfTOGRcNgZStqwYDBSauck+vRGFfsGIo0Jlmm\nfkgi2cq6MP66f6wwHuLg+ERFPzOlxrMa+4pXV9Aq6sWtK/eSyS+uJFwLp+bwpp/r\nAMTSJka2YOxt9qrgMpEKIBDGAzAgbKKg+QudK7WKQ8WB9ONrPQJb/NozxqkeGB1b\nflWeVtHPfsDxRh2qaCF71yrTKTl+cJHcMF5fnK9QL0gJ4cKefdp7E9kIGVHg3YI6\nQBAmi5XZAgMBAAECggEAFI7XCm5hsMBSqbqjJxP5dzvb4z0vLIvnVQtF2qvMJANF\n/rjTyJnQHPa/eD12ESdpuujVgL/WwRckdB8WmtREOmukodukyO8K5QdY9RbV6zLA\n/Vq1yptRsHWz9Lvdz87I8oPJHoucV1XrfxMTkf7ck35GbUaOaC4MzawDalCoxMER\n42M0W69sYeENKXBrn/QD0fJEQPEg/LXiLeAV6WIEP/h91VPSxIHBEyEt+6sbnVqN\nhOt10Vk8+ETzDdumIVKagG3/76cMLQMEkk6fxx4gaWSD3cERcDIXLRlhZFp7JsOC\nFG0KbAlo02DxW0DO5KDElLi5w4LD4sAV3tJB/ClMwQKBgQDsu7v7Czex8/hbhysf\nm0GyDGzlEzRIZzGlVwd+cPirBKxL/PJNsdJn0gqvQmtm/FdtkHJvI7F8Nr0ywhif\nJ4nQXY91nlgyAR8yWNhf87fAnRpN4G5OlulpLEgOVOQx/mbQ1qOwwZqXgcgdculC\nCP89bNmTp5Gk+ilT1+l6GNm5mQKBgQDlL2i5yAjHaoKQTfACHo4b8Z5UDaIbyuAY\niIlZP0yPatx/JUnYfTAPfcpS1jfBjThxhAAPcoifZlhQvrbxLIfJWLJuRw6evHpo\nOzG7jCarX7qhqDrUXbS8qY9IZeQzTxBJ/e28BpC77JgyBtardroeaFWBCEHphEKv\nn6itySTmQQKBgCur7l+/kAS6FyT7aI8qGxJ3jFcuFcUNlHEF/xHqUVVrRUW3YhPH\nLCOO8f2m6R1Ui+Rgc1vhX8qkZn7Io7YomxnfSKnQDkEbR+AH19LLqShVUxbuwiqp\nWGHYk2phar92SQ1Zq1TeQmCUxo/4NOPDuSJhxDmi/hFLPPiEqkOl9fRxAoGBAMYA\ni43WEB+ZGWvqqaxrEYN637rmfGNehvUrIN6GHXLac901LfNnVJpNpvqiMFF73IPV\n8udloDt2hF5eJld+jWGay60SnsLtOyPJ4FGT5+SvM+JuIUVQH9HO/AckYF8js4L5\naubDFVAGPAcceWJxlKKoqRZtN+Sza5mnameaG9MBAoGBAIOWFbO7JIahfXbXcVkN\nfL0SKuG60VfflLYVbr32Mj3h1iaIVKoYGQLgsYml6z2se2eVqlB11XjUQ7wYNXa6\n4ZZwFI95LLUgjdcSGmTJwWpDenqhP1nYgwprOJisk0A/stHX/9kgxr6JT2GHzpPF\nEfSM7tIpXEM0PQj41R+Lhb3Y\n-----END PRIVATE KEY-----\n',
        client_email: 'firebase-adminsdk-fbsvc@mcn-tinelfi-dorabox.iam.gserviceaccount.com',
        client_id: '115759477874068275879',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mcn-tinelfi-dorabox.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
      };
    }

    // 4. Khởi tạo khi tìm thấy credentials hợp lệ
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

    // FCM HTTP v1 yêu cầu toàn bộ value trong data phải là dạng chuỗi (string) và không được null/undefined
    const stringData: Record<string, string> = {};
    if (params.data) {
      for (const [k, v] of Object.entries(params.data)) {
        if (v !== undefined && v !== null) {
          stringData[k] = typeof v === 'string' ? v : String(v);
        }
      }
    }

    let channel = params.channelId || 'dorabox_general_v4';
    // Tự động nâng cấp channel sang v4 nếu request gửi v3
    if (channel.endsWith('_v3')) {
      channel = channel.replace('_v3', '_v4');
    }

    const isCall = channel.includes('calls') || stringData.type === 'call';
    const isMessage = channel.includes('messages') || stringData.type === 'message' || stringData.conversation_id != null;

    const safeTitle = String(params.title || 'Dorabox');
    const safeBody = String(params.body || '');

    const messagePayload: any = {
      token: params.token,
      data: {
        ...stringData,
        title: safeTitle,
        body: safeBody,
      },
      android: {
        priority: 'high',
      },
    };

    messagePayload.notification = {
      title: safeTitle,
      body: safeBody,
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
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
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
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
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
