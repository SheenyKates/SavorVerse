<?php

namespace App\Http\Controllers;

use App\Services\MealDbService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RecipeController extends Controller
{
    protected MealDbService $mealDb;

    public function __construct(MealDbService $mealDb)
    {
        $this->mealDb = $mealDb;
    }

    /**
     * 1. Return the five static categories for a given country.
     *    GET /api/recipes/country/{country}/categories
     */
    public function listCategories(string $country)
    {
        $categories = config('meal.categories');

        return response()->json([
            'country'    => $country,
            'categories' => $categories,
        ]);
    }

    /**
     * 2. Get meals by country + category.
     *    GET /api/recipes/country/{country}/category/{category}
     */
    public function getByCategory(string $country, string $category)
    {
        $cacheKey = "meals_{$country}_{$category}";

        $meals = Cache::remember($cacheKey, now()->addHours(6), function () use ($country, $category) {
            return $this->mealDb->filterByCategory($country, $category);
        });

        return response()->json($meals);
    }

    /**
     * 3. Get full recipe details by MealDB ID.
     *    GET /api/recipes/detail/{id}
     */
    public function getRecipeDetails(string $id)
    {
        $cacheKey = "meal_detail_{$id}";

        $detail = Cache::remember($cacheKey, now()->addDays(1), function () use ($id) {
            return $this->mealDb->getDetails($id);
        });

        return response()->json($detail);
    }

    /**
     * 4. Search by name, optional country filter.
     *    GET /api/recipes/search?q=adobo
     *    GET /api/recipes/search?q=adobo&country=Philippines
     */
    public function searchByName(Request $request)
    {
        $query   = $request->query('q', '');
        $country = $request->query('country');

        // cache each unique query+country for 2 hours
        $cacheKey = "search_{$query}_" . ($country ?: 'all');

        $results = Cache::remember($cacheKey, now()->addHours(2), function () use ($query) {
            return $this->mealDb->search($query);
        });

        if ($country && isset($results['meals'])) {
            $results['meals'] = array_filter(
                $results['meals'],
                fn($meal) => data_get($meal, 'strArea') === $country
            );
        }

        return response()->json($results);
    }
}
