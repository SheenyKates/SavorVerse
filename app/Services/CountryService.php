<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CountryService
{
    public function getCountries()
    {
        $response = Http::get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        return $response->json()['meals'] ?? [];
    }
}
