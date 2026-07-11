<?php

namespace App\Enums;

enum TypeCarburant: string
{
    case ESSENCE = 'Essence';
    case DIESEL = 'Diesel';
    case HYBRIDE = 'Hybride';
    case ELECTRIQUE = 'Électrique';
    case GPL = 'GPL';
}