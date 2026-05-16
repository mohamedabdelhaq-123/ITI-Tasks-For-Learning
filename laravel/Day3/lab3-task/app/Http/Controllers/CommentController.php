<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $request->validate(['body' => 'required|string|min:1']);

        $post->comments()->create([
            'body'    => $request->body,
            'user_id' => auth()->id(),
        ]);

        return back();
    }
}
