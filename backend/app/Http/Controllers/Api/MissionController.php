<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mission\StoreMissionRequest;
use App\Http\Requests\Mission\TerminerMissionRequest;
use App\Http\Requests\Mission\UpdateMissionRequest;
use App\Models\Mission;
use App\Services\MissionService;
use Illuminate\Http\Request;
use RuntimeException;

class MissionController extends Controller
{
    protected MissionService $missionService;

    public function __construct(MissionService $missionService)
    {
        $this->missionService = $missionService;
    }

    public function index(Request $request)
    {
        $query = Mission::with(['vehicule', 'conducteur', 'utilisateur'])->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    public function store(StoreMissionRequest $request)
    {
        try {
            $mission = $this->missionService->creer($request->validated());

            return response()->json(
                $mission->load(['vehicule', 'conducteur', 'utilisateur']),
                201
            );
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Mission $mission)
    {
        $mission->load(['vehicule', 'conducteur', 'utilisateur', 'carburants', 'alertes']);

        return response()->json($mission);
    }

    public function update(UpdateMissionRequest $request, Mission $mission)
    {
        $mission = $this->missionService->modifier($mission, $request->validated());

        return response()->json($mission->load(['vehicule', 'conducteur', 'utilisateur']));
    }

    public function valider(Mission $mission)
    {
        try {
            $mission = $this->missionService->valider($mission);

            return response()->json($mission->load(['vehicule', 'conducteur']));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function demarrer(Mission $mission)
    {
        try {
            $mission = $this->missionService->demarrer($mission);

            return response()->json($mission->load(['vehicule', 'conducteur']));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function terminer(TerminerMissionRequest $request, Mission $mission)
    {
        try {
            $mission = $this->missionService->terminer($mission, $request->validated());

            return response()->json($mission->load(['vehicule', 'conducteur']));
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Mission $mission)
    {
        $mission->delete();

        return response()->json([
            'message' => 'Mission supprimée.',
        ]);
    }
}
