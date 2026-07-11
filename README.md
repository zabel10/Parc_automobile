# AutoPark — Gestion de Parc Automobile

Application complète de gestion de parc automobile, avec **backend API Laravel**
et **frontend React** entièrement séparés.

```
parc_auto/
├── backend/     API Laravel 12 + Sanctum (SQLite par défaut)
└── frontend/    React 18 + Vite + Tailwind CSS
```

## Fonctionnalités

- Authentification par jeton (Sanctum) avec 3 rôles : **Administrateur**,
  **Gestionnaire**, **Conducteur**.
- Gestion des **véhicules** (fiche technique, statut, kilométrage, état).
- Gestion des **conducteurs** (permis, statut, coordonnées).
- Gestion des **missions** avec workflow complet : *En attente → Validée →
  En cours → Terminée*.
- Suivi des **pleins de carburant** avec justificatif (photo/PDF).
- Suivi des **maintenances** avec workflow *Planifiée → En cours → Terminée*
  et facture jointe.
- Gestion des **alertes** terrain (pannes, entretiens…) avec résolution.
- **Tableau de bord** avec statistiques et graphiques en temps réel.
- Gestion des **utilisateurs** (réservée à l'administrateur).

## Démarrage rapide

### 1. Backend (API Laravel)

```bash
cd backend
composer install
php artisan migrate --seed   # crée le schéma + comptes de démonstration
php artisan storage:link     # nécessaire pour servir les photos/justificatifs
php artisan serve            # démarre l'API sur http://127.0.0.1:8000
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev                  # démarre le front sur http://localhost:5173
```

Le fichier `frontend/.env` pointe déjà vers `http://127.0.0.1:8000/api`.
Adaptez-le si votre backend tourne ailleurs.

## Comptes de démonstration

| Rôle          | E-mail                     | Mot de passe |
|---------------|-----------------------------|--------------|
| Administrateur| admin@autopark.bf          | password     |
| Gestionnaire  | gestionnaire@autopark.bf   | password     |
| Conducteur    | conducteur@autopark.bf     | password     |

## Détails techniques

- **Backend** : Laravel 12, Sanctum (jetons Bearer), SQLite par défaut
  (facilement migrable vers MySQL/PostgreSQL via `.env`).
- **Frontend** : React 18, React Router 6, Tailwind CSS, Recharts (graphiques),
  Axios, React Toastify, Lucide Icons.
- Le front communique avec l'API exclusivement via `Authorization: Bearer
  <token>` — aucune session/cookie partagé n'est requise, ce qui permet de
  déployer le front et le back sur des domaines totalement différents.

Voir `backend/README.md` et `frontend/README.md` pour plus de détails.
