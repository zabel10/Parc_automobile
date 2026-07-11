<?php

namespace App\Http\Requests\Conducteur;

use App\Enums\StatutConducteur;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreConducteurRequest extends FormRequest
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
                'unique:conducteurs,utilisateur_id',
            ],

            'num_permis' => [
                'required',
                'string',
                'max:100',
                'unique:conducteurs,num_permis',
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

    public function attributes(): array
    {
        return [
            'utilisateur_id' => 'utilisateur',
            'num_permis' => 'numéro de permis',
            'categorie_permis' => 'catégorie de permis',
            'date_delivrance_permis' => 'date de délivrance',
            'date_expiration_permis' => "date d'expiration",
            'date_naissance' => 'date de naissance',
            'adresse' => 'adresse',
            'contact_urgence' => "contact d'urgence",
        ];
    }
}
