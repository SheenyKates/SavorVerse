<?php

namespace App\Http\Controllers;

use App\Services\CountryService;

class CountryController extends Controller
{
    public function __construct(protected CountryService $countries) {}

    /**
     * GET /api/countries
     */
    public function index()
    {
        return response()->json($this->countries->listAll());
    }
}
