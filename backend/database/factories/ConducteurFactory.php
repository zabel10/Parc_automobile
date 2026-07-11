<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ConducteurFactory extends Factory
{
    public function definition(): array
    {
        return [
            'num_permis' => strtoupper(fake()->bothify('BF-#######')),
            'categorie_permis' => fake()->randomElement(['B', 'C', 'D']),
            'date_delivrance_permis' => fake()->dateTimeBetween('-10 years', '-2 years'),
            'date_expiration_permis' => fake()->dateTimeBetween('+1 year', '+5 years'),
            'date_naissance' => fake()->dateTimeBetween('-55 years', '-20 years'),
            'adresse' => fake()->address(),
            'contact_urgence' => fake()->numerify('+226 76 ## ## ##'),
            'statut' => 'Actif',
        ];
    }
}
