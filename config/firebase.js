import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./firebase-service-account.json" with { type: "json" };

const firebaseApp = getApps().length > 0 ? getApps()[0]: initializeApp({ credential: cert(serviceAccount), });
export const messaging = getMessaging(firebaseApp);