export type Profile = {
  uid: string;
  name: string;
  email: string;
  accountType: "pf" | "pj";
  companyName: string | null;
  bio: string | null;
  // Foto ou logo já reduzida no navegador (JPEG em data URL, ~256 px).
  avatar: string | null;
  createdAt: Date;
};

export type Completion = { phaseId: string; score: number; xp: number; completedAt: Date };
export type Claim = { rewardId: string; status: string; claimedAt: Date };

// Nome exibido: a empresa, quando for conta PJ; senão, a pessoa.
export const displayName = (p: Profile) => (p.accountType === "pj" && p.companyName ? p.companyName : p.name);
