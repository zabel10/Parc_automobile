<?php

namespace App\Enums;

enum StatutMission: string
{
    case EN_ATTENTE = 'En attente';
    case VALIDEE = 'Validée';
    case EN_COURS = 'En cours';
    case TERMINEE = 'Terminée';
    case ANNULEE = 'Annulée';
}