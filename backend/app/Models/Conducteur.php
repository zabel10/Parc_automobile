<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conducteur extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'conducteurs';

    protected $fillable = [
        'utilisateur_id',
        'num_permis',
        'categorie_permis',
        'date_delivrance_permis',
        'date_expiration_permis',
        'date_naissance',
        'adresse',
        'contact_urgence',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'date_delivrance_permis' => 'date',
            'date_expiration_permis' => 'date',
            'date_naissance' => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    // Un conducteur correspond à un seul utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Un conducteur peut effectuer plusieurs missions
    public function missions()
    {
        return $this->hasMany(Mission::class, 'conducteur_id');
    }

    // Un conducteur peut déclarer plusieurs pleins
    public function carburants()
    {
        return $this->hasMany(Carburant::class, 'conducteur_id');
    }

    // Un conducteur peut déclarer plusieurs alertes
    public function alertes()
    {
        return $this->hasMany(Alerte::class, 'conducteur_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActifs($query)
    {
        return $query->where('statut', 'Actif');
    }

    public function scopeSuspendus($query)
    {
        return $query->where('statut', 'Suspendu');
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getNomCompletAttribute(): string
    {
        return $this->utilisateur->nom_complet;
    }

    public function getPermisExpireAttribute(): bool
    {
        return $this->date_expiration_permis->isPast();
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function permisValide(): bool
    {
        return now()->lessThanOrEqualTo($this->date_expiration_permis);
    }

    public function peutPrendreMission(): bool
    {
        return $this->statut === 'Actif'
            && $this->permisValide();
    }
}
