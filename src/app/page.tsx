import { AuthForm } from "@/components/AuthForm";
import { GuestOnly } from "@/components/GuestOnly";
import { Welcome } from "@/components/Welcome";

export default function Home() {
  return (
    <GuestOnly>
      <Welcome>
        <AuthForm mode="login" />
      </Welcome>
    </GuestOnly>
  );
}
