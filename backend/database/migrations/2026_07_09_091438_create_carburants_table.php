<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carburants', function (Blueprint $table) {
            $table->id();

            $table->string('reference')->unique();

            $table->foreignId('vehicule_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('conducteur_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('utilisateur_id')
                ->comment('Gestionnaire ayant validé le plein')
                ->constrained('utilisateurs')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('mission_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->dateTime('date_plein');

            $table->enum('type_carburant', [
                'Essence',
                'Diesel',
                'Hybride',
                'Électrique',
                'GPL',
            ]);

            $table->decimal('quantite_litres', 8, 2);
            $table->decimal('prix_litre', 8, 2);
            $table->decimal('cout_total', 10, 2)->comment('Calculé automatiquement');
            $table->unsignedInteger('kilometrage');

            $table->string('station_service')->nullable();
            $table->string('justificatif')->nullable();

            $table->text('observations')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('vehicule_id');
            $table->index('conducteur_id');
            $table->index('utilisateur_id');
            $table->index('mission_id');
            $table->index('date_plein');
            $table->index('type_carburant');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carburants');
    }
};
