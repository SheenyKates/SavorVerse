<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DishSeeder extends Seeder
{
    public function run()
    {
        $dishes = [
            [
                'name' => 'Adobo',
                'category' => 'Pork',
                'thumbnail' => 'url-to-adobo-image',
                'description' => 'A popular Filipino dish...',
            ],
            [
                'name' => 'Sinigang',
                'category' => 'Seafood',
                'thumbnail' => 'url-to-sinigang-image',
                'description' => 'A sour soup dish...',
            ],
            // Add more dishes here
        ];

        foreach ($dishes as $dish) {
            DB::table('dishes')->insert(array_merge($dish, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
