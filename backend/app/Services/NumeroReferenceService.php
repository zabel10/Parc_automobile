<?php

namespace App\Services;

use App\Models\Alerte;
use App\Models\Carburant;
use App\Models\Maintenance;
use App\Models\Mission;

class NumeroReferenceService
{
    public static function mission(): string
    {
        return self::generer(Mission::class, 'numero_mission', 'MIS');
    }

    public static function carburant(): string
    {
        return self::generer(Carburant::class, 'reference', 'CAR');
    }

    public static function alerte(): string
    {
        return self::generer(Alerte::class, 'reference', 'ALT');
    }

    public static function maintenance(): string
    {
        return self::generer(Maintenance::class, 'reference', 'MAI');
    }

    private static function generer(string $model, string $champ, string $prefixe): string
    {
        $annee = now()->year;

        $dernier = $model::whereYear('created_at', $annee)
            ->orderByDesc('id')
            ->first();

        if (!$dernier) {
            $numero = 1;
        } else {

            preg_match('/(\d+)$/', $dernier->$champ, $match);

            $numero = intval($match[1]) + 1;
        }

        return sprintf(
            "%s-%s-%05d",
            $prefixe,
            $annee,
            $numero
        );
    }
}