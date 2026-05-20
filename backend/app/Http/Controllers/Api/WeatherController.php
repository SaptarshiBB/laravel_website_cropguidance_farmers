<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeatherLog;
use App\Services\WeatherService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(private WeatherService $weather) {}

    public function getCurrentWeather(Request $request)
    {
        $validated = $request->validate(['city' => ['nullable', 'string'], 'state' => ['nullable', 'string']]);
        return response()->json($this->weather->current($validated['city'] ?? $request->user()->district ?? 'Pune', $validated['state'] ?? $request->user()->state ?? 'Maharashtra'));
    }

    public function getForecast(Request $request)
    {
        $validated = $request->validate(['city' => ['nullable', 'string'], 'state' => ['nullable', 'string']]);
        return response()->json($this->weather->forecast($validated['city'] ?? $request->user()->district ?? 'Pune', $validated['state'] ?? $request->user()->state ?? 'Maharashtra'));
    }

    public function storeWeatherLog(Request $request)
    {
        $validated = $request->validate([
            'city' => ['required', 'string'], 'state' => ['required', 'string'], 'temperature' => ['required', 'numeric'],
            'humidity' => ['required', 'integer'], 'wind_speed' => ['required', 'numeric'], 'rainfall' => ['nullable', 'numeric'],
            'condition' => ['required', 'string'], 'forecast_data' => ['nullable', 'array'],
        ]);
        $log = WeatherLog::create($validated + ['user_id' => $request->user()->id, 'rainfall' => $validated['rainfall'] ?? 0]);
        return response()->json($log, 201);
    }
}
