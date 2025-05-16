<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class DishController extends Controller
{
    public function show($id)
    {
        $response = Http::get("https://www.themealdb.com/api/json/v1/1/lookup.php?i={$id}");

        return response()->json($response->json()['meals'][0] ?? []);
    }
}
