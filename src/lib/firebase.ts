import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithCredential,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
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
    // Sem o resolvedor de pop-up aqui: os scripts do Google só carregam quando alguém clica em "Entrar com Google".
    const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
    const db = getFirestore(app);
    if (LOCAL) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      // Só nos testes locais: entra como uma conta Google qualquer sem abrir a janela do Google.
      Object.assign(window, {
        entrarComGoogleDeTeste: (email: string, name: string) =>
          signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name }))),
      });
    }
    return { app, auth, db };
  })();
  return ready;
}
