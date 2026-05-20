import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next: { email?: string; password?: string } = {}
    if (!email.trim()) next.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Email invalide'
    if (!password) next.password = 'Mot de passe requis'
    else if (password.length < 6) next.password = '6 caractères minimum'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(email.trim(), password, rememberMe)
      toast.success('Connexion réussie')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Connexion impossible'))
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
        <div>
          <p className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">JobTrackr</p>
          <p className="text-xs text-zinc-500">Gestion de candidatures</p>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Bon retour
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Connectez-vous pour accéder à votre tableau de bord.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="vous@exemple.com"
        />
        <PasswordInput
          label="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500/30"
          />
          Rester connecté sur cet appareil
        </label>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Pas encore de compte ?{' '}
        <Link
          to="/register"
          className="font-medium text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
