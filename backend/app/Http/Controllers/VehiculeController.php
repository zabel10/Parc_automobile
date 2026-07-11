<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vehicule\StoreVehiculeRequest;
use App\Http\Requests\Vehicule\UpdateVehiculeRequest;
use App\Models\Vehicule;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class VehiculeController extends Controller
{
    public function index(): View
    {
        $vehicules = Vehicule::latest()->paginate(15);

        return view('vehicules.index', compact('vehicules'));
    }

    public function create(): View
    {
        return view('vehicules.create');
    }

    public function store(StoreVehiculeRequest $request): RedirectResponse
    {
        Vehicule::create($request->validated());

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule créé avec succès.');
    }

    public function show(Vehicule $vehicule): View
    {
        return view('vehicules.show', compact('vehicule'));
    }

    public function edit(Vehicule $vehicule): View
    {
        return view('vehicules.edit', compact('vehicule'));
    }

    public function update(UpdateVehiculeRequest $request, Vehicule $vehicule): RedirectResponse
    {
        $vehicule->update($request->validated());

        return redirect()
            ->route('vehicules.show', $vehicule)
            ->with('success', 'Véhicule modifié avec succès.');
    }

    public function destroy(Vehicule $vehicule): RedirectResponse
    {
        $vehicule->delete();

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule supprimé.');
    }
}