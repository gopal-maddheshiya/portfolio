import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AdminLogin } from "@/components/admin/AdminLogin";

const AdminDashboard = lazy(() =>
  import("@/components/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Gopal Portfolio Studio | Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    } catch (err) {
      console.error("Session check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onSuccess={checkSession} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground font-mono">Loading Dashboard Studio...</p>
          </div>
        </div>
      }
    >
      <AdminDashboard onSignOut={handleSignOut} userEmail={session.user.email || "Admin"} />
    </Suspense>
  );
}
