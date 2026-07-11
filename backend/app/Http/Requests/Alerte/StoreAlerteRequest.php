<?php

namespace App\Http\Requests\Alerte;

use App\Enums\PrioriteAlerte;
use App\Enums\StatutAlerte;
use App\Enums\TypeAlerte;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreAlerteRequest extends FormRequest
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

            'conducteur_id' => [
                'required',
                'exists:conducteurs,id',
            ],

            // 'utilisateur_id' => [
            //     'required',
            //     'exists:users,id',
            // ],

            'mission_id' => [
                'nullable',
                'exists:missions,id',
            ],

            'type_alerte' => [
                'required',
                new Enum(TypeAlerte::class),
            ],

            'priorite' => [
                'required',
                new Enum(PrioriteAlerte::class),
            ],

            'description' => [
                'required',
                'string',
                'max:1000',
            ],

            'date_signalement' => [
                'required',
                'date',
            ],

            'immobilise_vehicule' => [
                'required',
                'boolean',
            ],

            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],

            // 'statut' => [
            //     'nullable',
            //     new Enum(StatutAlerte::class),
            // ],

            'commentaire_resolution' => [
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

            'image' => 'Le fichier doit être une image.',

            'mimes' => 'La photo doit être au format JPG, JPEG ou PNG.',

            'max' => 'La photo ne doit pas dépasser 2 Mo.',

            'boolean' => 'Le champ :attribute est invalide.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'vehicule_id' => 'véhicule',

            'conducteur_id' => 'conducteur',

            'utilisateur_id' => 'gestionnaire',

            'mission_id' => 'mission',

            'type_alerte' => 'type d\'alerte',

            'priorite' => 'priorité',

            'description' => 'description',

            'date_signalement' => 'date de signalement',

            'immobilise_vehicule' => 'immobilisation du véhicule',

            'photo' => 'photo',

            'statut' => 'statut',

            'commentaire_resolution' => 'commentaire de résolution',

        ];
    }
}