'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Dumbbell, Apple, Moon, CheckCircle } from 'lucide-react';
import type { Streak } from '@/types';

const streakConfig = {
  training: { icon: Dumbbell, label: 'Training', color: 'text-blue-400', tip: 'Log a workout to keep your training streak alive.' },
  recovery: { icon: Flame, label: 'Recovery', color: 'text-orange-400', tip: 'Complete a recovery session — stretching or foam rolling counts!' },
  nutrition: { icon: Apple, label: 'Nutrition', color: 'text-green-400', tip: 'Log your meals to track your nutrition streak.' },
  sleep: { icon: Moon, label: 'Sleep', color: 'text-purple-400', tip: 'Log 7+ hours of sleep to keep your streak going.' },
};

export default function StreaksPage() {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [logging, setLogging] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/streaks')
      .then((r) => r.json())
      .then((res) => setStreaks(res.data ?? []));
  }, []);

  const logToday = async (type: Streak['type']) => {
    setLogging(type);
    const res = await fetch('/api/streaks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.data) {
      setStreaks((prev) => prev.map((s) => (s.type === type ? data.data : s)));
    }
    setLogging(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Streaks</h1>
        <p className="text-muted-foreground mt-1">Keep your consistency going</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {streaks.map((streak) => {
          const config = streakConfig[streak.type];
          const Icon = config.icon;
          const isNew = streak.currentStreak >= streak.longestStreak;
          return (
            <Card key={streak.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    {config.label}
                  </CardTitle>
                  {isNew && streak.currentStreak > 0 && (
                    <Badge variant="default" className="text-xs">
                      Personal Best!
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div>
                    <div className="text-4xl font-bold">{streak.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">current streak</div>
                  </div>
                  <div className="text-right ml-auto">
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {streak.longestStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">personal best</div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => logToday(streak.type)}
                  disabled={logging === streak.type}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {logging === streak.type ? 'Logging...' : 'Log Today'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            Streak Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.values(streakConfig).map((c) => (
              <li key={c.label} className="flex items-start gap-2 text-sm">
                <c.icon className={`h-4 w-4 mt-0.5 shrink-0 ${c.color}`} />
                <span className="text-muted-foreground">{c.tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
