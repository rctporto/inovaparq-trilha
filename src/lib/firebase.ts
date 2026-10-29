import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";

const LOCAL = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(location.hostname);

let ready: Promise<{ app: FirebaseApp; auth: Auth; db: Firestore }> | null = null;

// No Firebase Hosting a configuração do projeto vem de /__/firebase/init.json,
// então o mesmo código serve para qualquer projeto. Localmente usa os emuladores.
export function firebase() {
  ready ??= (async () => {
    const config = LOCAL
      ? { apiKey: "demo", authDomain: "demo-inovaparq.firebaseapp.com", projectId: "demo-inovaparq" }
      : await fetch("/__/firebase/init.json").then((r) => r.json());
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (LOCAL) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    return { app, auth, db };
  })();
  return ready;
}
