import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-foreground hover:bg-secondary/80',
        danger: 'border-transparent bg-danger text-foreground hover:bg-danger/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
