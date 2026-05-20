import { cn } from '@/utils/cn'

export function PageLoader(props: { className?: string; label?: string }) {
  return <Loader {...props} />
}

export function Loader({ className, label = 'Chargement' }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <div
        className="size-9 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-600 dark:border-zinc-700 dark:border-t-violet-400"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  )
}
