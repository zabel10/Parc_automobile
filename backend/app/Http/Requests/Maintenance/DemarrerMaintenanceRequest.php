<?php

namespace App\Http\Requests\Maintenance;

use Illuminate\Foundation\Http\FormRequest;

class DemarrerMaintenanceRequest extends FormRequest
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

            'date_debut' => [
                'required',
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

            'date' => 'Le champ :attribute doit être une date valide.',

            'max' => 'Le champ :attribute ne doit pas dépasser 1000 caractères.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'date_debut' => 'date de début',

            'observations' => 'observations',

        ];
    }
}