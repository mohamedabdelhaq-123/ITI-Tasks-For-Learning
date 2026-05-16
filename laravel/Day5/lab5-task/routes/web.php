<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/posts/restore', [PostController::class, 'restore'])->name('posts.restore'); // to restore all deleted posts
Route::get('/posts' , [PostController::class , 'index'])->name('posts.index'); // to name the route for redirection after creating post
Route::get('/posts/create' , [PostController::class , 'create']);
Route::get('/posts/{post}' , [PostController::class , 'show'])->name('posts.show');

Route::get('/posts/{post}/edit' , [PostController::class , 'edit']);

Route::post('/posts' , [PostController::class , 'store']);
Route::put('/posts/{post}' , [PostController::class , 'update'])->name('posts.update');
Route::delete('/posts/{post}' , [PostController::class , 'destroy']);

});

require __DIR__.'/auth.php';
