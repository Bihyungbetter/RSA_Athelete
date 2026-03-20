import { useState } from 'react';
import { ScrollView, View, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Trash2, UserPlus, MessageCircle } from 'lucide-react-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Text } from '@/components/ui/text';
import { useApp } from '@/context/AppContext';
import * as SMS from 'expo-sms';
import type { Contact } from '@/types';

const roleOptions = [
  { value: 'friend', label: 'Friend' },
  { value: 'coach', label: 'Coach' },
  { value: 'parent', label: 'Parent' },
  { value: 'captain', label: 'Captain' },
];

const roleBadgeVariant = {
  friend: 'secondary',
  coach: 'default',
  parent: 'outline',
  captain: 'default',
} as const;

export default function ContactsScreen() {
  const { contacts, addContact, removeContact } = useApp();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    name: '',
    role: 'friend' as Contact['role'],
  });

  const handleSubmit = () => {
    if (!form.email.trim() || !form.name.trim()) return;
    addContact({
      name: form.name,
      email: form.email,
      role: form.role,
    });
    setOpen(false);
    setForm({ email: '', name: '', role: 'friend' });
  };

  const confirmRemove = (contact: Contact) => {
    Alert.alert(
      'Remove Contact',
      `Remove ${contact.name} from your contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeContact(contact.id),
        },
      ]
    );
  };

  const sendInvite = async () => {
    const available = await SMS.isAvailableAsync();
    if (!available) {
      Alert.alert('SMS Not Available', 'This device cannot send SMS messages.');
      return;
    }
    await SMS.sendSMSAsync(
      [],
      'Hey! Join me on Athlete App to track training, streaks, and challenges together. Download it here: https://athlete-app.example.com'
    );
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">Contacts</Text>
            <Text className="text-muted-foreground text-sm">
              Coaches, parents, friends & captains
            </Text>
          </View>
          <Button variant="outline" onPress={sendInvite} className="gap-2">
            <MessageCircle size={16} color="#5b8ee8" />
            <Text className="text-sm font-medium text-foreground">Invite</Text>
          </Button>
          <Button onPress={() => setOpen(true)} className="gap-2">
            <Plus size={16} color="#1e2d40" />
            <Text className="text-sm font-medium text-primary-foreground">Add</Text>
          </Button>
        </View>

        {/* Contact List */}
        {contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 items-center gap-3">
              <UserPlus size={40} color="#5c7a99" />
              <Text className="text-muted-foreground text-sm text-center">
                No contacts yet. Add coaches, parents, or{'\n'}teammates to keep them
                updated on your progress.
              </Text>
            </CardContent>
          </Card>
        ) : (
          <View className="gap-3">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="py-4 flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text className="text-base font-semibold text-foreground">
                      {contact.name}
                    </Text>
                    <Text className="text-xs text-muted-foreground">{contact.email}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Badge variant={roleBadgeVariant[contact.role]}>
                      {contact.role}
                    </Badge>
                    <Pressable
                      onPress={() => confirmRemove(contact)}
                      className="p-2"
                    >
                      <Trash2 size={16} color="#f87171" />
                    </Pressable>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Contact Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <View className="gap-1">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Coach Smith"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            />
          </View>

          <View className="gap-1">
            <Label>Email</Label>
            <Input
              placeholder="coach@example.com"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="gap-1">
            <Label>Role</Label>
            <View className="flex-row gap-2">
              {roleOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() =>
                    setForm((f) => ({ ...f, role: opt.value as Contact['role'] }))
                  }
                  className={`flex-1 items-center py-2 rounded-md border ${
                    form.role === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-input bg-input'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      form.role === opt.value
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={() => setOpen(false)}>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Button>
          <Button onPress={handleSubmit}>
            <Text className="text-sm font-medium text-primary-foreground">Add Contact</Text>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
