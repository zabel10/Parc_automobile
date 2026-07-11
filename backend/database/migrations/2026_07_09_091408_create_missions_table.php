<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();

            $table->string('numero_mission')->unique();

            $table->foreignId('vehicule_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('conducteur_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('utilisateur_id')
                ->comment('Gestionnaire ayant créé la mission')
                ->constrained('utilisateurs')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('lieu_depart');
            $table->string('destination');
            $table->text('motif');

            $table->dateTime('date_depart');
            $table->dateTime('date_retour_prevue');
            $table->dateTime('date_retour')->nullable();

            $table->unsignedInteger('km_depart');
            $table->unsignedInteger('km_retour')->nullable();

            $table->enum('statut', [
                'En attente',
                'Validée',
                'En cours',
                'Terminée',
                'Annulée',
            ])->default('En attente');

            $table->text('observations')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('vehicule_id');
            $table->index('conducteur_id');
            $table->index('utilisateur_id');
            $table->index('statut');
            $table->index('date_depart');
            $table->index('date_retour_prevue');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
