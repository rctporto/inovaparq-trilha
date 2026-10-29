import { displayName, type Profile } from "@/lib/types";

export function Avatar({ profile, size = 36 }: { profile: Profile; size?: number }) {
  const name = displayName(profile);
  if (profile.avatar) {
    return <img className="avatar" src={profile.avatar} alt={name} width={size} height={size} style={{ width: size, height: size }} />;
  }
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-label={name}>
      {initials}
    </span>
  );
}
