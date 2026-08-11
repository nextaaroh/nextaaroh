"use client";
import { useState } from "react";
import Link from "next/link";
import SimpleCaptcha from "./SimpleCaptcha";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginForm() {
  const { t } = useLanguage();
  const [usernameOrMobile, setUsernameOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!captchaOk) {
      setError(t("login.captcha_required"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username_or_mobile: usernameOrMobile, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || t("login.invalid_credentials"));
        setSubmitting(false);
        return;
      }
      if (data.educator_welcome) alert(data.educator_welcome);
      window.location.href = "/dashboard";
    } catch {
      setError(t("login.network_error"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">{t("login.title")}</h1>

      <div>
        <label className="text-sm font-medium block mb-1">{t("login.username_or_mobile")}</label>
        <input
          className="input"
          value={usernameOrMobile}
          onChange={(e) => setUsernameOrMobile(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">{t("login.password")}</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <SimpleCaptcha onVerified={setCaptchaOk} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {submitting ? t("login.submitting") : t("login.submit")}
      </button>

      <div className="text-center text-sm space-y-1">
        <Link href="/forgot-password" className="text-orange-500 block">
          {t("login.forgot_password")}
        </Link>
        <p>
          {t("login.no_account")}{" "}
          <Link href="/signup" className="text-orange-500 font-medium">
            {t("login.signup_link")}
          </Link>
        </p>
      </div>
    </form>
  );
}