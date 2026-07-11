<?php

namespace App\Enums;

enum EtatVehicule: string
{
    case EXCELLENT = 'Excellent';
    case BON = 'Bon';
    case MOYEN = 'Moyen';
    case MAUVAIS = 'Mauvais';
}