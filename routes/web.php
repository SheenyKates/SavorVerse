<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // or 'home' if you have a home.blade.php
});
