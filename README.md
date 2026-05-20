# JobTrackr — Frontend

Application web SaaS de gestion de candidatures. Ce dépôt contient le **frontend** (React, Tailwind CSS) : interface moderne, intuitive et responsive pour suivre vos candidatures d’emploi.

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React
- Framer Motion
- Sonner (toasts)

## Fonctionnalités

- Authentification (login / register) — session simulée en local
- Dashboard avec statistiques et graphiques
- Gestion des candidatures (liste, détail, ajout / édition)
- Filtrage et recherche
- Paramètres utilisateur (profil, thème clair / sombre)
- Interface responsive (mobile / tablette / desktop)
- Notifications toast
- Prêt pour connexion API backend

## Pages principales

- Login / Register
- Dashboard
- Candidatures (liste + détail)
- Statistiques
- Paramètres

## API Backend

Le frontend pourra consommer l’API REST :

https://jobtrackr-api.onrender.com

## Installation locale

```bash
git clone https://github.com/nyeja/jobtrackr-client.git
cd jobtrackr-client
cp .env.example .env
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173).

Configurez `VITE_API_URL` (ex. `http://localhost:5000/api`) et démarrez l’API backend MongoDB.

## Déploiement Vercel

1. Importer le repo sur Vercel  
2. Variable d’environnement : `VITE_API_URL=https://votre-api.onrender.com/api`  
3. Sur Render, définir `CLIENT_URL` = URL Vercel (CORS + cookies refresh)

## Structure du projet

```
src/
├── components/
├── pages/
├── layouts/
├── routes/
├── hooks/
├── services/
├── context/
└── utils/
```

## Scripts

| Commande          | Description          |
|-------------------|----------------------|
| `npm run dev`     | Serveur de développement |
| `npm run build`   | Build production     |
| `npm run preview` | Prévisualisation     |
