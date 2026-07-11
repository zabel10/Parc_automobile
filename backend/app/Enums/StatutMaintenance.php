<?php

namespace App\Enums;

enum StatutMaintenance: string
{
    case PLANIFIEE = 'Planifiée';
    case EN_COURS = 'En cours';
    case TERMINEE = 'Terminée';
    case ANNULEE = 'Annulée';
}