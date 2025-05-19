<?php

namespace App\Services;

class FavoriteService
{
    public function getFavorites(): array
    {
        return session()->get('favorites', []);
    }

    public function addFavorite(string $id): array
    {
        $favorites = $this->getFavorites();
        if (!in_array($id, $favorites)) {
            $favorites[] = $id;
            session()->put('favorites', $favorites);
        }
        return $favorites;
    }

    public function removeFavorite(string $id): array
    {
        $favorites = $this->getFavorites();

        $filtered = array_filter($favorites, function ($favId) use ($id) {
            return (string) $favId !== (string) $id;
        });

        $favorites = array_values($filtered);

        session()->put('favorites', $favorites);

        return $favorites;
    }
}
