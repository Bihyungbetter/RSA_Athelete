import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, UserPlus, Trash2, LogOut, MessageCircle, Search } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Contact } from '@/types';
import * as SMS from 'expo-sms';

const ROLE_OPTIONS: { value: Contact['role']; label: string }[] = [
  { value: 'friend',  label: 'Friend' },
  { value: 'coach',   label: 'Coach' },
  { value: 'parent',  label: 'Parent' },
  { value: 'captain', label: 'Captain' },
];

const ROLE_BADGE: Record<Contact['role'], 'default' | 'secondary' | 'outline'> = {
  friend:  'secondary',
  coach:   'default',
  parent:  'outline',
  captain: 'default',
};

function Avatar({ name }: { name: string }) {
  return (
    <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
      <Text className="text-base font-bold text-primary">{name[0].toUpperCase()}</Text>
    </View>
  );
}

export default function FriendsScreen() {
  const { signOut } = useAuth();
  const { contacts, addContact, removeContact } = useApp();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'friend' as Contact['role'] });

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    addContact({ name: form.name.trim(), email: form.email.trim(), role: form.role });
    setOpen(false);
    setForm({ name: '', email: '', role: 'friend' });
  };

  const confirmRemove = (contact: Contact) => {
    Alert.alert('Remove Friend', `Remove ${contact.name} from your friends?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeContact(contact.id) },
    ]);
  };

  const handleInvite = async () => {
    const available = await SMS.isAvailableAsync();
    if (!available) {
      Alert.alert('SMS Not Available', 'This device cannot send SMS messages.');
      return;
    }
    await SMS.sendSMSAsync(
      [],
      'Hey! Join me on Athlete App to track recovery and challenges together. Download it here: https://athlete-app.example.com'
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4 gap-4">

        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Friends</Text>
            <Text className="text-sm text-muted-foreground mt-0.5">
              {contacts.length} {contacts.length === 1 ? 'person' : 'people'} added
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleInvite}
              className="flex-row items-center gap-1.5 bg-secondary rounded-xl px-3 py-2.5"
            >
              <MessageCircle size={15} color="#5b8ee8" />
              <Text className="text-sm font-medium text-foreground">Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              className="flex-row items-center gap-1.5 bg-primary rounded-xl px-3 py-2.5"
            >
              <UserPlus size={15} color="#0d1117" />
              <Text className="text-sm font-medium text-primary-foreground">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search size={16} color="#5c7a99" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search friends..."
            placeholderTextColor="#5c7a99"
            className="flex-1 text-foreground text-sm"
          />
        </View>

        {/* Friend List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-14 items-center gap-3">
                <Users size={40} color="#5c7a99" />
                <Text className="text-muted-foreground text-sm text-center">
                  {search ? 'No friends match your search.' : 'No friends yet.\nTap Add to invite someone.'}
                </Text>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-3 pb-4">
              {filtered.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="py-3.5 flex-row items-center gap-3">
                    <Avatar name={contact.name} />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{contact.name}</Text>
                      <Text className="text-xs text-muted-foreground">{contact.email}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Badge variant={ROLE_BADGE[contact.role]}>
                        <Text className="text-xs capitalize">{contact.role}</Text>
                      </Badge>
                      <Pressable onPress={() => confirmRemove(contact)} className="p-1.5">
                        <Trash2 size={15} color="#f87171" />
                      </Pressable>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="flex-row items-center justify-center gap-2 border border-destructive rounded-xl py-3.5 mb-2"
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="text-base font-semibold text-destructive">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Add Friend Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <View className="gap-1">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Alex Johnson"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            />
          </View>
          <View className="gap-1">
            <Label>Email</Label>
            <Input
              placeholder="friend@example.com"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View className="gap-1">
            <Label>Role</Label>
            <View className="flex-row gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setForm((f) => ({ ...f, role: opt.value }))}
                  className={`flex-1 items-center py-2 rounded-md border ${
                    form.role === opt.value ? 'border-primary bg-primary/10' : 'border-input bg-input'
                  }`}
                >
                  <Text className={`text-sm ${form.role === opt.value ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
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
          <Button onPress={handleAdd}>
            <Text className="text-sm font-medium text-primary-foreground">Add Friend</Text>
          </Button>
        </DialogFooter>
      </Dialog>
    </SafeAreaView>
  );
}
