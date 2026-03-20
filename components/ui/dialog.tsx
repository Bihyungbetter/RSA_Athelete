import { Modal, Pressable, View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-center items-center px-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={() => onOpenChange(false)}
      >
        <Pressable
          className="w-full max-w-sm bg-card border border-border rounded-lg p-6"
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <View className={cn('mb-4', className)}>{children}</View>;
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)}>{children as string}</Text>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View className={cn('flex-row justify-end gap-3 mt-4', className)}>{children}</View>
  );
}
