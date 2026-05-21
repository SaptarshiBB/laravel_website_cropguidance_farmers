<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PestAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PestAlertController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->query()) {
            $alerts = Cache::remember('all_pest_alerts', 3600, fn () => PestAlert::with('crop')
                ->where('is_active', true)
                ->orderBy('risk_score', 'desc')
                ->get());

            return response()->json([
                'success' => true,
                'data' => $alerts,
                'total' => $alerts->count(),
            ]);
        }

        $query = PestAlert::with('crop')->where('is_active', true);

        if ($request->has('state') && $request->state !== 'all' && $request->state !== 'All India') {
            $query->whereJsonContains('affected_states', $request->state);
        }

        if ($request->has('severity') && $request->severity !== 'all') {
            $query->where('severity', strtolower($request->severity));
        }

        if ($request->has('crop') && $request->crop !== '') {
            $crop = $request->crop;
            $query->where(fn ($inner) => $inner
                ->whereJsonContains('affected_crops', $crop)
                ->orWhere('affected_crops', 'like', "%{$crop}%"));
        }

        if ($request->has('season') && $request->season !== 'all') {
            $query->where('season', strtolower($request->season));
        }

        $alerts = $query->orderBy('risk_score', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $alerts,
            'total' => $alerts->count(),
        ]);
    }

    public function getByState(Request $request)
    {
        $state = $request->validate(['state' => ['required', 'string']])['state'];

        return $this->index($request->merge(['state' => $state]));
    }

    public function report(Request $request)
    {
        $validated = $request->validate([
            'pest_name' => ['required', 'string'],
            'state' => ['required', 'string'],
            'crop' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sighting report received. Your local KVK/agriculture office can verify the field symptoms.',
            'data' => $validated,
        ], 201);
    }

    public function store(Request $request)
    {
        $alert = PestAlert::create($this->validated($request));
        Cache::forget('all_pest_alerts');
        return response()->json($alert->load('crop'), 201);
    }

    public function update(Request $request, $id)
    {
        $alert = PestAlert::findOrFail($id);
        $alert->update($this->validated($request));
        Cache::forget('all_pest_alerts');
        return response()->json($alert->load('crop'));
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'crop_id' => ['nullable', 'exists:crops,id'],
            'pest_name' => ['required', 'string'],
            'common_name' => ['nullable', 'string'],
            'affected_crops' => ['required', 'array'],
            'affected_states' => ['required', 'array'],
            'season' => ['required', 'string'],
            'severity' => ['required', 'in:low,medium,high,critical'],
            'symptoms' => ['required', 'array'],
            'prevention_organic' => ['required', 'array'],
            'prevention_chemical' => ['required', 'array'],
            'emergency_action' => ['required', 'string'],
            'risk_score' => ['required', 'integer', 'between:0,100'],
            'is_active' => ['boolean'],
            'reported_date' => ['nullable', 'date'],
            'source' => ['nullable', 'string'],
        ]);
    }
}
