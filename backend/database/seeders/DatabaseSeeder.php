<?php

namespace Database\Seeders;

use App\Models\Alerte;
use App\Models\Carburant;
use App\Models\Conducteur;
use App\Models\Maintenance;
use App\Models\Mission;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // --- Comptes de démonstration -----------------------------------

        $admin = User::create([
            'nom' => 'Zabel',
            'prenom' => 'Admin',
            'email' => 'admin@autopark.bf',
            'password' => Hash::make('password'),
            'telephone' => '+226 70 00 00 01',
            'role' => 'Administrateur',
            'statut' => 'Actif',
        ]);

        $gestionnaire = User::create([
            'nom' => 'Ouédraogo',
            'prenom' => 'Aïcha',
            'email' => 'gestionnaire@autopark.bf',
            'password' => Hash::make('password'),
            'telephone' => '+226 70 00 00 02',
            'role' => 'Gestionnaire',
            'statut' => 'Actif',
        ]);

        User::factory()->gestionnaire()->create([
            'nom' => 'Kaboré',
            'prenom' => 'Issa',
            'email' => 'issa.kabore@autopark.bf',
        ]);

        // --- Conducteurs ---------------------------------------------------

        $conducteurUsers = User::factory()
            ->conducteur()
            ->count(6)
            ->create([
                'password' => Hash::make('password'),
            ]);

        $conducteurUsers->first()->update([
            'email' => 'conducteur@autopark.bf',
            'nom' => 'Sawadogo',
            'prenom' => 'Jean',
        ]);

        $conducteurs = $conducteurUsers->map(
            fn (User $user) => Conducteur::factory()->create([
                'utilisateur_id' => $user->id,
            ])
        );

        // --- Véhicules -------------------------------------------------

        $vehicules = Vehicule::factory()->count(10)->create();

        // --- Missions, pleins, alertes, maintenances de démonstration --

        $statutsMission = ['En attente', 'Validée', 'En cours', 'Terminée'];

        for ($i = 1; $i <= 12; $i++) {
            $vehicule = $vehicules->random();
            $conducteur = $conducteurs->random();
            $depart = now()->subDays(random_int(1, 60));

            Mission::create([
                'numero_mission' => sprintf('MIS-%s-%05d', now()->year, $i),
                'vehicule_id' => $vehicule->id,
                'conducteur_id' => $conducteur->id,
                'utilisateur_id' => $gestionnaire->id,
                'lieu_depart' => 'Ouagadougou',
                'destination' => fake()->randomElement(['Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Kaya', 'Gaoua']),
                'motif' => fake()->sentence(6),
                'date_depart' => $depart,
                'date_retour_prevue' => (clone $depart)->addDays(random_int(1, 4)),
                'date_retour' => random_int(0, 1) ? (clone $depart)->addDays(random_int(1, 4)) : null,
                'km_depart' => $vehicule->kilometrage,
                'km_retour' => random_int(0, 1) ? $vehicule->kilometrage + random_int(50, 500) : null,
                'statut' => fake()->randomElement($statutsMission),
            ]);
        }

        foreach ($vehicules->random(6) as $vehicule) {
            $conducteur = $conducteurs->random();

            Carburant::create([
                'reference' => sprintf('CAR-%s-%05d', now()->year, $vehicule->id),
                'vehicule_id' => $vehicule->id,
                'conducteur_id' => $conducteur->id,
                'utilisateur_id' => $gestionnaire->id,
                'type_carburant' => $vehicule->carburant,
                'quantite_litres' => $qte = random_int(20, 70),
                'prix_litre' => $prix = 750,
                'cout_total' => $qte * $prix,
                'kilometrage' => $vehicule->kilometrage + random_int(10, 200),
                'station_service' => fake()->randomElement(['SONABHY Ouaga 2000', 'Total Zogona', 'Petrofa Patte d\'Oie']),
                'date_plein' => now()->subDays(random_int(1, 45)),
            ]);
        }

        foreach ($vehicules->random(4) as $vehicule) {
            Alerte::create([
                'reference' => sprintf('ALT-%s-%05d', now()->year, $vehicule->id),
                'vehicule_id' => $vehicule->id,
                'conducteur_id' => $conducteurs->random()->id,
                'utilisateur_id' => $gestionnaire->id,
                'type_alerte' => fake()->randomElement(['Panne', 'Vidange', 'Pneus', 'Freinage']),
                'priorite' => fake()->randomElement(['Normale', 'Haute', 'Critique']),
                'description' => fake()->sentence(10),
                'date_signalement' => now()->subDays(random_int(1, 20)),
                'statut' => fake()->randomElement(['En attente', 'En cours', 'Résolue']),
                'immobilise_vehicule' => false,
            ]);
        }

        foreach ($vehicules->random(3) as $vehicule) {
            Maintenance::create([
                'reference' => sprintf('MAI-%s-%05d', now()->year, $vehicule->id),
                'vehicule_id' => $vehicule->id,
                'utilisateur_id' => $gestionnaire->id,
                'type_maintenance' => fake()->randomElement(['Préventive', 'Corrective']),
                'prestataire' => fake()->randomElement(['Garage Faso Auto', 'CFAO Motors', 'Garage Central']),
                'description' => fake()->sentence(8),
                'date_debut' => now()->subDays(random_int(1, 30)),
                'cout' => random_int(20000, 250000),
                'kilometrage' => $vehicule->kilometrage,
                'statut' => fake()->randomElement(['Planifiée', 'En cours', 'Terminée']),
            ]);
        }

        $this->command?->info('Comptes de démonstration :');
        $this->command?->info('  Admin        : admin@autopark.bf / password');
        $this->command?->info('  Gestionnaire : gestionnaire@autopark.bf / password');
        $this->command?->info('  Conducteur   : conducteur@autopark.bf / password');
    }
}
