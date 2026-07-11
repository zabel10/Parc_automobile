<?php

namespace App\Enums;

enum StatutConducteur: string
{
    case ACTIF = 'Actif';
    case INACTIF = 'Inactif';
    case SUSPENDU = 'Suspendu';
}