import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Users, ChevronRight, Settings, Shield } from 'lucide-react';
import { db } from '@/lib/db';

const menuItems = [
  { icon: User, label: 'Edit Profile', description: 'Update your personal information' },
  { icon: Bell, label: 'Notifications', description: 'Manage alerts and reminders' },
  { icon: Users, label: 'Caregivers & Team', description: 'Add coaches, parents, or captains' },
  { icon: Shield, label: 'Privacy & Security', description: 'Control your data and access' },
  { icon: Settings, label: 'App Settings', description: 'Preferences and configuration' },
];

const reminders = [
  { time: '7:00 AM', label: 'Morning workout reminder', active: true },
  { time: '8:00 PM', label: 'Log daily activities', active: true },
  { time: '10:00 PM', label: 'Sleep tracking', active: false },
];

export default function ProfilePage() {
  const athlete = db.athletes.get(db.DEFAULT_ATHLETE_ID);
  const initials = athlete?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'A';

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{athlete?.name}</h1>
              <p className="text-muted-foreground">{athlete?.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {athlete?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Streak Days', value: '7' },
          { label: 'Challenges', value: '1' },
          { label: 'Recoveries', value: '1' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Menu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {menuItems.map((item, idx) => (
            <div key={item.label}>
              <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-accent/50 transition-colors text-left">
                <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              {idx < menuItems.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.time}</p>
              </div>
              <div
                className={`h-5 w-9 rounded-full transition-colors ${r.active ? 'bg-primary' : 'bg-muted'} relative cursor-pointer`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${r.active ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
