<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    protected $fillable = ['user_id']; //likedid&type filled by morph

    public function user(): BelongsTo //one who made like (user)
    {
        return $this->belongsTo(User::class);
    }

    public function liked(): MorphTo //sth that is liked (post/comm.)
    {
        return $this->morphTo();
    }
}
