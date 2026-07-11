<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\StatutAlerte;
use App\Enums\PrioriteAlerte;


class Alerte extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'alertes';

    protected $fillable = [
        'reference',
        'vehicule_id',
        'conducteur_id',
        'utilisateur_id',
        'mission_id',
        'type_alerte',
        'priorite',
        'description',
        'date_signalement',
        'statut',
        'immobilise_vehicule',
        'photo',
        'date_resolution',
        'commentaire_resolution',
    ];

    protected function casts(): array
    {
        return [
            'statut' => StatutAlerte::class,
            'priorite' => PrioriteAlerte::class,
            'date_signalement' => 'datetime',
            'date_resolution' => 'datetime',
            'immobilise_vehicule' => 'boolean',
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

    public function maintenance()
    {
        return $this->hasOne(Maintenance::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'En attente');
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'En cours');
    }

    public function scopeResolues($query)
    {
        return $query->where('statut', 'Résolue');
    }

    public function scopeCritiques($query)
    {
        return $query->where('priorite', 'Critique');
    }

    public function scopeVehiculesImmobilises($query)
    {
        return $query->where('immobilise_vehicule', true);
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getEstResolueAttribute(): bool
    {
        return $this->statut === 'Résolue';
    }

    public function getTempsResolutionAttribute(): ?int
    {
        if (!$this->date_resolution) {
            return null;
        }

        return $this->date_signalement
            ->diffInDays($this->date_resolution);
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function estCritique(): bool
    {
        return $this->priorite === 'Critique';
    }

    public function estEnCours(): bool
    {
        return $this->statut === 'En cours';
    }

    public function estEnAttente(): bool
    {
        return $this->statut === 'En attente';
    }

    public function estResolue(): bool
    {
        return $this->statut === 'Résolue';
    }

    public function immobiliseVehicule(): bool
    {
        return $this->immobilise_vehicule;
    }

    public function aUneMaintenance(): bool
    {
        return $this->maintenance()->exists();
    }
}
