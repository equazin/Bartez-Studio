import { footer, company, contact } from "../constants";
import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#061a10] py-16 text-white/55">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-gradient-to-br from-verde-acento to-verde font-serif text-verde-deep">B</span>
              <span className="text-[18px] font-bold">Bartez<span className="font-medium text-bronce">·Tecnología</span></span>
            </div>
            <p className="mt-4 max-w-[30ch] text-[14px]">{footer.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a href={contact.social.linkedin} aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition-colors hover:border-verde-acento hover:text-verde-acento">
                <Linkedin size={16} />
              </a>
              <a href={contact.social.instagram} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition-colors hover:border-verde-acento hover:text-verde-acento">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-bronce">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] transition-colors hover:text-white">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-[12.5px]">
          <p>{footer.legalLine}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span>{footer.copyright}</span>
            <span className="text-bronce">{footer.signature} 🌿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
