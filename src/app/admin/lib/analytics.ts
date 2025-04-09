import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

interface AnalyticsData {
  timestamp: Timestamp;
  visitorId: string;
  path: string;
  country: string;
  referrer: string;
}

export async function getTotalViews(): Promise<number> {
  const snapshot = await adminDb.collection("analytics").count().get();
  return snapshot.data().count;
}

export async function getUniqueVisitors(days: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

  const snapshot = await adminDb
    .collection("analytics")
    .where("timestamp", ">=", cutoffTimestamp)
    .select("visitorId")
    .get();

  const visitorIds = new Set<string>();
  snapshot.docs.forEach((doc) => visitorIds.add(doc.data().visitorId));
  return visitorIds.size;
}

export async function getPopularPages(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const snapshot = await adminDb
    .collection("analytics")
    .where("timestamp", ">=", cutoffDate)
    .select("path")
    .get();

  const pageCounts: Record<string, number> = {};
  snapshot.docs.forEach((doc) => {
    const path = doc.data().path || "/";
    pageCounts[path] = (pageCounts[path] || 0) + 1;
  });

  return Object.entries(pageCounts)
    .map(([path, count]) => ({
      path: path === "/" ? "Home" : path.replace(/^\//, ""),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getViewsByCountry(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const snapshot = await adminDb
    .collection("analytics")
    .where("timestamp", ">=", cutoffDate)
    .select("country")
    .get();

  const countryCounts: Record<string, number> = {};
  snapshot.docs.forEach((doc) => {
    const country = doc.data().country || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  return Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}
