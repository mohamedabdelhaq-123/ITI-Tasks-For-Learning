<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        schema::table('posts', function (Blueprint $table) {
            $table->string('image')->nullable(true); // not mandatory
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};

// image upload:
// migration add image then migrate
// validate extension by custom rule or default img validation
// enctype in forms & accept=images/*
// link storage with public  folder that contains html&css seen by browser and make a (shortcut)-> bec browser allowed to see public folder not my private storage\ by cmd php artisan storage:link
// controller store and update
// view layout


// the link dilemma
// pics physically saved in storage/app/public/posts/
// ->store('posts', 'public')
//             ↑         ↑
//          subfolder   disk name → resolves to storage/app/public/
// browser sees only files in public/ (html,css)
// so create shortcut or link by php artisan storage:link
// public/storage  →  points to →  storage/app/public/
// save Permantly in storage/app/public/posts/ folder and rename uploaded file rand. in storage/app/public/posts/
//  save returned path in db validDate[image]
// so to get the file in brower must use the public/storage/posts/ (symbolic link)
