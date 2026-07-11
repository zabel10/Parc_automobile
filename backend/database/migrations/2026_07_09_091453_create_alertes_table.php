<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vehicule_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('conducteur_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('utilisateur_id')
                ->nullable()
                ->comment("Gestionnaire ayant pris en charge ou clôturé l'alerte")
                ->constrained('utilisateurs')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('mission_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->string('reference')->unique();

            $table->enum('type_alerte', [
                'Panne',
                'Entretien',
                'Vidange',
                'Pneus',
                'Freinage',
                'Batterie',
                'Assurance',
                'Visite technique',
                'Accident',
                'Autre',
            ]);

            $table->enum('priorite', [
                'Faible',
                'Normale',
                'Haute',
                'Critique',
            ])->default('Normale');

            $table->text('description');
            $table->dateTime('date_signalement');

            $table->enum('statut', [
                'En attente',
                'En cours',
                'Résolue',
                'Rejetée',
            ])->default('En attente');

            $table->boolean('immobilise_vehicule')->default(false);
            $table->string('photo')->nullable();

            $table->dateTime('date_resolution')->nullable();
            $table->text('commentaire_resolution')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('vehicule_id');
            $table->index('conducteur_id');
            $table->index('utilisateur_id');
            $table->index('mission_id');
            $table->index('type_alerte');
            $table->index('priorite');
            $table->index('statut');
            $table->index('date_signalement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes');
    }
};
