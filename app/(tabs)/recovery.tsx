import { useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Plus,
  Heart,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  Circle,
  CheckCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';
import { useApp } from '@/context/AppContext';
import { getRecommendedPlan } from '@/lib/recoveryPlans';

const severityVariant = {
  minor: 'secondary',
  moderate: 'default',
  severe: 'destructive',
} as const;

export default function RecoveryScreen() {
  const {
    injuries,
    addInjury,
    markRecovered,
    toggleTask,
    updateInjuryPlan,
    updateDiagnosis,
  } = useApp();
  const insets = useSafeAreaInsets();

  // Dialogs
  const [open, setOpen] = useState(false);
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState<string | null>(null);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Log injury form
  const [form, setForm] = useState({
    injuryType: '',
    dateStarted: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Diagnosis dialog state
  const [diagnosisInput, setDiagnosisInput] = useState('');

  // Add task dialog state
  const [newTaskInput, setNewTaskInput] = useState('');

  const handleSubmit = () => {
    if (!form.injuryType.trim()) return;

    addInjury({
      injuryType: form.injuryType,
      severity: 'moderate',
      dateStarted: new Date(form.dateStarted),
      notes: form.notes || undefined,
    });

    setOpen(false);
    setForm({
      injuryType: '',
      dateStarted: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleAddDiagnosis = () => {
    if (!showDiagnosisDialog || !diagnosisInput.trim()) return;
    updateDiagnosis(showDiagnosisDialog, diagnosisInput.trim());

    // Also try to auto-fill a recovery plan if the injury has none
    const injury = injuries.find((i) => i.id === showDiagnosisDialog);
    if (injury && injury.recoveryPlan.length === 0) {
      const plan = getRecommendedPlan(
        diagnosisInput.trim() || injury.injuryType,
        injury.severity
      );
      if (plan) {
        updateInjuryPlan(showDiagnosisDialog, plan.steps);
      }
    }

    setShowDiagnosisDialog(null);
    setDiagnosisInput('');
  };

  const handleAddTask = () => {
    if (!showAddTaskDialog || !newTaskInput.trim()) return;
    const injury = injuries.find((i) => i.id === showAddTaskDialog);
    if (!injury) return;
    updateInjuryPlan(showAddTaskDialog, [...injury.recoveryPlan, newTaskInput.trim()]);
    setShowAddTaskDialog(null);
    setNewTaskInput('');
  };

  const handleRemoveTask = (injuryId: string, task: string) => {
    const injury = injuries.find((i) => i.id === injuryId);
    if (!injury) return;
    updateInjuryPlan(
      injuryId,
      injury.recoveryPlan.filter((t) => t !== task)
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const active = injuries.filter((i) => !i.dateRecovered);
  const past = injuries.filter((i) => i.dateRecovered);

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Recovery</Text>
            <Text className="text-muted-foreground mt-1">Track and manage your injuries</Text>
          </View>
          <Button onPress={() => setOpen(true)} className="gap-2">
            <Plus size={16} color="#1e2d40" />
            <Text className="text-sm font-medium text-primary-foreground">Log Injury</Text>
          </Button>
        </View>

        {/* Active Recoveries */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Heart size={20} color="#f87171" />
            <Text className="text-lg font-semibold text-foreground">
              Active Recoveries ({active.length})
            </Text>
          </View>

          {active.length === 0 ? (
            <Card>
              <CardContent className="py-8 items-center">
                <Text className="text-muted-foreground text-sm">
                  No active injuries. Stay healthy!
                </Text>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-3">
              {active.map((injury) => {
                const completed = injury.completedTasks.length;
                const total = injury.recoveryPlan.length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isExpanded = expandedCards.has(injury.id);

                return (
                  <Card key={injury.id}>
                    <CardHeader className="pb-3">
                      <Pressable onPress={() => toggleExpanded(injury.id)}>
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1 mr-3">
                            <Text className="text-base font-semibold text-foreground">
                              {injury.injuryType}
                            </Text>
                            {injury.diagnosis && (
                              <View className="flex-row items-center gap-1 mt-1">
                                <Stethoscope size={12} color="#5b8ee8" />
                                <Text className="text-xs text-primary">
                                  Dx: {injury.diagnosis}
                                </Text>
                              </View>
                            )}
                            <Text className="text-xs text-muted-foreground mt-1">
                              Started: {new Date(injury.dateStarted).toLocaleDateString()}
                            </Text>
                          </View>
                          <View className="items-end gap-2">
                            <Badge variant={severityVariant[injury.severity]}>
                              {injury.severity}
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp size={16} color="#5c7a99" />
                            ) : (
                              <ChevronDown size={16} color="#5c7a99" />
                            )}
                          </View>
                        </View>
                      </Pressable>

                      {/* Progress bar (always visible) */}
                      {total > 0 && (
                        <View className="mt-3">
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-xs text-muted-foreground">
                              Recovery Progress
                            </Text>
                            <Text className="text-xs text-foreground">
                              {completed}/{total} — {progress}%
                            </Text>
                          </View>
                          <Progress value={progress} />
                        </View>
                      )}
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="gap-3">
                        {/* Diagnosis section */}
                        {!injury.diagnosis && (
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => {
                              setDiagnosisInput('');
                              setShowDiagnosisDialog(injury.id);
                            }}
                            className="flex-row gap-2 self-start"
                          >
                            <Stethoscope size={14} color="#5b8ee8" />
                            <Text className="text-xs font-medium text-foreground">
                              Add Doctor Diagnosis
                            </Text>
                          </Button>
                        )}

                        <Separator />

                        {/* Recovery Plan */}
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            <ClipboardList size={16} color="#5b8ee8" />
                            <Text className="text-sm font-semibold text-foreground">
                              Recovery Plan
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onPress={() => {
                                setNewTaskInput('');
                                setShowAddTaskDialog(injury.id);
                              }}
                            >
                              <Plus size={12} color="#e2e8f0" />
                            </Button>
                          </View>
                        </View>

                        {injury.recoveryPlan.length === 0 ? (
                          <Text className="text-xs text-muted-foreground italic">
                            No recovery plan yet. Add tasks to track your progress.
                          </Text>
                        ) : (
                          <View className="gap-2">
                            {injury.recoveryPlan.map((task) => {
                              const isDone = injury.completedTasks.includes(task);
                              return (
                                <View
                                  key={task}
                                  className="flex-row items-center justify-between"
                                >
                                  <Pressable
                                    className="flex-row items-center gap-2 flex-1 mr-2"
                                    onPress={() => toggleTask(injury.id, task)}
                                  >
                                    {isDone ? (
                                      <CheckCircle size={18} color="#5b8ee8" />
                                    ) : (
                                      <Circle size={18} color="#5c7a99" />
                                    )}
                                    <Text
                                      className={`text-sm flex-1 ${
                                        isDone
                                          ? 'line-through text-muted-foreground'
                                          : 'text-foreground'
                                      }`}
                                    >
                                      {task}
                                    </Text>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleRemoveTask(injury.id, task)}
                                    hitSlop={8}
                                  >
                                    <Trash2 size={14} color="#f87171" />
                                  </Pressable>
                                </View>
                              );
                            })}
                          </View>
                        )}

                        <Separator />

                        {/* Notes */}
                        {injury.notes && (
                          <Text className="text-sm text-muted-foreground italic">
                            "{injury.notes}"
                          </Text>
                        )}

                        {/* Actions */}
                        <View className="flex-row gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => markRecovered(injury.id)}
                            className="flex-row gap-1"
                          >
                            <CheckCircle2 size={12} color="#e2e8f0" />
                            <Text className="text-xs font-medium text-foreground">
                              Mark Recovered
                            </Text>
                          </Button>
                        </View>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        {/* Recovery History */}
        {past.length > 0 && (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Recovery History ({past.length})
            </Text>
            <View className="gap-2">
              {past.map((injury) => (
                <Card key={injury.id} className="opacity-70">
                  <CardContent className="py-3 gap-1">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground">
                          {injury.injuryType}
                        </Text>
                        {injury.diagnosis && (
                          <Text className="text-xs text-primary">Dx: {injury.diagnosis}</Text>
                        )}
                        <Text className="text-xs text-muted-foreground">
                          {new Date(injury.dateStarted).toLocaleDateString()} →{' '}
                          {injury.dateRecovered
                            ? new Date(injury.dateRecovered).toLocaleDateString()
                            : 'Ongoing'}
                        </Text>
                      </View>
                      <Badge variant={severityVariant[injury.severity]}>
                        {injury.severity}
                      </Badge>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ─── Log Injury Dialog ───────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Log New Injury</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <View className="gap-1">
            <Label>Injury Type</Label>
            <Input
              placeholder="e.g. Hamstring Strain"
              value={form.injuryType}
              onChangeText={(v) => setForm((f) => ({ ...f, injuryType: v }))}
            />
          </View>

          <View className="gap-1">
            <Label>Description</Label>
            <Textarea
              placeholder="How did it happen? Any symptoms?"
              value={form.notes}
              onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
            />
          </View>

          <View className="gap-1">
            <Label>Date Started (YYYY-MM-DD)</Label>
            <Input
              placeholder="2026-03-01"
              value={form.dateStarted}
              onChangeText={(v) => setForm((f) => ({ ...f, dateStarted: v }))}
            />
          </View>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={() => setOpen(false)}>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Button>
          <Button onPress={handleSubmit}>
            <Text className="text-sm font-medium text-primary-foreground">Save Injury</Text>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ─── Add Diagnosis Dialog ────────────────────────── */}
      <Dialog
        open={showDiagnosisDialog !== null}
        onOpenChange={(v) => !v && setShowDiagnosisDialog(null)}
      >
        <DialogHeader>
          <DialogTitle>Doctor Diagnosis</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <Text className="text-sm text-muted-foreground">
            Enter the official diagnosis from your doctor or medical professional.
          </Text>
          <View className="gap-1">
            <Label>Diagnosis</Label>
            <Input
              placeholder="e.g. Grade 2 lateral ankle sprain"
              value={diagnosisInput}
              onChangeText={setDiagnosisInput}
              autoFocus
            />
          </View>
          <Text className="text-xs text-muted-foreground">
            If a matching recovery plan is found, it will be suggested automatically.
          </Text>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={() => setShowDiagnosisDialog(null)}>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Button>
          <Button onPress={handleAddDiagnosis}>
            <Text className="text-sm font-medium text-primary-foreground">Save</Text>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ─── Add Task Dialog ─────────────────────────────── */}
      <Dialog
        open={showAddTaskDialog !== null}
        onOpenChange={(v) => !v && setShowAddTaskDialog(null)}
      >
        <DialogHeader>
          <DialogTitle>Add Recovery Task</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <View className="gap-1">
            <Label>Task</Label>
            <Input
              placeholder="e.g. Ice for 15 minutes, 3x daily"
              value={newTaskInput}
              onChangeText={setNewTaskInput}
              autoFocus
            />
          </View>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={() => setShowAddTaskDialog(null)}>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Button>
          <Button onPress={handleAddTask}>
            <Text className="text-sm font-medium text-primary-foreground">Add</Text>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
