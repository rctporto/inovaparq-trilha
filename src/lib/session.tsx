"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
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
import { isAdminUser } from "./admin";
import type { Claim, Completion, Profile } from "./types";

type Session = {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  profile: Profile | null;
  completions: Completion[];
  claims: Claim[];
};

const EMPTY: Session = { loading: false, user: null, isAdmin: false, profile: null, completions: [], claims: [] };
const Ctx = createContext<Session>({ ...EMPTY, loading: true });

const toDate = (t: Timestamp | null | undefined) => (t ? t.toDate() : new Date());

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Session>({ ...EMPTY, loading: true });

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
          setState(EMPTY);
          return;
        }
        // O administrador não participa da trilha: vai direto para o painel.
        if (isAdminUser(user)) {
          setState({ ...EMPTY, user, isAdmin: true });
          return;
        }
        setState({ ...EMPTY, loading: true, user });
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

// Para onde cada pessoa deve ir, conforme a situação do cadastro.
export function homeFor(s: Session) {
  if (!s.user) return "/";
  if (s.isAdmin) return "/admin/";
  if (!s.profile) return "/completar-cadastro/";
  if (s.profile.status !== "aprovado") return "/aguardando/";
  return "/trilha/";
}

// Mantém a pessoa só nas páginas que valem para a situação dela.
// Devolve a sessão quando ela pode ficar; enquanto carrega ou redireciona, devolve null.
export function useGate(allowed: string) {
  const s = useSession();
  const router = useRouter();
  const target = s.loading ? null : homeFor(s);
  useEffect(() => {
    if (target && target !== allowed) router.replace(target);
  }, [target, allowed, router]);
  return target === allowed ? s : null;
}

// Páginas da trilha: só para cadastros aprovados.
export function useRequireSession() {
  return useGate("/trilha/") as (Session & { user: User; profile: Profile }) | null;
}

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/weak-password": "A senha precisa ter pelo menos 8 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  "auth/popup-closed-by-user": "A janela do Google foi fechada antes de concluir.",
  "auth/popup-blocked": "O navegador bloqueou a janela do Google. Permita pop-ups para este site.",
  "auth/operation-not-allowed": "Esse tipo de login ainda não foi ativado no Firebase.",
  "auth/account-exists-with-different-credential": "Esse e-mail já tem conta com senha. Entre com e-mail e senha.",
};
export const authMessage = (e: unknown) =>
  AUTH_ERRORS[(e as { code?: string })?.code ?? ""] ?? "Não foi possível concluir. Tente novamente.";

export async function login(email: string, password: string) {
  const { auth } = await firebase();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const { auth } = await firebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
}

type ProfileInput = { name: string; accountType: "pf" | "pj"; companyName: string };

// Todo cadastro novo começa aguardando a aprovação do Inovaparq.
function newProfile(email: string | null, data: ProfileInput) {
  return {
    name: data.name,
    email,
    accountType: data.accountType,
    companyName: data.accountType === "pj" ? data.companyName : null,
    bio: null,
    avatar: null,
    status: "pendente",
    createdAt: serverTimestamp(),
  };
}

// Quem entrou com Google completa o cadastro depois do login.
export async function completeProfile(data: ProfileInput) {
  const { auth, db } = await firebase();
  const user = auth.currentUser!;
  await setDoc(doc(db, "users", user.uid), newProfile(user.email, data));
}

let signupInFlight: Promise<unknown> = Promise.resolve();

export function signup(data: ProfileInput & { email: string; password: string }) {
  const run = createAccount(data);
  signupInFlight = run.catch(() => {});
  return run;
}

async function createAccount(data: ProfileInput & { email: string; password: string }) {
  const { auth, db } = await firebase();
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await setDoc(doc(db, "users", cred.user.uid), newProfile(cred.user.email, data));
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
