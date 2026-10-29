import type { User } from "firebase/auth";

// Contas Google que administram a plataforma (aprovam cadastros e bonificações).
// Manter igual à função isAdmin() em firestore.rules.
export const ADMIN_EMAILS = ["renato@norionano.com.br"];

export const isAdminUser = (u: User) => u.emailVerified && ADMIN_EMAILS.includes((u.email ?? "").toLowerCase());
