<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'in:farmer,admin'],
            'admin_code' => ['nullable', 'string'],
            'state' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        if ($validated['role'] === 'admin' && ($validated['admin_code'] ?? '') !== 'AGRI-ADMIN-2026') {
            return response()->json(['message' => 'Invalid admin registration code.', 'errors' => ['admin_code' => ['Invalid admin registration code.']]], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'state' => $validated['state'],
            'district' => $validated['district'],
            'phone' => $validated['phone'],
        ]);

        return response()->json(['user' => $user, 'token' => $user->createToken('crop-guidance')->plainTextToken], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email or password.'], 422);
        }

        return response()->json(['user' => $user, 'token' => $user->createToken('crop-guidance')->plainTextToken]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
