import Link from "next/link";
import { CircleUserRound, Home, MapPinned, Network, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/home", icon: Home, active: true },
  { label: "Places", icon: MapPinned },
  { label: "Coworkers", icon: UsersRound },
  { label: "Connections", icon: Network },
  { label: "Profile", href: "/profile", icon: CircleUserRound, active: true },
];
export function AppNav() {
  return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:sticky md:top-5 md:h-fit md:w-56 md:rounded-2xl md:border md:p-2">
    <ul className="mx-auto flex max-w-xl justify-around md:block">{items.map(({ label, href, icon: Icon, active }) => <li key={label}>{active && href ? <Link href={href} className="flex min-h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-semibold text-ink/65 hover:bg-mist hover:text-moss md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm"><Icon className="size-5" />{label}</Link> : <span aria-disabled="true" title="Coming in a later phase" className={cn("flex min-h-12 min-w-14 cursor-not-allowed flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-ink/25 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm")}><Icon className="size-5" />{label}</span>}</li>)}</ul>
  </nav>;
}
