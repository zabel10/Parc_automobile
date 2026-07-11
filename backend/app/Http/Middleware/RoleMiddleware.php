<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles
    ): Response {

        // Utilisateur non connecté
        if (!auth()->check()) {
            abort(401, 'Vous devez être connecté.');
        }

        $user = auth()->user();

        // Compte désactivé
        if ($user->statut?->value !== 'Actif') {
            abort(403, 'Votre compte est désactivé.');
        }

        // Aucun rôle demandé
        if (empty($roles)) {
            return $next($request);
        }

        // L'administrateur a toujours accès
        if ($user->role?->value === 'Administrateur') {
            return $next($request);
        }

        // Vérification du rôle
        if (!in_array($user->role?->value, $roles, true)) {
            abort(403, 'Accès refusé : rôle insuffisant.');
        }

        return $next($request);
    }
}
