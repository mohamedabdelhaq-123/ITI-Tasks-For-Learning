<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

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
Route::get('/posts/create' , [PostController::class , 'create']);
Route::get('/posts/{id}' , [PostController::class , 'show']);
Route::post('/posts' , [PostController::class , 'store']);
Route::get('/posts/{id}/edit' , [PostController::class , 'edit']);
Route::put('/posts/{id}' , [PostController::class , 'update']);
Route::delete('/posts/{id}' , [PostController::class , 'destroy']);

Route::get('/', function () {
    return view('welcome');
});


// in background: 
// $controllerInstance = new \App\Http\Controllers\PostController();
// $controllerInstance->index();


// app.get('/users',userController.getAllUsers) -> Route::get('/users',[UserController::class,'getAllUsers'])