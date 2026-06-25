import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-7xl font-bold text-[#1236d8]">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#11142a]">
          Pagina no encontrada
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          La pagina que buscas no existe o fue movida.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1236d8] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#0f2fb8]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
