import Image from "next/image";
import { getDynamicClients } from "@/lib/db-content";

export async function ClientLogos() {
  const clients = await getDynamicClients();
  if (clients.length === 0) return null;

  return (
    <section className="border-y border-white/5 bg-[#030c07] py-14" aria-label="Clientes destacados">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="font-display text-[24px] font-bold text-white">Clientes que eligen Bartez</h2>
        <div className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-6">
          {clients.map((client) => <Image key={client.name} src={client.logo} alt={client.name} width={120} height={42} className="h-8 w-auto brightness-0 invert opacity-65" />)}
        </div>
      </div>
    </section>
  );
}
