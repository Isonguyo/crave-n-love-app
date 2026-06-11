import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { adminLogin } from "@/lib/api/admin.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in – Calabar Buka" }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const router = useRouter();
  const loginFn = useServerFn(adminLogin);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        // Try admin credentials first (email field doubles as admin username)
        try {
          await loginFn({ data: { username: email, password } });
          router.navigate({ to: "/admin-dashboard" });
          return;
        } catch {
          // Fall through to regular user sign-in
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setInfo("Signed in. Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setInfo("Account created. Check your email to confirm.");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 grid place-items-center px-5 py-12">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl bg-card border border-border/60 p-7 shadow-elegant"
        >
          <div className="flex items-center gap-2 text-gold mb-2">
            <Lock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </span>
          </div>
          <h1 className="font-display text-3xl">
            {mode === "signin" ? "Sign in" : "Join Calabar Buka"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your account."
              : "Create an account to stay in the loop."}
          </p>

          <div className="mt-5 inline-flex rounded-full bg-muted p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`px-4 h-8 rounded-full inline-flex items-center gap-1 ${
                mode === "signin" ? "bg-background text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`px-4 h-8 rounded-full inline-flex items-center gap-1 ${
                mode === "signup" ? "bg-background text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" /> Sign up
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="text-sm font-medium">Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            {err && <p className="text-sm text-destructive">{err}</p>}
            {info && <p className="text-sm text-emerald-500">{info}</p>}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-12 rounded-full bg-gradient-gold text-gold-foreground font-semibold disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              Staff?{" "}
              <Link to="/admin-dashboard" className="underline hover:text-foreground">
                Admin dashboard
              </Link>
            </p>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
