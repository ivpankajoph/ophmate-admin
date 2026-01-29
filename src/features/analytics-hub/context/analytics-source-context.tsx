import React, { createContext, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";

type AnalyticsSourceValue = "all" | "ophmart" | "template";

type AnalyticsSourceOption = {
  value: AnalyticsSourceValue;
  label: string;
};

type AnalyticsSourceContextValue = {
  source: AnalyticsSourceValue;
  setSource: (value: AnalyticsSourceValue) => void;
  options: AnalyticsSourceOption[];
};

const AnalyticsSourceContext = createContext<AnalyticsSourceContextValue | null>(
  null
);

const STORAGE_KEY = "analytics_source";

const getStoredSource = (): AnalyticsSourceValue => {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ophmart" || stored === "template" || stored === "all") {
    return stored;
  }
  return "all";
};

export function AnalyticsSourceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: any) => state.auth?.user);
  const role = user?.role || "admin";
  const [source, setSourceState] = useState<AnalyticsSourceValue>(() =>
    getStoredSource()
  );

  const setSource = (value: AnalyticsSourceValue) => {
    setSourceState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const options = useMemo<AnalyticsSourceOption[]>(() => {
    const base: AnalyticsSourceOption[] = [
      { value: "all", label: "All Storefronts" },
      { value: "ophmart", label: "Ophmate Storefront" },
      { value: "template", label: "Vendor Templates" },
    ];
    return role === "vendor"
      ? base
      : base;
  }, [role]);

  return (
    <AnalyticsSourceContext.Provider value={{ source, setSource, options }}>
      {children}
    </AnalyticsSourceContext.Provider>
  );
}

export const useAnalyticsSource = () => {
  const ctx = useContext(AnalyticsSourceContext);
  if (!ctx) {
    throw new Error("useAnalyticsSource must be used within AnalyticsSourceProvider");
  }
  return ctx;
};
