import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-3 shadow-sm transition-[border-color,box-shadow] focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/20',
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-zinc-400" aria-hidden />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Rechercher…'}
        className="h-full w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
        type="search"
        autoComplete="off"
      />
    </div>
  )
}
