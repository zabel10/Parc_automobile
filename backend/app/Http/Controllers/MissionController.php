<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mission\StoreMissionRequest;
use App\Http\Requests\Mission\TerminerMissionRequest;
use App\Http\Requests\Mission\UpdateMissionRequest;
use App\Models\Conducteur;
use App\Models\Mission;
use App\Models\Vehicule;
use App\Services\MissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;



class MissionController extends Controller
{
    protected MissionService $missionService;

    public function __construct(MissionService $missionService)
    {
        $this->missionService = $missionService;
    }

    /**
     * Liste des missions.
     */
    public function index(): View
    {
        $missions = Mission::with([
            'vehicule',
            'conducteur',
            'utilisateur',
        ])
            ->latest()
            ->paginate(15);

        return view('missions.index', compact('missions'));
    }

    /**
     * Formulaire de création.
     */
    public function create(): View
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        $conducteurs = Conducteur::orderBy('nom')->get();

        return view('missions.create', compact(
            'vehicules',
            'conducteurs'
        ));
    }

    /**
     * Enregistrer une nouvelle mission.
     */
    public function store(StoreMissionRequest $request): RedirectResponse
    {
        $this->missionService->creer($request->validated());

        return redirect()
            ->route('missions.index')
            ->with('success', 'Mission créée avec succès.');
    }

    /**
     * Afficher une mission.
     */
    public function show(Mission $mission): View
    {
        $mission->load([
            'vehicule',
            'conducteur',
            'utilisateur',
            'carburants',
            'alertes',
        ]);

        return view('missions.show', compact('mission'));
    }

    /**
     * Formulaire de modification.
     */
    public function edit(Mission $mission): View
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        $conducteurs = Conducteur::orderBy('nom')->get();

        return view('missions.edit', compact(
            'mission',
            'vehicules',
            'conducteurs'
        ));
    }

    /**
     * Mettre à jour une mission.
     */
    public function update(
        UpdateMissionRequest $request,
        Mission $mission
    ): RedirectResponse {

        $this->missionService->modifier(
            $mission,
            $request->validated()
        );

        return redirect()
            ->route('missions.show', $mission)
            ->with('success', 'Mission modifiée avec succès.');
    }

    /**
     * Valider une mission.
     */
    public function valider(Mission $mission): RedirectResponse
    {
        $this->missionService->valider($mission);

        return redirect()
            ->route('missions.show', $mission)
            ->with('success', 'Mission validée avec succès.');
    }

    /**
     * Démarrer une mission.
     */
    public function demarrer(Mission $mission): RedirectResponse
    {
        $this->missionService->demarrer($mission);

        return redirect()
            ->route('missions.show', $mission)
            ->with('success', 'Mission démarrée avec succès.');
    }

    /**
     * Terminer une mission.
     */
    public function terminer(
        TerminerMissionRequest $request,
        Mission $mission
    ): RedirectResponse {

        $this->missionService->terminer(
            $mission,
            $request->validated()
        );

        return redirect()
            ->route('missions.show', $mission)
            ->with('success', 'Mission terminée avec succès.');
    }

    /**
     * Supprimer une mission.
     */
    public function destroy(Mission $mission): RedirectResponse
    {
        $mission->delete();

        return redirect()
            ->route('missions.index')
            ->with('success', 'Mission supprimée avec succès.');
    }
}