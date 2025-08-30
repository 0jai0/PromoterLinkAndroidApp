import axios from "axios";
import { notificationApi } from "../features/notifications/notification.api";
const API_BASE = "https://influencerlink-446936445912.asia-south1.run.app/api/notifications"; // change if deployed

export async function storeUserToken(userId, fcmToken) {
  try {
    const res = await notificationApi.storeToken({ userId, token });
    // console.log("✅ Token stored:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error storing token:", err.response?.data || err.message);
    throw err;
  }
}
