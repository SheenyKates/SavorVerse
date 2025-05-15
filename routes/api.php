<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\Auth\SocialAuthController;

// Country list endpoint
Route::get('countries', [CountryController::class, 'index']);

// Google OAuth login routes
Route::get('login/google', [SocialAuthController::class, 'redirectToGoogle'])->name('login.google');
Route::get('login/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// Recipe-related routes grouped under 'recipes' prefix
Route::prefix('recipes')->group(function () {
    // 1. Get the 5 static categories for a country
    Route::get('country/{country}/categories', [RecipeController::class, 'listCategories']);
    
    // 2. Get meals by country + category
    Route::get('country/{country}/category/{category}', [RecipeController::class, 'getByCategory']);
    
    // 3. Get full recipe details
    Route::get('detail/{id}', [RecipeController::class, 'getRecipeDetails']);
    
    // 4. Search recipes by name (optional country filter)
    Route::get('search', [RecipeController::class, 'searchByName']);
});

// Favorites routes protected by Sanctum auth middleware
Route::middleware('auth:sanctum')->group(function () {
    // List current user’s favorites
    Route::get('favorites', [FavoriteController::class, 'index']);
    
    // Add a recipe to favorites
    Route::post('favorites', [FavoriteController::class, 'store']);
    
    // Remove a recipe from favorites
    Route::delete('favorites/{id}', [FavoriteController::class, 'destroy']);
});
