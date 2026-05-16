<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        schema::table('posts', function (Blueprint $table) {
            $table->softDeletes(); // for soft delete, adds deleted_at col
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        schema::table('posts', function (Blueprint $table) {
            $table->dropSoftDeletes(); // to drop the deleted_at col if i want to remove soft delete
        });

    }
};

// the change is in up() and down() only no need to copy prev. migration 