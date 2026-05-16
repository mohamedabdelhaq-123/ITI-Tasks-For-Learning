<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'=> ['required','string','max:255'],
            'email'=> ['required', 'email','unique:users,email'],
            'password' => ['required','string', 'min:8', 'confirmed'],
        ]);

        $user = new User();
        $user->name=$validated['name'];
        $user->email=$validated['email'];
        $user->forceFill(
            ['password' =>$validated['password']])->save();

        return response()->json([
            'message' => 'User registered successfully',
            'status'  => 'success',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $token = auth()->user()->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'status'       => 'success',
            ], 200);
        }

        return response()->json([
            'message' => 'Unauthorized',
            'status'  => 'failed',
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out',
            'status'  => 'success',
        ], 200);
    }
}
