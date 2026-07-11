<?php

namespace App\Http\Requests\Conducteur;

use App\Enums\StatutConducteur;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateConducteurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'utilisateur_id' => [
                'required',
                'exists:utilisateurs,id',
                Rule::unique('conducteurs', 'utilisateur_id')
                    ->ignore($this->route('conducteur')),
            ],

            'num_permis' => [
                'required',
                'string',
                'max:100',
                Rule::unique('conducteurs', 'num_permis')
                    ->ignore($this->route('conducteur')),
            ],

            'categorie_permis' => [
                'required',
                'string',
                'max:10',
            ],

            'date_delivrance_permis' => [
                'required',
                'date',
            ],

            'date_expiration_permis' => [
                'required',
                'date',
                'after:date_delivrance_permis',
            ],

            'date_naissance' => [
                'required',
                'date',
                'before:-18 years',
            ],

            'adresse' => [
                'nullable',
                'string',
                'max:255',
            ],

            'contact_urgence' => [
                'nullable',
                'string',
                'max:50',
            ],

            'statut' => [
                'nullable',
                new Enum(StatutConducteur::class),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'exists' => 'Le :attribute sélectionné est invalide.',
            'unique' => 'Ce :attribute est déjà utilisé.',
            'before' => 'Le conducteur doit avoir au moins 18 ans.',
            'after' => "La date d'expiration doit être postérieure à la date de délivrance.",
        ];
    }
}
