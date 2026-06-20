"use client";

import { useEffect, useState } from "react";
import { cookie } from "../constants";

const KEY = "bartez-cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* noop */
    }
  }, []);

  const decide = (v: "accept" | "reject") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* noop */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-[560px] rounded-2xl border border-white/10 bg-ink/95 p-4 text-white shadow-2xl backdrop-blur md:left-6 md:right-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-[13px] text-slate-300">{cookie.text}</p>
        <div className="flex flex-none gap-2">
          <button onClick={() => decide("reject")} className="rounded-full border border-white/25 px-4 py-2 text-[13px] font-medium transition-colors hover:border-white/50">
            {cookie.reject}
          </button>
          <button onClick={() => decide("accept")} className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-105">
            {cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
