<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicule extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vehicules';

    protected $fillable = [
        'immatriculation',
        'numero_chassis',
        'marque',
        'modele',
        'annee',
        'couleur',
        'carburant',
        'kilometrage',
        'capacite_reservoir',
        'consommation_moyenne',
        'statut',
        'etat',
        'date_acquisition',
        'photo_principale',
    ];

    protected function casts(): array
    {
        return [
            'annee' => 'integer',
            'kilometrage' => 'integer',
            'capacite_reservoir' => 'integer',
            'consommation_moyenne' => 'decimal:2',
            'date_acquisition' => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function missions()
    {
        return $this->hasMany(Mission::class);
    }

    public function carburants()
    {
        return $this->hasMany(Carburant::class);
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class);
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeDisponible($query)
    {
        return $query->where('statut', 'Disponible');
    }

    public function scopeEnMission($query)
    {
        return $query->where('statut', 'En mission');
    }

    public function scopeEnMaintenance($query)
    {
        return $query->where('statut', 'Maintenance');
    }

    public function scopeHorsService($query)
    {
        return $query->where('statut', 'Hors service');
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getNomCompletAttribute(): string
    {
        return "{$this->marque} {$this->modele}";
    }

    public function getDesignationAttribute(): string
    {
        return "{$this->marque} {$this->modele} ({$this->immatriculation})";
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function estDisponible(): bool
    {
        return $this->statut === 'Disponible';
    }

    public function estEnMission(): bool
    {
        return $this->statut === 'En mission';
    }

    public function estEnMaintenance(): bool
    {
        return $this->statut === 'Maintenance';
    }

    public function estHorsService(): bool
    {
        return $this->statut === 'Hors service';
    }

    public function peutRecevoirMission(): bool
    {
        return $this->statut === 'Disponible'
            && $this->etat !== 'Mauvais';
    }

    /*
    |--------------------------------------------------------------------------
    | Relations filtrées
    |--------------------------------------------------------------------------
    */

    public function missionEnCours()
    {
        return $this->hasOne(Mission::class)
                    ->where('statut', 'En cours');
    }

    public function alertesOuvertes()
    {
        return $this->hasMany(Alerte::class)
                    ->whereIn('statut', ['En attente', 'En cours']);
    }

    public function derniereMaintenance()
    {
        return $this->hasOne(Maintenance::class)
                    ->latest('date_debut');
    }

    public function dernierPlein()
    {
        return $this->hasOne(Carburant::class)
                    ->latest('date_plein');
    }
}
