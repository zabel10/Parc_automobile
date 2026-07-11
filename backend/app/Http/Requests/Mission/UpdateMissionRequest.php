<?php

namespace App\Http\Requests\Mission;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMissionRequest extends FormRequest
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
                'exists:vehicules,id'
            ],

            'conducteur_id' => [
                'required',
                'exists:conducteurs,id'
            ],

            'lieu_depart' => [
                'required',
                'string',
                'max:255'
            ],

            'destination' => [
                'required',
                'string',
                'max:255'
            ],

            'motif' => [
                'required',
                'string',
                'max:1000'
            ],

            'date_depart' => [
                'required',
                'date'
            ],

            'date_retour_prevue' => [
                'required',
                'date',
                'after:date_depart'
            ],

            'observations' => [
                'nullable',
                'string'
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

            'exists' => ':attribute invalide.',

            'after' => 'La date de retour prévue doit être postérieure à la date de départ.',

        ];
    }

    /**
     * Nom des champs.
     */
    public function attributes(): array
    {
        return [

            'vehicule_id' => 'véhicule',

            'conducteur_id' => 'conducteur',

            'lieu_depart' => 'lieu de départ',

            'destination' => 'destination',

            'motif' => 'motif',

            'date_depart' => 'date de départ',

            'date_retour_prevue' => 'date de retour prévue',

            'observations' => 'observations',

        ];
    }
}