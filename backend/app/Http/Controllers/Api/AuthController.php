<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Connexion : retourne un jeton Sanctum à utiliser dans
     * l'en-tête "Authorization: Bearer <token>" côté front React.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Identifiants invalides.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => "L'email ou le mot de passe est incorrect.",
            ], 401);
        }

        if ($user->statut?->value !== 'Actif') {
            return response()->json([
                'message' => 'Ce compte est désactivé. Contactez un administrateur.',
            ], 403);
        }

        $token = $user->createToken('parc-auto-frontend')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'token' => $token,
            'user' => $user->load('conducteur'),
        ]);
    }

    /**
     * Déconnexion : révoque le jeton courant.
     */
    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Utilisateur actuellement connecté.
     */
    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load('conducteur')
        );
    }
}
