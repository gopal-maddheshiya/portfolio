import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const remoteData = await fetchPortfolioData();
      setData(remoteData);
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
          console.log("⚡ [Realtime Sync] Supabase update received:", payload);
          if (payload.new && typeof payload.new === "object" && "content" in payload.new) {
            const raw = payload.new as { content?: unknown; updated_at?: string };
            const parsed = parsePortfolioContent(raw.content, raw.updated_at);
            setData(parsed);
          } else {
            loadData(true);
          }
        }
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
            console.log("⚡ [Cross-Tab Sync] Instant sync received from Admin Studio");
            setData(parsePortfolioContent(event.data.payload, new Date().toISOString()));
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    // 3. Tab Focus / Visibility Auto-Refresh
    const handleVisibility = () => {
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
    updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)
  ) => {
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
