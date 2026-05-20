<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    public function current(string $city = 'Pune', ?string $state = 'Maharashtra'): array
    {
        $key = config('services.openweather.key', env('OPENWEATHER_API_KEY'));
        $base = env('OPENWEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5');

        if (!$key || $key === 'your_openweather_api_key_here') {
            return $this->mock($city, $state);
        }

        try {
            $response = Http::timeout(8)->get("{$base}/weather", [
                'q' => $city . ',IN',
                'appid' => $key,
                'units' => 'metric',
            ]);

            if (!$response->successful()) {
                return $this->mock($city, $state);
            }

            $data = $response->json();
            return [
                'city' => $city,
                'state' => $state,
                'temperature' => round($data['main']['temp'] ?? 28, 1),
                'feels_like' => round($data['main']['feels_like'] ?? 30, 1),
                'humidity' => $data['main']['humidity'] ?? 70,
                'wind_speed' => round(($data['wind']['speed'] ?? 3) * 3.6, 1),
                'rainfall' => $data['rain']['1h'] ?? 0,
                'condition' => ucfirst($data['weather'][0]['description'] ?? 'Partly cloudy'),
                'visibility' => round(($data['visibility'] ?? 9000) / 1000, 1),
                'pressure' => $data['main']['pressure'] ?? 1010,
                'uv_index' => 6,
                'sunrise' => date('H:i', $data['sys']['sunrise'] ?? time()),
                'sunset' => date('H:i', $data['sys']['sunset'] ?? time()),
                'recommendations' => $this->farmingAdvice($data['main']['temp'] ?? 28, $data['rain']['1h'] ?? 0),
            ];
        } catch (\Throwable) {
            return $this->mock($city, $state);
        }
    }

    public function forecast(string $city = 'Pune', ?string $state = 'Maharashtra'): array
    {
        $current = $this->current($city, $state);
        $days = ['Today', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
        $forecast = collect($days)->map(function ($day, $i) use ($current) {
            $rain = max(5, min(95, 22 + ($i * 9) + (($i % 2) * 18)));
            return [
                'day' => $day,
                'high' => round($current['temperature'] + 2 + ($i % 3), 1),
                'low' => round($current['temperature'] - 5 - ($i % 2), 1),
                'rain_chance' => $rain,
                'condition' => $rain > 55 ? 'Rain showers' : ($i % 3 === 0 ? 'Sunny' : 'Partly cloudy'),
                'rainfall' => round($rain / 18, 1),
            ];
        })->values()->all();

        $hourly = collect(range(1, 12))->map(fn ($i) => [
            'time' => now()->addHours($i)->format('H:00'),
            'temperature' => round($current['temperature'] + sin($i / 2) * 3, 1),
            'rain_chance' => max(5, min(90, 18 + ($i * 5))),
        ])->all();

        return ['current' => $current, 'daily' => $forecast, 'hourly' => $hourly, 'warnings' => $this->warnings($current)];
    }

    private function mock(string $city, ?string $state): array
    {
        $stateTemps = ['Punjab' => 31, 'Maharashtra' => 29, 'West Bengal' => 30, 'Tamil Nadu' => 33, 'Rajasthan' => 36, 'Kerala' => 28];
        $temp = $stateTemps[$state] ?? 29;
        $rain = in_array($state, ['Kerala', 'West Bengal', 'Assam'], true) ? 8.4 : 1.8;

        return [
            'city' => $city,
            'state' => $state ?: 'Maharashtra',
            'temperature' => $temp,
            'feels_like' => $temp + 2,
            'humidity' => $rain > 5 ? 82 : 64,
            'wind_speed' => 12.5,
            'rainfall' => $rain,
            'condition' => $rain > 5 ? 'Light monsoon showers' : 'Partly cloudy',
            'visibility' => 9.2,
            'pressure' => 1009,
            'uv_index' => 7,
            'sunrise' => '05:52',
            'sunset' => '18:48',
            'recommendations' => $this->farmingAdvice($temp, $rain),
        ];
    }

    private function farmingAdvice(float $temp, float $rain): array
    {
        $advice = [];
        $advice[] = $rain > 5 ? 'Avoid pesticide spraying until foliage dries.' : 'Good window for spraying in early morning or late evening.';
        $advice[] = $temp > 34 ? 'Use mulching and short irrigation cycles to reduce heat stress.' : 'Temperature is suitable for routine field operations.';
        $advice[] = $rain > 2 ? 'Skip irrigation today and inspect drainage channels.' : 'Schedule irrigation based on soil moisture before noon.';
        return $advice;
    }

    private function warnings(array $current): array
    {
        $warnings = [];
        if ($current['rainfall'] > 6) {
            $warnings[] = ['severity' => 'high', 'message' => 'Heavy rainfall may cause waterlogging in low-lying plots.'];
        }
        if ($current['temperature'] > 36) {
            $warnings[] = ['severity' => 'medium', 'message' => 'Heat stress risk for vegetables and pulses.'];
        }
        return $warnings;
    }
}
