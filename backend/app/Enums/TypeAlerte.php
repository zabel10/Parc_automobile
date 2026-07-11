<?php

namespace App\Enums;

enum TypeAlerte: string
{
    case PANNE = 'Panne';
    case ENTRETIEN = 'Entretien';
    case VIDANGE = 'Vidange';
    case PNEUS = 'Pneus';
    case FREINAGE = 'Freinage';
    case BATTERIE = 'Batterie';
    case ASSURANCE = 'Assurance';
    case VISITE_TECHNIQUE = 'Visite technique';
    case ACCIDENT = 'Accident';
    case AUTRE = 'Autre';
}