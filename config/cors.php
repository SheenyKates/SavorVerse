<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:8000',      // Add this
        'http://127.0.0.1:8000',      // Add this
        'https://savorverse-production.up.railway.app', // Optional for production
        'http://localhost:5500',      // Keep if you also use this
        'http://127.0.0.1:5500',      // Keep if you also use this
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
