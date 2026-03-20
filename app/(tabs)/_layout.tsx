import { Tabs, Redirect } from 'expo-router';
import { Home, Heart, Trophy, Users } from 'lucide-react-native';
import { AppProvider } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0d1117',
            borderTopColor: '#1e2d40',
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
            paddingHorizontal: 0,
          },
          tabBarActiveTintColor: '#5b8ee8',
          tabBarInactiveTintColor: '#5c7a99',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            textAlign: 'center',
          },
          tabBarItemStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="recovery"
          options={{
            title: 'Recovery',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            title: 'Challenges',
            tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Friends',
            tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          }}
        />
        <Tabs.Screen name="contacts" options={{ tabBarButton: () => null, headerShown: false, tabBarItemStyle: { display: 'none', width: 0 } }} />
      </Tabs>
    </AppProvider>
  );
}
