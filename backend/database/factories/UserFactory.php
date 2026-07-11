<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->numerify('+226 70 ## ## ##'),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'Conducteur',
            'statut' => 'Actif',
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => 'Administrateur']);
    }

    public function gestionnaire(): static
    {
        return $this->state(fn () => ['role' => 'Gestionnaire']);
    }

    public function conducteur(): static
    {
        return $this->state(fn () => ['role' => 'Conducteur']);
    }
}
