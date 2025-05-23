<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\RestCountryController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

// 🔹 Country
Route::get('/countries', [CountryController::class, 'index']);

// 🔹 Dish Details
Route::get('/dish/{id}', [DishController::class, 'show']);

// 🔹 Explore (by Country + Category)
Route::get('/explore/{country}/{category}', [ExploreController::class, 'byCountryAndCategory']);
Route::get('/categories/for/{country}', [ExploreController::class, 'listCategories']);

// 🔹 Home
Route::get('/home/recent', [HomeController::class, 'recentDishes']);
Route::get('/home/trivia', [HomeController::class, 'trivia']);
// Genderize API (detect gender from name)
Route::get('/genderize/{name}', [\App\Http\Controllers\HomeController::class, 'genderize']);
Route::get('/quote/motivation', [HomeController::class, 'dailyMotivation']);


// 🔹 REST Country Info
Route::get('/country/info/{name}', [RestCountryController::class, 'show']);

// 🔹 Favorites
Route::prefix('favorites')->group(function () {
    Route::get('/', [FavoriteController::class, 'index']);
    Route::post('/add', [FavoriteController::class, 'store']);
    Route::delete('/remove', [FavoriteController::class, 'destroy']);
});

//AuthController

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::get('/test', function () {
    return response()->json(['message' => 'test works']);
});


