<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = ['Pork', 'Beef', 'Chicken', 'Vegetables', 'Fish'];

        foreach ($categories as $cat) {
            Category::create(['name' => $cat]);
        }
    }
}

