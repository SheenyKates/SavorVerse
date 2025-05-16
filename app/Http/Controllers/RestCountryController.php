<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class RestCountryController extends Controller
{
    public function show($name)
    {
        $response = Http::get("https://restcountries.com/v3.1/name/{$name}?fullText=true");

        if ($response->successful() && isset($response->json()[0])) {
            return response()->json($response->json()[0]);
        }

        return response()->json(['error' => 'Country not found'], 404);
    }
}
