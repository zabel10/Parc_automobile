<?php

namespace App\Enums;

enum StatutUtilisateur: string
{
    case ACTIF = 'Actif';
    case INACTIF = 'Inactif';
    case SUSPENDU = 'Suspendu';
}