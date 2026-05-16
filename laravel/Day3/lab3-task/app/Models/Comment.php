<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Comment extends Model
{

    protected $fillable = ['body', 'post_id', 'user_id'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class); 
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class); 
    }

    public function likes(): MorphMany // allows being liked
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
