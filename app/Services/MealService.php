<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class MealService
{
    protected MealDbService $mealDb;

    public function __construct(MealDbService $mealDb)
    {
        $this->mealDb = $mealDb;
    }

    /**
     * Get categories for a country (area).
     * For now, returning static categories; extend if needed.
     */
    public function getCategoriesForCountry(string $country): array
    {
        // You can add caching here if fetching from a DB or API later
        return ['Pork', 'Beef', 'Chicken', 'Seafood', 'Vegetarian'];
    }

    /**
     * Get meals filtered by country and category with caching.
     */
    public function getMealsByCountryAndCategory(string $country, string $category): array
    {
        $cacheKey = "meals_{$country}_{$category}";

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($country, $category) {
            $response = $this->mealDb->filterByCategory($country, $category);
            // TheMealDB returns meals inside 'meals' key — normalize
            return $response['meals'] ?? [];
        });
    }

    /**
     * Get detailed recipe info by meal ID.
     */
    public function getMealDetails(string $id): array
    {
        $cacheKey = "meal_details_{$id}";

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($id) {
            $response = $this->mealDb->getDetails($id);
            return $response['meals'][0] ?? []; // first meal details
        });
    }

    /**
     * Search meals by name (optionally filter by country in controller).
     */
    public function searchMeals(string $query): array
    {
        $response = $this->mealDb->search($query);
        return $response['meals'] ?? [];
    }
}
