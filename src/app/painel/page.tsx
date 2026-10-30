import { redirect } from "next/navigation";
import { landingPath } from "@/lib/session";

export default async function Painel() {
  redirect(await landingPath());
}
