<?php

namespace App\Http\Requests\Carburant;

use App\Enums\TypeCarburant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCarburantRequest extends FormRequest
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

            'mission_id' => [
                'nullable',
                'exists:missions,id',
            ],

            'type_carburant' => [
                'required',
                new Enum(TypeCarburant::class),
            ],

            'quantite_litres' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'prix_litre' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'kilometrage' => [
                'required',
                'integer',
                'min:0',
            ],

            'station_service' => [
                'required',
                'string',
                'max:255',
            ],

            'date_plein' => [
                'required',
                'date',
            ],

            'justificatif' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:2048',
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

            'gt' => 'Le champ :attribute doit être supérieur à 0.',

            'numeric' => 'Le champ :attribute doit être un nombre.',

            'mimes' => 'Le justificatif doit être un PDF ou une image.',

            'max' => 'Le fichier ne doit pas dépasser 2 Mo.',

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

            'mission_id' => 'mission',

            'type_carburant' => 'type de carburant',

            'quantite_litres' => 'quantité',

            'prix_litre' => 'prix au litre',

            'kilometrage' => 'kilométrage',

            'station_service' => 'station-service',

            'date_plein' => 'date du plein',

            'justificatif' => 'justificatif',

            'observations' => 'observations',

        ];
    }
}