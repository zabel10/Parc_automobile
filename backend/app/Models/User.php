<?php

namespace App\Models;

use App\Enums\Role;
use App\Enums\StatutUtilisateur;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'photo',
        'role',
        'statut',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'nom_complet',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
            'statut' => StatutUtilisateur::class,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function conducteur()
    {
        return $this->hasOne(Conducteur::class, 'utilisateur_id');
    }

    public function missions()
    {
        return $this->hasMany(Mission::class, 'utilisateur_id');
    }

    public function carburants()
    {
        return $this->hasMany(Carburant::class, 'utilisateur_id');
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class, 'utilisateur_id');
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class, 'utilisateur_id');
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

    /*
    |--------------------------------------------------------------------------
    | Méthodes métier
    |--------------------------------------------------------------------------
    */

    public function estAdministrateur(): bool
    {
        return $this->role === Role::ADMINISTRATEUR;
    }

    public function estGestionnaire(): bool
    {
        return $this->role === Role::GESTIONNAIRE;
    }

    public function estConducteur(): bool
    {
        return $this->role === Role::CONDUCTEUR;
    }

    public function estActif(): bool
    {
        return $this->statut === StatutUtilisateur::ACTIF;
    }

    /*
    |--------------------------------------------------------------------------
    | Accesseurs
    |--------------------------------------------------------------------------
    */

    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
