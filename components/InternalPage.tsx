import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

type InternalAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  icon?: LucideIcon;
};

export type InternalAccent = "brand" | "violet" | "teal" | "amber";

type AccentClasses = {
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
  highlight: string;
  metric: string;
  ring: string;
};

const ACCENT_MAP: Record<InternalAccent, AccentClasses> = {
  brand: {
    badgeBorder: "border-blue-100",
    badgeBg: "bg-blue-50",
    badgeText: "text-brand",
    badgeDot: "bg-brand",
    highlight: "text-brand",
    metric: "text-brand",
    ring: "ring-brand/40",
  },
  violet: {
    badgeBorder: "border-violet-100",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeDot: "bg-violet-600",
    highlight: "text-violet-700",
    metric: "text-violet-700",
    ring: "ring-violet-400/40",
  },
  teal: {
    badgeBorder: "border-teal-100",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    badgeDot: "bg-teal-600",
    highlight: "text-teal-700",
    metric: "text-teal-700",
    ring: "ring-teal-400/40",
  },
  amber: {
    badgeBorder: "border-amber-100",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeDot: "bg-amber-500",
    highlight: "text-amber-700",
    metric: "text-amber-700",
    ring: "ring-amber-400/40",
  },
};

function accentClasses(accent: InternalAccent = "brand"): AccentClasses {
  return ACCENT_MAP[accent];
}

export type InternalMetric = {
  value: string;
  label: string;
  detail?: string;
};

export type InternalMediaItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export type InternalHeroProps = {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  intro: string;
  actions?: InternalAction[];
  metrics?: InternalMetric[];
  image?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  mediaLabel?: string;
  mediaTitle?: string;
  mediaSubtitle?: string;
  mediaItems?: InternalMediaItem[];
  children?: ReactNode;
  className?: string;
  accent?: InternalAccent;
};

export type InternalFeature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function InternalPageShell({
  children,
  showBreadcrumbs = true,
}: {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-x-hidden bg-white text-ink">
        {showBreadcrumbs ? <Breadcrumbs /> : null}
        {children}
      </main>
      <Footer />
    </>
  );
}

export function InternalHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  intro,
  actions = [],
  metrics = [],
  image,
  imageAlt = "",
  imagePriority = false,
  mediaLabel,
  mediaTitle,
  mediaSubtitle,
  mediaItems = [],
  children,
  className,
  accent = "brand",
}: InternalHeroProps) {
  const hasMedia = Boolean(children || image || mediaItems.length);
  const a = accentClasses(accent);

  return (
    <section className={cn("border-b border-slate-200 bg-white py-16 md:py-20 lg:py-24", className)}>
      <div className={cn("mx-auto grid max-w-[1200px] gap-12 px-6", hasMedia ? "lg:grid-cols-[0.94fr_1.06fr] lg:items-center" : "")}>
        <div>
          {eyebrow ? (
            <div className={cn("mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold", a.badgeBorder, a.badgeBg, a.badgeText)}>
              {EyebrowIcon ? <EyebrowIcon className="size-3.5" strokeWidth={1.8} /> : <span className={cn("size-1.5 rounded-full", a.badgeDot)} />}
              {eyebrow}
            </div>
          ) : null}

          <h1 className="max-w-[780px] font-display text-[clamp(38px,5.4vw,68px)] font-extrabold leading-[1.02] text-ink text-balance">
            {title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[clamp(15.5px,1.45vw,18px)] leading-relaxed text-slate-600">{intro}</p>

          {actions.length ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <InternalActionLink key={`${action.label}-${action.href}`} action={action} />
              ))}
            </div>
          ) : null}

          {metrics.length ? (
            <div className="mt-12 grid gap-5 border-t border-slate-200 pt-7 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`}>
                  <div className={cn("font-display text-[clamp(28px,4vw,42px)] font-extrabold leading-none", a.metric)}>{metric.value}</div>
                  <div className="mt-1 text-[12.5px] font-semibold text-ink">{metric.label}</div>
                  {metric.detail ? <div className="mt-1 text-[12px] leading-relaxed text-slate-600">{metric.detail}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {hasMedia ? (
          <div className="lg:pl-4">
            {children ?? (
              <InternalHeroMedia
                image={image}
                imageAlt={imageAlt}
                imagePriority={imagePriority}
                label={mediaLabel}
                title={mediaTitle}
                subtitle={mediaSubtitle}
                items={mediaItems}
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InternalActionLink({ action }: { action: InternalAction }) {
  const Icon = action.icon ?? (action.variant === "secondary" ? ArrowRight : MessageCircle);
  const className = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-[14px] font-bold transition",
    action.variant === "secondary"
      ? "border border-blue-200 bg-white text-brand shadow-sm hover:border-brand hover:bg-blue-50"
      : "bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] hover:-translate-y-0.5"
  );

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
        <Icon size={17} strokeWidth={1.9} />
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      <Icon size={17} strokeWidth={1.9} />
      {action.label}
    </Link>
  );
}

export function InternalHeroMedia({
  image,
  imageAlt = "",
  imagePriority = false,
  label,
  title,
  subtitle,
  items = [],
  className,
}: {
  image?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  label?: string;
  title?: string;
  subtitle?: string;
  items?: InternalMediaItem[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_28px_70px_-46px_rgba(17,20,42,0.42)]", className)}>
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={imagePriority}
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
          {label ? (
            <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-bold text-brand shadow-sm">
              {label}
            </div>
          ) : null}
        </div>
      ) : null}

      {(title || subtitle || items.length) ? (
        <div className="p-5 md:p-6">
          {title ? <h2 className="font-display text-[22px] font-extrabold leading-tight text-ink">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{subtitle}</p> : null}
          {items.length ? (
            <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
              {items.map((item) => {
                const Icon = item.icon ?? CheckCircle2;
                return (
                  <div key={item.title} className="min-w-0">
                    <Icon className="size-5 text-brand" strokeWidth={1.8} />
                    <h3 className="mt-3 text-[13.5px] font-bold text-ink">{item.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function InternalSection({
  eyebrow,
  title,
  intro,
  children,
  tone = "white",
  className,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  children: ReactNode;
  tone?: "white" | "soft" | "blue";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "py-16 md:py-20",
        tone === "soft" && "border-y border-slate-200 bg-[#f7f9fc]",
        tone === "blue" && "bg-[#eef4ff]",
        tone === "white" && "bg-white",
        className
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {(eyebrow || title || intro) ? (
          <div className="mb-10 max-w-[680px]">
            {eyebrow ? <p className="text-[13px] font-bold text-brand">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 font-display text-[clamp(28px,3.8vw,44px)] font-extrabold leading-[1.05] text-ink text-balance">{title}</h2> : null}
            {intro ? <p className="mt-4 text-[15.5px] leading-relaxed text-slate-600">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function InternalFeatureGrid({
  features,
  columns = "three",
  className,
}: {
  features: InternalFeature[];
  columns?: "two" | "three" | "four";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === "two" && "md:grid-cols-2",
        columns === "three" && "sm:grid-cols-2 lg:grid-cols-3",
        columns === "four" && "sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {features.map((feature) => {
        const Icon = feature.icon ?? CheckCircle2;
        return (
          <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(17,20,42,0.35)] transition hover:-translate-y-0.5 hover:border-blue-200">
            <span className="grid size-11 place-items-center rounded-lg border border-blue-100 bg-blue-50">
              <Icon className="size-5 text-brand" strokeWidth={1.7} />
            </span>
            <h3 className="mt-5 font-display text-[17px] font-extrabold text-ink">{feature.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{feature.description}</p>
          </article>
        );
      })}
    </div>
  );
}

export function InternalChecklist({
  items,
  columns = "one",
  className,
}: {
  items: string[];
  columns?: "one" | "two";
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-4", columns === "two" && "md:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-[14px] leading-relaxed text-slate-700 shadow-sm">
          <CheckCircle2 className="mt-0.5 size-5 flex-none text-brand" strokeWidth={1.8} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function InternalCta({
  title,
  intro,
  actions,
  tone = "dark",
}: {
  title: ReactNode;
  intro: string;
  actions: InternalAction[];
  tone?: "dark" | "light";
}) {
  return (
    <section className={cn("py-16 md:py-20", tone === "dark" ? "bg-navy text-white" : "border-t border-slate-200 bg-white text-ink")}>
      <div className="mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center">
        <h2 className={cn("font-display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] text-balance", tone === "dark" ? "text-white" : "text-ink")}>{title}</h2>
        <p className={cn("mt-4 max-w-[58ch] text-[15.5px] leading-relaxed", tone === "dark" ? "text-slate-300" : "text-slate-600")}>{intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {actions.map((action) => (
            <InternalActionLink key={`${action.label}-${action.href}`} action={action} />
          ))}
        </div>
      </div>
    </section>
  );
}
