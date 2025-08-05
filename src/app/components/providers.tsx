'use client';

import { AuthContextProvider } from '@/app/context/auth-context';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from "@/app/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthContextProvider>
            {children}
            <Toaster />
        </AuthContextProvider>
    </ThemeProvider>
  );
}
