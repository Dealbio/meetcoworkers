import Link from "next/link";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { Brand } from "@/components/brand";

export default function LandingPage() {
  return <main className="min-h-dvh overflow-hidden bg-mist">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8"><Brand /><Link href="/auth" className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold">Sign in</Link></nav>
    <section className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 sm:px-8 md:grid-cols-[1.2fr_.8fr] md:items-center md:pb-28 md:pt-24">
      <div className="relative z-10">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sand/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-moss"><MapPin className="size-3.5" /> Place-based professional community</p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-7xl">We already work from the same places. <span className="text-moss">We should know each other.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-ink/65">Discover the people working from your favorite places — and find where interesting people are working today.</p>
        <Link href="/auth" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-moss px-6 font-semibold text-white shadow-soft transition hover:bg-ink">Join Meet Coworkers <ArrowUpRight className="size-4" /></Link>
      </div>
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-16 rounded-full bg-sand/70 blur-3xl" />
        <div className="relative rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
          <div className="mb-10 flex items-center justify-between"><span className="text-sm font-semibold">Around your places</span><span className="size-2.5 rounded-full bg-emerald-500" /></div>
          <div className="space-y-3">
            {[["N", "A shared place", "Your next conversation"], ["O", "A familiar corner", "A new collaborator"], ["K", "Your workday", "A stronger community"]].map(([initial, title, copy]) => <div key={title} className="flex items-center gap-3 rounded-2xl bg-mist p-3"><span className="grid size-11 place-items-center rounded-xl bg-sand font-bold text-moss">{initial}</span><span className="flex-1"><span className="block text-sm font-semibold">{title}</span><span className="text-xs text-ink/50">{copy}</span></span><Users className="size-4 text-moss" /></div>)}
          </div>
        </div>
      </div>
    </section>
  </main>;
}
