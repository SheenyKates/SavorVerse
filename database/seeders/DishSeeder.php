<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dish;
use App\Models\Category;

class DishSeeder extends Seeder
{
    public function run()
    {
        $categories = Category::pluck('id', 'name');

        $dishes = [
            ['name' => 'Adobo', 'category' => 'Pork'],
            ['name' => 'Menudo', 'category' => 'Pork'],
            ['name' => 'Beef Kaldereta', 'category' => 'Beef'],
            ['name' => 'Chicken Inasal', 'category' => 'Chicken'],
            ['name' => 'Pinakbet', 'category' => 'Vegetables'],
            ['name' => 'Sinigang na Isda', 'category' => 'Fish'],
        ];

        foreach ($dishes as $dish) {
            Dish::create([
                'name' => $dish['name'],
                'category_id' => $categories[$dish['category']],
                'ingredients' => json_encode(['Example ingredient 1', 'Example ingredient 2']),
                'procedure' => json_encode(['Step 1', 'Step 2']),
            ]);
        }
    }
}
