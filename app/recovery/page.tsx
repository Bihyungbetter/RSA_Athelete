'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Plus, Heart, CheckCircle2 } from 'lucide-react';
import type { InjuryRecord } from '@/types';

const severityColor = {
  minor: 'secondary',
  moderate: 'default',
  severe: 'destructive',
} as const;

export default function RecoveryPage() {
  const [injuries, setInjuries] = useState<InjuryRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    injuryType: '',
    severity: 'minor' as InjuryRecord['severity'],
    dateStarted: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetch('/api/injuries')
      .then((r) => r.json())
      .then((res) => setInjuries(res.data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/injuries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.data) {
      setInjuries((prev) => [...prev, data.data]);
      setOpen(false);
      setForm({
        injuryType: '',
        severity: 'minor',
        dateStarted: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  };

  const markRecovered = async (id: string) => {
    const res = await fetch(`/api/injuries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRecovered: new Date().toISOString() }),
    });
    const data = await res.json();
    if (data.data) {
      setInjuries((prev) => prev.map((i) => (i.id === id ? data.data : i)));
    }
  };

  const active = injuries.filter((i) => !i.dateRecovered);
  const past = injuries.filter((i) => i.dateRecovered);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recovery</h1>
          <p className="text-muted-foreground mt-1">Track and manage your injuries</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Log Injury
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Injury</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="injuryType">Injury Type</Label>
                <Input
                  id="injuryType"
                  placeholder="e.g. Hamstring Strain"
                  value={form.injuryType}
                  onChange={(e) => setForm((f) => ({ ...f, injuryType: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  id="severity"
                  value={form.severity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, severity: e.target.value as InjuryRecord['severity'] }))
                  }
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateStarted">Date Started</Label>
                <Input
                  id="dateStarted"
                  type="date"
                  value={form.dateStarted}
                  onChange={(e) => setForm((f) => ({ ...f, dateStarted: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did it happen? Any symptoms?"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Injury</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Recoveries */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          Active Recoveries ({active.length})
        </h2>
        {active.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No active injuries. Stay healthy!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {active.map((injury) => {
              const completed = injury.completedTasks.length;
              const total = injury.recoveryPlan.length || 1;
              const progress = Math.round((completed / total) * 100);
              return (
                <Card key={injury.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{injury.injuryType}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {new Date(injury.dateStarted).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={severityColor[injury.severity]}>{injury.severity}</Badge>
                        <Button size="sm" variant="outline" onClick={() => markRecovered(injury.id)}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Recovered
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {injury.recoveryPlan.length > 0 && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Recovery Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="mt-2 space-y-1">
                          {injury.recoveryPlan.map((task) => (
                            <div key={task} className="flex items-center gap-2 text-sm">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${injury.completedTasks.includes(task) ? 'bg-primary' : 'bg-muted-foreground'}`}
                              />
                              <span
                                className={
                                  injury.completedTasks.includes(task)
                                    ? 'line-through text-muted-foreground'
                                    : ''
                                }
                              >
                                {task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {injury.notes && (
                      <p className="text-sm text-muted-foreground italic">&ldquo;{injury.notes}&rdquo;</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recovery History */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Recovery History ({past.length})</h2>
          <div className="space-y-2">
            {past.map((injury) => (
              <Card key={injury.id} className="opacity-70">
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{injury.injuryType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(injury.dateStarted).toLocaleDateString()} →{' '}
                      {injury.dateRecovered
                        ? new Date(injury.dateRecovered).toLocaleDateString()
                        : 'Ongoing'}
                    </p>
                  </div>
                  <Badge variant={severityColor[injury.severity]}>{injury.severity}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
