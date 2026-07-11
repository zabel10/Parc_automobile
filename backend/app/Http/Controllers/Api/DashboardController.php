<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutAlerte;
use App\Enums\StatutMaintenance;
use App\Enums\StatutMission;
use App\Enums\StatutVehicule;
use App\Http\Controllers\Controller;
use App\Models\Alerte;
use App\Models\Carburant;
use App\Models\Maintenance;
use App\Models\Mission;
use App\Models\Vehicule;

class DashboardController extends Controller
{
    /**
     * Statistiques globales pour le tableau de bord React.
     */
    public function index()
    {
        return response()->json([

            'vehicules' => Vehicule::count(),
            'vehiculesDisponibles' => Vehicule::where('statut', StatutVehicule::DISPONIBLE)->count(),
            'vehiculesMission' => Vehicule::where('statut', StatutVehicule::EN_MISSION)->count(),
            'vehiculesMaintenance' => Vehicule::where('statut', StatutVehicule::EN_MAINTENANCE)->count(),

            'missionsEnCours' => Mission::where('statut', StatutMission::EN_COURS)->count(),
            'missionsEnAttente' => Mission::where('statut', StatutMission::EN_ATTENTE)->count(),
            'missionsTerminees' => Mission::where('statut', StatutMission::TERMINEE)->count(),

            'alertesEnAttente' => Alerte::where('statut', StatutAlerte::EN_ATTENTE)->count(),
            'alertesCritiques' => Alerte::where('priorite', 'Critique')->whereNot('statut', StatutAlerte::RESOLUE)->count(),

            'maintenancesEnCours' => Maintenance::where('statut', StatutMaintenance::EN_COURS)->count(),
            'maintenancesPlanifiees' => Maintenance::where('statut', StatutMaintenance::PLANIFIEE)->count(),

            'coutCarburant' => (float) Carburant::sum('cout_total'),
            'coutMaintenance' => (float) Maintenance::sum('cout'),

            'evolutionMissions' => Mission::selectRaw("strftime('%Y-%m', date_depart) as mois, count(*) as total")
                ->groupBy('mois')
                ->orderBy('mois')
                ->limit(6)
                ->get(),

            'evolutionCarburant' => Carburant::selectRaw("strftime('%Y-%m', date_plein) as mois, sum(cout_total) as total")
                ->groupBy('mois')
                ->orderBy('mois')
                ->limit(6)
                ->get(),

            'dernieresAlertes' => Alerte::with(['vehicule', 'conducteur'])
                ->latest()
                ->take(5)
                ->get(),

            'dernieresMissions' => Mission::with(['vehicule', 'conducteur'])
                ->latest()
                ->take(5)
                ->get(),

            'prochainesMaintenances' => Maintenance::with('vehicule')
                ->whereNotNull('prochaine_echeance')
                ->where('prochaine_echeance', '>=', now())
                ->orderBy('prochaine_echeance')
                ->take(5)
                ->get(),
        ]);
    }
}
