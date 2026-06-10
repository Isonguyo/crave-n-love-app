import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Send } from "lucide-react";
import { listReviews, submitReview } from "@/lib/api/reviews.functions";

type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  avatar_color: string;
  created_at: string;
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  return <>{(parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")}</>;
}

export function ReviewsSection() {
  const list = useServerFn(listReviews);
  const submit = useServerFn(submitReview);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => list().then((r) => setReviews(r as Review[])).catch(() => {});
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || body.trim().length < 3) return;
    setSending(true); setMsg(null);
    try {
      await submit({ data: { name: name.trim(), rating, body: body.trim() } });
      setName(""); setBody(""); setRating(5);
      setMsg("Thanks — your review is live!");
      load();
    } catch {
      setMsg("Sorry, something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="reviews" className="container mx-auto px-5 lg:px-8 py-20">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Loved by Calabar</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">What guests are saying</h2>
      </div>

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Be the first to leave a review.
            </div>
          )}
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl bg-card border border-border/60 p-5 hover:shadow-soft transition-all">
              <div className="flex items-start gap-3">
                <div
                  className="h-11 w-11 shrink-0 rounded-full grid place-items-center text-white font-display font-semibold"
                  style={{ background: r.avatar_color }}
                >
                  <Initials name={r.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <p className="font-display text-lg truncate">{r.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-gradient-blush dark:bg-secondary p-6 h-fit lg:sticky lg:top-28">
          <p className="font-display text-2xl">Share your experience</p>
          <p className="text-xs text-muted-foreground mt-1">No sign-up required.</p>
          <label className="block mt-4 text-sm">
            <span className="font-medium">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className="mt-1.5 w-full h-11 rounded-xl bg-background border border-input px-3 focus:outline-none focus:ring-2 focus:ring-gold" />
          </label>
          <div className="mt-3 text-sm">
            <span className="font-medium">Rating</span>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className="p-1">
                  <Star className={`h-6 w-6 transition-transform hover:scale-110 ${n <= rating ? "fill-gold text-gold" : "text-muted-foreground/50"}`} />
                </button>
              ))}
            </div>
          </div>
          <label className="block mt-3 text-sm">
            <span className="font-medium">Review</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={4} className="mt-1.5 w-full rounded-xl bg-background border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold" placeholder="Tell us what you loved…" />
          </label>
          <button disabled={sending} className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gradient-gold text-gold-foreground font-semibold disabled:opacity-60">
            {sending ? "Sending…" : (<><Send className="h-4 w-4" /> Post review</>)}
          </button>
          {msg && <p className="mt-3 text-xs text-foreground">{msg}</p>}
        </form>
      </div>
    </section>
  );
}
