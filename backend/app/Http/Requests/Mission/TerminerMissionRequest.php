<?php

namespace App\Http\Requests\Mission;

use Illuminate\Foundation\Http\FormRequest;

class TerminerMissionRequest extends FormRequest
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

            'date_retour' => [
                'required',
                'date',
                'after_or_equal:date_depart',
            ],

            'km_retour' => [
                'required',
                'integer',
                'gte:km_depart',
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

            'after_or_equal' => 'La date de retour doit être postérieure ou égale à la date de départ.',

            'gte' => 'Le kilométrage de retour doit être supérieur ou égal au kilométrage de départ.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'date_retour' => 'date de retour',

            'km_retour' => 'kilométrage de retour',

            'observations' => 'observations',

        ];
    }
}