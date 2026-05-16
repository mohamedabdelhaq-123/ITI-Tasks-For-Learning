<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    private array $posts;

    public function __construct()
    {
        $this->posts = [
            ['id' => 1, 'title' => 'First Post', 'content' => 'This is the first post.'],
            ['id' => 2, 'title' => 'Second Post', 'content' => 'This is the second post.'],
            ['id' => 3, 'title' => 'Third Post', 'content' => 'This is the third post.'],
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('posts.index', ['posts' => $this->posts] ); // ret. html to browser -> the html is in the view()"view folder" in posts folder in index file -> pass to it before ret. the data as var $posts (by ref )
        // return view('posts.index', compact('posts') ); // compact() ---(converted to)>>> ['posts' => $posts]
    }// compact('x') look for var called x in your current scope and auto. build assos. arr ['x' => $x]

    public function create()
    {
        return view('posts.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // push to db / 
    {
        //store data in database
        // $posts[]= $request->all();  // even after global posts var it won't work due to statelessness (use db or sessions)
        dd($request->all()); // dump and die -> print the data and stop the execution
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // get details of one post
        foreach ($this->posts as $post) {
            if ($post['id'] == $id) {
                return view('posts.show', ['post' => $post]);
            }
        }

        return 'Post not found';
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view('posts.edit', ['id' => $id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // update the post in database
        dd($request->all(), $id); // dump and die -> print the data and stop the execution
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // delete the post from database
        return 'Post with ID ' . $id . ' has been deleted.';
    }
}


// artisan -> cli for small tasks 
