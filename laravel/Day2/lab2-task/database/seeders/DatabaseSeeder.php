<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // parent befor child due to FK in child that is needed form the parent
        $this->call(UserSeeder::class); // call UserSeeder to create users first, then we can use those users to assign them as authors to posts
        $this->call(PostSeeder::class); // call PostSeeder to create posts using the users created by UserSeeder
    }
}
