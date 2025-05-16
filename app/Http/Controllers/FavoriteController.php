<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // Simulate database using session or static array
    public function index(Request $request)
    {
        $favorites = session()->get('favorites', []);
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');

        if (!$id) {
            return response()->json(['error' => 'Dish ID is required'], 400);
        }

        $favorites = session()->get('favorites', []);
        if (!in_array($id, $favorites)) {
            $favorites[] = $id;
            session()->put('favorites', $favorites);
        }

        return response()->json(['message' => 'Added to favorites', 'favorites' => $favorites]);
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $favorites = session()->get('favorites', []);

        if (($key = array_search($id, $favorites)) !== false) {
            unset($favorites[$key]);
            session()->put('favorites', array_values($favorites));
        }

        return response()->json(['message' => 'Removed from favorites', 'favorites' => $favorites]);
    }
}
