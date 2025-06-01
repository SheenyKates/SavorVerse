<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'guestindex');
Route::view('/greeting', 'greeting'); 
Route::view('/home', 'home');
Route::view('/about', 'about');
Route::view('/category', 'category');
Route::view('/dish', 'dish');
Route::view('/explore', 'explore');
Route::view('/favorites', 'favorites');
Route::view('/explore-category', 'explore-category');
Route::view('/guestabout', 'guestabout');
