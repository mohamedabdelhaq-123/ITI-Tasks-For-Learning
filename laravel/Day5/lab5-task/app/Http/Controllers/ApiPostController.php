<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Http\Resources\PostDetailsResource;

class ApiPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct() {
        // paginate what is sent on params
        $this->per_page= request()->query('per_page',15);

    }  
        
    public function index()
    {
        $posts= Post::paginate($this->per_page);
        return response()->json(['data'=>PostDetailsResource::collection($posts), 'status'=>'success'],200);
    } // resource like serialzer btw Json,res

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        // $validated=$request->validate([
        //     'title'=>'required',
        //     'content'=>'required',
        //     'image'=>'required'
        // ]);
        $post=Post::create($request->validated());
        return response()->json(['data'=>$post, 'status'=>'success'],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post=Post::findOrFail($id);
        return response()->json(['data'=>PostDetailsResource::make($post), 'status'=>'success'],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, string $id)
    {
        $post=Post::findOrFail($id);
        $post->update($request->validated());
        return response()->json(['data'=>PostDetailsResource::make($post), 'status'=>'success'],200);
    }

    
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->comments()->delete();
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully', 'status' => 'success'], 200);
    }
}
