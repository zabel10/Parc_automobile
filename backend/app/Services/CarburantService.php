<?php

namespace App\Services;

use App\Models\Carburant;
use App\Models\Conducteur;
use App\Models\Mission;
use App\Models\Vehicule;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CarburantService
{
    /**
     * Créer un plein de carburant.
     */
    public function creer(array $data): Carburant
    {
        return DB::transaction(function () use ($data) {

            $vehicule = Vehicule::findOrFail($data['vehicule_id']);

            $conducteur = Conducteur::findOrFail($data['conducteur_id']);

            // Vérifier le kilométrage
            if ($data['kilometrage'] < $vehicule->kilometrage) {
                throw new RuntimeException(
                    "Le kilométrage ne peut pas être inférieur au kilométrage actuel du véhicule."
                );
            }

            // Vérifier la mission si renseignée
            if (!empty($data['mission_id'])) {

                $mission = Mission::findOrFail($data['mission_id']);

                if ($mission->vehicule_id != $vehicule->id) {
                    throw new RuntimeException(
                        "Cette mission ne correspond pas au véhicule sélectionné."
                    );
                }
            }

            // Génération de la référence
            $data['reference'] = NumeroReferenceService::carburant();

            // Calcul automatique du coût total
            $data['cout_total'] = round(
                $data['quantite_litres'] * $data['prix_litre'],
                2
            );

            // Création
            $carburant = Carburant::create($data);

            // Mise à jour du kilométrage du véhicule
            $vehicule->update([
                'kilometrage' => $data['kilometrage']
            ]);

            return $carburant->fresh();
        });
    }
}