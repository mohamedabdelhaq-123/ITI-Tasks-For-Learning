<?php

namespace Database\Seeders;
use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::factory(500)->create(); // create 500 posts using the recipe in PostFactory
    }
}

// factory -> generate random data
// seeder -> insert that data into the database 
