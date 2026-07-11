<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicule\StoreVehiculeRequest;
use App\Http\Requests\Vehicule\UpdateVehiculeRequest;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicule::query()->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('immatriculation', 'like', "%{$q}%")
                    ->orWhere('marque', 'like', "%{$q}%")
                    ->orWhere('modele', 'like', "%{$q}%");
            });
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreVehiculeRequest $request)
    {
        $vehicule = Vehicule::create($request->validated());

        return response()->json($vehicule, 201);
    }

    public function show(Vehicule $vehicule)
    {
        $vehicule->load([
            'missions' => fn ($q) => $q->latest()->take(10),
            'alertesOuvertes',
            'derniereMaintenance',
            'dernierPlein',
        ]);

        return response()->json($vehicule);
    }

    public function update(UpdateVehiculeRequest $request, Vehicule $vehicule)
    {
        $vehicule->update($request->validated());

        return response()->json($vehicule->fresh());
    }

    public function destroy(Vehicule $vehicule)
    {
        $vehicule->delete();

        return response()->json([
            'message' => 'Véhicule supprimé.',
        ]);
    }
}
