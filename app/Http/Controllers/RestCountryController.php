<?php

namespace App\Http\Controllers;

use App\Services\RestCountryService;

class RestCountryController extends Controller
{
    protected RestCountryService $restCountryService;

    public function __construct(RestCountryService $restCountryService)
    {
        $this->restCountryService = $restCountryService;
    }

    public function show(string $name)
    {
        $countryInfo = $this->restCountryService->getCountryInfo($name);

        if ($countryInfo) {
            return response()->json($countryInfo);
        }

        return response()->json(['error' => 'Country not found'], 404);
    }
}
