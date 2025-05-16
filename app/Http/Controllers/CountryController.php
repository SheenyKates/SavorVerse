<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class CountryController extends Controller
{
    public function index()
    {
        $response = Http::get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');

        return response()->json($response->json()['meals']);
    }
}

