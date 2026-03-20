import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Mail, Shield, Heart, Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { athlete, streaks, injuries, activities } = useApp();

  const activeInjuries = injuries.filter((i) => !i.dateRecovered);
  const recoveredInjuries = injuries.filter((i) => i.dateRecovered);
  const recoveryRate =
    injuries.length > 0 ? Math.round((recoveredInjuries.length / injuries.length) * 100) : 0;

  const recoveryStreak = streaks.find((s) => s.type === 'recovery');
  const trainingStreak = streaks.find((s) => s.type === 'training');

  const recentRecoveryActivities = activities
    .filter((a) => a.type === 'recovery')
    .slice(0, 3);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-3xl font-bold text-foreground">Profile</Text>

        {/* Account Card */}
        <Card>
          <CardContent className="pt-6 items-center gap-3">
            <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center">
              <Text className="text-4xl font-bold text-primary">
                {(user?.displayName ?? athlete?.name ?? 'A')[0].toUpperCase()}
              </Text>
            </View>

            <View className="items-center gap-1">
              <Text className="text-xl font-bold text-foreground">
                {user?.displayName ?? athlete?.name ?? 'Athlete'}
              </Text>

              <View className="flex-row items-center gap-2">
                <Mail size={13} color="#5c7a99" />
                <Text className="text-sm text-muted-foreground">
                  {user?.email ?? athlete?.email}
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5 bg-secondary px-3 py-1 rounded-full mt-1">
                <Shield size={12} color="#5b8ee8" />
                <Text className="text-xs text-primary capitalize">
                  {athlete?.role ?? 'Athlete'}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Recovery Stats Row */}
        <View className="flex-row gap-3">
          {[
            {
              label: 'Active Injuries',
              value: String(activeInjuries.length),
              color: activeInjuries.length > 0 ? '#ef4444' : '#34d399',
            },
            {
              label: 'Recovered',
              value: String(recoveredInjuries.length),
              color: '#34d399',
            },
            {
              label: 'Recovery Rate',
              value: `${recoveryRate}%`,
              color: '#5b8ee8',
            },
          ].map((stat) => (
            <Card key={stat.label} className="flex-1">
              <CardContent className="pt-4 pb-4 items-center gap-1">
                <Text className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </Text>
                <Text className="text-xs text-muted-foreground text-center">{stat.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Recovery & Training Streaks */}
        <Card>
          <CardHeader className="pb-2">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={16} color="#34d399" />
              <Text className="text-base font-semibold text-foreground">Streaks</Text>
            </View>
          </CardHeader>
          <CardContent className="pt-0 gap-0">
            {[
              { streak: recoveryStreak, label: 'Recovery', Icon: Heart, color: '#34d399' },
              { streak: trainingStreak, label: 'Training', Icon: Activity, color: '#5b8ee8' },
            ].map(({ streak, label, Icon, color }, idx, arr) => (
              <View
                key={label}
                className={`flex-row items-center justify-between py-3 ${idx < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={16} color={color} />
                  </View>
                  <Text className="text-sm text-foreground">{label}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-base font-bold" style={{ color }}>
                    {streak?.currentStreak ?? 0}d
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    best {streak?.longestStreak ?? 0}d
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Active Injuries Summary */}
        {activeInjuries.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <View className="flex-row items-center gap-2">
                <AlertCircle size={16} color="#ef4444" />
                <Text className="text-base font-semibold text-foreground">Active Injuries</Text>
              </View>
            </CardHeader>
            <CardContent className="pt-0 gap-0">
              {activeInjuries.map((injury, idx) => {
                const totalTasks = injury.recoveryPlan.length;
                const doneTasks = injury.completedTasks.length;
                const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
                return (
                  <View
                    key={injury.id}
                    className={`flex-row items-center justify-between py-3 ${idx < activeInjuries.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <View className="flex-1 gap-0.5">
                      <Text className="text-sm font-medium text-foreground capitalize">
                        {injury.injuryType}
                      </Text>
                      <Text className="text-xs text-muted-foreground capitalize">
                        {injury.severity} · {totalTasks > 0 ? `${doneTasks}/${totalTasks} tasks` : 'No plan yet'}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <Text className="text-sm font-bold" style={{ color: progress === 100 ? '#34d399' : '#fb923c' }}>
                        {progress}%
                      </Text>
                      <View className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: progress === 100 ? '#34d399' : '#fb923c',
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Recent Recovery Sessions */}
        {recentRecoveryActivities.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <View className="flex-row items-center gap-2">
                <CheckCircle2 size={16} color="#34d399" />
                <Text className="text-base font-semibold text-foreground">Recent Recovery Sessions</Text>
              </View>
            </CardHeader>
            <CardContent className="pt-0 gap-0">
              {recentRecoveryActivities.map((activity, idx) => (
                <View
                  key={activity.id}
                  className={`flex-row items-center justify-between py-3 ${idx < recentRecoveryActivities.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <View className="gap-0.5">
                    <Text className="text-sm font-medium text-foreground">Recovery Session</Text>
                    <Text className="text-xs text-muted-foreground">
                      {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted-foreground">{activity.duration} min</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="flex-row items-center justify-center gap-2 border border-destructive rounded-xl py-3.5"
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="text-base font-semibold text-destructive">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
