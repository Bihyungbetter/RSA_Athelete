import { View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginScreen() {
  const { createAccount, signIn } = useAuth();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'create' && !displayName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'create') {
        await createAccount(email.trim(), password, displayName.trim());
      } else {
        await signIn(email.trim(), password);
      }
    } catch (e: any) {
      const code = e?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 items-center justify-center px-8">

        {/* Logo / Title */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-2xl bg-secondary items-center justify-center mb-6 border border-border">
            <Text className="text-4xl">⚡</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground mb-2">Athlete App</Text>
          <Text className="text-muted-foreground text-center">Recover. Compete. Repeat.</Text>
        </View>

        {/* Mode Toggle */}
        <View className="flex-row w-full mb-4 bg-secondary rounded-xl p-1">
          <TouchableOpacity
            onPress={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'signin' ? 'bg-background' : ''}`}
          >
            <Text className={`text-sm font-semibold ${mode === 'signin' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setMode('create'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'create' ? 'bg-background' : ''}`}
          >
            <Text className={`text-sm font-semibold ${mode === 'create' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <Card className="w-full">
          <CardContent className="pt-6 gap-3">
            {mode === 'create' && (
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Full name"
                placeholderTextColor="#5c7a99"
                autoCapitalize="words"
                className="bg-secondary rounded-lg px-4 py-3 text-foreground text-base"
              />
            )}

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#5c7a99"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-secondary rounded-lg px-4 py-3 text-foreground text-base"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#5c7a99"
              secureTextEntry
              className="bg-secondary rounded-lg px-4 py-3 text-foreground text-base"
            />

            {error && (
              <Text className="text-destructive text-sm text-center">{error}</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
              className="bg-primary rounded-lg py-3.5 items-center mt-1"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-base font-semibold text-primary-foreground">
                  {mode === 'create' ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Footer */}
        <Text className="text-muted-foreground text-xs text-center absolute bottom-10">
          By continuing, you agree to our Terms of Service
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
