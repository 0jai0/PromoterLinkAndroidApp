// config/auth.js
import { makeRedirectUri } from "expo-auth-session";

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  // Client IDs
  ANDROID_CLIENT_ID: "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
  EXPO_CLIENT_ID: "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
  IOS_CLIENT_ID: "YOUR_IOS_CLIENT_ID", // Add when needed
  WEB_CLIENT_ID: "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",

  // App Scheme and Redirect
  SCHEME: "PromoterLink",
  REDIRECT_PATH: "oauthredirect",

  // Scopes (if needed)
  SCOPES: ["openid", "profile", "email"],
};

// Generate redirect URI
export const getGoogleRedirectUri = () => {
  return makeRedirectUri({
    scheme: GOOGLE_OAUTH_CONFIG.SCHEME,
    path: GOOGLE_OAUTH_CONFIG.REDIRECT_PATH,
  });
};

// Google Auth Request Configuration
export const getGoogleAuthRequestConfig = () => {
  return {
    androidClientId: GOOGLE_OAUTH_CONFIG.ANDROID_CLIENT_ID,
    expoClientId: GOOGLE_OAUTH_CONFIG.EXPO_CLIENT_ID,
    iosClientId: GOOGLE_OAUTH_CONFIG.IOS_CLIENT_ID,
    webClientId: GOOGLE_OAUTH_CONFIG.WEB_CLIENT_ID,
    redirectUri: getGoogleRedirectUri(),
    scopes: GOOGLE_OAUTH_CONFIG.SCOPES,
  };
};

// Export for easy import
export default {
  GOOGLE_OAUTH_CONFIG,
  getGoogleRedirectUri,
  getGoogleAuthRequestConfig,
};