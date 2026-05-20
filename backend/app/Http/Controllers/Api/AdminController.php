<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\PestAlert;
use App\Models\Recommendation;
use App\Models\Scheme;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function getUsers()
    {
        return response()->json(User::latest()->get());
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => ['sometimes', 'string'], 'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['sometimes', 'in:farmer,admin'], 'state' => ['nullable', 'string'], 'district' => ['nullable', 'string'], 'phone' => ['nullable', 'string'],
        ]);
        $user->update($validated);
        return response()->json($user);
    }

    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function getAnalytics()
    {
        return response()->json([
            'totals' => ['users' => User::count(), 'alerts' => PestAlert::count(), 'crops' => Crop::count(), 'schemes' => Scheme::count()],
            'registrations' => [['month' => 'Jan', 'users' => 80], ['month' => 'Feb', 'users' => 130], ['month' => 'Mar', 'users' => 210], ['month' => 'Apr', 'users' => 310], ['month' => 'May', 'users' => 460]],
            'searched_crops' => [['name' => 'Rice', 'value' => 340], ['name' => 'Wheat', 'value' => 290], ['name' => 'Cotton', 'value' => 210], ['name' => 'Maize', 'value' => 180]],
            'active_states' => [['state' => 'Maharashtra', 'users' => 180], ['state' => 'Punjab', 'users' => 155], ['state' => 'West Bengal', 'users' => 132], ['state' => 'Tamil Nadu', 'users' => 118]],
            'alert_response' => [['severity' => 'critical', 'rate' => 86], ['severity' => 'high', 'rate' => 78], ['severity' => 'medium', 'rate' => 65], ['severity' => 'low', 'rate' => 52]],
            'recent_activity' => Recommendation::with('user')->latest()->take(10)->get(),
        ]);
    }
}
