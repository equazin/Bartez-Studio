"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, ShieldCheck, UsersRound } from "lucide-react";
import { AdminAlert, AdminButton, AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

interface Member {
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Grantable {
  key: string;
  label: string;
}

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner (todo)" },
  { value: "admin", label: "Admin (operación completa)" },
  { value: "member", label: "Member (operativo)" },
  { value: "viewer", label: "Viewer (solo lectura)" },
];

const ROLE_HINT: Record<string, string> = {
  owner: "Acceso total, incluida la gestión del equipo.",
  admin: "Todos los módulos salvo administración de la organización.",
  member: "Carga operativa (CRM, ventas, compras, stock), sin borrar ni configurar.",
  viewer: "Solo lectura.",
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [grantable, setGrantable] = useState<Grantable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [okMessage, setOkMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar el equipo");
      setMembers(json.data.members);
      setGrantable(json.data.grantable);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function patchMember(userId: string, patch: Partial<Member>) {
    setMembers((list) => list.map((m) => (m.userId === userId ? { ...m, ...patch } : m)));
  }

  function togglePermission(userId: string, key: string) {
    setMembers((list) => list.map((m) => {
      if (m.userId !== userId) return m;
      const has = m.permissions.includes(key);
      return { ...m, permissions: has ? m.permissions.filter((p) => p !== key) : [...m.permissions, key] };
    }));
  }

  async function saveMember(member: Member) {
    setSavingId(member.userId);
    setError(null);
    setOkMessage(null);
    try {
      const res = await fetch(`/api/admin/team/${member.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: member.role, permissions: member.permissions }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar");
      setOkMessage(`Cambios guardados para ${member.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Equipo</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Roles y permisos puntuales por usuario. Solo el owner puede editar.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}
      {okMessage && <div className="mt-5"><AdminAlert tone="success">{okMessage}</AdminAlert></div>}

      {loading ? (
        <div className="flex items-center justify-center py-24"><AdminSpinner /></div>
      ) : members.length === 0 ? (
        <AdminPanel className="mt-6 p-10 text-center"><UsersRound className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-[14px] font-bold text-slate-950">No hay miembros en la organización.</p></AdminPanel>
      ) : (
        <div className="mt-6 grid gap-5">
          {members.map((member) => (
            <AdminPanel key={member.userId} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[15px] font-bold text-slate-950">{member.name}</p>
                  <p className="text-[12.5px] text-slate-600">{member.email}</p>
                </div>
                <div className="sm:w-72">
                  <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500" htmlFor={`role-${member.userId}`}>Rol</label>
                  <select id={`role-${member.userId}`} value={member.role} onChange={(e) => patchMember(member.userId, { role: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                    {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <p className="mt-1 text-[11.5px] text-slate-500">{ROLE_HINT[member.role]}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-brand" /><p className="text-[12.5px] font-bold text-slate-800">Permisos extra (sobre el rol)</p></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {grantable.map((perm) => {
                    const checked = member.permissions.includes(perm.key);
                    return (
                      <label key={perm.key} className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                        <input type="checkbox" checked={checked} onChange={() => togglePermission(member.userId, perm.key)} className="size-4 rounded border-slate-300 text-brand focus:ring-brand/30" />
                        {perm.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <AdminButton size="sm" onClick={() => void saveMember(member)} disabled={savingId === member.userId}><Save />{savingId === member.userId ? "Guardando..." : "Guardar"}</AdminButton>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}
