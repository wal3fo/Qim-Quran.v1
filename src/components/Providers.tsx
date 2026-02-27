"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { createQueryClient } from "@/lib/queryClient";

type ProvidersProps = {
  children: React.ReactNode;
};

const globalObj = globalThis as typeof globalThis & {
  __name?: (target: Function, value: string) => void;
};

if (!globalObj.__name) {
  globalObj.__name = (target: Function, value: string) => {
    Object.defineProperty(target, "name", { value, configurable: true });
  };
}

export default function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => createQueryClient());
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
