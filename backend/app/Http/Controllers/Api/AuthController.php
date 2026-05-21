<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuthLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'state' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'farmer',
            'state' => $validated['state'],
            'district' => $validated['district'],
            'phone' => $validated['phone'],
        ]);

        $this->logAuth($request, $user, 'register');

        return response()->json(['user' => $user, 'token' => $user->createToken('crop-guidance')->plainTextToken], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email or password.'], 422);
        }

        $this->logAuth($request, $user, 'login');

        return response()->json(['user' => $user, 'token' => $user->createToken('crop-guidance')->plainTextToken]);
    }

    public function logout(Request $request)
    {
        $this->logAuth($request, $request->user(), 'logout');
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    private function logAuth(Request $request, ?User $user, string $action): void
    {
        if (!$user) {
            return;
        }

        $payload = [
            'user_id' => $user->id,
            'action' => $action,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ];

        if (Schema::hasColumn('auth_logs', 'email')) {
            $payload['email'] = $user->email;
        }

        if (Schema::hasColumn('auth_logs', 'name')) {
            $payload['name'] = $user->name;
        }

        if (Schema::hasColumn('auth_logs', 'role')) {
            $payload['role'] = $user->role;
        }

        if (Schema::hasColumn('auth_logs', 'logged_at')) {
            $payload['logged_at'] = now();
        }

        AuthLog::unguarded(fn () => AuthLog::create($payload));
    }
}
