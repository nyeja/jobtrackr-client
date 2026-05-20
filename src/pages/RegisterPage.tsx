import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/api'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Nom requis'
    if (!email.trim()) next.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Email invalide'
    if (!password) next.password = 'Mot de passe requis'
    else if (password.length < 6) next.password = '6 caractères minimum'
    if (password !== confirm) next.confirm = 'Les mots de passe ne correspondent pas'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password, rememberMe)
      toast.success('Compte créé avec succès')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Inscription impossible'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
          JT
        </div>
        <p className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">JobTrackr</p>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Créer un compte
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Commencez à suivre vos candidatures en quelques secondes.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Alex Martin"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="vous@exemple.com"
        />
        <PasswordInput
          label="Mot de passe"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />
        <PasswordInput
          label="Confirmer le mot de passe"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          placeholder="••••••••"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500/30"
          />
          Rester connecté après inscription
        </label>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Déjà inscrit ?{' '}
        <Link
          to="/login"
          className="font-medium text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
