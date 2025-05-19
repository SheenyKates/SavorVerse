<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class HomeService
{
    public function getRecentDishes(): array
    {
        $response = Http::get('https://www.themealdb.com/api/json/v1/1/latest.php');
        return $response->json()['meals'] ?? [];
    }

    public function getTrivia(): string
    {
        $apiKey = env('SPOONACULAR_API_KEY');
        if (!$apiKey) {
            return 'Missing Spoonacular API key';
        }

        $response = Http::get("https://api.spoonacular.com/food/trivia/random?apiKey={$apiKey}");
        return $response->json()['text'] ?? 'No trivia available right now.';
    }
}
