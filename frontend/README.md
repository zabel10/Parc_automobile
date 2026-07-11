# AutoPark — Frontend (React)

Interface web de gestion de parc automobile, consommant l'API Laravel
située dans `../backend`.

## Installation

```bash
npm install
npm run dev       # http://localhost:5173
```

## Configuration

Le fichier `.env` définit l'URL de l'API et du stockage de fichiers :

```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_STORAGE_URL=http://127.0.0.1:8000/storage
```

Adaptez ces valeurs si votre backend est déployé ailleurs.

## Stack technique

- **React 18** + **React Router 6**
- **Tailwind CSS** — design system cohérent (`src/index.css`)
- **Recharts** — graphiques du tableau de bord
- **Axios** — client HTTP avec injection automatique du jeton Sanctum
- **React Toastify** — notifications
- **Lucide React** — icônes

## Structure

```
src/
├── api/axios.js              Client HTTP + gestion du token
├── context/AuthContext.jsx   Authentification globale (login/logout/rôle)
├── components/               Composants réutilisables (UI, layout)
├── layouts/DashboardLayout   Structure sidebar + navbar
├── hooks/useResourceList.js  Hook générique liste paginée + filtres
├── services/                 Un service par ressource (CRUD générique)
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── utilisateurs/         Administrateur uniquement
│   ├── conducteurs/
│   ├── vehicules/
│   ├── missions/
│   ├── carburants/
│   ├── alertes/
│   └── maintenances/
└── routes/AppRoutes.jsx      Déclaration de toutes les routes + gardes de rôle
```

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build
```
