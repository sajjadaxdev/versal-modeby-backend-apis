import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const firebaseApp = getApps().length > 0
	? getApps()[0]
	: serviceAccountJson
		? initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
		: null;

const missingFirebaseConfig = () => {
	throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing. Add it to the server environment.");
};

export const messaging = firebaseApp
	? getMessaging(firebaseApp)
	: { send: missingFirebaseConfig, sendEachForMulticast: missingFirebaseConfig };