<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

// Route::get('/test', function () {
//     // return view('welcome');
//     return 'Hello text';
// });

// Route::get('/posts', function ($id) {
//     // return view('welcome');
//     return 'Hello text with ID: ' . $id;
// });

// Route::get('/test/{id?}', function ($id = null) {
//     // return view('welcome');
//     return $id ? 'Hello text with ID: ' . $id : 'Hello text without ID';
// });


Route::get('/posts' , [PostController::class , 'index']);
Route::get('/posts/{id}' , [PostController::class , 'show']);
