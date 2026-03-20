import { useState } from 'react';
import { ScrollView, View, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trophy, Plus, Calendar, Trash2, Medal } from 'lucide-react-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import type { CompetitionChallenge } from '@/types';

const typeVariant = {
  streak: 'default',
  consistency: 'secondary',
  recovery: 'destructive',
} as const;

const typeOptions = [
  { value: 'streak', label: 'Streak' },
  { value: 'consistency', label: 'Consistency' },
  { value: 'recovery', label: 'Recovery' },
];

const MEDAL_COLORS = ['#facc15', '#94a3b8', '#b45309'];

function LeaderboardRow({
  rank,
  name,
  photoURL,
  score,
  isMe,
}: {
  rank: number;
  name: string;
  photoURL?: string | null;
  score: number;
  isMe: boolean;
}) {
  return (
    <View className={`flex-row items-center px-3 py-2 border-b border-border ${isMe ? 'bg-primary/10' : ''}`}>
      <View className="w-7 items-center mr-2">
        {rank <= 3 ? (
          <Medal size={16} color={MEDAL_COLORS[rank - 1]} />
        ) : (
          <Text className="text-xs text-muted-foreground">#{rank}</Text>
        )}
      </View>

      {photoURL ? (
        <Image source={{ uri: photoURL }} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
      ) : (
        <View className="w-7 h-7 rounded-full bg-secondary items-center justify-center mr-2">
          <Text className="text-xs font-bold text-foreground">{name[0]?.toUpperCase()}</Text>
        </View>
      )}

      <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
        {isMe ? 'You' : name}
      </Text>
      <Text className="text-sm font-semibold text-foreground">{score} pts</Text>
    </View>
  );
}

function ChallengeCard({
  challenge,
  userId,
  userName,
  userPhoto,
  onDelete,
  onScore,
}: {
  challenge: CompetitionChallenge;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  onDelete: (id: string) => void;
  onScore: (id: string) => void;
}) {
  const now = new Date();
  const end = new Date(challenge.endDate);
  const start = new Date(challenge.startDate);
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isActive = now >= start && now <= end;
  const isCreator = challenge.creatorId === userId;

  const leaderboard = [...challenge.leaderboard].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-foreground">{challenge.name}</Text>
            <Text className="text-sm text-muted-foreground mt-0.5">{challenge.description}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Badge variant={typeVariant[challenge.type]}>{challenge.type}</Badge>
            {isCreator && (
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                  Alert.alert('Delete Challenge', 'Are you sure?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => onDelete(challenge.id) },
                  ]);
                }}
              >
                <Trash2 size={16} color="#f87171" />
              </Button>
            )}
          </View>
        </View>
      </CardHeader>

      <CardContent className="gap-3">
        <View className="flex-row items-center gap-1">
          <Calendar size={14} color="#5c7a99" />
          <Text className="text-sm text-muted-foreground">
            {isActive ? `${daysLeft} days left` : now < start ? 'Not started' : 'Ended'}
          </Text>
        </View>

        {/* Leaderboard */}
        <View className="border border-border rounded-md overflow-hidden">
          <View className="flex-row items-center gap-2 px-3 py-2 bg-secondary/50">
            <Trophy size={13} color="#facc15" />
            <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Leaderboard
            </Text>
          </View>
          {leaderboard.map((entry, idx) => (
            <LeaderboardRow
              key={entry.athleteId}
              rank={idx + 1}
              name={entry.athleteId === userId ? userName : entry.athleteId}
              photoURL={entry.athleteId === userId ? userPhoto : null}
              score={entry.score}
              isMe={entry.athleteId === userId}
            />
          ))}
        </View>

        {isActive && (
          <Button variant="outline" size="sm" onPress={() => onScore(challenge.id)} className="gap-1 self-start">
            <Plus size={14} color="#5b8ee8" />
            <Text className="text-xs font-medium text-foreground">Log Progress (+1)</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const challengeTemplates = [
  { name: '7-Day Training Streak', type: 'Streak', desc: 'Train 7 days in a row' },
  { name: 'Recovery Master', type: 'Recovery', desc: 'Complete all recovery tasks for 14 days' },
  { name: 'Consistency King', type: 'Consistency', desc: 'Log activities for 30 consecutive days' },
];

function TotalLeaderboard({
  challenges,
  userId,
  userName,
  userPhoto,
}: {
  challenges: CompetitionChallenge[];
  userId: string;
  userName: string;
  userPhoto?: string | null;
}) {
  // Aggregate total points across all challenges per athleteId
  const totals: Record<string, number> = {};
  for (const challenge of challenges) {
    for (const entry of challenge.leaderboard) {
      totals[entry.athleteId] = (totals[entry.athleteId] ?? 0) + entry.score;
    }
  }

  const ranked = Object.entries(totals)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <View className="flex-row items-center gap-2">
          <Trophy size={18} color="#facc15" />
          <Text className="text-base font-semibold text-foreground">Overall Leaderboard</Text>
        </View>
        <Text className="text-xs text-muted-foreground mt-0.5">Total points across all challenges</Text>
      </CardHeader>
      <CardContent className="pt-0">
        {ranked.length === 0 ? (
          <Text className="text-sm text-muted-foreground py-4 text-center">
            No points logged yet. Start a challenge!
          </Text>
        ) : (
          <View className="border border-border rounded-md overflow-hidden">
            {ranked.map((entry, idx) => (
              <LeaderboardRow
                key={entry.id}
                rank={idx + 1}
                name={entry.id === userId ? userName : entry.id}
                photoURL={entry.id === userId ? userPhoto : null}
                score={entry.score}
                isMe={entry.id === userId}
              />
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

export default function ChallengesScreen() {
  const { user } = useAuth();
  const { athlete, challenges, addChallenge, deleteChallenge, updateChallengeScore } = useApp();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'streak' as CompetitionChallenge['type'],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const userId = athlete?.id ?? '';
  const userName = user?.displayName ?? athlete?.name ?? 'You';
  const userPhoto = user?.photoURL ?? null;

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    addChallenge({
      name: form.name,
      description: form.description,
      type: form.type,
      startDate: new Date(),
      endDate: new Date(form.endDate),
    });
    setOpen(false);
    setForm({
      name: '',
      description: '',
      type: 'streak',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const now = new Date();
  const active = challenges.filter((c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now);
  const past = challenges.filter((c) => new Date(c.endDate) < now);
  const upcoming = challenges.filter((c) => new Date(c.startDate) > now);

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Challenges</Text>
            <Text className="text-muted-foreground mt-1">Compete and stay motivated</Text>
          </View>
          <Button onPress={() => setOpen(true)} className="gap-2">
            <Plus size={16} color="#1e2d40" />
            <Text className="text-sm font-medium text-primary-foreground">Create</Text>
          </Button>
        </View>

        <Tabs defaultValue="active">
          <TabsList className="w-full">
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="gap-3 mt-4">
            {active.length === 0 ? (
              <Card>
                <CardContent className="py-8 items-center">
                  <Text className="text-muted-foreground text-sm">No active challenges. Create one!</Text>
                </CardContent>
              </Card>
            ) : (
              active.map((c) => (
                <ChallengeCard key={c.id} challenge={c} userId={userId} userName={userName} userPhoto={userPhoto}
                  onDelete={deleteChallenge} onScore={(id) => updateChallengeScore(id, 1)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="gap-3 mt-4">
            {upcoming.length === 0 ? (
              <Card>
                <CardContent className="py-8 items-center">
                  <Text className="text-muted-foreground text-sm">No upcoming challenges.</Text>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((c) => (
                <ChallengeCard key={c.id} challenge={c} userId={userId} userName={userName} userPhoto={userPhoto}
                  onDelete={deleteChallenge} onScore={(id) => updateChallengeScore(id, 1)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="gap-3 mt-4">
            {past.length === 0 ? (
              <Card>
                <CardContent className="py-8 items-center">
                  <Text className="text-muted-foreground text-sm">No completed challenges yet.</Text>
                </CardContent>
              </Card>
            ) : (
              past.map((c) => (
                <ChallengeCard key={c.id} challenge={c} userId={userId} userName={userName} userPhoto={userPhoto}
                  onDelete={deleteChallenge} onScore={(id) => updateChallengeScore(id, 1)} />
              ))
            )}
          </TabsContent>
        </Tabs>

        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Trophy size={20} color="#facc15" />
            <Text className="text-lg font-semibold text-foreground">Challenge Ideas</Text>
          </View>
          <View className="gap-3">
            {challengeTemplates.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-4">
                  <Text className="font-medium text-sm text-foreground">{t.name}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t.desc}</Text>
                  <Badge variant="outline" className="mt-2">{t.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        <TotalLeaderboard
          challenges={challenges}
          userId={userId}
          userName={userName}
          userPhoto={userPhoto}
        />
      </ScrollView>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>
        <View className="gap-4">
          <View className="gap-1">
            <Label>Challenge Name</Label>
            <Input placeholder="e.g. 30-Day Training Streak" value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
          </View>
          <View className="gap-1">
            <Label>Description</Label>
            <Textarea placeholder="What's the goal?" value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />
          </View>
          <View className="gap-1">
            <Label>Type</Label>
            <Select value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as CompetitionChallenge['type'] }))}
              options={typeOptions} />
          </View>
          <View className="gap-1">
            <Label>End Date (YYYY-MM-DD)</Label>
            <Input placeholder="2026-04-01" value={form.endDate}
              onChangeText={(v) => setForm((f) => ({ ...f, endDate: v }))} />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={() => setOpen(false)}>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Button>
          <Button onPress={handleSubmit}>
            <Text className="text-sm font-medium text-primary-foreground">Create</Text>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
