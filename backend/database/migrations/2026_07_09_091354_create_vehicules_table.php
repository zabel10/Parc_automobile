<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {

            $table->id();

            // Identification
            $table->string('immatriculation')->unique();
            $table->string('numero_chassis')->unique();

            // Informations générales
            $table->string('marque');
            $table->string('modele');
            $table->unsignedSmallInteger('annee');
            $table->string('couleur');

            // Caractéristiques techniques
            $table->enum('carburant', [
                'Essence',
                'Diesel',
                'Hybride',
                'Électrique',
                'GPL',
            ]);

            $table->unsignedInteger('kilometrage')->default(0);
            $table->unsignedSmallInteger('capacite_reservoir')->nullable();

            $table->decimal('consommation_moyenne', 5, 2)->nullable()
                ->comment('Consommation moyenne en L/100 km');

            // État du véhicule
            $table->enum('statut', [
                'Disponible',
                'En mission',
                'Maintenance',
                'En panne',
                'Hors service',
            ])->default('Disponible');

            $table->enum('etat', [
                'Excellent',
                'Bon',
                'Moyen',
                'Mauvais',
            ])->default('Bon');

            // Acquisition
            $table->date('date_acquisition');

            // Photo
            $table->string('photo_principale')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('marque');
            $table->index('modele');
            $table->index('statut');
            $table->index('carburant');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
