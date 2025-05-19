<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\FavoriteService;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    protected FavoriteService $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    public function index()
    {
        $favorites = $this->favoriteService->getFavorites();
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        if (!$id) {
            return response()->json(['error' => 'Dish ID is required'], 400);
        }

        $favorites = $this->favoriteService->addFavorite($id);
        return response()->json(['message' => 'Added to favorites', 'favorites' => $favorites]);
    }

    public function destroy(string $id)
    {
        $favorites = $this->favoriteService->removeFavorite($id);
        return response()->json(['message' => 'Removed from favorites', 'favorites' => $favorites]);
    }
}
