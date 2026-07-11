<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();

            $table->string('reference')->unique();

            $table->foreignId('vehicule_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('utilisateur_id')
                ->comment('Gestionnaire ayant enregistré la maintenance')
                ->constrained('utilisateurs')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('alerte_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->enum('type_maintenance', [
                'Préventive',
                'Corrective',
                'Urgente',
            ]);

            $table->string('prestataire');
            $table->text('description');

            $table->date('date_debut');
            $table->date('date_fin')->nullable();

            $table->decimal('cout', 10, 2)->default(0);
            $table->unsignedInteger('kilometrage');
            $table->date('prochaine_echeance')->nullable();

            $table->enum('statut', [
                'Planifiée',
                'En cours',
                'Terminée',
                'Annulée',
            ])->default('Planifiée');

            $table->string('facture')->nullable();
            $table->text('observations')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('vehicule_id');
            $table->index('utilisateur_id');
            $table->index('alerte_id');
            $table->index('type_maintenance');
            $table->index('statut');
            $table->index('date_debut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
