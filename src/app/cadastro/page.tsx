import { AuthForm } from "@/components/AuthForm";
import { GuestOnly } from "@/components/GuestOnly";
import { Welcome } from "@/components/Welcome";

export default function SignupPage() {
  return (
    <GuestOnly>
      <Welcome>
        <AuthForm mode="signup" />
      </Welcome>
    </GuestOnly>
  );
}
