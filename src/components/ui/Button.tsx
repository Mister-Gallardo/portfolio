import clsx from 'clsx';
import type { ComponentProps } from 'react';

type Variant = 'solid' | 'outline';
type Size = 'md' | 'sm';

type StyleProps = { variant?: Variant; size?: Size };

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-[0.25rem] font-medium whitespace-nowrap transition-[background-color,color,border-color,scale] duration-300 ease-(--ease-out-quart) active:scale-[0.98]';

const variants: Record<Variant, string> = {
  solid: 'bg-fg text-surface hover:bg-accent hover:text-ink',
  outline: 'border border-line text-fg hover:border-fg',
};

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-small',
  sm: 'h-11 px-5 text-small',
};

const buttonClass = ({ variant = 'solid', size = 'md' }: StyleProps, className?: string) =>
  clsx(base, variants[variant], sizes[size], className);

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<'a'> & StyleProps) {
  return <a className={buttonClass({ variant, size }, className)} {...props} />;
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & StyleProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />;
}
