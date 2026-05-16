<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use App\Rules\FirstLetterUppercase;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Support\Facades\Storage; 

class PostController extends Controller
{

    public function __construct()
    {
        $this->posts=Post::all(); // ORM==>get all posts from db
        // $this->posts=Post::paginate(15); 
        $this->users=User::all(); // ORM==>get all users from db
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('posts.index', ['posts' => Post::paginate(15)] ); // ret. html to browser -> the html is in the view()"view folder" in posts folder in index file -> pass to it before ret. the data as var $posts (by ref )
        // return view('posts.index', compact('posts') ); // compact() ---(converted to)>>> ['posts' => $posts]
    }// compact('x') look for var called x in your current scope and auto. build assos. arr ['x' => $x]

    public function create()
    {
        return view('posts.create', ['users' => $this->users] ); // to show the dropdown of users in create post form
    }

// validation in form req.

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request) // push to db / 
    {
        //store data in database
        // mass ass.
        // Workflow modifier->Requirement->Data Type->Constraints->Database Checks
        // for ex: nullable/bail --> required --> string/numeric/boolean --> min/max/email --> unique/exists --> custom rule
        // $validData=$request->validate([
        //     'title'=>['required','string','min:3','unique:posts,title', new FirstLetterUppercase],
        //     'content'=>['required','string','min:10'],
        //     'author_id'=>['required','integer','exists:users,id']
        // ]); 
        $validData=$request->validated();

        if($request->hasFile('image')){
            $validData['image']=$request->file('image')->store('posts','public');
        } 
//->store('posts', 'public')
//            ↑         ↑
//         subfolder   disk name → resolves to storage/app/public/

        Post::create($validData);

        // Post::create([
        //     'title' => $request['title'],
        //     'content'=> $request["content"],
        //     'author_id'=>$request['author_id']
        // ]);

        return redirect()->route('posts.index')->with('success', 'Post Created!');
        // return view('posts.index', ['posts' => $this->posts] )->with('success',"Post Created!");
        // browser cashes the post/put & show the old posts due to un refreshed $this->posts
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        // get details of one post 
        // model binding
        return view('posts.show',['post'=>$post, 'slug'=>$post->slug]);

        // return view('posts.show',['post'=> Post::findOrFail($id),'slug'=>$slug]);

        // foreach ($this->posts as $post) {
        //     if ($post['id'] == $id) {
        //         return view('posts.show', ['post' => $post]);
        //     }
        // }

        // return 'Post not found';
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {

        return view('posts.edit', ['users'=>$this->users, 'post'=>$post]); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        // update the post in database
        // $post = Post::findorFail($id); // give 404 not null like find() only , findOrFail accespts string ids and convert them

        // $validData=$request->validate([
        //     'title'=>'required|string|min:3|unique:posts,title,'. $post->id, // ignore only this post bec if title didn't change so no errors
        //     'content'=>'required|string|min:10',
        //     'author_id'=>'required|integer|exists:users,id'
        // ]);

        $validData = $request->validated();

        if($request->hasFile('image')){
            if($post->image) Storage::disk('public')->delete($post->image);
            $validData['image']=$request->file('image')->store('posts','public');
        }
        else{
            unset($validData['image']); // removes image key, so not overwrite on exiting val. in Db (null or real img)
        }

        $post->update($validData);

        return redirect()->route('posts.index')->with('success', 'Post Updated!');
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // delete the post from database
        // $post = Post::findorFail((int)$id); // give 404 not null like find() only

    if ($post->image) {
        Storage::disk('public')->delete($post->image);
        $post->image = null;
        $post->save();
    }
        $post->delete(); // soft delete (still in db)
        return redirect()->route('posts.index')->with('success', 'Post Deleted!');
    }

    public function restore(){
        Post::withTrashed()->restore();
        return redirect()->route('posts.index')->with('success', 'Post Restored!');
    }
}


// artisan -> cli for small tasks 
