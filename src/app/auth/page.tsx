import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";

export default function AuthPage() {
  return <main className="grid min-h-dvh place-items-center px-5 py-10"><div className="w-full max-w-md"><div className="mb-8 text-center"><Brand /><h1 className="mt-8 text-3xl font-semibold tracking-tight">Meet your workday community</h1><p className="mt-2 text-ink/60">Sign in or create your account to get started.</p></div><AuthForm /></div></main>;
}
