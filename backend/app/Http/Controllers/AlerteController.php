<?php

namespace App\Http\Controllers;

use App\Http\Requests\Alerte\ResoudreAlerteRequest;
use App\Http\Requests\Alerte\StoreAlerteRequest;
use App\Models\Alerte;
use App\Models\Mission;
use App\Models\Vehicule;
use App\Services\AlerteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AlerteController extends Controller
{
    protected AlerteService $alerteService;

    public function __construct(AlerteService $alerteService)
    {
        $this->alerteService = $alerteService;
    }

    /**
     * Liste des alertes.
     */
    public function index(): View
    {
        $alertes = Alerte::with([
            'vehicule',
            'conducteur',
            'mission',
            'maintenance'
        ])
        ->latest()
        ->paginate(15);

        return view('alertes.index', compact('alertes'));
    }

    /**
     * Formulaire de création.
     */
    public function create(): View
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        $missions = Mission::orderByDesc('date_depart')->get();

        return view('alertes.create', compact(
            'vehicules',
            'missions'
        ));
    }

    /**
     * Enregistrer une nouvelle alerte.
     */
    public function store(StoreAlerteRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')
                ->store('alertes', 'public');
        }

        $this->alerteService->creer($data);

        return redirect()
            ->route('alertes.index')
            ->with('success', 'Alerte enregistrée avec succès.');
    }

    /**
     * Afficher une alerte.
     */
    public function show(Alerte $alerte): View
    {
        $alerte->load([
            'vehicule',
            'conducteur',
            'mission',
            'maintenance'
        ]);

        return view('alertes.show', compact('alerte'));
    }

    /**
     * Formulaire de résolution.
     */
    public function edit(Alerte $alerte): View
    {
        return view('alertes.edit', compact('alerte'));
    }

    /**
     * Résoudre une alerte.
     */
    public function resoudre(
        ResoudreAlerteRequest $request,
        Alerte $alerte
    ): RedirectResponse {

        $this->alerteService->resoudre(
            $alerte,
            $request->validated()
        );

        return redirect()
            ->route('alertes.show', $alerte)
            ->with('success', 'Alerte résolue avec succès.');
    }

    /**
     * Supprimer une alerte.
     */
    public function destroy(Alerte $alerte): RedirectResponse
    {
        $alerte->delete();

        return redirect()
            ->route('alertes.index')
            ->with('success', 'Alerte supprimée avec succès.');
    }
}