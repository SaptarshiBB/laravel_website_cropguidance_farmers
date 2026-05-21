<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuthLog;
use App\Models\Crop;
use App\Models\PestAlert;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_farmers' => User::where('role', 'farmer')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_crops' => Crop::count(),
            'total_pest_alerts' => PestAlert::count(),
            'total_recommendations' => Recommendation::count(),
            'recent_logins' => AuthLog::with('user:id,name,email')
                ->where('action', 'login')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn (AuthLog $log) => [
                    'name' => $log->user?->name,
                    'email' => $log->user?->email,
                    'created_at' => $log->created_at,
                ]),
        ]);
    }

    public function users()
    {
        return response()->json(User::select('id', 'name', 'email', 'role', 'state', 'created_at')
            ->selectSub(
                AuthLog::select('created_at')
                    ->whereColumn('user_id', 'users.id')
                    ->where('action', 'login')
                    ->latest()
                    ->limit(1),
                'last_login'
            )
            ->latest()
            ->paginate(20)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'state' => $user->state,
                'created_at' => $user->created_at,
                'last_login' => $user->last_login,
            ]));
    }

    public function promote(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'email' => ['nullable', 'email'],
        ]);

        $user = !empty($validated['user_id'])
            ? User::find($validated['user_id'])
            : User::where('email', $validated['email'] ?? '')->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'User is already an admin.'], 422);
        }

        $user->role = 'admin';
        $user->save();

        return response()->json([
            'message' => 'User promoted to admin successfully',
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function demote(Request $request)
    {
        $validated = $request->validate(['user_id' => ['required', 'integer', 'exists:users,id']]);

        if ((int) $validated['user_id'] === (int) Auth::id()) {
            return response()->json(['message' => 'You cannot demote yourself.'], 422);
        }

        $user = User::findOrFail($validated['user_id']);
        $user->role = 'farmer';
        $user->save();

        return response()->json([
            'message' => 'User removed from admin successfully',
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function activityLogs()
    {
        return response()->json(AuthLog::with('user:id,name,email')
            ->latest()
            ->paginate(20)
            ->through(fn (AuthLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at,
                'user' => $log->user ? $log->user->only(['id', 'name', 'email']) : null,
            ]));
    }
}
