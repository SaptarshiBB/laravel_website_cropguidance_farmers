<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PestAlert;
use Illuminate\Http\Request;

class PestAlertController extends Controller
{
    public function index()
    {
        return response()->json(PestAlert::with('crop')->where('is_active', true)->latest()->get());
    }

    public function getByState(Request $request)
    {
        $state = $request->validate(['state' => ['required', 'string']])['state'];
        $alerts = PestAlert::with('crop')->where('is_active', true)->get()->filter(fn ($alert) => in_array($state, $alert->affected_states, true))->values();
        return response()->json($alerts);
    }

    public function store(Request $request)
    {
        $alert = PestAlert::create($this->validated($request));
        return response()->json($alert->load('crop'), 201);
    }

    public function update(Request $request, $id)
    {
        $alert = PestAlert::findOrFail($id);
        $alert->update($this->validated($request));
        return response()->json($alert->load('crop'));
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'crop_id' => ['required', 'exists:crops,id'], 'pest_name' => ['required', 'string'], 'severity' => ['required', 'in:low,medium,high,critical'],
            'affected_states' => ['required', 'array'], 'symptoms' => ['required', 'string'], 'prevention' => ['required', 'string'], 'emergency_action' => ['required', 'string'], 'is_active' => ['boolean'],
        ]);
    }
}
