import { useRef } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart, Trophy, AlertTriangle, CheckCircle,
  Activity, Zap, Lightbulb,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getRelativeDate } from '@/lib/helpers';
import type { Streak } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────


const DAILY_TIPS = [
  "Ice reduces inflammation most in the first 48 hours. Use it consistently.",
  "Sleep is when your body repairs tissue — 8+ hours accelerates recovery.",
  "Skipping rest days slows healing. Recovery is progress, not laziness.",
  "Hydration keeps joints lubricated and reduces muscle soreness. Drink water.",
  "Gentle movement on rest days increases blood flow without stress on injuries.",
  "Log your pain levels daily — patterns help your physio adjust your plan.",
  "Nutrition fuels repair. Protein within 30 minutes of therapy speeds healing.",
];

const MILESTONES = [7, 14, 30, 50, 100];

// ─── Streak Ring ──────────────────────────────────────────────────────────────

function StreakRing({ current, goal = 30, color }: { current: number; goal?: number; color: string }) {
  const size = 120;
  const radius = 48;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const offset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#1e2d40" strokeWidth={stroke} fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text className="text-3xl font-bold text-foreground">{current}</Text>
        <Text className="text-xs text-muted-foreground">days</Text>
      </View>
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { athlete, streaks, injuries, challenges, activities, incrementStreak, logRecovery } = useApp();
  const { user, profile } = useAuth();
  const insets = useSafeAreaInsets();
  const debounceRef = useRef<Record<string, boolean>>({});

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (user?.displayName ?? athlete?.name ?? 'Athlete').split(' ')[0];

  const streakGoal = profile?.streakGoal ?? 30;
  const recoveryStreak = streaks.find((s) => s.type === 'recovery');
  const activeInjuries = injuries.filter((i) => !i.dateRecovered);
  const recoveredCount = injuries.filter((i) => !!i.dateRecovered).length;
  const now = new Date();
  const activeChallenges = challenges.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );
  const topChallenge = activeChallenges[0] ?? null;
  const recentActivities = activities.slice(0, 3);
  const dailyTip = DAILY_TIPS[today.getDay()];
  const milestone = MILESTONES.find((m) => recoveryStreak?.currentStreak === m) ?? null;

  const logToday = (type: Streak['type']) => {
    if (debounceRef.current[type]) return;
    debounceRef.current[type] = true;
    if (type === 'recovery') logRecovery();
    else incrementStreak(type);
    setTimeout(() => { debounceRef.current[type] = false; }, 400);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header with avatar ── */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-3xl font-bold text-foreground">
            {greeting}, {firstName}!
          </Text>
          <Text className="text-muted-foreground mt-1">{formatDate(today)}</Text>
        </View>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
        ) : (
          <View className="w-11 h-11 rounded-full bg-secondary items-center justify-center">
            <Text className="text-base font-bold text-primary">{firstName[0]}</Text>
          </View>
        )}
      </View>

      {/* ── Milestone celebration ── */}
      {milestone !== null && (
        <Card>
          <CardContent className="pt-4 pb-4 flex-row items-center gap-3">
            <Text className="text-3xl">🎉</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">
                {milestone}-Day Recovery Milestone!
              </Text>
              <Text className="text-sm text-muted-foreground">
                {milestone} days of consistent recovery. Your body thanks you.
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* ── Recovery ring hero ── */}
      <Card>
        <CardContent className="pt-6 pb-6 flex-row items-center gap-6">
          <StreakRing
            current={recoveryStreak?.currentStreak ?? 0}
            goal={streakGoal}
            color="#34d399"
          />
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Heart size={16} color="#34d399" />
              <Text className="text-base font-semibold text-foreground">Recovery Streak</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              {recoveryStreak?.currentStreak ?? 0} of {streakGoal} day goal
            </Text>
            <Text className="text-xs text-muted-foreground">
              Best: {recoveryStreak?.longestStreak ?? 0} days · {recoveredCount} total recovered
            </Text>
            <Button
              size="sm"
              variant="outline"
              onPress={() => logToday('recovery')}
              className="gap-1 mt-2 self-start"
            >
              <CheckCircle size={13} color="#34d399" />
              <Text className="text-xs font-medium text-foreground">Log Recovery</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* ── Active injury alert ── */}
      {activeInjuries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <AlertTriangle size={16} color="#f87171" />
                <Text className="text-base font-semibold text-foreground">
                  Active Recovery {activeInjuries.length === 1 ? 'Plan' : 'Plans'}
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">{activeInjuries.length} in progress</Text>
            </View>
          </CardHeader>
          <CardContent className="gap-3 pt-0">
            {activeInjuries.slice(0, 2).map((injury) => {
              const completed = injury.completedTasks.length;
              const total = injury.recoveryPlan.length;
              const progress = total > 0 ? completed / total : 0;
              const nextTask = injury.recoveryPlan.find((t) => !injury.completedTasks.includes(t));
              return (
                <View key={injury.id} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-foreground">{injury.injuryType}</Text>
                    <Text className="text-xs text-muted-foreground">{completed}/{total} tasks</Text>
                  </View>
                  {/* Progress bar */}
                  <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${progress * 100}%`, backgroundColor: '#34d399' }}
                    />
                  </View>
                  {nextTask && (
                    <Text className="text-xs text-muted-foreground">
                      Next: {nextTask}
                    </Text>
                  )}
                </View>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── Challenge snapshot ── */}
      {topChallenge && (
        <Card>
          <CardHeader className="pb-2">
            <View className="flex-row items-center gap-2">
              <Trophy size={16} color="#facc15" />
              <Text className="text-base font-semibold text-foreground">Top Challenge</Text>
            </View>
          </CardHeader>
          <CardContent className="pt-0 gap-2">
            <Text className="text-sm font-medium text-foreground">{topChallenge.name}</Text>
            <View className="flex-row items-center gap-3">
              {(() => {
                const sorted = [...topChallenge.leaderboard].sort((a, b) => b.score - a.score);
                const myEntry = topChallenge.leaderboard.find((e) => e.athleteId === athlete?.id);
                const myRank = sorted.findIndex((e) => e.athleteId === athlete?.id) + 1;
                return (
                  <>
                    <View className="bg-secondary px-3 py-1 rounded-full">
                      <Text className="text-xs text-foreground font-medium">
                        Rank #{myRank || '—'}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {myEntry?.score ?? 0} pts
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {Math.max(0, Math.ceil((new Date(topChallenge.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))} days left
                    </Text>
                  </>
                );
              })()}
            </View>
          </CardContent>
        </Card>
      )}

      {/* ── Recent activity ── */}
      {recentActivities.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <View className="flex-row items-center gap-2">
              <Activity size={16} color="#5b8ee8" />
              <Text className="text-base font-semibold text-foreground">Recent Activity</Text>
            </View>
          </CardHeader>
          <CardContent className="pt-0 gap-0">
            {recentActivities.map((activity, idx) => (
              <View
                key={activity.id}
                className={`flex-row items-center justify-between py-2.5 ${idx < recentActivities.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-lg bg-secondary items-center justify-center">
                    <Zap size={14} color="#5b8ee8" />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground capitalize">{activity.type}</Text>
                    <Text className="text-xs text-muted-foreground">{activity.duration} min</Text>
                  </View>
                </View>
                <Text className="text-xs text-muted-foreground">{getRelativeDate(new Date(activity.date))}</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Daily tip ── */}
      <Card>
        <CardContent className="pt-4 pb-4 flex-row items-start gap-3">
          <View className="w-8 h-8 rounded-lg bg-secondary items-center justify-center mt-0.5">
            <Lightbulb size={16} color="#facc15" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Daily Tip
            </Text>
            <Text className="text-sm text-foreground leading-5">{dailyTip}</Text>
          </View>
        </CardContent>
      </Card>

    </ScrollView>
  );
}
