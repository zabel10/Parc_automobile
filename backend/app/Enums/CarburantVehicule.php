<?php

namespace App\Enums;

enum CarburantVehicule: string
{
    case ESSENCE = 'Essence';
    case DIESEL = 'Diesel';
    case HYBRIDE = 'Hybride';
    case ELECTRIQUE = 'Électrique';
    case GPL = 'GPL';
}