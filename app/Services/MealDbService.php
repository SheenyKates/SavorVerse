<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class MealDbService
{
    protected string $baseUri;

    public function __construct()
    {
        $this->baseUri = config('services.themealdb.base_uri');
    }

    /** 
     * List all areas (countries) – not needed if you use static, but here for completeness 
     */
    public function listAreas(): array
    {
        return Http::get($this->baseUri . 'list.php', ['a' => ''])
                   ->throw()
                   ->json();
    }

    /**
     * Get meals by country (area) + category
     */
    public function filterByCategory(string $area, string $category): array
    {
        return Http::get($this->baseUri . 'filter.php', [
                    'a' => $area,
                    'c' => $category,
                ])->throw()->json();
    }

    /**
     * Get full recipe details by MealDB ID
     */
    public function getDetails(string $id): array
    {
        return Http::get($this->baseUri . 'lookup.php', ['i' => $id])
                   ->throw()
                   ->json();
    }

    /**
     * Search meals by name (optional area filter applied in controller)
     */
    public function search(string $query): array
    {
        return Http::get($this->baseUri . 'search.php', ['s' => $query])
                   ->throw()
                   ->json();
    }
}
