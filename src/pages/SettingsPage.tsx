import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/Card'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'

export function SettingsPage() {
  usePageMeta('Paramètres', 'Profil et préférences')
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [compact, setCompact] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Informations du profil
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Données synchronisées depuis votre compte MongoDB.
        </p>
        <dl className="mt-6 max-w-md space-y-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Nom</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{user?.email}</dd>
          </div>
          {user?.createdAt ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Membre depuis
              </dt>
              <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                {formatDate(user.createdAt)}
              </dd>
            </div>
          ) : null}
        </dl>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Sécurité du compte
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Le mot de passe est hashé (bcrypt) côté serveur uniquement. La modification du profil
          via l’API sera ajoutée prochainement.
        </p>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Préférences d’interface
        </h3>
        <div className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Mode sombre</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Activez un thème adapté aux environnements peu éclairés.
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-zinc-200/80 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  theme === 'light'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-800',
                )}
              >
                <Sun className="size-4" />
                Clair
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-800',
                )}
              >
                <Moon className="size-4" />
                Sombre
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Vue compacte</p>
              <p className="text-sm text-zinc-500">Réduit les espacements dans les listes.</p>
            </div>
            <input
              type="checkbox"
              checked={compact}
              onChange={(e) => {
                setCompact(e.target.checked)
                toast(e.target.checked ? 'Vue compacte activée' : 'Vue standard')
              }}
              className="size-5 rounded-md border-zinc-300 text-violet-600 focus:ring-violet-500/30"
            />
          </label>
        </div>
      </Card>
    </div>
  )
}
