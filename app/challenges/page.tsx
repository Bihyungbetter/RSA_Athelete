'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Plus, Users, Calendar } from 'lucide-react';
import type { CompetitionChallenge } from '@/types';

const typeColor = {
  streak: 'default',
  consistency: 'secondary',
  recovery: 'destructive',
} as const;

function ChallengeCard({ challenge }: { challenge: CompetitionChallenge }) {
  const now = new Date();
  const end = new Date(challenge.endDate);
  const start = new Date(challenge.startDate);
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isActive = now >= start && now <= end;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{challenge.name}</CardTitle>
            <CardDescription className="mt-1">{challenge.description}</CardDescription>
          </div>
          <Badge variant={typeColor[challenge.type]}>{challenge.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {challenge.participants.length} participant{challenge.participants.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {isActive ? `${daysLeft} days left` : 'Ended'}
          </span>
        </div>
        {challenge.leaderboard.length > 0 && (
          <div className="border rounded-md divide-y divide-border">
            {challenge.leaderboard
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map((entry, idx) => (
                <div key={entry.athleteId} className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-2">#{idx + 1}</span>
                    {entry.athleteId === 'athlete-1' ? 'You' : entry.athleteId}
                  </span>
                  <span className="text-sm font-semibold">{entry.score} pts</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<CompetitionChallenge[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'streak' as CompetitionChallenge['type'],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    fetch('/api/challenges')
      .then((r) => r.json())
      .then((res) => setChallenges(res.data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.data) {
      setChallenges((prev) => [...prev, data.data]);
      setOpen(false);
      setForm({
        name: '',
        description: '',
        type: 'streak',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  };

  const now = new Date();
  const active = challenges.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );
  const past = challenges.filter((c) => new Date(c.endDate) < now);
  const upcoming = challenges.filter((c) => new Date(c.startDate) > now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground mt-1">Compete and stay motivated</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Challenge Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. 30-Day Training Streak"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's the goal?"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as CompetitionChallenge['type'],
                    }))
                  }
                >
                  <option value="streak">Streak</option>
                  <option value="consistency">Consistency</option>
                  <option value="recovery">Recovery</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Past ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {active.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No active challenges. Create one to get started!
              </CardContent>
            </Card>
          ) : (
            active.map((c) => <ChallengeCard key={c.id} challenge={c} />)
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No upcoming challenges.
              </CardContent>
            </Card>
          ) : (
            upcoming.map((c) => <ChallengeCard key={c.id} challenge={c} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No completed challenges yet.
              </CardContent>
            </Card>
          ) : (
            past.map((c) => <ChallengeCard key={c.id} challenge={c} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Available Challenge Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Challenge Ideas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: '7-Day Training Streak', type: 'Streak', desc: 'Train 7 days in a row' },
            { name: 'Recovery Master', type: 'Recovery', desc: 'Complete all recovery tasks for 14 days' },
            { name: 'Consistency King', type: 'Consistency', desc: 'Log activities for 30 consecutive days' },
          ].map((t) => (
            <Card key={t.name} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {t.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
