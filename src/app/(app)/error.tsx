"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center"><h2 className="text-xl font-semibold">Something went wrong</h2><p className="mt-2 text-sm text-ink/55">We couldn’t load this page. Please try again.</p><Button className="mt-5" onClick={reset}>Try again</Button></div>;
}
