import React, { createContext, useContext, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue>({ value: '', onValueChange: () => {} });

export function Tabs({
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const value = valueProp ?? internal;
  const handleChange = onValueChange ?? setInternal;

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <View className={cn('', className)}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn('flex-row bg-secondary rounded-lg p-1 gap-1', className)}
    >
      {children}
    </View>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <Pressable
      className={cn(
        'flex-1 py-2 px-3 rounded-md items-center',
        isActive ? 'bg-card' : 'bg-transparent',
        className
      )}
      onPress={() => ctx.onValueChange(value)}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {children as string}
      </Text>
    </Pressable>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <View className={cn('', className)}>{children}</View>;
}
