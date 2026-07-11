<?php

namespace App\Enums;

enum PrioriteAlerte: string
{
    case FAIBLE = 'Faible';
    case NORMALE = 'Normale';
    case HAUTE = 'Haute';
    case CRITIQUE = 'Critique';
}