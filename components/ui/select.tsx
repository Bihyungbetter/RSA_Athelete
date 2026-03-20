import React, { useState } from 'react';
import { View, Pressable, Modal, FlatList } from 'react-native';
import { Text } from './text';
import { ChevronDown, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        className={cn(
          'flex-row items-center justify-between h-10 px-3 rounded-md border border-input bg-input',
          className
        )}
        onPress={() => setOpen(true)}
      >
        <Text className={cn('text-sm', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color="#8b9bb4" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="bg-card border-t border-border rounded-t-2xl pt-2 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="w-10 h-1 rounded-full bg-border self-center mb-4" />
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row items-center justify-between px-6 py-4 active:bg-accent"
                  onPress={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    className={cn(
                      'text-base',
                      value === item.value ? 'text-primary font-medium' : 'text-foreground'
                    )}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={16} color="#5b8ee8" />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
