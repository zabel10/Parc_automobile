<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Maintenance\DemarrerMaintenanceRequest;
use App\Http\Requests\Maintenance\StoreMaintenanceRequest;
use App\Http\Requests\Maintenance\TerminerMaintenanceRequest;
use App\Models\Maintenance;
use App\Services\MaintenanceService;
use Illuminate\Http\Request;
use RuntimeException;

class MaintenanceController extends Controller
{
    protected MaintenanceService $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    public function index(Request $request)
    {
        $query = Maintenance::with(['vehicule', 'alerte', 'utilisateur'])->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreMaintenanceRequest $request)
    {
        try {
            $maintenance = $this->maintenanceService->creer($request->validated());

            return response()->json(
                $maintenance->load(['vehicule', 'alerte']),
                201
            );
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Maintenance $maintenance)
    {
        $maintenance->load(['vehicule', 'alerte', 'utilisateur']);

        return response()->json($maintenance);
    }

    public function demarrer(DemarrerMaintenanceRequest $request, Maintenance $maintenance)
    {
        try {
            $maintenance = $this->maintenanceService->demarrer($maintenance, $request->validated());

            return response()->json($maintenance->load('vehicule'));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function terminer(TerminerMaintenanceRequest $request, Maintenance $maintenance)
    {
        $data = $request->validated();

        if ($request->hasFile('facture')) {
            $data['facture'] = $request->file('facture')->store('maintenances', 'public');
        }

        try {
            $maintenance = $this->maintenanceService->terminer($maintenance, $data);

            return response()->json($maintenance->load(['vehicule', 'alerte']));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Maintenance $maintenance)
    {
        $maintenance->delete();

        return response()->json([
            'message' => 'Maintenance supprimée.',
        ]);
    }
}
