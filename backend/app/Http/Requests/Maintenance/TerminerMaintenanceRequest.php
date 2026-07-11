<?php

namespace App\Http\Requests\Maintenance;

use Illuminate\Foundation\Http\FormRequest;

class TerminerMaintenanceRequest extends FormRequest
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

            'date_fin' => [
                'required',
                'date',
            ],

            'cout' => [
                'required',
                'numeric',
                'min:0',
            ],

            'facture' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:2048',
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

            'numeric' => 'Le champ :attribute doit être un nombre.',

            'min' => 'Le champ :attribute doit être supérieur ou égal à 0.',

            'date' => 'Le champ :attribute doit être une date valide.',

            'mimes' => 'La facture doit être un fichier PDF, JPG, JPEG ou PNG.',

            'max' => 'Le fichier ne doit pas dépasser 2 Mo.',

        ];
    }

    /**
     * Nom des attributs.
     */
    public function attributes(): array
    {
        return [

            'date_fin' => 'date de fin',

            'cout' => 'coût',

            'facture' => 'facture',

            'prochaine_echeance' => 'prochaine échéance',

            'observations' => 'observations',

        ];
    }
}