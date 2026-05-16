<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{

    public function __construct()
    {
        // $this->posts=Post::all(); // ORM==>get all posts from db
        $this->posts=Post::paginate(15); 
        $this->users=User::all(); // ORM==>get all users from db
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
        return view('posts.create', ['users' => $this->users] ); // to show the dropdown of users in create post form
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // push to db / 
    {
        //store data in database
        // mass ass.
        Post::create([
            'title' => $request['title'],
            'content'=> $request["content"],
            'author_id'=>$request['author_id']
        ]);

        return redirect()->route('posts.index')->with('success', 'Post Created!');
        // return view('posts.index', ['posts' => $this->posts] )->with('success',"Post Created!");
        // browser cashes the post/put & show the old posts due to un refreshed $this->posts
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // get details of one post 
        // find, modelbinding
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
        return view('posts.edit', ['id' => $id, 'users'=>$this->users]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // update the post in database
        $post = Post::findorFail((int)$id); // give 404 not null like find() only
        $post->update([
            'title' => $request['title'],
            'content'=> $request["content"],
            'author_id'=>$request['author_id']
        ]);

        return redirect()->route('posts.index')->with('success', 'Post Updated!');
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // delete the post from database
        $post = Post::findorFail((int)$id); // give 404 not null like find() only
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post Deleted!');
    }
}


// artisan -> cli for small tasks 
