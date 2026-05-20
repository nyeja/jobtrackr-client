import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuth } from '@/context/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
    await new Promise((r) => setTimeout(r, 700))
    register(name, email, password)
    toast.success('Compte créé avec succès')
    navigate('/dashboard')
    setLoading(false)
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
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          placeholder="••••••••"
        />
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
