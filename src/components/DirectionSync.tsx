"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function DirectionSync() {
  const locale = useLocale();

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
