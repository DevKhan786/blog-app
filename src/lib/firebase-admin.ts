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

if (process.env.CI === "true" && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error(
      "Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:",
      error
    );
    throw new Error("Invalid Firebase service account in environment variable");
  }
} else {
  try {
    const filePath = path.join(process.cwd(), "firebase-service-account.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    serviceAccount = JSON.parse(fileContent);
  } catch (error) {
    console.error("Firebase service account file not found:", error);

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (parseError) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", parseError);
        throw new Error("Firebase service account not available");
      }
    } else {
      throw new Error("Firebase service account not found");
    }
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
