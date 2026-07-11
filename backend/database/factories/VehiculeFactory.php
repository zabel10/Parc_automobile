<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VehiculeFactory extends Factory
{
    public function definition(): array
    {
        $marques = [
            'Toyota' => ['Hilux', 'Land Cruiser', 'Corolla'],
            'Nissan' => ['Patrol', 'Navara'],
            'Ford' => ['Ranger'],
            'Mitsubishi' => ['Pajero', 'L200'],
            'Hyundai' => ['Tucson', 'H1'],
        ];

        $marque = fake()->randomElement(array_keys($marques));
        $modele = fake()->randomElement($marques[$marque]);

        return [
            'immatriculation' => strtoupper(fake()->bothify('##?? ## BF')),
            'numero_chassis' => strtoupper(fake()->bothify('CH#########')),
            'marque' => $marque,
            'modele' => $modele,
            'annee' => fake()->numberBetween(2015, 2026),
            'couleur' => fake()->randomElement(['Blanc', 'Gris', 'Noir', 'Bleu']),
            'carburant' => fake()->randomElement(['Essence', 'Diesel']),
            'kilometrage' => fake()->numberBetween(500, 120000),
            'capacite_reservoir' => fake()->randomElement([50, 60, 70, 80]),
            'consommation_moyenne' => fake()->randomFloat(2, 6, 12),
            'statut' => 'Disponible',
            'etat' => fake()->randomElement(['Excellent', 'Bon', 'Moyen']),
            'date_acquisition' => fake()->dateTimeBetween('-5 years', '-1 month'),
        ];
    }
}
