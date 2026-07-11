<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ConducteurController;
use App\Http\Controllers\Api\VehiculeController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\CarburantController;
use App\Http\Controllers\Api\AlerteController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes — Gestion de Parc Automobile (AutoPark)
|--------------------------------------------------------------------------
| Consommées par le front React (Vite) via des jetons Sanctum.
*/

// Authentification (publique)
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    /*
    |----------------------------------------------------------------
    | Lecture partagée : tout utilisateur authentifié et actif peut
    | consulter les listes / détails (menus des formulaires, vues
    | détail, navigation). Les écritures restent restreintes par rôle
    | ci-dessous.
    |----------------------------------------------------------------
    */
    Route::apiResource('vehicules', VehiculeController::class)->only(['index', 'show']);
    Route::apiResource('conducteurs', ConducteurController::class)->only(['index', 'show']);
    Route::apiResource('missions', MissionController::class)->only(['index', 'show']);
    Route::apiResource('maintenances', MaintenanceController::class)->only(['index', 'show']);
    Route::apiResource('carburants', CarburantController::class)->only(['index', 'show']);
    Route::apiResource('alertes', AlerteController::class)->only(['index', 'show']);

    Route::middleware('role:Administrateur,Gestionnaire')->group(function () {
        Route::apiResource('users', UserController::class)->only(['index', 'show']);
    });

    /*
    |----------------------------------------------------------------
    | Administrateur : gestion des comptes utilisateurs
    |----------------------------------------------------------------
    */
    Route::middleware('role:Administrateur')->group(function () {
        Route::apiResource('users', UserController::class)->only(['store', 'update', 'destroy']);
    });

    /*
    |----------------------------------------------------------------
    | Gestionnaire : conducteurs, véhicules, missions, maintenances
    |----------------------------------------------------------------
    */
    Route::middleware('role:Gestionnaire')->group(function () {

        Route::apiResource('conducteurs', ConducteurController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('vehicules', VehiculeController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('missions', MissionController::class)->only(['store', 'update', 'destroy']);

        Route::patch('missions/{mission}/valider', [MissionController::class, 'valider']);
        Route::patch('missions/{mission}/demarrer', [MissionController::class, 'demarrer']);
        Route::patch('missions/{mission}/terminer', [MissionController::class, 'terminer']);

        Route::apiResource('maintenances', MaintenanceController::class)->only(['store', 'destroy']);
        Route::patch('maintenances/{maintenance}/demarrer', [MaintenanceController::class, 'demarrer']);
        Route::patch('maintenances/{maintenance}/terminer', [MaintenanceController::class, 'terminer']);
    });

    /*
    |----------------------------------------------------------------
    | Gestionnaire + Conducteur : pleins de carburant et alertes terrain
    |----------------------------------------------------------------
    */
    Route::middleware('role:Gestionnaire,Conducteur')->group(function () {

        Route::apiResource('carburants', CarburantController::class)->only(['store', 'destroy']);

        Route::apiResource('alertes', AlerteController::class)->only(['store', 'destroy']);
        Route::patch('alertes/{alerte}/resoudre', [AlerteController::class, 'resoudre']);
    });
});
