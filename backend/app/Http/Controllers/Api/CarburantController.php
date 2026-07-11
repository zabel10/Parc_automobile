<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Carburant\StoreCarburantRequest;
use App\Models\Carburant;
use App\Services\CarburantService;
use Illuminate\Http\Request;
use RuntimeException;

class CarburantController extends Controller
{
    protected CarburantService $carburantService;

    public function __construct(CarburantService $carburantService)
    {
        $this->carburantService = $carburantService;
    }

    public function index(Request $request)
    {
        $query = Carburant::with(['vehicule', 'conducteur', 'mission'])->latest();

        if ($request->filled('vehicule_id')) {
            $query->where('vehicule_id', $request->vehicule_id);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreCarburantRequest $request)
    {
        $data = $request->validated();

        // Le gestionnaire/conducteur connecté valide le plein
        $data['utilisateur_id'] = $request->user()->id;

        if ($request->hasFile('justificatif')) {
            $data['justificatif'] = $request->file('justificatif')
                ->store('carburants', 'public');
        }

        try {
            $carburant = $this->carburantService->creer($data);

            return response()->json(
                $carburant->load(['vehicule', 'conducteur', 'mission']),
                201
            );
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Carburant $carburant)
    {
        $carburant->load(['vehicule', 'conducteur', 'mission', 'utilisateur']);

        return response()->json($carburant);
    }

    public function destroy(Carburant $carburant)
    {
        $carburant->delete();

        return response()->json([
            'message' => 'Plein supprimé.',
        ]);
    }
}
