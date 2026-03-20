import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { saveOnboarding } from '@/lib/firestore';
import type { UserProfile } from '@/lib/firestore';

// ─── Step config ──────────────────────────────────────────────────────────────

const ROLES = [
  { value: 'athlete',  label: 'Athlete',  emoji: '🏃' },
  { value: 'coach',    label: 'Coach',    emoji: '📋' },
  { value: 'parent',   label: 'Parent',   emoji: '👨‍👧' },
  { value: 'captain',  label: 'Captain',  emoji: '⭐' },
] as const;

const GOALS = [
  { value: 'recovery',    label: 'Recover from Injury',  emoji: '💚', desc: 'Track and complete your recovery plan' },
  { value: 'consistency', label: 'Stay Consistent',      emoji: '🔥', desc: 'Build daily recovery habits that stick' },
  { value: 'competition', label: 'Return to Competition',emoji: '🏆', desc: 'Recover fully and get back to peak performance' },
  { value: 'fitness',     label: 'Maintain Fitness',     emoji: '💪', desc: 'Stay active while recovering safely' },
] as const;

const TRACKING_OPTIONS = [
  { value: 'recovery',  label: 'Recovery Sessions', emoji: '💚' },
  { value: 'sleep',     label: 'Sleep Quality',     emoji: '😴' },
  { value: 'nutrition', label: 'Nutrition',         emoji: '🥗' },
  { value: 'training',  label: 'Light Training',    emoji: '🏋️' },
] as const;

const STREAK_GOALS = [
  { value: 7,  label: '7 Days',  desc: 'One week' },
  { value: 14, label: '14 Days', desc: 'Two weeks' },
  { value: 30, label: '30 Days', desc: 'One month' },
  { value: 60, label: '60 Days', desc: 'Two months' },
];

const TOTAL_STEPS = 5;

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <View className="flex-row gap-1.5 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          className="flex-1 h-1 rounded-full"
          style={{ backgroundColor: i < step ? '#5b8ee8' : '#1e2d40' }}
        />
      ))}
    </View>
  );
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({
  selected,
  onPress,
  emoji,
  label,
  desc,
}: {
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
  desc?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-3">
      <Card className={selected ? 'border-primary' : ''}>
        <CardContent className="pt-4 pb-4 flex-row items-center gap-4">
          <Text className="text-2xl">{emoji}</Text>
          <View className="flex-1">
            <Text className={`text-base font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>
              {label}
            </Text>
            {desc && <Text className="text-sm text-muted-foreground mt-0.5">{desc}</Text>}
          </View>
          {selected && (
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
              <Check size={14} color="#0d1117" />
            </View>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

// ─── Onboarding screen ────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<UserProfile['role'] | null>(null);
  const [sport, setSport] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState<UserProfile['primaryGoal'] | null>(null);
  const [trackingGoals, setTrackingGoals] = useState<string[]>(['recovery', 'sleep']);
  const [streakGoal, setStreakGoal] = useState<number>(30);

  const canNext = () => {
    if (step === 1) return !!role;
    if (step === 2) return sport.trim().length > 0;
    if (step === 3) return !!primaryGoal;
    if (step === 4) return trackingGoals.length > 0;
    return true;
  };

  const toggleTracking = (val: string) => {
    setTrackingGoals((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveOnboarding(user.uid, {
        role: role!,
        sport: sport.trim(),
        primaryGoal: primaryGoal!,
        trackingGoals,
        streakGoal,
        onboardingComplete: true,
      });
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-6">
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-foreground">Athlete App</Text>
          <Text className="text-sm text-muted-foreground mt-1">Step {step} of {TOTAL_STEPS}</Text>
        </View>
        <ProgressBar step={step} />

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

          {/* Step 1 — Role */}
          {step === 1 && (
            <View>
              <Text className="text-2xl font-bold text-foreground mb-1">What best describes you?</Text>
              <Text className="text-muted-foreground mb-6">This helps us personalize your experience.</Text>
              {ROLES.map((r) => (
                <OptionCard
                  key={r.value}
                  selected={role === r.value}
                  onPress={() => setRole(r.value)}
                  emoji={r.emoji}
                  label={r.label}
                />
              ))}
            </View>
          )}

          {/* Step 2 — Sport */}
          {step === 2 && (
            <View>
              <Text className="text-2xl font-bold text-foreground mb-1">What sport do you play?</Text>
              <Text className="text-muted-foreground mb-6">We tailor your recovery tips and plans to your sport.</Text>
              <Card className={sport.trim() ? 'border-primary' : ''}>
                <CardContent className="pt-1 pb-1">
                  <TextInput
                    value={sport}
                    onChangeText={setSport}
                    placeholder="e.g. Soccer, Basketball, Swimming..."
                    placeholderTextColor="#5c7a99"
                    autoFocus
                    style={{
                      paddingVertical: 14,
                      fontSize: 16,
                      color: '#f0f6ff',
                    }}
                  />
                </CardContent>
              </Card>
            </View>
          )}

          {/* Step 3 — Primary goal */}
          {step === 3 && (
            <View>
              <Text className="text-2xl font-bold text-foreground mb-1">What is your recovery goal?</Text>
              <Text className="text-muted-foreground mb-6">This shapes your home dashboard and daily tips.</Text>
              {GOALS.map((g) => (
                <OptionCard
                  key={g.value}
                  selected={primaryGoal === g.value}
                  onPress={() => setPrimaryGoal(g.value)}
                  emoji={g.emoji}
                  label={g.label}
                  desc={g.desc}
                />
              ))}
            </View>
          )}

          {/* Step 4 — Tracking */}
          {step === 4 && (
            <View>
              <Text className="text-2xl font-bold text-foreground mb-1">What will you track daily?</Text>
              <Text className="text-muted-foreground mb-6">These build your recovery streaks. Select all that apply.</Text>
              {TRACKING_OPTIONS.map((t) => (
                <OptionCard
                  key={t.value}
                  selected={trackingGoals.includes(t.value)}
                  onPress={() => toggleTracking(t.value)}
                  emoji={t.emoji}
                  label={t.label}
                />
              ))}
            </View>
          )}

          {/* Step 5 — Streak goal */}
          {step === 5 && (
            <View>
              <Text className="text-2xl font-bold text-foreground mb-1">Set your recovery goal</Text>
              <Text className="text-muted-foreground mb-6">How many consecutive days of recovery do you want to hit?</Text>
              {STREAK_GOALS.map((g) => (
                <OptionCard
                  key={g.value}
                  selected={streakGoal === g.value}
                  onPress={() => setStreakGoal(g.value)}
                  emoji="🎯"
                  label={g.label}
                  desc={g.desc}
                />
              ))}
            </View>
          )}

        </ScrollView>

        {/* Navigation buttons */}
        <View className="flex-row gap-3 pb-6 pt-4">
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep((s) => s - 1)}
              className="w-12 h-12 rounded-xl bg-secondary items-center justify-center"
            >
              <ChevronLeft size={22} color="#f0f6ff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              if (step < TOTAL_STEPS) setStep((s) => s + 1);
              else handleFinish();
            }}
            disabled={!canNext() || saving}
            activeOpacity={0.85}
            className="flex-1 h-12 rounded-xl items-center justify-center flex-row gap-2"
            style={{ backgroundColor: canNext() ? '#5b8ee8' : '#1e2d40', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text className="text-base font-semibold" style={{ color: canNext() ? '#0d1117' : '#5c7a99' }}>
                  {step === TOTAL_STEPS ? "Let's Go" : 'Continue'}
                </Text>
                {!saving && <ChevronRight size={18} color={canNext() ? '#0d1117' : '#5c7a99'} />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
