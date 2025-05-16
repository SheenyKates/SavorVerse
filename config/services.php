<?php

return [

    // ... other Laravel services like mail, etc.

    'themealdb' => [
        'base_uri' => env('THEMEALDB_URL'),
    ],

    'restcountries' => [
        'base_uri' => env('RESTCOUNTRIES_URL'),
    ],

    'spoonacular' => [
        'api_key' => env('SPOONACULAR_API_KEY'),
        'base_uri' => 'https://api.spoonacular.com/food/',
    ],

    'edamam' => [
        'nutrition_uri' => env('EDAMAM_NUTRIENT_URL'),
        'app_id'        => env('EDAMAM_APP_ID'),
        'app_key'       => env('EDAMAM_APP_KEY'),
    ],

    'cloudinary' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key'    => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
        'upload_uri' => "https://api.cloudinary.com/v1_1/".env('CLOUDINARY_CLOUD_NAME')."/image/upload",
    ],

    'translate' => [
        'base_uri' => 'https://translation.googleapis.com/language/translate/v2',
        'key'      => env('GOOGLE_TRANSLATE_KEY'),
    ],

];
