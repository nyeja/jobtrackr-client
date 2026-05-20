import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('JobTrackr ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh items-center justify-center bg-[var(--color-surface)] p-6 dark:bg-zinc-950">
          <div className="max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertTriangle className="size-6" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Une erreur est survenue
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {this.state.message ?? 'Rechargez la page ou réessayez plus tard.'}
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/dashboard'
              }}
            >
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
