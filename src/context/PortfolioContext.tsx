import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  DEFAULT_PORTFOLIO_DATA,
  RECORD_ID,
  TABLE_NAME,
  clearAdminDraftPortfolioData,
  clearLegacyPublicCache,
  fetchPortfolioData,
  getAdminDraftPortfolioData,
  invalidatePortfolioCache,
  parsePortfolioContent,
  savePortfolioData,
  setAdminDraftPortfolioData,
  supabase,
  type PortfolioData,
} from "@/lib/supabase";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
  saveData: (customData?: PortfolioData) => Promise<boolean>;
  resetToDefaults: () => void;
  refreshData: () => Promise<void>;
}

/** Let GSAP ScrollTrigger re-measure positions after remote content swaps layout. */
function notifyContentUpdate() {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("app:content-updated"));
  });
}

function arePortfolioContentsEqual(a: PortfolioData, b: PortfolioData): boolean {
  if (a === b) return true;
  const { updatedAt: _a, ...restA } = a;
  const { updatedAt: _b, ...restB } = b;
  return JSON.stringify(restA) === JSON.stringify(restB);
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window !== "undefined") {
      clearLegacyPublicCache();
      if (window.location.pathname.startsWith("/admin")) {
        const draft = getAdminDraftPortfolioData();
        if (draft) return draft;
      }
    }
    return initialData || DEFAULT_PORTFOLIO_DATA;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      return Boolean(getAdminDraftPortfolioData());
    }
    return false;
  });

  const lastFetchTimeRef = useRef<number>(Date.now());
  const isDirtyRef = useRef<boolean>(isDirty);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const remoteData = await fetchPortfolioData(true);
      lastFetchTimeRef.current = Date.now();

      setData((prev) => {
        if (isDirtyRef.current) return prev;
        if (arePortfolioContentsEqual(prev, remoteData)) {
          return prev;
        }
        notifyContentUpdate();
        return remoteData;
      });
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      loadData();
    }

    const channel = supabase
      .channel("portfolio-realtime-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLE_NAME,
          filter: `id=eq.${RECORD_ID}`,
        },
        (payload) => {
          if (isDirtyRef.current) return;
          invalidatePortfolioCache();
          if (payload.new && typeof payload.new === "object" && "content" in payload.new) {
            const raw = payload.new as { content?: unknown; updated_at?: string };
            const parsed = parsePortfolioContent(raw.content, raw.updated_at);
            setData(parsed);
            notifyContentUpdate();
          } else {
            loadData(true);
          }
        },
      )
      .subscribe();

    let broadcast: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        broadcast = new BroadcastChannel("gopal_portfolio_tab_sync");
        broadcast.onmessage = (event) => {
          if (isDirtyRef.current) return;
          if (event.data?.type === "PORTFOLIO_SAVED" && event.data?.payload) {
            invalidatePortfolioCache();
            const parsed = parsePortfolioContent(event.data.payload, new Date().toISOString());
            setData(parsed);
            notifyContentUpdate();
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    const handleVisibility = () => {
      if (isDirtyRef.current) return;
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 2 * 60 * 1000) return;
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        lastFetchTimeRef.current = now;
        loadData(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleVisibility);
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      supabase.removeChannel(channel);
      if (broadcast) broadcast.close();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleVisibility);
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, [loadData, initialData]);

  const updateData = (
    updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData),
  ) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      setAdminDraftPortfolioData(next);
      return next;
    });
  };

  const saveData = async (customData?: PortfolioData): Promise<boolean> => {
    const dataToSave = customData || data;
    try {
      setIsSaving(true);
      const res = await savePortfolioData(dataToSave);
      const updated = { ...dataToSave, updatedAt: new Date().toISOString() };
      setData(updated);

      if (res.success) {
        clearAdminDraftPortfolioData();
        isDirtyRef.current = false;
        setIsDirty(false);
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          try {
            const bc = new BroadcastChannel("gopal_portfolio_tab_sync");
            bc.postMessage({ type: "PORTFOLIO_SAVED", payload: updated });
            bc.close();
          } catch {
            // Handled by Supabase Realtime channel
          }
        }
        toast.success("Portfolio changes saved live!");
        return true;
      }

      if (res.savedLocally) {
        toast.warning("Saved to local Admin draft (sign in or check connection to sync cloud).");
        return false;
      }

      toast.error(`Save failed: ${res.error || "Unknown error"}`);
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      toast.error(`Save failed: ${msg}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    clearAdminDraftPortfolioData();
    clearLegacyPublicCache();
    invalidatePortfolioCache();
    setData(DEFAULT_PORTFOLIO_DATA);
    isDirtyRef.current = true;
    setIsDirty(true);
    toast.info("Reset to default profile values. Click 'Save Live' to publish to Supabase.");
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        isDirty,
        updateData,
        saveData,
        resetToDefaults,
        refreshData: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    return {
      data: DEFAULT_PORTFOLIO_DATA,
      isLoading: false,
      isSaving: false,
      isDirty: false,
      updateData: () => {},
      saveData: async () => false,
      resetToDefaults: () => {},
      refreshData: async () => {},
    };
  }
  return context;
}
