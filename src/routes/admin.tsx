import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus, X, Check, Clock, Phone } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  CATEGORIES, type Category, type MenuItem, type GalleryPhoto, type Booking,
  galleryStore, menuStore, bookingsStore,
  useGallery, useMenu, useBookings, uid,
} from "@/lib/store";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin – Calabar Buka" }] }),
  component: AdminPage,
});

type Tab = "menu" | "gallery" | "bookings";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("menu");

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="container mx-auto px-5 lg:px-8 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Admin</p>
            <h1 className="mt-3 font-display text-5xl">Control Center</h1>
            <p className="mt-3 text-muted-foreground">Manage menu, gallery and live booking requests.</p>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-border">
          {(["menu", "gallery", "bookings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 h-11 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                tab === t ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "menu" && <MenuAdmin />}
          {tab === "gallery" && <GalleryAdmin />}
          {tab === "bookings" && <BookingsAdmin />}
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ------------------ MENU ADMIN ------------------ */
function MenuAdmin() {
  const items = useMenu();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({ id: uid(), name: "", description: "", price: 0, category: CATEGORIES[0], image: "" });
    setOpen(true);
  };
  const openEdit = (m: MenuItem) => { setEditing({ ...m }); setOpen(true); };
  const del = (id: string) => {
    if (!confirm("Delete this item?")) return;
    menuStore.set(items.filter((i) => i.id !== id));
  };
  const save = (m: MenuItem) => {
    const exists = items.find((i) => i.id === m.id);
    menuStore.set(exists ? items.map((i) => (i.id === m.id ? m : i)) : [m, ...items]);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{items.length} items live on the website.</p>
        <button onClick={openNew} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gradient-gold text-gold-foreground font-semibold shadow-soft">
          <Plus className="h-4 w-4" /> Add new dish
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl bg-card border border-border/60 overflow-hidden">
            <div className="aspect-[5/3] bg-muted overflow-hidden">
              {m.image ? <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg leading-tight">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.category}</p>
                </div>
                <span className="text-gold font-semibold whitespace-nowrap">{formatNaira(m.price)}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(m)} className="flex-1 h-9 rounded-lg bg-muted hover:bg-accent inline-flex items-center justify-center gap-1.5 text-sm"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                <button onClick={() => del(m.id)} className="h-9 px-3 rounded-lg text-destructive hover:bg-destructive/10 inline-flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {open && editing && <MenuItemModal item={editing} onClose={() => setOpen(false)} onSave={save} />}
    </div>
  );
}

function MenuItemModal({ item, onClose, onSave }: { item: MenuItem; onClose: () => void; onSave: (m: MenuItem) => void }) {
  const [m, setM] = useState(item);
  const valid = m.name.trim() && m.image.trim() && m.price > 0;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="bg-background rounded-3xl border border-border w-full max-w-lg p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-2xl">{item.name ? "Edit item" : "New item"}</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={m.name} onChange={(v) => setM({ ...m, name: v })} />
          <Input label="Image URL" value={m.image} onChange={(v) => setM({ ...m, image: v })} placeholder="https://…" />
          <div>
            <label className="text-sm font-medium">Category</label>
            <select value={m.category} onChange={(e) => setM({ ...m, category: e.target.value as Category })} className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-3">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Price (₦)" type="number" value={String(m.price)} onChange={(v) => setM({ ...m, price: Number(v) || 0 })} />
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea rows={3} value={m.description} onChange={(e) => setM({ ...m, description: e.target.value })} className="mt-2 w-full rounded-xl bg-background border border-input px-3 py-2" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="h-11 px-5 rounded-full border border-border">Cancel</button>
          <button onClick={() => onSave(m)} disabled={!valid} className="h-11 px-6 rounded-full bg-gradient-gold text-gold-foreground font-semibold disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-3" />
    </label>
  );
}

/* ------------------ GALLERY ADMIN ------------------ */
function GalleryAdmin() {
  const photos = useGallery();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const add = () => {
    if (!url.trim()) return;
    galleryStore.set([{ id: uid(), url: url.trim(), caption: caption.trim() || undefined }, ...photos]);
    setUrl(""); setCaption("");
  };
  const del = (id: string) => galleryStore.set(photos.filter((p) => p.id !== id));

  return (
    <div>
      <div className="rounded-2xl bg-card border border-border/60 p-5 mb-6">
        <p className="font-display text-lg mb-3 flex items-center gap-2"><ImagePlus className="h-5 w-5 text-gold" /> Add a photo</p>
        <div className="grid sm:grid-cols-[2fr_1fr_auto] gap-3">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="h-11 rounded-xl bg-background border border-input px-3" />
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="h-11 rounded-xl bg-background border border-input px-3" />
          <button onClick={add} className="h-11 px-5 rounded-full bg-gradient-gold text-gold-foreground font-semibold">Add</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p) => (
          <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden group bg-muted">
            <img src={p.url} alt={p.caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
            <button onClick={() => del(p.id)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ BOOKINGS ADMIN ------------------ */
function BookingsAdmin() {
  const bookings = useBookings();

  const setStatus = (id: string, status: Booking["status"]) => {
    bookingsStore.set(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };
  const setNotes = (id: string, notes: string) => {
    bookingsStore.set(bookings.map((b) => (b.id === id ? { ...b, notes } : b)));
  };
  const del = (id: string) => bookingsStore.set(bookings.filter((b) => b.id !== id));

  const statusColor: Record<Booking["status"], string> = {
    new: "bg-blush text-foreground",
    contacted: "bg-secondary text-secondary-foreground",
    confirmed: "bg-gold text-gold-foreground",
    completed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No bookings yet. They'll appear here when customers send orders via WhatsApp.</p>
      )}
      {bookings.map((b) => (
        <div key={b.id} className="rounded-2xl bg-card border border-border/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(b.createdAt).toLocaleString()}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{b.type}</span>
              </div>
              <p className="mt-2 font-display text-xl">{b.customerName}</p>
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {b.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
              <p className="font-display text-2xl text-gold">{formatNaira(b.total)}</p>
            </div>
          </div>
          <div className="gold-divider my-4" />
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Details:</span> {b.details}</div>
            <div><span className="text-muted-foreground">Venue/Address:</span> {b.address}</div>
            <div><span className="text-muted-foreground">When:</span> {b.dateTime}</div>
          </div>
          <textarea
            placeholder="Follow-up notes…"
            value={b.notes ?? ""}
            onChange={(e) => setNotes(b.id, e.target.value)}
            className="mt-4 w-full rounded-xl bg-background border border-input px-3 py-2 text-sm"
            rows={2}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {(["new", "contacted", "confirmed", "completed"] as Booking["status"][]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(b.id, s)}
                className={`h-8 px-3 text-xs rounded-full inline-flex items-center gap-1 ${b.status === s ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
              >
                {b.status === s && <Check className="h-3 w-3" />} {s}
              </button>
            ))}
            <button onClick={() => del(b.id)} className="ml-auto h-8 px-3 text-xs rounded-full text-destructive hover:bg-destructive/10 inline-flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
