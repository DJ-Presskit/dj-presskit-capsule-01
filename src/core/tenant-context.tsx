import { createContext, useContext, ReactNode } from "react";
import type { SupportedLang } from "@/types";

interface TenantContextValue {
  slug: string;
  lang: SupportedLang;
  isProxied: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps extends TenantContextValue {
  children: ReactNode;
}

export function TenantProvider({ children, slug, lang, isProxied }: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ slug, lang, isProxied }}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
