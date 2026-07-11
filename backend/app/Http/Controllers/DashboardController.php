<?php

namespace App\Http\Controllers;

use App\Enums\StatutAlerte;
use App\Enums\StatutMaintenance;
use App\Enums\StatutMission;
use App\Enums\StatutVehicule;
use App\Models\Alerte;
use App\Models\Carburant;
use App\Models\Maintenance;
use App\Models\Mission;
use App\Models\Vehicule;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('dashboard', [

            'vehicules' => Vehicule::count(),

            'vehiculesDisponibles' => Vehicule::where(
                'statut',
                StatutVehicule::DISPONIBLE
            )->count(),

            'vehiculesMission' => Vehicule::where(
                'statut',
                StatutVehicule::EN_MISSION
            )->count(),

            'vehiculesMaintenance' => Vehicule::where(
                'statut',
                StatutVehicule::EN_MAINTENANCE
            )->count(),

            'missionsEnCours' => Mission::where(
                'statut',
                StatutMission::EN_COURS
            )->count(),

            'alertesEnAttente' => Alerte::where(
                'statut',
                StatutAlerte::EN_ATTENTE
            )->count(),

            'maintenancesEnCours' => Maintenance::where(
                'statut',
                StatutMaintenance::EN_COURS
            )->count(),

            'coutCarburant' => Carburant::sum('cout_total'),

            'coutMaintenance' => Maintenance::sum('cout'),

            'dernieresAlertes' => Alerte::latest()
                ->take(5)
                ->get(),

            'dernieresMissions' => Mission::latest()
                ->take(5)
                ->get(),
        ]);
    }
}