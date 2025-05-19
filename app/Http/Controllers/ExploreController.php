<?php

namespace App\Http\Controllers;

use App\Services\MealService;

class ExploreController extends Controller
{
    protected MealService $mealService;

    public function __construct(MealService $mealService)
    {
        $this->mealService = $mealService;
    }

    public function byCountryAndCategory(string $country, string $category)
    {
        $meals = $this->mealService->getMealsByCountryAndCategory($country, $category);

        return response()->json($meals);
    }

    public function listCategories(string $country)
    {
        $categories = $this->mealService->getCategoriesForCountry($country);
        return response()->json($categories);
    }
}
