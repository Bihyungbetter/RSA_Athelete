import { Pressable, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('flex-row items-center justify-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary',
      outline: 'border border-border bg-transparent',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      ghost: 'bg-transparent',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 py-1',
      lg: 'h-12 px-6 py-3',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  className?: string;
}

export function Button({ variant, size, className, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
      disabled={disabled}
      {...props}
    />
  );
}
