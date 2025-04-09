import {
  initializeApp,
  cert,
  getApps,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

let serviceAccount;
try {
  const filePath = path.join(process.cwd(), "firebase-service-account.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    console.error("Firebase service account not found:", error);
    throw new Error("Firebase service account not found");
  }
}

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });

export const adminDb = getFirestore(app);
