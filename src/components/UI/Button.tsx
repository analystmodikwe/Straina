import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const base =
  'inline-flex min-h-control-touch items-center justify-center gap-2 rounded-control border border-transparent px-4 text-sm font-semibold transition-colors md:min-h-control ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-text'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border-border-control bg-surface text-secondary hover:bg-background',
  danger: 'bg-error text-white hover:brightness-90',
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
}