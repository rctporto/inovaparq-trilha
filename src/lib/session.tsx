"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { firebase } from "./firebase";
import type { Claim, Completion, Profile } from "./types";

type Session = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  completions: Completion[];
  claims: Claim[];
};

const Ctx = createContext<Session>({ loading: true, user: null, profile: null, completions: [], claims: [] });

const toDate = (t: Timestamp | null | undefined) => (t ? t.toDate() : new Date());

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Session>({ loading: true, user: null, profile: null, completions: [], claims: [] });

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    let stopAuth = () => {};
    firebase().then(({ auth, db }) => {
      stopAuth = onAuthStateChanged(auth, async (user) => {
        unsubs.forEach((u) => u());
        unsubs = [];
        // No cadastro, o login acontece antes de o perfil ser gravado: espera a gravação
        // terminar para não ler um perfil que ainda não existe no servidor.
        await signupInFlight;
        if (auth.currentUser?.uid !== user?.uid) return;
        if (!user) {
          setState({ loading: false, user: null, profile: null, completions: [], claims: [] });
          return;
        }
        setState((s) => ({ ...s, loading: true, user }));
        // Os dados chegam ao vivo: concluir uma fase atualiza a trilha na hora.
        const base = doc(db, "users", user.uid);
        unsubs.push(
          onSnapshot(base, (snap) => {
            const d = snap.data();
            setState((s) => ({
              ...s,
              loading: false,
              profile: d ? ({ ...d, uid: user.uid, createdAt: toDate(d.createdAt) } as Profile) : null,
            }));
          }, () => setState((s) => ({ ...s, loading: false }))),
          onSnapshot(collection(base, "completions"), (snap) =>
            setState((s) => ({
              ...s,
              completions: snap.docs
                .map((x) => ({ phaseId: x.id, score: x.data().score, xp: x.data().xp, completedAt: toDate(x.data().completedAt) }))
                .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime()),
            })),
          ),
          onSnapshot(collection(base, "claims"), (snap) =>
            setState((s) => ({
              ...s,
              claims: snap.docs.map((x) => ({ rewardId: x.id, status: x.data().status, claimedAt: toDate(x.data().claimedAt) })),
            })),
          ),
        );
      });
    });
    return () => {
      stopAuth();
      unsubs.forEach((u) => u());
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useSession = () => useContext(Ctx);

// Para páginas internas: manda para o login quem não estiver logado.
export function useRequireSession() {
  const s = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!s.loading && !s.user) router.replace("/");
  }, [s.loading, s.user, router]);
  return s.loading || !s.profile ? null : (s as Session & { user: User; profile: Profile });
}

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/weak-password": "A senha precisa ter pelo menos 8 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
};
export const authMessage = (e: unknown) =>
  AUTH_ERRORS[(e as { code?: string })?.code ?? ""] ?? "Não foi possível concluir. Tente novamente.";

export async function login(email: string, password: string) {
  const { auth } = await firebase();
  await signInWithEmailAndPassword(auth, email, password);
}

let signupInFlight: Promise<unknown> = Promise.resolve();

export function signup(data: { name: string; email: string; password: string; accountType: "pf" | "pj"; companyName: string }) {
  const run = createAccount(data);
  signupInFlight = run.catch(() => {});
  return run;
}

async function createAccount(data: { name: string; email: string; password: string; accountType: "pf" | "pj"; companyName: string }) {
  const { auth, db } = await firebase();
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await setDoc(doc(db, "users", cred.user.uid), {
    name: data.name,
    email: cred.user.email,
    accountType: data.accountType,
    companyName: data.accountType === "pj" ? data.companyName : null,
    bio: null,
    avatar: null,
    createdAt: serverTimestamp(),
  });
}

export async function resetPassword(email: string) {
  const { auth } = await firebase();
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  const { auth } = await firebase();
  await signOut(auth);
}

export async function updateProfile(uid: string, data: Partial<Pick<Profile, "name" | "companyName" | "bio" | "avatar">>) {
  const { db } = await firebase();
  await updateDoc(doc(db, "users", uid), data);
}

export async function completePhase(uid: string, phaseId: string, score: number, xp: number) {
  const { db } = await firebase();
  await setDoc(doc(db, "users", uid, "completions", phaseId), { score, xp, completedAt: serverTimestamp() });
}

export async function claimReward(uid: string, rewardId: string) {
  const { db } = await firebase();
  await setDoc(doc(db, "users", uid, "claims", rewardId), { status: "solicitado", claimedAt: serverTimestamp() });
}

// Reduz a imagem para um quadrado de 256 px em JPEG, para guardar no próprio perfil.
export function resizeImage(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      // Recorta o centro para não distorcer.
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Imagem inválida"));
    img.src = URL.createObjectURL(file);
  });
}
