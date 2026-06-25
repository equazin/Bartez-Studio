import { ArrowRight } from "lucide-react";

type Variant = "primary" | "outline" | "ghost-light" | "sunset" | "dark";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-bright hover:shadow-glow hover:-translate-y-0.5",
  outline:
    "border border-slate-300 text-slate-800 hover:border-brand hover:text-brand bg-white",
  "ghost-light":
    "border border-white/30 text-white hover:border-accent hover:text-accent",
  sunset:
    "bg-gradient-to-r from-[#ff7a18] via-sunset to-[#ffb000] text-white font-black shadow-[0_18px_38px_-18px_rgba(255,122,24,0.9)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-16px_rgba(255,122,24,0.95)]",
  dark:
    "bg-ink text-white hover:bg-brand",
};

export function Button({
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight size={18} />}
    </a>
  );
}
