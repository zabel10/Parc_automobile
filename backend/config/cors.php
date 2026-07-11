<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuration CORS
    |--------------------------------------------------------------------------
    | Le front React (Vite, http://localhost:5173) tourne sur un port
    | différent du back Laravel (http://localhost:8000) : on autorise donc
    | les échanges cross-origin pour les routes API.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
