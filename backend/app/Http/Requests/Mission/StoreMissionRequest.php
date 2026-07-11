<?php

namespace App\Http\Requests\Mission;

use Illuminate\Foundation\Http\FormRequest;

class StoreMissionRequest extends FormRequest
{
    /**
     * Déterminer si l'utilisateur est autorisé.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Le gestionnaire connecté est automatiquement l'auteur de la mission.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'utilisateur_id' => $this->user()?->id,
        ]);
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

            'utilisateur_id' => [
                'required',
                'exists:utilisateurs,id'
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

            'km_depart' => [
                'required',
                'integer',
                'min:0'
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

            'after' => 'La date de retour doit être postérieure à la date de départ.',

        ];
    }

    /**
     * Noms lisibles.
     */
    public function attributes(): array
    {
        return [

            'vehicule_id' => 'véhicule',

            'conducteur_id' => 'conducteur',

            'utilisateur_id' => 'gestionnaire',

            'lieu_depart' => 'lieu de départ',

            'destination' => 'destination',

            'motif' => 'motif',

            'date_depart' => 'date de départ',

            'date_retour_prevue' => 'date de retour prévue',

            'km_depart' => 'kilométrage de départ',

        ];
    }
}