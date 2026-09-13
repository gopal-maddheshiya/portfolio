import React, { useState } from "react";
import { Lock, Mail, KeyRound, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("gopalmaddheshiya138@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Welcome back, Gopal!");
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        if (data.session) {
          toast.success("Account created & logged in!");
          onSuccess();
        } else {
          toast.success("Account created! Please check your email to verify if required, or try signing in.");
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.href,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Magic login link sent to your email!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send magic link";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl border border-border bg-card/95 p-6 sm:p-8 shadow-lift backdrop-blur-xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 border border-primary/20">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
              Gopal Portfolio Studio
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Sign in to manage your public portfolio, projects, bio and skills.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={
              mode === "signin"
                ? handleSignIn
                : mode === "signup"
                ? handleSignUp
                : handleMagicLink
            }
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gopalmaddheshiya138@gmail.com"
                  className="w-full rounded-lg border border-border bg-surface px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {mode !== "magic" && (
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="w-full rounded-lg border border-border bg-surface px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <span>
                    {mode === "signin"
                      ? "Sign In to Studio"
                      : mode === "signup"
                      ? "Create Admin Account"
                      : "Send Magic Link"}
                  </span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode switchers */}
          <div className="mt-6 pt-5 border-t border-border flex flex-col gap-2 text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  First time setting up? Create Admin Password
                </button>
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Or sign in with Magic Link email
                </button>
              </>
            ) : mode === "signup" ? (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Already have password? Sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Back to Password sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
