import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Heart, Trophy, Activity } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/helpers';

export default function HomePage() {
  const athlete = db.athletes.get(db.DEFAULT_ATHLETE_ID);
  const streaks = Array.from(db.streaks.values()).filter(
    (s) => s.athleteId === db.DEFAULT_ATHLETE_ID
  );
  const trainingStreak = streaks.find((s) => s.type === 'training');
  const activeInjuries = Array.from(db.injuries.values()).filter(
    (i) => i.athleteId === db.DEFAULT_ATHLETE_ID && !i.dateRecovered
  );
  const activeChallenges = Array.from(db.challenges.values());
  const recentActivities = Array.from(db.activities.values())
    .filter((a) => a.athleteId === db.DEFAULT_ATHLETE_ID)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, {athlete?.name?.split(' ')[0] ?? 'Athlete'}!
        </h1>
        <p className="text-muted-foreground mt-1">{formatDate(today)}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trainingStreak?.currentStreak ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">days training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              Active Recoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeInjuries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeInjuries.length === 1 ? 'injury' : 'injuries'} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeChallenges.length}</div>
            <p className="text-xs text-muted-foreground mt-1">in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today&apos;s Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activities logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium capitalize">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(activity.date))} · {activity.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.intensity && (
                      <Badge
                        variant={
                          activity.intensity === 'high'
                            ? 'destructive'
                            : activity.intensity === 'medium'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {activity.intensity}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            Streak Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {streaks.map((streak) => (
              <div key={streak.id} className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground capitalize">{streak.type}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{streak.currentStreak}</span>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">Best: {streak.longestStreak}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
