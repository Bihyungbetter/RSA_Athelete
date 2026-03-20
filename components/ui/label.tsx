import { Text } from 'react-native';
import { cn } from '@/lib/utils';

export function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Text className={cn('text-sm font-medium text-foreground mb-1', className)}>
      {children as string}
    </Text>
  );
}
