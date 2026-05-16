<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsTo;

class Post extends Model
{
    use HasFactory; // for using factory and seeders
    // in models use fillable or guarded 
    protected $fillable=['title', 'content','author_id']; //fillable is opposite of gaurded // author if FK

    // protected $hidden=[]; // {protect Output} fields never shown in API output (for ex: password)
    // protected $guarded=[]; // {Protect Input} put cols you don't want it to be mass assigned, anything else can (for ex: is_admin)

    // relation (child->the one has FK), SO each child belongs to his parent (User)
    public function author(): belongsTo {
        return $this->belongsTo(User::class, 'author_id'); // author_id is FK in posts table & ref to users PK 
    }
    // aim of function will be shown in baldes & controllers (for ex: $post->author->name)
}


// REGISTRATION:
//   Form → $fillable allows 'password' → saved (hashed) to DB ✅

// API RESPONSE:
//   DB → $hidden strips 'password' → JSON sent to browser (no password) ✅


/*
  LARAVEL DATABASE STEPS:
  1. MIGRATION  -> Define tables & Foreign Keys (e.g., author_id).
  2. MIGRATE    -> Run 'php artisan migrate' to build tables in MySQL.
  3. MODEL      -> Add '$fillable' to protect columns from form injection.
  4. RELATION   -> Add 'belongsTo' or 'hasMany' methods to link your tables.
  5. SEEDING    -> Run 'php artisan db:seed' to fill tables with dummy data.
  6. CONTROLLER -> Run 'User::all()' and pass it to the view via 'compact()'.
  7. BLADE VIEW -> Use '@foreach' inside a '<select>' tag for the dropdown.
*/
