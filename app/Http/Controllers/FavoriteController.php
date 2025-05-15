<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * List the current user’s favorites.
     */
    public function index()
{
    /** @var \App\Models\User $user */
    $user = Auth::user();

    $favs = $user
        ->favorites()
        ->orderBy('created_at', 'desc')
        ->get(['meal_id','meal_name','meal_thumb']);

    return response()->json(['favorites' => $favs]);
}


    /**
     * Add a recipe to favorites.
     */
    public function store(Request $request)
{
    /** @var \App\Models\User $user */
    $user = Auth::user();

    $data = $request->validate([
      // …
    ]);

    $fav = $user->favorites()->firstOrCreate(
      ['meal_id' => $data['meal_id']],
      $data
    );

    return response()->json(['favorite' => $fav], 201);
}


    /**
     * Remove a recipe from favorites.
     */
    /**
 * Remove a recipe from favorites.
 */
public function destroy($id)
{
    /** @var \App\Models\User $user */
    $user = Auth::user();

    $deleted = $user
        ->favorites()
        ->where('meal_id', $id)
        ->delete();

    return response()->json(['deleted' => (bool) $deleted]);
}

}
