<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $title =$this->faker->sentence();
        return [
            
            // 'title' => fake()->sentence(), // 1 rand. sentence
            'title'=>$title,
            'content' => fake()->paragraph(2), 
            'slug' => Str::slug($title),
            'author_id' => User::inRandomOrder()->value('id'), // get random user id from users table, so we can assign it to post as FK
            // 'author_id' => \App\Models\User::factory(), // create new user for each post
        ];
    }
}

// use of seeding is to test ui 
// Factory  → the recipe    (HOW to make one fake post)
// seeding → the process of filling the database with fake data (HOW to make many fake posts)


// YOU TYPE:  php artisan db:seed
//                 │
//                 ▼
//     DatabaseSeeder.php  (the master list)
//                 │
//                 │  calls
//                 ▼
//     PostSeeder.php  (the chef)
//                 │
//                 │  uses
//                 ▼
//     PostFactory.php  (the recipe)
//                 │
//                 │  runs 500 times
//                 ▼
//     posts table  ← 500 real rows inserted ✅


// 1. make:factory & make:seeder (finish Parent then child)
// 2. fill PostFactory with the recipe
// 3. put instructions in PostSeeder to use the factory to create N posts
// 4. call seeders in DatabaseSeeder in right order (parent then child)
// 5. then php artisan migrate:fresh --seed (drop and seed) or php artisan db:seed (just seed)

// note handle imports