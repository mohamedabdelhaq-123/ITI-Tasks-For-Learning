<?php

namespace App\Http\Controllers;

use App\Models\Post;

class LikeController extends Controller
{
    public function toggle(Post $post)
    {
        $existing = $post->likes()->where('user_id', auth()->id())->first();

        if ($existing) {
            $existing->delete();
        } else {
            $post->likes()->create(['user_id' => auth()->id()]);
        }

        return back();
    }
}
