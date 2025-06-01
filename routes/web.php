<?php

use Illuminate\Support\Facades\Route;

// Redirect Laravel routes to static HTML files in public/

Route::get('/', function () {
    return response()->file(public_path('index.html'));
});

Route::get('/greeting', function () {
    return response()->file(public_path('greeting.html'));  // Replace with actual file if exists
});

Route::get('/home', function () {
    return response()->file(public_path('home.html'));
});

Route::get('/about', function () {
    return response()->file(public_path('about.html'));
});

Route::get('/category', function () {
    return response()->file(public_path('category.html'));
});

Route::get('/dish', function () {
    return response()->file(public_path('dish.html'));
});

Route::get('/explore', function () {
    return response()->file(public_path('explore.html'));
});

Route::get('/favorites', function () {
    return response()->file(public_path('favorites.html'));
});

Route::get('/explore-category', function () {
    return response()->file(public_path('explore-category.html'));
});

Route::get('/guestabout', function () {
    return response()->file(public_path('guestabout.html'));
});
