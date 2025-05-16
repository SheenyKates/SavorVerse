<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class HomeController extends Controller
{
    public function recentDishes()
    {
        $response = Http::get('https://www.themealdb.com/api/json/v1/1/latest.php');

        return response()->json($response->json()['meals'] ?? []);
    }

    public function trivia()
    {
        $apiKey = env('SPOONACULAR_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'Missing Spoonacular API key'], 500);
        }

        $response = Http::get("https://api.spoonacular.com/food/trivia/random?apiKey={$apiKey}");

        return response()->json([
            'trivia' => $response->json()['text'] ?? 'No trivia available right now.'
        ]);
    }
}
