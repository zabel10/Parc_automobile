<?php

namespace App\Http\Controllers;

use App\Http\Requests\Carburant\StoreCarburantRequest;
use App\Models\Carburant;
use App\Models\Mission;
use App\Models\Vehicule;
use App\Services\CarburantService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class CarburantController extends Controller
{
    protected CarburantService $carburantService;

    public function __construct(CarburantService $carburantService)
    {
        $this->carburantService = $carburantService;
    }

    /**
     * Liste des pleins de carburant.
     */
    public function index(): View
    {
        $carburants = Carburant::with([
            'vehicule',
            'conducteur',
            'mission'
        ])
        ->latest()
        ->paginate(15);

        return view('carburants.index', compact('carburants'));
    }

    /**
     * Formulaire de création.
     */
    public function create(): View
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        $missions = Mission::where('statut', 'En cours')
            ->orderByDesc('date_depart')
            ->get();

        return view('carburants.create', compact(
            'vehicules',
            'missions'
        ));
    }

    /**
     * Enregistrer un plein.
     */
    public function store(StoreCarburantRequest $request): RedirectResponse
    {
        $this->carburantService->creer(
            $request->validated()
        );

        return redirect()
            ->route('carburants.index')
            ->with('success', 'Plein de carburant enregistré avec succès.');
    }

    /**
     * Afficher un plein.
     */
    public function show(Carburant $carburant): View
    {
        $carburant->load([
            'vehicule',
            'conducteur',
            'mission'
        ]);

        return view('carburants.show', compact('carburant'));
    }

    /**
     * Supprimer un plein.
     */
    public function destroy(Carburant $carburant): RedirectResponse
    {
        $carburant->delete();

        return redirect()
            ->route('carburants.index')
            ->with('success', 'Plein supprimé avec succès.');
    }
}