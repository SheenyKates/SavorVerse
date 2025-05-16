<?php

namespace App\Http\Controllers;

use App\Services\MealDbService;
use Illuminate\Support\Facades\Cache;

class ExploreController extends Controller
{
    protected MealDbService $mealDb;

    public function __construct(MealDbService $mealDb)
    {
        $this->mealDb = $mealDb;
    }

    public function byCountryAndCategory(string $country, string $category)
{
    // Use $country directly as area
    $cacheKey = "meals_{$country}_{$category}";

    $meals = Cache::remember($cacheKey, now()->addHours(6), function () use ($country, $category) {
        return $this->mealDb->filterByCategory($country, $category);
    });

    return response()->json($meals);
}

}
