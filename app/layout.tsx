import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AthleteApp',
  description: 'Performance & Recovery Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
              <div className="container max-w-4xl mx-auto px-4 py-6">{children}</div>
            </main>
          </div>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
