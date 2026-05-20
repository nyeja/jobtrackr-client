import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { cn } from '@/utils/cn'

export function SettingsPage() {
  usePageMeta('Paramètres', 'Profil et préférences')
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [compact, setCompact] = useState(false)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    toast.success('Profil mis à jour (simulation)')
  }

  const savePassword = (e: FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      toast.error('Remplissez les deux champs mot de passe')
      return
    }
    toast.success('Mot de passe mis à jour (simulation)')
    setCurrentPassword('')
    setNewPassword('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Informations du profil
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Mettez à jour vos informations personnelles.
        </p>
        <form onSubmit={saveProfile} className="mt-6 max-w-md space-y-4">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Mot de passe
        </h3>
        <form onSubmit={savePassword} className="mt-6 max-w-md space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Mettre à jour le mot de passe
          </Button>
        </form>
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
                toast.message(e.target.checked ? 'Vue compacte activée' : 'Vue standard')
              }}
              className="size-5 rounded-md border-zinc-300 text-violet-600 focus:ring-violet-500/30"
            />
          </label>
        </div>
      </Card>
    </div>
  )
}
