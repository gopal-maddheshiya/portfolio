import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  DEFAULT_PORTFOLIO_DATA,
  RECORD_ID,
  TABLE_NAME,
  fetchPortfolioData,
  parsePortfolioContent,
  savePortfolioData,
  supabase,
  type PortfolioData,
} from "@/lib/supabase";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
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

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Track whether the user has unsaved local edits.
  // When dirty, skip ALL remote overwrites (realtime, broadcast, focus refresh)
  // so that file-picker blur/re-focus cycles don't wipe out admin work.
  const isDirtyRef = useRef<boolean>(false);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const remoteData = await fetchPortfolioData();
      setData(remoteData);
      notifyContentUpdate();
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // 1. Supabase Realtime Channel Subscription (WebSocket)
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
          // Skip remote overwrite while admin has unsaved changes
          if (isDirtyRef.current) {
            console.log("⚡ [Realtime Sync] Skipped — local unsaved edits present");
            return;
          }
          console.log("⚡ [Realtime Sync] Supabase update received:", payload);
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
      .subscribe((status) => {
        console.log("⚡ Supabase Realtime sync status:", status);
      });

    // 2. Multi-Tab Instant Sync via BroadcastChannel
    let broadcast: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        broadcast = new BroadcastChannel("gopal_portfolio_tab_sync");
        broadcast.onmessage = (event) => {
          if (event.data?.type === "PORTFOLIO_SAVED" && event.data?.payload) {
            // Skip if admin is actively editing (dirty state)
            if (isDirtyRef.current) {
              console.log("⚡ [Cross-Tab Sync] Skipped — local unsaved edits present");
              return;
            }
            console.log("⚡ [Cross-Tab Sync] Instant sync received from Admin Studio");
            setData(parsePortfolioContent(event.data.payload, new Date().toISOString()));
            notifyContentUpdate();
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    // 3. Tab Focus / Visibility Auto-Refresh
    //    Skip when dirty so file-picker blur→focus doesn't wipe unsaved edits
    const handleVisibility = () => {
      if (isDirtyRef.current) {
        console.log("⚡ [Focus Refresh] Skipped — local unsaved edits present");
        return;
      }
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadData(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleVisibility);
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      supabase.removeChannel(channel);
      if (broadcast) {
        broadcast.close();
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleVisibility);
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, [loadData]);

  const updateData = (
    updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData),
  ) => {
    // Mark as dirty — prevents remote sync from overwriting local edits
    isDirtyRef.current = true;
    if (typeof updater === "function") {
      setData((prev) => updater(prev));
    } else {
      setData((prev) => ({ ...prev, ...updater }));
    }
  };

  const saveData = async (customData?: PortfolioData): Promise<boolean> => {
    const dataToSave = customData || data;
    try {
      setIsSaving(true);
      const res = await savePortfolioData(dataToSave);
      if (res.success) {
        toast.success("Portfolio changes saved live!");
        const updated = { ...dataToSave, updatedAt: new Date().toISOString() };
        setData(updated);
        // Clear dirty flag — remote sync can resume now
        isDirtyRef.current = false;

        // Notify all open tabs instantly in < 5ms without page reload
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          try {
            const bc = new BroadcastChannel("gopal_portfolio_tab_sync");
            bc.postMessage({ type: "PORTFOLIO_SAVED", payload: dataToSave });
            bc.close();
          } catch {
            // Handled by Supabase Realtime channel
          }
        }

        return true;
      } else {
        toast.error(`Save failed: ${res.error || "Unknown error"}`);
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      toast.error(`Save failed: ${msg}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setData(DEFAULT_PORTFOLIO_DATA);
    isDirtyRef.current = false;
    toast.info("Reset to default profile values. Click 'Save' to persist.");
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
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

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    // If used outside provider, gracefully return defaults
    return {
      data: DEFAULT_PORTFOLIO_DATA,
      isLoading: false,
      isSaving: false,
      updateData: () => {},
      saveData: async () => false,
      resetToDefaults: () => {},
      refreshData: async () => {},
    };
  }
  return context;
}
