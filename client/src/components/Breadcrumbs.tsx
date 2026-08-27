/** Style reminder — Mall Road Monograph: small, sober internal links that never compete with the page title. */
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Breadcrumbs({ current }: { current: string }) {
  const { language } = useLanguage();
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{language === "hi" ? "होम" : "Home"}</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{current}</span></nav>;
}
