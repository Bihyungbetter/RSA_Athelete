import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: TextInputProps & { className?: string }) {
  return (
    <TextInput
      className={cn(
        'h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground',
        className
      )}
      placeholderTextColor="#8b9bb4"
      {...props}
    />
  );
}
