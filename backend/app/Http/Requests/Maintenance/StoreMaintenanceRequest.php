<?php

namespace App\Http\Requests\Maintenance;

use App\Enums\TypeMaintenance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreMaintenanceRequest extends FormRequest
{
    /**
     * Déterminer si l'utilisateur est autorisé.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation.
     */
    public function rules(): array
    {
        return [

            'vehicule_id' => [
                'required',
                'exists:vehicules,id',
            ],

            'alerte_id' => [
                'nullable',
                'exists:alertes,id',
            ],

            'type_maintenance' => [
                'required',
                new Enum(TypeMaintenance::class),
            ],

            'prestataire' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
                'max:1000',
            ],

            'kilometrage' => [
                'required',
                'integer',
                'min:0',
            ],

            'prochaine_echeance' => [
                'nullable',
                'date',
            ],

            'observations' => [
                'nullable',
                'string',
                'max:1000',
            ],

        ];
    }

    /**
     * Messages personnalisés.
     */
    public function messages(): array
    {
        return [

            'required' => 'Le champ :attribute est obligatoire.',

            'exists' => 'Le :attribute sélectionné est invalide.',

            'max' => 'Le champ :attribute ne doit pas dépasser 1000 caractères.',

            'integer' => 'Le champ :attribute doit être un nombre entier.',

            'date' => 'Le champ :attribute doit être une date valide.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'vehicule_id' => 'véhicule',

            'alerte_id' => 'alerte',

            'type_maintenance' => 'type de maintenance',

            'prestataire' => 'prestataire',

            'description' => 'description',

            'kilometrage' => 'kilométrage',

            'prochaine_echeance' => 'prochaine échéance',

            'observations' => 'observations',

        ];
    }
}