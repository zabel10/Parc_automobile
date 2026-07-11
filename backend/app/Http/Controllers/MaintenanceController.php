<?php

namespace App\Http\Controllers;

use App\Http\Requests\Maintenance\DemarrerMaintenanceRequest;
use App\Http\Requests\Maintenance\StoreMaintenanceRequest;
use App\Http\Requests\Maintenance\TerminerMaintenanceRequest;
use App\Models\Alerte;
use App\Models\Maintenance;
use App\Models\Vehicule;
use App\Services\MaintenanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class MaintenanceController extends Controller
{
    protected MaintenanceService $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    /**
     * Liste des maintenances.
     */
    public function index(): View
    {
        $maintenances = Maintenance::with([
            'vehicule',
            'alerte',
            'utilisateur'
        ])
            ->latest()
            ->paginate(15);

        return view('maintenances.index', compact('maintenances'));
    }

    /**
     * Formulaire de création.
     */
    public function create(): View
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        $alertes = Alerte::where('statut', '!=', 'Résolue')
            ->orderByDesc('date_signalement')
            ->get();

        return view('maintenances.create', compact(
            'vehicules',
            'alertes'
        ));
    }

    /**
     * Enregistrer une maintenance.
     */
    public function store(StoreMaintenanceRequest $request): RedirectResponse
    {
        $this->maintenanceService->creer(
            $request->validated()
        );

        return redirect()
            ->route('maintenances.index')
            ->with('success', 'Maintenance créée avec succès.');
    }

    /**
     * Afficher une maintenance.
     */
    public function show(Maintenance $maintenance): View
    {
        $maintenance->load([
            'vehicule',
            'alerte',
            'utilisateur'
        ]);

        return view('maintenances.show', compact('maintenance'));
    }

    /**
     * Formulaire de démarrage.
     */
    public function edit(Maintenance $maintenance): View
    {
        return view('maintenances.edit', compact('maintenance'));
    }

    /**
     * Démarrer une maintenance.
     */
    public function demarrer(
        DemarrerMaintenanceRequest $request,
        Maintenance $maintenance
    ): RedirectResponse {

        $this->maintenanceService->demarrer(
            $maintenance,
            $request->validated()
        );

        return redirect()
            ->route('maintenances.show', $maintenance)
            ->with('success', 'Maintenance démarrée avec succès.');
    }

    /**
     * Terminer une maintenance.
     */
    public function terminer(
        TerminerMaintenanceRequest $request,
        Maintenance $maintenance
    ): RedirectResponse {

        $data = $request->validated();

        if ($request->hasFile('facture')) {
            $data['facture'] = $request->file('facture')
                ->store('maintenances', 'public');
        }

        $this->maintenanceService->terminer(
            $maintenance,
            $data
        );

        return redirect()
            ->route('maintenances.show', $maintenance)
            ->with('success', 'Maintenance terminée avec succès.');
    }

    /**
     * Supprimer une maintenance.
     */
    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $maintenance->delete();

        return redirect()
            ->route('maintenances.index')
            ->with('success', 'Maintenance supprimée avec succès.');
    }
}