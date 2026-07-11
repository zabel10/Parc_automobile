<?php

namespace App\Enums;

enum StatutAlerte: string
{
    case EN_ATTENTE = 'En attente';
    case EN_COURS = 'En cours';
    case RESOLUE = 'Résolue';
    case REJETEE = 'Rejetée';

    
}