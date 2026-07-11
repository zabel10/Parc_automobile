<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\StatutMission;

class Mission extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'missions';

    protected $fillable = [
        'numero_mission',
        'vehicule_id',
        'conducteur_id',
        'utilisateur_id',
        'lieu_depart',
        'destination',
        'motif',
        'date_depart',
        'date_retour_prevue',
        'date_retour',
        'km_depart',
        'km_retour',
        'statut',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'statut' => StatutMission::class,
            'date_depart' => 'datetime',
            'date_retour_prevue' => 'datetime',
            'date_retour' => 'datetime',
            'km_depart' => 'integer',
            'km_retour' => 'integer',
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

    public function carburants()
    {
        return $this->hasMany(Carburant::class);
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class);
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

    public function scopeValidees($query)
    {
        return $query->where('statut', 'Validée');
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'En cours');
    }

    public function scopeTerminees($query)
    {
        return $query->where('statut', 'Terminée');
    }

    public function scopeAnnulees($query)
    {
        return $query->where('statut', 'Annulée');
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getTrajetAttribute(): string
    {
        return "{$this->lieu_depart} → {$this->destination}";
    }

    public function getDistanceParcourueAttribute(): ?int
    {
        if (is_null($this->km_retour)) {
            return null;
        }

        return $this->km_retour - $this->km_depart;
    }

    public function getEstEnRetardAttribute(): bool
    {
        if ($this->statut === 'Terminée' && $this->date_retour) {
            return $this->date_retour->greaterThan($this->date_retour_prevue);
        }

        if ($this->statut === 'En cours') {
            return now()->greaterThan($this->date_retour_prevue);
        }

        return false;
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function estEnAttente(): bool
    {
        return $this->statut === 'En attente';
    }

    public function estValidee(): bool
    {
        return $this->statut === 'Validée';
    }

    public function estEnCours(): bool
    {
        return $this->statut === 'En cours';
    }

    public function estTerminee(): bool
    {
        return $this->statut === 'Terminée';
    }

    public function estAnnulee(): bool
    {
        return $this->statut === 'Annulée';
    }

    public function coutCarburant(): float
    {
        return (float) $this->carburants()->sum('cout_total');
    }

    public function nombreAlertes(): int
    {
        return $this->alertes()->count();
    }

    public function distance(): ?int
    {
        return $this->distance_parcourue;
    }

    public function peutEtreCloturee(): bool
    {
        return $this->estEnCours()
            && !is_null($this->date_retour)
            && !is_null($this->km_retour);
    }
}