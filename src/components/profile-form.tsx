"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Camera, Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { saveProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { profileSchema, roles, type ProfileInput } from "@/lib/profile-schema";
import type { Tables } from "@/types/database";
import { cn } from "@/lib/utils";

type Props = { cities: Tables<"cities">[]; industries: Tables<"industries">[]; userId: string; initial?: ProfileInput; onboarding?: boolean };
const empty = (cityId: string): ProfileInput => ({ first_name: "", last_name: "", avatar_url: "", headline: "", company_name: "", working_on: "", role_category: "Founder", city_id: cityId, open_to_meet: true, linkedin_url: "", industry_ids: [] });

export function ProfileForm({ cities, industries, userId, initial, onboarding = false }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileInput>(initial ?? empty(cities[0]?.id ?? ""));
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState(initial?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const steps = onboarding ? ["Your profile", "Your work", "Preferences"] : ["Edit profile"];
  const update = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => setValues((v) => ({ ...v, [key]: value }));
  const count = values.working_on.length;
  const stepValid = useMemo(() => {
    if (!onboarding) return true;
    if (step === 0) return !!(values.first_name.trim() && values.last_name.trim() && values.headline.trim() && (photo || values.avatar_url));
    if (step === 1) return values.working_on.trim().length >= 10 && values.industry_ids.length > 0;
    return true;
  }, [onboarding, photo, step, values]);

  function selectIndustry(id: string) {
    update("industry_ids", values.industry_ids.includes(id) ? values.industry_ids.filter((item) => item !== id) : values.industry_ids.length < 3 ? [...values.industry_ids, id] : values.industry_ids);
  }
  function choosePhoto(file?: File) {
    setError(undefined);
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Use a JPG, PNG, or WebP image.");
    if (file.size > 5 * 1024 * 1024) return setError("Your photo must be smaller than 5 MB.");
    setPhoto(file); setPreview(URL.createObjectURL(file));
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(undefined);
    let avatarUrl = values.avatar_url;
    if (photo) {
      const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/avatar-${crypto.randomUUID()}.${extension}`;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, photo, { cacheControl: "3600", contentType: photo.type });
      if (uploadError) { setError("We couldn't upload your photo. Please try another image."); setSaving(false); return; }
      avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }
    const payload = { ...values, avatar_url: avatarUrl };
    const checked = profileSchema.safeParse(payload);
    if (!checked.success) { setError(checked.error.issues[0]?.message ?? "Review your details."); setSaving(false); return; }
    const result = await saveProfile(checked.data);
    if (result.error) { setError(result.error); setSaving(false); return; }
    router.push(onboarding ? "/home" : "/profile?saved=1"); router.refresh();
  }

  return <form onSubmit={submit} className="space-y-6">
    {onboarding && <div className="mb-8"><div className="flex items-center justify-between text-xs font-semibold text-ink/45"><span>Step {step + 1} of {steps.length}</span><span>{steps[step]}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-moss transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div>}

    {(!onboarding || step === 0) && <section className="space-y-5">
      <div><Label>Profile photo</Label><div className="flex items-center gap-4"><label className="group relative grid size-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-3xl border-2 border-dashed border-moss/25 bg-mist">{preview ? <Image src={preview} alt="Profile preview" fill className="object-cover" unoptimized /> : <Camera className="size-6 text-moss" />}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => choosePhoto(e.target.files?.[0])} /></label><p className="text-sm leading-6 text-ink/55">Add a clear photo so future coworkers can recognize you. JPG, PNG, or WebP up to 5 MB.</p></div></div>
      <div className="grid grid-cols-2 gap-3"><div><Label htmlFor="first">First name</Label><Input id="first" autoComplete="given-name" value={values.first_name} onChange={(e) => update("first_name", e.target.value)} required /></div><div><Label htmlFor="last">Last name</Label><Input id="last" autoComplete="family-name" value={values.last_name} onChange={(e) => update("last_name", e.target.value)} required /></div></div>
      <div><Label htmlFor="headline">Professional headline</Label><Input id="headline" placeholder="Product designer at Acme" maxLength={120} value={values.headline} onChange={(e) => update("headline", e.target.value)} required /></div>
      <div><Label htmlFor="company">Company <span className="font-normal text-ink/40">(optional)</span></Label><Input id="company" value={values.company_name} onChange={(e) => update("company_name", e.target.value)} /></div>
    </section>}

    {(!onboarding || step === 1) && <section className="space-y-5">
      <div><div className="mb-2 flex justify-between"><Label htmlFor="working" className="mb-0">What are you working on?</Label><span className={cn("text-xs", count > 240 ? "text-red-600" : "text-ink/40")}>{count}/240</span></div><textarea id="working" rows={4} maxLength={240} className="w-full rounded-xl border border-ink/15 bg-white p-4 text-base outline-none focus:border-moss focus:ring-2 focus:ring-moss/10" placeholder="Building a health startup intelligence platform." value={values.working_on} onChange={(e) => update("working_on", e.target.value)} required /><p className="mt-1 text-xs text-ink/45">Aim for a useful, conversational 100–160 characters.</p></div>
      <div><Label>Role</Label><div className="flex flex-wrap gap-2">{roles.map((role) => <button key={role} type="button" onClick={() => update("role_category", role)} className={cn("min-h-10 rounded-full border px-4 text-sm font-medium", values.role_category === role ? "border-moss bg-moss text-white" : "border-ink/15 bg-white")}>{role}</button>)}</div></div>
      <div><div className="flex justify-between"><Label>Industries</Label><span className="text-xs text-ink/45">{values.industry_ids.length}/3</span></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{industries.map((industry) => { const active = values.industry_ids.includes(industry.id); return <button key={industry.id} type="button" onClick={() => selectIndustry(industry.id)} className={cn("flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-medium", active ? "border-moss bg-moss/5 text-moss" : "border-ink/10 bg-white")}><span>{industry.name}</span>{active && <Check className="size-4" />}</button>; })}</div></div>
    </section>}

    {(!onboarding || step === 2) && <section className="space-y-5">
      <div><Label htmlFor="city">City</Label><select id="city" className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4" value={values.city_id} onChange={(e) => update("city_id", e.target.value)}>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></div>
      <fieldset><legend className="mb-3 text-sm font-semibold">Open to meeting people who work from the same places?</legend><div className="grid grid-cols-2 gap-3">{[[true, "Yes"], [false, "Not right now"]] .map(([value, label]) => <button key={label as string} type="button" onClick={() => update("open_to_meet", value as boolean)} className={cn("min-h-12 rounded-xl border text-sm font-semibold", values.open_to_meet === value ? "border-moss bg-moss text-white" : "border-ink/15 bg-white")}>{label as string}</button>)}</div></fieldset>
      <div><Label htmlFor="linkedin">LinkedIn URL <span className="font-normal text-ink/40">(optional)</span></Label><Input id="linkedin" type="url" placeholder="https://linkedin.com/in/your-name" value={values.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} /></div>
    </section>}

    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="flex gap-3 pt-2">{onboarding && step > 0 && <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}><ChevronLeft className="mr-1 size-4" />Back</Button>}{onboarding && step < steps.length - 1 ? <Button type="button" className="ml-auto" disabled={!stepValid} onClick={() => setStep((s) => s + 1)}>Continue<ChevronRight className="ml-1 size-4" /></Button> : <Button className="ml-auto" disabled={saving}>{saving && <LoaderCircle className="mr-2 size-4 animate-spin" />}{onboarding ? "Complete profile" : "Save changes"}</Button>}</div>
  </form>;
}
