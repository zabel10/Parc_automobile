<?php

namespace App\Services;

use App\Enums\StatutAlerte;
use App\Enums\StatutVehicule;
use App\Models\Alerte;
use App\Models\Mission;
use App\Models\Vehicule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AlerteService
{
    /**
     * Créer une nouvelle alerte.
     */
    public function creer(array $data): Alerte
    {
        return DB::transaction(function () use ($data) {

            $vehicule = Vehicule::findOrFail($data['vehicule_id']);

            // Vérifier la mission si elle est renseignée
            if (!empty($data['mission_id'])) {

                $mission = Mission::findOrFail($data['mission_id']);

                if ($mission->vehicule_id !== $vehicule->id) {
                    throw new RuntimeException(
                        "La mission sélectionnée ne correspond pas au véhicule."
                    );
                }
            }

            // Génération automatique
            $data['reference'] = NumeroReferenceService::alerte();

            // Utilisateur connecté
            $data['utilisateur_id'] = Auth::id();

            // Statut initial
            $data['statut'] = StatutAlerte::EN_ATTENTE;

            // Création
            $alerte = Alerte::create($data);

            // Immobilisation éventuelle
            if ($data['immobilise_vehicule']) {

                $vehicule->update([
                    'statut' => StatutVehicule::EN_PANNE,
                ]);
            }

            return $alerte->fresh();
        });
    }

    /**
     * Résoudre une alerte.
     */
    public function resoudre(Alerte $alerte, array $data): Alerte
    {
        return DB::transaction(function () use ($alerte, $data) {

            if ($alerte->statut === StatutAlerte::RESOLUE) {
                throw new RuntimeException(
                    "Cette alerte est déjà résolue."
                );
            }

            $alerte->update([
                'statut'                  => StatutAlerte::RESOLUE,
                'date_resolution'         => $data['date_resolution'],
                'commentaire_resolution'  => $data['commentaire_resolution'],
            ]);

            // Si le véhicule était immobilisé,
            // on le remet disponible.
            if ($alerte->immobilise_vehicule) {

                $alerte->vehicule->update([
                    'statut' => StatutVehicule::DISPONIBLE,
                ]);
            }

            return $alerte->fresh();
        });
    }
}