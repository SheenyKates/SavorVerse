<?php

namespace App\Http\Controllers;

use App\Services\MealService;

class DishController extends Controller
{
    protected MealService $mealService;

    public function __construct(MealService $mealService)
    {
        $this->mealService = $mealService;
    }

    public function show($id)
    {
        $details = $this->mealService->getMealDetails($id);
        return response()->json($details);
    }
}
