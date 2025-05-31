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

// 🔓 Public Routes (Register & Login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ping', fn() => response()->json(['message' => 'pong']));
Route::get('/check-api', fn() => response()->json(['status' => 'api routes loaded']));
Route::get('/test', fn() => response()->json(['message' => 'test works']));

// 🔒 Protected Routes (Require Sanctum Authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

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
    Route::get('/genderize/{name}', [HomeController::class, 'genderize']);
    Route::get('/quote/motivation', [HomeController::class, 'dailyMotivation']);

    // 🔹 REST Country Info
    Route::get('/country/info/{name}', [RestCountryController::class, 'show']);

    // 🔹 Favorites
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/add', [FavoriteController::class, 'store']);
        Route::delete('/remove/{id}', [FavoriteController::class, 'destroy']);
    });
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});