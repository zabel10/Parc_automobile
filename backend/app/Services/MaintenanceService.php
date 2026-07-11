<?php

namespace App\Services;

use App\Enums\StatutAlerte;
use App\Enums\StatutMaintenance;
use App\Enums\StatutVehicule;
use App\Models\Alerte;
use App\Models\Maintenance;
use App\Models\Vehicule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MaintenanceService
{
    /**
     * Créer une maintenance.
     */
    public function creer(array $data): Maintenance
    {
        return DB::transaction(function () use ($data) {

            $vehicule = Vehicule::findOrFail($data['vehicule_id']);

            // Vérifier l'alerte
            if (!empty($data['alerte_id'])) {

                $alerte = Alerte::findOrFail($data['alerte_id']);

                if ($alerte->vehicule_id !== $vehicule->id) {
                    throw new RuntimeException(
                        "Cette alerte ne correspond pas au véhicule."
                    );
                }

                if ($alerte->statut === StatutAlerte::RESOLUE) {
                    throw new RuntimeException(
                        "Cette alerte est déjà résolue."
                    );
                }
            }

            $data['reference'] = NumeroReferenceService::maintenance();

            $data['utilisateur_id'] = Auth::id();

            $data['statut'] = StatutMaintenance::PLANIFIEE;

            $maintenance = Maintenance::create($data);

            $vehicule->update([
                'statut' => StatutVehicule::EN_MAINTENANCE,
            ]);

            return $maintenance->fresh();
        });
    }

    /**
     * Démarrer une maintenance.
     */
    public function demarrer(
        Maintenance $maintenance,
        array $data
    ): Maintenance {

        return DB::transaction(function () use ($maintenance, $data) {

            if ($maintenance->statut !== StatutMaintenance::PLANIFIEE) {
                throw new RuntimeException(
                    "Cette maintenance ne peut pas être démarrée."
                );
            }

            $maintenance->update([
                'date_debut' => $data['date_debut'],
                'observations' => $data['observations'] ?? null,
                'statut' => StatutMaintenance::EN_COURS,
            ]);

            return $maintenance->fresh();
        });
    }

    /**
     * Terminer une maintenance.
     */
    public function terminer(
        Maintenance $maintenance,
        array $data
    ): Maintenance {

        return DB::transaction(function () use ($maintenance, $data) {

            if ($maintenance->statut !== StatutMaintenance::EN_COURS) {
                throw new RuntimeException(
                    "Cette maintenance n'est pas en cours."
                );
            }

            if ($data['date_fin'] < $maintenance->date_debut) {
                throw new RuntimeException(
                    "La date de fin est invalide."
                );
            }

            $maintenance->update([
                'date_fin' => $data['date_fin'],
                'cout' => $data['cout'],
                'facture' => $data['facture'] ?? null,
                'prochaine_echeance' => $data['prochaine_echeance'] ?? null,
                'observations' => $data['observations'] ?? null,
                'statut' => StatutMaintenance::TERMINEE,
            ]);

            // Véhicule de nouveau disponible
            $maintenance->vehicule->update([
                'statut' => StatutVehicule::DISPONIBLE,
            ]);

            // Résolution automatique de l'alerte liée
            if ($maintenance->alerte) {

                $maintenance->alerte->update([
                    'statut' => StatutAlerte::RESOLUE,
                    'date_resolution' => now(),
                    'commentaire_resolution' =>
                        'Alerte résolue automatiquement après la maintenance.',
                ]);
            }

            return $maintenance->fresh();
        });
    }
}