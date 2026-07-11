<?php

namespace App\Enums;

enum TypeMaintenance: string
{
    case PREVENTIVE = 'Préventive';
    case CORRECTIVE = 'Corrective';
    case URGENTE = 'Urgente';
}