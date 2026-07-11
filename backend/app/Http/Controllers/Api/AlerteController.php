<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Alerte\ResoudreAlerteRequest;
use App\Http\Requests\Alerte\StoreAlerteRequest;
use App\Models\Alerte;
use App\Services\AlerteService;
use Illuminate\Http\Request;
use RuntimeException;

class AlerteController extends Controller
{
    protected AlerteService $alerteService;

    public function __construct(AlerteService $alerteService)
    {
        $this->alerteService = $alerteService;
    }

    public function index(Request $request)
    {
        $query = Alerte::with(['vehicule', 'conducteur', 'mission', 'maintenance'])->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('priorite')) {
            $query->where('priorite', $request->priorite);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreAlerteRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('alertes', 'public');
        }

        try {
            $alerte = $this->alerteService->creer($data);

            return response()->json(
                $alerte->load(['vehicule', 'conducteur', 'mission']),
                201
            );
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Alerte $alerte)
    {
        $alerte->load(['vehicule', 'conducteur', 'mission', 'maintenance', 'utilisateur']);

        return response()->json($alerte);
    }

    public function resoudre(ResoudreAlerteRequest $request, Alerte $alerte)
    {
        try {
            $alerte = $this->alerteService->resoudre($alerte, $request->validated());

            return response()->json($alerte->load(['vehicule', 'conducteur']));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Alerte $alerte)
    {
        $alerte->delete();

        return response()->json([
            'message' => 'Alerte supprimée.',
        ]);
    }
}
