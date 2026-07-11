<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs (paginée, recherche possible via ?q=).
     */
    public function index(Request $request)
    {
        $query = User::query()->latest();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('nom', 'like', "%{$q}%")
                    ->orWhere('prenom', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->boolean('sans_conducteur')) {
            $query->whereDoesntHave('conducteur');
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    /**
     * Créer un utilisateur (réservé à l'administrateur).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => ['required', 'string', 'max:100'],
            'prenom' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:utilisateurs,email'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:Administrateur,Gestionnaire,Conducteur'],
            'statut' => ['nullable', 'in:Actif,Inactif,Suspendu'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['password'] = Hash::make($data['password']);
        $data['statut'] = $data['statut'] ?? 'Actif';

        $user = User::create($data);

        return response()->json($user, 201);
    }

    /**
     * Afficher un utilisateur.
     */
    public function show(User $user)
    {
        return response()->json($user->load('conducteur'));
    }

    /**
     * Modifier un utilisateur (réservé à l'administrateur).
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'nom' => ['required', 'string', 'max:100'],
            'prenom' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:utilisateurs,email,' . $user->id],
            'telephone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'in:Administrateur,Gestionnaire,Conducteur'],
            'statut' => ['required', 'in:Actif,Inactif,Suspendu'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    /**
     * Supprimer un utilisateur.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé.',
        ]);
    }
}
