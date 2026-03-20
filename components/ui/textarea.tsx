import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: TextInputProps & { className?: string }) {
  return (
    <TextInput
      className={cn(
        'w-full rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground min-h-[80px]',
        className
      )}
      placeholderTextColor="#8b9bb4"
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}
