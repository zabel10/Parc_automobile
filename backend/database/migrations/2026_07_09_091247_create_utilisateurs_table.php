<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('photo')->nullable();
            $table->string('password');

            $table->enum('role', [
                'Administrateur',
                'Gestionnaire',
                'Conducteur',
            ])->default('Conducteur');

            $table->enum('statut', [
                'Actif',
                'Inactif',
                'Suspendu',
            ])->default('Actif');

            $table->rememberToken();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
