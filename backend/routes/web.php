<?php

use Illuminate\Support\Facades\Route;

// use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\ConducteurController;
// use App\Http\Controllers\VehiculeController;
// use App\Http\Controllers\MissionController;
// use App\Http\Controllers\CarburantController;
// use App\Http\Controllers\AlerteController;
// use App\Http\Controllers\MaintenanceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function(){
    return response()->json(['message' => 'API Parc Automobile - ok']);
});

// Route::redirect('/', '/dashboard');

// require __DIR__.'/auth.php';

// /*
// |--------------------------------------------------------------------------
// | Routes authentifiées
// |--------------------------------------------------------------------------
// */

// Route::middleware('auth')->group(function () {

//     /*
//     |--------------------------------------------------------------------------
//     | Dashboard
//     |--------------------------------------------------------------------------
//     */

//     Route::get('/dashboard', [DashboardController::class, 'index'])
//         ->name('dashboard');

//     /*
//     |--------------------------------------------------------------------------
//     | Profil
//     |--------------------------------------------------------------------------
//     */

//     Route::get('/profile', [ProfileController::class, 'edit'])
//         ->name('profile.edit');

//     Route::put('/profile', [ProfileController::class, 'update'])
//         ->name('profile.update');
// });

// /*
// |--------------------------------------------------------------------------
// | Administrateur
// |--------------------------------------------------------------------------
// */

// Route::middleware(['auth', 'role:Administrateur'])->group(function () {

//     Route::resource('users', UserController::class);

// });

// /*
// |--------------------------------------------------------------------------
// | Gestionnaire
// |--------------------------------------------------------------------------
// */

// Route::middleware(['auth', 'role:Gestionnaire'])->group(function () {

//     Route::resource('conducteurs', ConducteurController::class);

//     Route::resource('vehicules', VehiculeController::class);

//     Route::resource('missions', MissionController::class);

//     Route::patch(
//         'missions/{mission}/valider',
//         [MissionController::class, 'valider']
//     )->name('missions.valider');

//     Route::patch(
//         'missions/{mission}/demarrer',
//         [MissionController::class, 'demarrer']
//     )->name('missions.demarrer');

//     Route::patch(
//         'missions/{mission}/terminer',
//         [MissionController::class, 'terminer']
//     )->name('missions.terminer');

//     Route::resource('maintenances', MaintenanceController::class)
//         ->except('update');

//     Route::patch(
//         'maintenances/{maintenance}/demarrer',
//         [MaintenanceController::class, 'demarrer']
//     )->name('maintenances.demarrer');

//     Route::patch(
//         'maintenances/{maintenance}/terminer',
//         [MaintenanceController::class, 'terminer']
//     )->name('maintenances.terminer');

// });

// /*
// |--------------------------------------------------------------------------
// | Conducteur
// |--------------------------------------------------------------------------
// */

// Route::middleware(['auth', 'role:Conducteur'])->group(function () {

//     Route::resource('carburants', CarburantController::class)
//         ->except([
//             'edit',
//             'update',
//         ]);

//     Route::resource('alertes', AlerteController::class)
//         ->except([
//             'update',
//         ]);

//     Route::patch(
//         'alertes/{alerte}/resoudre',
//         [AlerteController::class, 'resoudre']
//     )->name('alertes.resoudre');

// });