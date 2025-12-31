import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
}

export function Button({
  className = '',
  variant = 'default',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-all disabled:opacity-50';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'hover:bg-slate-700 text-white',
    outline: 'border border-slate-600 text-white hover:bg-slate-700',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
