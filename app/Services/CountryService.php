<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CountryService
{
    protected string $baseUri;

    public function __construct()
    {
        $this->baseUri = config('services.restcountries.base_uri');
    }

    public function listAll(): array
    {
        return Cache::remember('countries_all', now()->addDay(), function() {
            return Http::get($this->baseUri . 'all')->throw()->json();
        });
    }
}
