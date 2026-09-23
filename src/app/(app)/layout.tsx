import { Brand } from "@/components/brand";
import { AppNav } from "@/components/app-nav";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-mist"><header className="border-b border-ink/10 bg-white"><div className="mx-auto flex max-w-6xl items-center px-5 py-4"><Brand /></div></header><div className="mx-auto flex max-w-6xl gap-7 px-4 py-5 sm:px-6"><AppNav /><main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main></div></div>;
}
