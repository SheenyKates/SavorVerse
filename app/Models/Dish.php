<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category_id', 'ingredients', 'procedure'];

    protected $casts = [
        'ingredients' => 'array',
        'procedure' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

