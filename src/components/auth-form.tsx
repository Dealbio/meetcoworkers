"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);
  const callback = typeof window === "undefined" ? "" : `${window.location.origin}/auth/callback`;

  async function magicLink(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setStatus(undefined);
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: callback } });
    setStatus(error ? "We couldn't send that link. Please check your email and try again." : "Check your inbox for your secure sign-in link.");
    setLoading(false);
  }
  async function google() {
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback } });
    if (error) { setStatus("Google sign-in is unavailable right now. Please try again."); setLoading(false); }
  }
  return <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
    <Button type="button" variant="secondary" className="w-full" onClick={google} disabled={loading}><span className="mr-3 text-lg font-bold text-blue-600">G</span>Continue with Google</Button>
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ink/40"><span className="h-px flex-1 bg-ink/10" />or email<span className="h-px flex-1 bg-ink/10" /></div>
    <form onSubmit={magicLink}><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} /><Button className="mt-4 w-full" disabled={loading}>{loading ? "Please wait…" : "Email me a magic link"}</Button></form>
    {status && <p role="status" className="mt-4 rounded-xl bg-mist p-3 text-sm text-ink/70">{status}</p>}
    <p className="mt-6 text-center text-xs leading-5 text-ink/45">By continuing, you agree to use Meet Coworkers respectfully and professionally.</p>
  </div>;
}
