import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <View className={cn('h-2 w-full rounded-full bg-secondary overflow-hidden', className)}>
      <View
        className="h-full rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}
