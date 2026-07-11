<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conducteurs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('utilisateur_id')
                ->unique()
                ->constrained('utilisateurs')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('num_permis')->unique();
            $table->string('categorie_permis', 20);
            $table->date('date_delivrance_permis');
            $table->date('date_expiration_permis');
            $table->date('date_naissance');
            $table->string('adresse')->nullable();

            $table->enum('statut', [
                'Actif',
                'Inactif',
                'Suspendu',
            ])->default('Actif');

            $table->string('contact_urgence')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conducteurs');
    }
};
