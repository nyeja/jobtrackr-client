import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, error, hint, className, id, disabled, ...props }, ref) {
    const [visible, setVisible] = useState(false)
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            disabled={disabled}
            className={cn(
              'h-11 w-full rounded-xl border bg-white py-0 pl-3.5 pr-11 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500',
              error
                ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-500/50 dark:focus:border-rose-400 dark:focus:ring-rose-500/20'
                : 'border-zinc-200/80 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:focus:border-violet-500 dark:focus:ring-violet-500/20',
              disabled && 'cursor-not-allowed opacity-60',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
              disabled && 'pointer-events-none opacity-50',
            )}
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
        ) : null}
      </div>
    )
  },
)
