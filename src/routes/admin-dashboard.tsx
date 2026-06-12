import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, LogOut, RefreshCw, Trash2, Check, ExternalLink, Plus, Pencil } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminListAll,
  adminUpdateStatus,
  adminDeleteRow,
} from "@/lib/api/admin.functions";
import {
  adminListMenu,
  adminUpsertMenuItem,
  adminDeleteMenuItem,
  type MenuRow,
} from "@/lib/api/menu.functions";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard – Calabar Buka" }] }),
  component: AdminDashboardPage,
});

type Tab = "orders" | "reservations" | "venue" | "catering" | "reviews" | "menu";

function AdminDashboardPage() {
  const router = useRouter();
  const meFn = useServerFn(adminMe);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    meFn().then((r) => setAuthed(!!r.session)).catch(() => setAuthed(false));
  }, [meFn]);

  if (authed === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      {authed ? (
        <Dashboard onSignOut={() => { setAuthed(false); router.invalidate(); }} />
      ) : (
        <LoginCard onSuccess={() => setAuthed(true)} />
      )}
      <Footer />
    </div>
  );
}

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const loginFn = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await loginFn({ data: { username, password } });
      onSuccess();
    } catch {
      setErr("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 grid place-items-center px-5 py-12">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card border border-border/60 p-7 shadow-elegant">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Lock className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium">Restricted</span>
        </div>
        <h1 className="font-display text-3xl">Admin Sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Authorized personnel only.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Username</span>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full h-12 rounded-full bg-gradient-gold text-gold-foreground font-semibold disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </section>
  );
}

type DataPayload = Awaited<ReturnType<typeof adminListAll>>;

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const listFn = useServerFn(adminListAll);
  const logoutFn = useServerFn(adminLogout);
  const updateFn = useServerFn(adminUpdateStatus);
  const deleteFn = useServerFn(adminDeleteRow);

  const [data, setData] = useState<DataPayload | null>(null);
  const [tab, setTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setData(await listFn()); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const handleStatus = async (table: string, id: string, status: string) => {
    await updateFn({ data: { table: table as never, id, status } });
    refresh();
  };
  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Delete this record?")) return;
    await deleteFn({ data: { table: table as never, id } });
    refresh();
  };
  const signOut = async () => { await logoutFn(); onSignOut(); };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "orders", label: "Food Orders", count: data?.food_orders.length ?? 0 },
    { key: "reservations", label: "Table Reservations", count: data?.table_reservations.length ?? 0 },
    { key: "venue", label: "Venue Requests", count: data?.venue_requests.length ?? 0 },
    { key: "catering", label: "Catering", count: data?.catering_requests.length ?? 0 },
    { key: "reviews", label: "Reviews", count: data?.reviews.length ?? 0 },
    { key: "menu", label: "Menu", count: 0 },
  ];

  return (
    <section className="container mx-auto px-5 lg:px-8 py-10 flex-1">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Admin</p>
          <h1 className="mt-2 font-display text-4xl">Control Center</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border hover:bg-muted text-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={signOut} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background text-sm">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 h-11 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === t.key ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} <span className="ml-1 text-xs text-muted-foreground">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {!data && <p className="text-muted-foreground">Loading data…</p>}
        {data && tab === "orders" && data.food_orders.map((o: any) => (
          <Card key={o.id} title={o.customer_name} subtitle={`${o.phone} · ${o.address}`} status={o.status} createdAt={o.created_at}>
            <p className="text-sm"><span className="text-muted-foreground">Items:</span> {(o.items ?? []).map((i: any) => `${i.name} x${i.qty}`).join(", ")}</p>
            <p className="text-sm"><span className="text-muted-foreground">Total:</span> ₦{Number(o.total).toLocaleString()}</p>
            {o.delivery_at && <p className="text-sm"><span className="text-muted-foreground">Deliver:</span> {new Date(o.delivery_at).toLocaleString()}</p>}
            {o.notes && <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {o.notes}</p>}
            {o.signed_image_urls?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {o.signed_image_urls.map((u: string, i: number) => (
                  <a key={i} href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-gold hover:underline">
                    <ExternalLink className="h-3 w-3" /> Image {i + 1}
                  </a>
                ))}
              </div>
            )}
            <StatusBar table="food_orders" id={o.id} status={o.status} options={["new", "preparing", "out_for_delivery", "completed"]} onStatus={handleStatus} onDelete={handleDelete} />
          </Card>
        ))}
        {data && tab === "reservations" && data.table_reservations.map((r: any) => (
          <Card key={r.id} title={r.customer_name} subtitle={`${r.phone} · ${r.guests} guests`} status={r.status} createdAt={r.created_at}>
            <p className="text-sm"><span className="text-muted-foreground">When:</span> {r.reservation_date} at {r.reservation_time}</p>
            {r.email && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {r.email}</p>}
            {r.notes && <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {r.notes}</p>}
            <StatusBar table="table_reservations" id={r.id} status={r.status} options={["confirmed", "seated", "completed", "cancelled"]} onStatus={handleStatus} onDelete={handleDelete} />
          </Card>
        ))}
        {data && tab === "venue" && data.venue_requests.map((v: any) => (
          <Card key={v.id} title={`${v.event_type} · ${v.customer_name}`} subtitle={`${v.phone} · ${v.guests} guests`} status={v.status} createdAt={v.created_at}>
            <p className="text-sm"><span className="text-muted-foreground">When:</span> {v.event_date}{v.event_time ? ` at ${v.event_time}` : ""}</p>
            {v.notes && <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {v.notes}</p>}
            <StatusBar table="venue_requests" id={v.id} status={v.status} options={["pending", "approved", "declined", "completed"]} onStatus={handleStatus} onDelete={handleDelete} />
          </Card>
        ))}
        {data && tab === "catering" && data.catering_requests.map((c: any) => (
          <Card key={c.id} title={c.customer_name} subtitle={`${c.phone} · ${c.guests} guests · ${c.event_date}`} status={c.status} createdAt={c.created_at}>
            <p className="text-sm"><span className="text-muted-foreground">Venue:</span> {c.venue_address}</p>
            <p className="text-sm"><span className="text-muted-foreground">Menu:</span> {c.menu_choices}</p>
            {Array.isArray(c.extras) && c.extras.length > 0 && (
              <p className="text-sm"><span className="text-muted-foreground">Extras:</span> {c.extras.join(", ")}</p>
            )}
            {c.notes && <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {c.notes}</p>}
            <StatusBar table="catering_requests" id={c.id} status={c.status} options={["new", "contacted", "confirmed", "completed", "declined"]} onStatus={handleStatus} onDelete={handleDelete} />
          </Card>
        ))}
        {data && tab === "reviews" && data.reviews.map((r: any) => (
          <Card key={r.id} title={`${r.name} · ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}`} subtitle={new Date(r.created_at).toLocaleString()} status={r.approved ? "visible" : "hidden"} createdAt={r.created_at}>
            <p className="text-sm">{r.body}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleDelete("reviews", r.id)} className="inline-flex items-center gap-1 h-8 px-3 text-xs rounded-full text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </Card>
        ))}
        {tab === "menu" && <MenuManager />}
        {data && tab !== "menu" && (
          (tab === "orders" && data.food_orders.length === 0) ||
          (tab === "reservations" && data.table_reservations.length === 0) ||
          (tab === "venue" && data.venue_requests.length === 0) ||
          (tab === "catering" && data.catering_requests.length === 0) ||
          (tab === "reviews" && data.reviews.length === 0)
        ) && <p className="text-center py-12 text-muted-foreground">Nothing here yet.</p>}
      </div>
    </section>
  );
}

function Card({ title, subtitle, status, createdAt, children }: { title: string; subtitle?: string; status: string; createdAt: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-5">
      <div className="flex justify-between flex-wrap gap-2 items-start">
        <div>
          <p className="font-display text-lg">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-muted">{status}</span>
          <p className="text-[10px] text-muted-foreground mt-1">{new Date(createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

function StatusBar({ table, id, status, options, onStatus, onDelete }: {
  table: string; id: string; status: string; options: string[];
  onStatus: (t: string, id: string, s: string) => void;
  onDelete: (t: string, id: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 items-center">
      {options.map((s) => (
        <button
          key={s}
          onClick={() => onStatus(table, id, s)}
          className={`h-8 px-3 text-xs rounded-full inline-flex items-center gap-1 ${status === s ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
        >
          {status === s && <Check className="h-3 w-3" />} {s.replace(/_/g, " ")}
        </button>
      ))}
      <button onClick={() => onDelete(table, id)} className="ml-auto h-8 px-3 text-xs rounded-full text-destructive hover:bg-destructive/10 inline-flex items-center gap-1">
        <Trash2 className="h-3 w-3" /> Delete
      </button>
    </div>
  );
}

function emptyDraft(): MenuRow {
  return { id: "" as any, name: "", description: "", price: 0, category: CATEGORIES[0], image_url: "", sort_order: 0, available: true };
}

function MenuManager() {
  const listFn = useServerFn(adminListMenu);
  const upsertFn = useServerFn(adminUpsertMenuItem);
  const deleteFn = useServerFn(adminDeleteMenuItem);
  const [rows, setRows] = useState<MenuRow[] | null>(null);
  const [draft, setDraft] = useState<MenuRow | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => setRows(await listFn());
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload: any = { ...draft!, price: Number(draft.price), sort_order: Number(draft.sort_order) };
      if (!payload.id) delete payload.id;
      await upsertFn({ data: payload });
      setDraft(null);
      await refresh();
    } catch (e: any) {
      alert(e?.message ?? "Failed to save");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await deleteFn({ data: { id } });
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{rows?.length ?? 0} items · changes appear on the public menu immediately.</p>
        <button onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-gradient-gold text-gold-foreground text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>

      {rows === null && <p className="text-muted-foreground">Loading menu…</p>}
      {rows?.map((m) => (
        <div key={m.id} className="rounded-2xl bg-card border border-border/60 p-4 flex gap-4 items-start">
          {m.image_url ? (
            <img src={m.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted grid place-items-center text-xs text-muted-foreground">No img</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display text-lg">{m.name}</p>
              {!m.available && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted">hidden</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{m.category} · ₦{Number(m.price).toLocaleString()} · order {m.sort_order}</p>
            {m.description && <p className="text-sm mt-1 line-clamp-2">{m.description}</p>}
          </div>
          <div className="flex gap-1">
            <button onClick={() => setDraft({ ...m })} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted" title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => remove(m.id)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 text-destructive" title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      {rows && rows.length === 0 && <p className="text-center py-12 text-muted-foreground">No menu items yet — add one to get started.</p>}

      {draft && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50" onClick={() => !saving && setDraft(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-elegant max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl">{draft!.id ? "Edit item" : "New item"}</h3>
            <div className="mt-4 space-y-3">
              <Field label="Name"><input value={draft!.name} onChange={(e) => setDraft({ ...draft!, name: e.target.value })} className="input" /></Field>
              <Field label="Description"><textarea value={draft!.description} onChange={(e) => setDraft({ ...draft!, description: e.target.value })} rows={3} className="input" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₦)"><input type="number" min={0} value={draft!.price} onChange={(e) => setDraft({ ...draft!, price: Number(e.target.value) })} className="input" /></Field>
                <Field label="Sort order"><input type="number" min={0} value={draft!.sort_order} onChange={(e) => setDraft({ ...draft!, sort_order: Number(e.target.value) })} className="input" /></Field>
              </div>
              <Field label="Category">
                <select value={draft!.category} onChange={(e) => setDraft({ ...draft!, category: e.target.value })} className="input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Image URL (optional)"><input value={draft!.image_url} onChange={(e) => setDraft({ ...draft!, image_url: e.target.value })} placeholder="https://..." className="input" /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={draft!.available} onChange={(e) => setDraft({ ...draft!, available: e.target.checked })} />
                Visible on public menu
              </label>
            </div>
            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={() => setDraft(null)} disabled={saving} className="h-10 px-4 rounded-full border border-border text-sm">Cancel</button>
              <button onClick={save} disabled={saving || !draft?.name} className="h-10 px-5 rounded-full bg-gradient-gold text-gold-foreground text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`.input{width:100%;height:42px;border-radius:12px;background:hsl(var(--background));border:1px solid hsl(var(--input));padding:0 14px;outline:none}.input:focus{box-shadow:0 0 0 2px hsl(var(--ring))}textarea.input{height:auto;padding:10px 14px}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
