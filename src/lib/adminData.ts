"use client";

import { useEffect, useState } from "react";
import { collection, collectionGroup, doc, onSnapshot, serverTimestamp, updateDoc, type Timestamp } from "firebase/firestore";
import { firebase } from "./firebase";
import type { Claim, Completion, Profile } from "./types";

export type Participant = Profile & { completions: Completion[]; claims: Claim[] };

const toDate = (t: Timestamp | null | undefined) => (t ? t.toDate() : new Date());

// Todos os cadastros, com progresso e pedidos de bonificação, ao vivo. Só o administrador consegue ler.
export function useParticipants() {
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [completions, setCompletions] = useState<(Completion & { uid: string })[]>([]);
  const [claims, setClaims] = useState<(Claim & { uid: string })[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    const fail = () => setError("Não foi possível carregar os dados. Confira se você entrou com a conta de administrador.");
    firebase().then(({ db }) => {
      unsubs = [
        onSnapshot(collection(db, "users"), (snap) =>
          setUsers(snap.docs.map((d) => ({
            ...(d.data() as Profile),
            uid: d.id,
            // Contas criadas antes da aprovação existir aparecem como pendentes.
            status: d.data().status ?? "pendente",
            createdAt: toDate(d.data().createdAt),
          }))), fail),
        onSnapshot(collectionGroup(db, "completions"), (snap) =>
          setCompletions(snap.docs.map((d) => ({
            uid: d.ref.parent.parent!.id,
            phaseId: d.id,
            score: d.data().score,
            xp: d.data().xp,
            completedAt: toDate(d.data().completedAt),
          }))), fail),
        onSnapshot(collectionGroup(db, "claims"), (snap) =>
          setClaims(snap.docs.map((d) => ({
            uid: d.ref.parent.parent!.id,
            rewardId: d.id,
            status: d.data().status,
            claimedAt: toDate(d.data().claimedAt),
          }))), fail),
      ];
    });
    return () => unsubs.forEach((u) => u());
  }, []);

  const participants: Participant[] | null = users
    ? users
        .map((u) => ({
          ...u,
          completions: completions.filter((c) => c.uid === u.uid),
          claims: claims.filter((c) => c.uid === u.uid),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : null;

  return { participants, error };
}

export async function setUserStatus(uid: string, status: "aprovado" | "recusado" | "pendente") {
  const { db } = await firebase();
  await updateDoc(doc(db, "users", uid), { status, reviewedAt: serverTimestamp() });
}

export const CLAIM_STATUSES = ["solicitado", "agendado", "concluído"] as const;

export async function setClaimStatus(uid: string, rewardId: string, status: (typeof CLAIM_STATUSES)[number]) {
  const { db } = await firebase();
  await updateDoc(doc(db, "users", uid, "claims", rewardId), { status });
}
