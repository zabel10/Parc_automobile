<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Conducteur\StoreConducteurRequest;
use App\Http\Requests\Conducteur\UpdateConducteurRequest;
use App\Models\Conducteur;
use Illuminate\Http\Request;

class ConducteurController extends Controller
{
    public function index(Request $request)
    {
        $query = Conducteur::with('utilisateur')->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreConducteurRequest $request)
    {
        $conducteur = Conducteur::create($request->validated());

        return response()->json($conducteur->load('utilisateur'), 201);
    }

    public function show(Conducteur $conducteur)
    {
        $conducteur->load(['utilisateur', 'missions', 'alertes', 'carburants']);

        return response()->json($conducteur);
    }

    public function update(UpdateConducteurRequest $request, Conducteur $conducteur)
    {
        $conducteur->update($request->validated());

        return response()->json($conducteur->fresh()->load('utilisateur'));
    }

    public function destroy(Conducteur $conducteur)
    {
        $conducteur->delete();

        return response()->json([
            'message' => 'Conducteur supprimé.',
        ]);
    }
}
