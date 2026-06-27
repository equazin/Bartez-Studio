"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Save, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

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

  // Alta de usuario
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("member");
  const [creating, setCreating] = useState(false);

  // Reset de contraseña por miembro
  const [pwById, setPwById] = useState<Record<string, string>>({});

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
      const newPw = pwById[member.userId]?.trim();
      const payload: Record<string, unknown> = { role: member.role, permissions: member.permissions };
      if (newPw) {
        if (newPw.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
        payload.password = newPw;
      }
      const res = await fetch(`/api/admin/team/${member.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar");
      setPwById((prev) => ({ ...prev, [member.userId]: "" }));
      setOkMessage(`Cambios guardados para ${member.name}.${newPw ? " Contraseña actualizada." : ""}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingId(null);
    }
  }

  async function createMember() {
    if (!newEmail.trim() || !newName.trim()) { setError("Completá email y nombre."); return; }
    if (newPassword.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setCreating(true);
    setError(null);
    setOkMessage(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, password: newPassword, role: newRole }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos crear el usuario");
      setNewEmail(""); setNewName(""); setNewPassword(""); setNewRole("member");
      setOkMessage(`Usuario ${json.data.email} creado.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCreating(false);
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

      <AdminPanel className="mt-6 p-5">
        <div className="flex items-center gap-2"><UserPlus className="size-[18px] text-brand" /><h2 className="font-display text-[16px] font-bold text-slate-950">Nuevo usuario</h2></div>
        <p className="mt-1.5 text-[12.5px] text-slate-600">Crea un usuario con su propia contraseña. Podrá iniciar sesión con su email.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminField label="Email" htmlFor="nu-email"><AdminInput id="nu-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="persona@empresa.com" /></AdminField>
          <AdminField label="Nombre" htmlFor="nu-name"><AdminInput id="nu-name" value={newName} onChange={(e) => setNewName(e.target.value)} /></AdminField>
          <AdminField label="Contraseña (mín. 8)" htmlFor="nu-pw"><AdminInput id="nu-pw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" /></AdminField>
          <AdminField label="Rol" htmlFor="nu-role">
            <select id="nu-role" value={newRole} onChange={(e) => setNewRole(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
              {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </AdminField>
        </div>
        <div className="mt-4 flex justify-end">
          <AdminButton onClick={() => void createMember()} disabled={creating}><UserPlus />{creating ? "Creando..." : "Crear usuario"}</AdminButton>
        </div>
      </AdminPanel>

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
                  <label className="text-[12px] font-semibold text-slate-600" htmlFor={`role-${member.userId}`}>Rol</label>
                  <select id={`role-${member.userId}`} value={member.role} onChange={(e) => patchMember(member.userId, { role: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                    {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <p className="mt-1 text-[12px] text-slate-600">{ROLE_HINT[member.role]}</p>
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

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="sm:w-72">
                  <label className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600" htmlFor={`pw-${member.userId}`}><KeyRound className="size-3.5" />Resetear contraseña</label>
                  <AdminInput id={`pw-${member.userId}`} type="password" autoComplete="new-password" placeholder="Dejar vacío para no cambiar" value={pwById[member.userId] ?? ""} onChange={(e) => setPwById((prev) => ({ ...prev, [member.userId]: e.target.value }))} />
                </div>
                <AdminButton size="sm" onClick={() => void saveMember(member)} disabled={savingId === member.userId}><Save />{savingId === member.userId ? "Guardando..." : "Guardar"}</AdminButton>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}
