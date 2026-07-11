<?php

namespace App\Http\Requests\Alerte;

use Illuminate\Foundation\Http\FormRequest;

class ResoudreAlerteRequest extends FormRequest
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

            'commentaire_resolution' => [
                'required',
                'string',
                'max:1000',
            ],

            'date_resolution' => [
                'required',
                'date',
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

            'max' => 'Le champ :attribute ne doit pas dépasser 1000 caractères.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'commentaire_resolution' => 'commentaire de résolution',

            'date_resolution' => 'date de résolution',

        ];
    }
}