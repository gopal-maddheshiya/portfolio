import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_PORTFOLIO_DATA,
  fetchPortfolioData,
  savePortfolioData,
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

  const loadData = async () => {
    try {
      setIsLoading(true);
      const remoteData = await fetchPortfolioData();
      setData(remoteData);
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        setData({ ...dataToSave, updatedAt: new Date().toISOString() });
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
