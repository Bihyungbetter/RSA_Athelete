'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Flame, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/recovery', label: 'Recovery', icon: Heart },
  { href: '/streaks', label: 'Streaks', icon: Flame },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-card border-r border-border px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-foreground">AthleteApp</h1>
        <p className="text-xs text-muted-foreground mt-1">Performance Tracker</p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
