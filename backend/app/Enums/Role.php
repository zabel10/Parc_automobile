<?php

namespace App\Enums;

enum Role: string
{
    case ADMINISTRATEUR = 'Administrateur';
    case GESTIONNAIRE = 'Gestionnaire';
    case CONDUCTEUR = 'Conducteur';
}