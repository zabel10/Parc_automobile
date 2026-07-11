<?php

namespace App\Http\Requests\Vehicule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\StatutVehicule;

class UpdateVehiculeRequest extends FormRequest
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

            'immatriculation' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vehicules', 'immatriculation')
                    ->ignore($this->vehicule),
            ],

            'numero_chassis' => [
                'required',
                'string',
                'max:100',
                Rule::unique('vehicules', 'numero_chassis')
                    ->ignore($this->vehicule),
            ],

            'marque' => [
                'required',
                'string',
                'max:100',
            ],

            'modele' => [
                'required',
                'string',
                'max:100',
            ],

            'annee' => [
                'required',
                'integer',
                'between:1990,' . (date('Y') + 1),
            ],

            'couleur' => [
                'nullable',
                'string',
                'max:50',
            ],

            'carburant' => [
                'required',
                'string',
                'max:50',
            ],

            'kilometrage' => [
                'required',
                'numeric',
                'min:0',
            ],

            'date_acquisition' => [
                'nullable',
                'date',
            ],

            'statut' => [
                'required',
                Rule::enum(StatutVehicule::class),
            ],
        ];
    }
}