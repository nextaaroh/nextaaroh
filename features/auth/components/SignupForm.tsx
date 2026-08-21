"use client";
import { useState } from "react";
import Link from "next/link";
import { signupSchema, MINOR_SEGMENTS } from "../validators/signupSchema";
import SimpleCaptcha from "./SimpleCaptcha";
import { usePincodeLookup } from "./usePincodeLookup";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LanguageCode } from "@/lib/i18n/translations";

const CLASS_OPTIONS = [
  { value: "class_5_8", label: "Class 5–8" },
  { value: "class_9_10", label: "Class 9–10" },
  { value: "class_11_12", label: "Class 11–12" },
  { value: "iti_diploma_polytechnic", label: "ITI / Diploma / Polytechnic" },
  { value: "graduation_pg", label: "Graduation / PG" },
  { value: "upsc_ssc_railway_banking_defence", label: "UPSC/SSC/Railway/Banking/Defence" },
  { value: "neet_jee_cuet", label: "NEET/JEE/CUET" },
  { value: "other", label: "Not a student / Other" },
];

const LANGUAGE_OPTIONS: { value: LanguageCode; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "hinglish", label: "Hinglish" },
];

export default function SignupForm() {
  const { language, setLanguage, t } = useLanguage();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    mobile_number: "",
    pin_code: "",
    state: "",
    district: "",
    class_segment: "",
    segment_other_text: "",
    language_code: language,
    dream: "",
    referral_code: "",
    guardian_mobile_number: "",
  });
  const [captchaOk, setCaptchaOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [locationLocked, setLocationLocked] = useState(false);
  const { lookup, loading: pinLoading, notFound } = usePincodeLookup();

  const isMinor = MINOR_SEGMENTS.includes(form.class_segment);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleLanguageChange(lang: LanguageCode) {
    setLanguage(lang);
    update("language_code", lang);
  }

  async function handlePinChange(value: string) {
    update("pin_code", value);
    setLocationLocked(false);
    if (value.length === 6) {
      const result = await lookup(value);
      if (result) {
        setForm((f) => ({ ...f, state: result.state, district: result.district }));
        setLocationLocked(true);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!captchaOk) {
      setServerError(t("signup.captcha_required"));
      return;
    }

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (isMinor && !form.guardian_mobile_number) {
      setServerError(t("signup.guardian_required"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, creator_ref: typeof window !== "undefined" ? localStorage.getItem("creator_ref") : null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error?.message || t("signup.generic_error"));
        setSubmitting(false);
        return;
      }
      if (data.educator_welcome) alert(data.educator_welcome);
      window.location.href = "/me";
    } catch {
      setServerError(t("signup.network_error"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">{t("signup.title")}</h1>

      <Field label={t("signup.language")}>
        <select className="input" value={form.language_code} onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}>
          {LANGUAGE_OPTIONS.map((l) => {
            return <option key={l.value} value={l.value}>{l.label}</option>;
          })}
        </select>
      </Field>

      <Field label={t("signup.full_name")} error={errors.full_name}>
        <input className="input" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
      </Field>

      <Field label={t("signup.username")} error={errors.username}>
        <input className="input" value={form.username} onChange={(e) => update("username", e.target.value)} />
      </Field>

      <Field label={t("signup.password")} error={errors.password}>
        <input type="password" className="input" value={form.password} onChange={(e) => update("password", e.target.value)} />
      </Field>

      <Field label={t("signup.mobile_number")} error={errors.mobile_number}>
        <input className="input" value={form.mobile_number} onChange={(e) => update("mobile_number", e.target.value)} />
      </Field>

      <Field label={t("signup.pin_code")} error={errors.pin_code}>
        <input className="input" value={form.pin_code} maxLength={6} onChange={(e) => handlePinChange(e.target.value)} />
        {pinLoading ? <p className="text-xs text-gray-500 mt-1">{t("signup.pin_searching")}</p> : null}
        {notFound ? <p className="text-xs text-red-600 mt-1">{t("signup.pin_not_found")}</p> : null}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("signup.state")} error={errors.state}>
          <input className="input" value={form.state} readOnly={locationLocked} onChange={(e) => update("state", e.target.value)} />
        </Field>
        <Field label={t("signup.district")} error={errors.district}>
          <input className="input" value={form.district} readOnly={locationLocked} onChange={(e) => update("district", e.target.value)} />
        </Field>
      </div>

      <Field label={t("signup.class_segment")} error={errors.class_segment}>
        <select className="input border-2 border-orange-300 bg-orange-50 font-medium" value={form.class_segment} onChange={(e) => update("class_segment", e.target.value)}>
          <option value="">{t("signup.choose")}</option>
          {CLASS_OPTIONS.map((c) => {
            return <option key={c.value} value={c.value}>{c.label}</option>;
          })}
        </select>
      </Field>

      {form.class_segment === "other" ? (
        <Field label="Not a student — बताइए आप क्या करते हैं">
          <input className="input" placeholder="जैसे: Working professional, Parent, Teacher..." value={form.segment_other_text} onChange={(e) => update("segment_other_text", e.target.value)} />
        </Field>
      ) : null}

      {isMinor ? (
        <Field label={t("signup.guardian_mobile")} error={errors.guardian_mobile_number}>
          <input className="input" value={form.guardian_mobile_number} onChange={(e) => update("guardian_mobile_number", e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">{t("signup.guardian_note")}</p>
        </Field>
      ) : null}

      <Field label={t("signup.dream")}>
        <input className="input" value={form.dream} onChange={(e) => update("dream", e.target.value)} />
      </Field>

      <Field label={t("signup.referral_code")}>
        <input className="input" value={form.referral_code} onChange={(e) => update("referral_code", e.target.value)} />
      </Field>

      <SimpleCaptcha onVerified={setCaptchaOk} />

      {serverError ? <p className="text-red-600 text-sm">{serverError}</p> : null}

      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? t("signup.submitting") : t("signup.submit")}
      </button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-orange-500 font-medium">
          Login
        </Link>
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      {children}
      {error ? <p className="text-red-600 text-xs mt-1">{error}</p> : null}
    </div>
  );
}
