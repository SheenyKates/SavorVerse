<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;  // ← add this import

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'meal_id',
        'meal_name',
        'meal_thumb',
    ];

    /**
     * Each Favorite belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
