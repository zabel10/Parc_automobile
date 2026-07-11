<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\TypeCarburant;

class Carburant extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'carburants';

    protected $fillable = [
        'reference',
        'vehicule_id',
        'conducteur_id',
        'utilisateur_id',
        'mission_id',
        'type_carburant',
        'quantite_litres',
        'prix_litre',
        'cout_total',
        'kilometrage',
        'station_service',
        'date_plein',
        'justificatif',
        'observations',
    ];


    protected function casts(): array
    {
        return [
            'type_carburant' => TypeCarburant::class,
            'quantite_litres' => 'decimal:2',
            'prix_litre' => 'decimal:2',
            'cout_total' => 'decimal:2',
            'kilometrage' => 'integer',
            'date_plein' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeAujourdhui($query)
    {
        return $query->whereDate('date_plein', today());
    }

    public function scopeCeMois($query)
    {
        return $query->whereMonth('date_plein', now()->month)
                    ->whereYear('date_plein', now()->year);
    }

    public function scopeCetteAnnee($query)
    {
        return $query->whereYear('date_plein', now()->year);
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getPrixDuPleinAttribute(): string
    {
        return number_format($this->cout_total, 2, ',', ' ') . ' FCFA';
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function calculerCoutTotal(): float
    {
        return round(
            $this->quantite_litres * $this->prix_litre,
            2
        );
    }

    public function estLieAMission(): bool
    {
        return ! is_null($this->mission_id);
    }
}
