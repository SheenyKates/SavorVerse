<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\RestCountryController;
use App\Http\Controllers\RecipeUtilityController;

// 🔹 Country
Route::get('/countries', [CountryController::class, 'index']);

// 🔹 Dish Details
Route::get('/dish/{id}', [DishController::class, 'show']);

// 🔹 Explore (by Country + Category)
Route::get('/explore/{country}/{category}', [ExploreController::class, 'byCountryAndCategory']);

// 🔹 Home
Route::get('/home/recent', [HomeController::class, 'recentDishes']);
Route::get('/home/trivia', [HomeController::class, 'trivia']);

// 🔹 REST Country Info
Route::get('/country/info/{name}', [RestCountryController::class, 'show']);

// 🔹 Favorites
Route::prefix('favorites')->group(function () {
    Route::get('/', [FavoriteController::class, 'index']);
    Route::post('/add', [FavoriteController::class, 'store']);
    Route::delete('/remove', [FavoriteController::class, 'destroy']);
});

// 🔹 Recipes Utility (search, detail, by category)
Route::prefix('recipes')->group(function () {
    Route::get('/country/{country}/categories', [RecipeUtilityController::class, 'listCategories']);
    Route::get('/country/{country}/category/{category}', [RecipeUtilityController::class, 'getByCategory']);
    Route::get('/detail/{id}', [RecipeUtilityController::class, 'getRecipeDetails']);
    Route::get('/search', [RecipeUtilityController::class, 'searchByName']);
});
