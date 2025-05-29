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
    $apiKey = 'b8b6af3bed874fd483b78e5eecdc4e47'; // Use your working key

    try {
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'x-api-key' => $apiKey
        ])->get('https://api.spoonacular.com/food/trivia/random');

        if ($response->successful()) {
            return $response->json()['text'] ?? 'No trivia available right now.';
        } else {
            Log::error('Spoonacular API failed. Status: ' . $response->status() . '. Body: ' . $response->body());
            return 'No trivia available right now.';
        }
    } catch (\Exception $e) {
        Log::error('Exception occurred: ' . $e->getMessage());
        return 'No trivia available right now.';
    }
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
