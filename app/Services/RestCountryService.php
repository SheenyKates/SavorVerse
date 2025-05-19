<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RestCountryService
{
    public function getCountryInfo(string $name): ?array
    {
        $response = Http::get("https://restcountries.com/v3.1/name/{$name}?fullText=true");

        if ($response->successful() && isset($response->json()[0])) {
            return $response->json()[0];
        }

        return null;
    }
}
