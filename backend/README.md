# AutoPark — Backend (API Laravel)

API REST pour la gestion de parc automobile, consommée par le frontend React
situé dans `../frontend`.

## Installation

```bash
composer install
cp .env.example .env      # si besoin (le .env fourni est déjà prêt pour SQLite)
php artisan key:generate  # si APP_KEY est vide
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

L'API est alors disponible sur `http://127.0.0.1:8000/api`.

## Authentification

L'authentification utilise **Laravel Sanctum** en mode jetons (pas de cookies) :

```
POST /api/login        { email, password }  ->  { token, user }
GET  /api/me            (Authorization: Bearer <token>)
POST /api/logout        (Authorization: Bearer <token>)
```

Toutes les autres routes nécessitent l'en-tête :
```
Authorization: Bearer <token>
```

## Rôles

- **Administrateur** : accès total, y compris la gestion des comptes
  utilisateurs (`/api/users`).
- **Gestionnaire** : gestion des conducteurs, véhicules, missions,
  maintenances ; peut aussi enregistrer pleins et alertes.
- **Conducteur** : peut consulter les données et enregistrer ses propres
  pleins de carburant / alertes.

## Structure

- `app/Http/Controllers/Api/*` — contrôleurs REST (retournent du JSON).
- `app/Http/Requests/*` — validation des formulaires.
- `app/Services/*` — logique métier (calculs, transitions de statut,
  contrôles de cohérence).
- `app/Models/*` — modèles Eloquent (table `utilisateurs`, `conducteurs`,
  `vehicules`, `missions`, `carburants`, `alertes`, `maintenances`).
- `app/Enums/*` — enums PHP pour les statuts/rôles/types métier.
- `routes/api.php` — toutes les routes consommées par le frontend React.

## Notes

- La base par défaut est **SQLite** (`database/database.sqlite`). Pour
  utiliser MySQL/PostgreSQL, modifiez `DB_*` dans `.env` puis relancez les
  migrations.
- Les fichiers uploadés (justificatifs de carburant, photos d'alertes,
  factures de maintenance) sont stockés sur le disque `public` — pensez à
  exécuter `php artisan storage:link`.
- CORS est déjà configuré (`config/cors.php`) pour autoriser
  `http://localhost:5173` (Vite). Ajoutez vos domaines de production dans
  `CORS_ALLOWED_ORIGINS` (`.env`).
