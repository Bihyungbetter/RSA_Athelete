import { View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

export function Avatar({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <View className={cn('h-10 w-10 rounded-full overflow-hidden', className)}>{children}</View>
  );
}

export function AvatarFallback({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      className={cn('h-full w-full items-center justify-center bg-primary', className)}
    >
      <Text className="text-primary-foreground font-bold">{children as string}</Text>
    </View>
  );
}
