<?php

namespace App\Enums;

enum StatutVehicule: string
{
    case DISPONIBLE = 'Disponible';
    case EN_MISSION = 'En mission';
    case EN_MAINTENANCE = 'Maintenance';
    case HORS_SERVICE = 'Hors service';

    case EN_PANNE = 'En panne';
}