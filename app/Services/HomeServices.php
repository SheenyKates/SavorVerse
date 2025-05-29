<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HomeService
{
    public function getRecentDishes(): array
    {
        $response = Http::get('https://www.themealdb.com/api/json/v1/1/latest.php');
        return $response->json()['meals'] ?? [];
    }

    public function getTrivia(): string
    {
        $apiKey = env('SPOONACULAR_KEY');
        if (!$apiKey) {
            return 'Missing Spoonacular API key';
        }

        $response = Http::get("https://api.spoonacular.com/food/trivia/random?apiKey={$apiKey}");
        return $response->json()['text'] ?? 'No trivia available right now.';
    }

    // ✅ Genderize API integration
    public function detectGender(string $name): array
    {
        $response = Http::get("https://api.genderize.io", [
            'name' => $name
        ]);

        return $response->successful() ? $response->json() : ['gender' => null];
    }

    public function getDailyMotivationalQuote(): array
{
    try {
        $response = Http::get("https://zenquotes.io/api/random");

        if ($response->successful()) {
            $data = $response->json()[0];

            return [
                'quote' => $data['q'],
                'author' => $data['a'] ?? 'Unknown'
            ];
        }
    } catch (\Exception $e) {
        Log::error('ZenQuote error: ' . $e->getMessage());
    }

    return [
        'quote' => 'Start your day with purpose.',
        'author' => 'SavorVerse'
    ];
}

}
