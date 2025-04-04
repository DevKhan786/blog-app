import {
  initializeApp,
  cert,
  getApps,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../config/firebase-service-account.json";

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });

export const adminDb = getFirestore(app);
