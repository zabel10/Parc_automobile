<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\TypeMaintenance;
use App\Enums\StatutMaintenance;


class Maintenance extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'maintenances';

    protected $fillable = [
        'reference',
        'vehicule_id',
        'utilisateur_id',
        'alerte_id',
        'type_maintenance',
        'prestataire',
        'description',
        'date_debut',
        'date_fin',
        'cout',
        'kilometrage',
        'prochaine_echeance',
        'statut',
        'facture',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'type_maintenance' => TypeMaintenance::class,
            'statut' => StatutMaintenance::class,
            'date_debut' => 'date',
            'date_fin' => 'date',
            'prochaine_echeance' => 'date',
            'cout' => 'decimal:2',
            'kilometrage' => 'integer',
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

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function alerte()
    {
        return $this->belongsTo(Alerte::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopePlanifiees($query)
    {
        return $query->where('statut', 'Planifiée');
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'En cours');
    }

    public function scopeTerminees($query)
    {
        return $query->where('statut', 'Terminée');
    }

    public function scopePreventives($query)
    {
        return $query->where('type_maintenance', 'Préventive');
    }

    public function scopeCorrectives($query)
    {
        return $query->where('type_maintenance', 'Corrective');
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getEstTermineeAttribute(): bool
    {
        return $this->statut === 'Terminée';
    }

    public function getDureeMaintenanceAttribute(): ?int
    {
        if (!$this->date_fin) {
            return null;
        }

        return $this->date_debut->diffInDays($this->date_fin);
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function estPlanifiee(): bool
    {
        return $this->statut === 'Planifiée';
    }

    public function estEnCours(): bool
    {
        return $this->statut === 'En cours';
    }

    public function estTerminee(): bool
    {
        return $this->statut === 'Terminée';
    }

    public function estPreventive(): bool
    {
        return $this->type_maintenance === 'Préventive';
    }

    public function estCorrective(): bool
    {
        return $this->type_maintenance === 'Corrective';
    }

    public function estUrgente(): bool
    {
        return $this->type_maintenance === 'Urgente';
    }

    public function aUneAlerte(): bool
    {
        return !is_null($this->alerte_id);
    }
}
