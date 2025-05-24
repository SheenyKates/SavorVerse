<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // returns the default Laravel welcome page
});
