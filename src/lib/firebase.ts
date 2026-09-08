/* ------------------------------------------------------------------
   Firebase, loaded only when something actually needs it.

   The SDK is around 700 kB. A visitor browsing the catalogue never signs
   in, never submits a form and never opens the admin panel, so making
   them download it to look at gift boxes is a poor trade — it more than
   doubled the bundle when it was imported at the top level.

   So nothing here is imported statically. `getDb()` and `getAuthed()`
   pull the SDK in on first use and memoise it, which puts Firebase on the
   form-submit path and the /admin path and nowhere else. Reading the
   price overrides avoids the SDK altogether; see pricing.ts.

   None of the config values are secrets. A Firebase web config ships in
   every client bundle by design; what protects the data is
   firestore.rules, not hiding these.
   ------------------------------------------------------------------ */
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

export const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** True once a real project id and key are present. */
export const isConfigured = Boolean(cfg.apiKey && cfg.projectId);

export class NotConfigured extends Error {
  constructor() {
    super("Firebase is not configured");
    this.name = "NotConfigured";
  }
}

let appP: Promise<FirebaseApp> | undefined;

async function getApp(): Promise<FirebaseApp> {
  if (!isConfigured) throw new NotConfigured();
  appP ||= import("firebase/app").then(({ initializeApp, getApps, getApp: existing }) =>
    getApps().length ? existing() : initializeApp(cfg as Required<typeof cfg>));
  return appP;
}

let dbP: Promise<Firestore> | undefined;
export async function getDb(): Promise<Firestore> {
  dbP ||= getApp().then(async (a) => (await import("firebase/firestore")).getFirestore(a));
  return dbP;
}

let authP: Promise<Auth> | undefined;
export async function getAuthed(): Promise<Auth> {
  authP ||= getApp().then(async (a) => (await import("firebase/auth")).getAuth(a));
  return authP;
}
