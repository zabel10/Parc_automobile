<?php

namespace App\Services;

use App\Enums\StatutMission;
use App\Enums\StatutVehicule;
use App\Models\Conducteur;
use App\Models\Mission;
use App\Models\Vehicule;
use Illuminate\Support\Facades\DB;

class MissionService
{
    /**
     * Créer une mission.
     */
    public function creer(array $data): Mission
    {
        return DB::transaction(function () use ($data) {

            $vehicule = Vehicule::findOrFail($data['vehicule_id']);
            $conducteur = Conducteur::findOrFail($data['conducteur_id']);

            if (! $vehicule->peutRecevoirMission()) {
                throw new \RuntimeException("Le véhicule n'est pas disponible.");
            }

            if (! $conducteur->peutPrendreMission()) {
                throw new \RuntimeException("Le conducteur n'est pas disponible.");
            }

            $data['numero_mission'] = NumeroReferenceService::mission();
            $data['statut'] = StatutMission::EN_ATTENTE;

            return Mission::create($data);
        });
    }

    /**
     * Modifier une mission.
     */
    public function modifier(Mission $mission, array $data): Mission
    {
        $mission->update($data);

        return $mission->fresh();
    }

    /**
     * Valider une mission.
     */
    public function valider(Mission $mission): Mission
    {
        $mission->update([
            'statut' => StatutMission::VALIDEE,
        ]);

        return $mission->fresh();
    }

    /**
     * Démarrer une mission.
     */
    public function demarrer(Mission $mission): Mission
    {
        return DB::transaction(function () use ($mission) {

            $vehicule = $mission->vehicule;

            if (! $vehicule->peutRecevoirMission()) {
                throw new \RuntimeException("Le véhicule n'est pas disponible.");
            }

            $mission->update([
                'statut' => StatutMission::EN_COURS,
            ]);

            $vehicule->update([
                'statut' => StatutVehicule::EN_MISSION,
            ]);

            return $mission->fresh();
        });
    }

    /**
     * Terminer une mission.
     */
    public function terminer(Mission $mission, array $data): Mission
    {
        return DB::transaction(function () use ($mission, $data) {

            if ($data['km_retour'] < $mission->km_depart) {
                throw new \RuntimeException(
                    "Le kilométrage de retour ne peut pas être inférieur au kilométrage de départ."
                );
            }

            $mission->update([
                'date_retour'   => $data['date_retour'],
                'km_retour'     => $data['km_retour'],
                'observations'  => $data['observations'] ?? null,
                'statut'        => StatutMission::TERMINEE,
            ]);

            $mission->vehicule->update([
                'statut'       => StatutVehicule::DISPONIBLE,
                'kilometrage'  => $data['km_retour'],
            ]);

            return $mission->fresh();
        });
    }
}