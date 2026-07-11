<?php

namespace App\Http\Controllers;

use App\Http\Requests\Conducteur\StoreConducteurRequest;
use App\Http\Requests\Conducteur\UpdateConducteurRequest;
use App\Models\Conducteur;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ConducteurController extends Controller
{
    public function index(): View
    {
        $conducteurs = Conducteur::latest()->paginate(15);

        return view('conducteurs.index', compact('conducteurs'));
    }

    public function create(): View
    {
        return view('conducteurs.create');
    }

    public function store(StoreConducteurRequest $request): RedirectResponse
    {
        Conducteur::create($request->validated());

        return redirect()
            ->route('conducteurs.index')
            ->with('success', 'Conducteur créé.');
    }

    public function show(Conducteur $conducteur): View
    {
        return view('conducteurs.show', compact('conducteur'));
    }

    public function edit(Conducteur $conducteur): View
    {
        return view('conducteurs.edit', compact('conducteur'));
    }

    public function update(UpdateConducteurRequest $request, Conducteur $conducteur): RedirectResponse
    {
        $conducteur->update($request->validated());

        return redirect()
            ->route('conducteurs.show', $conducteur)
            ->with('success', 'Conducteur modifié.');
    }

    public function destroy(Conducteur $conducteur): RedirectResponse
    {
        $conducteur->delete();

        return redirect()
            ->route('conducteurs.index')
            ->with('success', 'Conducteur supprimé.');
    }
}