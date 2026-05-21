<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeatherLog;
use App\Services\WeatherService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(private WeatherService $weatherService) {}

    public function getCurrentWeather(Request $request)
    {
        $request->validate(['city' => 'required|string|min:2', 'state' => 'nullable|string']);
        $city = $request->query('city', 'Delhi');
        $state = $request->query('state', '');
        $data = $this->weatherService->getWeatherByCity($city, $state);
        $data['unit'] = $data['unit'] ?? '°C';
        $data['location'] = $data['location'] ?? ($data['state'] ? "{$data['city']}, {$data['state']}" : $data['city']);

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function getForecast(Request $request)
    {
        $request->validate(['city' => 'required|string|min:2', 'state' => 'nullable|string']);
        $city = $request->query('city', 'Delhi');
        $state = $request->query('state', '');
        $data = $this->weatherService->getForecastByCity($city, $state);

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function storeWeatherLog(Request $request)
    {
        $validated = $request->validate([
            'city' => ['required', 'string'],
            'state' => ['required', 'string'],
            'temperature' => ['required', 'numeric'],
            'humidity' => ['required', 'integer'],
            'wind_speed' => ['required', 'numeric'],
            'rainfall' => ['nullable', 'numeric'],
            'condition' => ['required', 'string'],
            'forecast_data' => ['nullable', 'array'],
        ]);

        $log = WeatherLog::create($validated + [
            'user_id' => $request->user()->id,
            'rainfall' => $validated['rainfall'] ?? 0,
        ]);

        return response()->json($log, 201);
    }
}
