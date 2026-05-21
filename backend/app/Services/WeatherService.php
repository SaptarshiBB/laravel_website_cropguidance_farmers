<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WeatherService
{
    private string $baseUrl = 'https://api.openweathermap.org/data/2.5';

    public function getWeatherByCity(string $city, ?string $state = null): array
    {
        $key = config('services.openweather.key', env('OPENWEATHER_API_KEY'));

        if (!$key || $key === 'your_openweather_api_key_here') {
            return $this->mockWeather($city, $state);
        }

        try {
            $current = Http::timeout(8)->get("{$this->baseUrl}/weather", [
                'q' => trim($city) . ',IN',
                'appid' => $key,
                'units' => 'metric',
            ]);

            if (!$current->successful()) {
                return $this->mockWeather($city, $state);
            }

            $currentData = $current->json();
            $forecastData = $this->fetchForecast($city, $key);

            return $this->formatWeather($currentData, $forecastData, $city, $state);
        } catch (\Throwable) {
            return $this->mockWeather($city, $state);
        }
    }

    public function getForecastByCity(string $city, ?string $state = null): array
    {
        return [
            'forecast' => $this->getWeatherByCity($city, $state)['forecast'],
            'hourly' => $this->getWeatherByCity($city, $state)['hourly'],
        ];
    }

    public function current(string $city = 'Pune', ?string $state = null): array
    {
        return $this->getWeatherByCity($city, $state);
    }

    public function forecast(string $city = 'Pune', ?string $state = null): array
    {
        $weather = $this->getWeatherByCity($city, $state);
        return ['current' => $weather, 'daily' => $weather['forecast'], 'hourly' => $weather['hourly'], 'warnings' => []];
    }

    private function fetchForecast(string $city, string $key): array
    {
        $response = Http::timeout(8)->get("{$this->baseUrl}/forecast", [
            'q' => trim($city) . ',IN',
            'appid' => $key,
            'units' => 'metric',
        ]);

        return $response->successful() ? $response->json() : [];
    }

    private function formatWeather(array $current, array $forecast, string $requestedCity, ?string $stateName = null): array
    {
        $weather = $current['weather'][0] ?? [];
        $windKmh = round(($current['wind']['speed'] ?? 0) * 3.6, 1);
        $daily = $this->dailyForecast($forecast['list'] ?? [], $current);
        $hourly = $this->hourlyForecast($forecast['list'] ?? [], $current);
        $rainChance = max(array_column($hourly, 'rain_chance') ?: [0]);
        $condition = $weather['description'] ?? 'clear sky';
        $temp = round($current['main']['temp'] ?? random_int(35, 44), 1);
        $cityName = $current['name'] ?? $requestedCity;
        $stateName = trim((string) $stateName);

        return [
            'city' => $cityName,
            'state' => $stateName,
            'country' => $current['sys']['country'] ?? 'IN',
            'location' => $stateName ? "{$cityName}, {$stateName}" : $cityName,
            'temperature' => $temp,
            'feels_like' => round($current['main']['feels_like'] ?? $temp, 1),
            'temp_min' => round($current['main']['temp_min'] ?? $temp, 1),
            'temp_max' => round($current['main']['temp_max'] ?? $temp, 1),
            'unit' => '°C',
            'humidity' => (int) ($current['main']['humidity'] ?? 60),
            'wind_speed' => $windKmh,
            'pressure' => (int) ($current['main']['pressure'] ?? 1010),
            'visibility' => (int) ($current['visibility'] ?? 8000),
            'condition' => Str::title($condition),
            'condition_icon' => $weather['icon'] ?? '01d',
            'sunrise' => $current['sys']['sunrise'] ?? now()->timestamp,
            'sunset' => $current['sys']['sunset'] ?? now()->addHours(12)->timestamp,
            'forecast' => $daily,
            'hourly' => $hourly,
            'farming_advice' => $this->farmingAdvice($condition, $temp, $windKmh, $rainChance),
        ];
    }

    private function dailyForecast(array $items, array $current): array
    {
        $grouped = [];
        foreach ($items as $item) {
            $date = Carbon::parse($item['dt_txt'])->toDateString();
            $grouped[$date][] = $item;
        }

        $days = [];
        foreach ($grouped as $date => $entries) {
            $temps = array_map(fn ($entry) => (float) $entry['main']['temp'], $entries);
            $rain = array_map(fn ($entry) => (float) (($entry['pop'] ?? 0) * 100), $entries);
            $midday = $entries[min(3, count($entries) - 1)];
            $days[] = [
                'date' => $date,
                'day_name' => Carbon::parse($date)->isToday() ? 'Today' : Carbon::parse($date)->format('D'),
                'high' => round(max($temps), 1),
                'low' => round(min($temps), 1),
                'condition' => Str::title($midday['weather'][0]['description'] ?? 'Partly cloudy'),
                'icon' => $midday['weather'][0]['icon'] ?? '02d',
                'rain_chance' => (int) round(max($rain ?: [0])),
                'humidity' => (int) round(collect($entries)->avg('main.humidity')),
                'wind' => round(max(array_map(fn ($entry) => ($entry['wind']['speed'] ?? 0) * 3.6, $entries)), 1),
            ];
        }

        if (empty($days)) {
            return $this->mockDaily($current['main']['temp'] ?? random_int(35, 44), $current['weather'][0]['description'] ?? 'Clear sky');
        }

        return array_slice(array_values($days), 0, 7);
    }

    private function hourlyForecast(array $items, array $current): array
    {
        if (empty($items)) {
            return $this->mockHourly($current['main']['temp'] ?? random_int(35, 44), $current['weather'][0]['description'] ?? 'Clear sky');
        }

        return array_map(fn ($item) => [
            'time' => Carbon::parse($item['dt_txt'])->format('H:i'),
            'temp' => round($item['main']['temp'] ?? random_int(35, 44), 1),
            'condition' => Str::title($item['weather'][0]['description'] ?? 'Partly cloudy'),
            'icon' => $item['weather'][0]['icon'] ?? '02d',
            'rain_chance' => (int) round(($item['pop'] ?? 0) * 100),
        ], array_slice($items, 0, 12));
    }

    private function mockWeather(string $city, ?string $state = null): array
    {
        $seed = crc32(Str::lower($city));
        $temp = random_int(35, 44);
        $feelsLike = random_int(38, 47);
        $tempMin = random_int(33, 38);
        $tempMax = random_int(40, 46);
        $rainChance = 15 + ($seed % 55);
        $wind = 8 + ($seed % 24);
        $condition = $rainChance > 60 ? 'light rain' : ($temp > 34 ? 'clear sky' : 'partly cloudy');
        $cityName = trim($city);
        $stateName = trim((string) $state);

        return [
            'city' => $cityName,
            'state' => $stateName,
            'country' => 'IN',
            'location' => $stateName ? "{$cityName}, {$stateName}" : $cityName,
            'temperature' => (float) $temp,
            'feels_like' => (float) $feelsLike,
            'temp_min' => (float) $tempMin,
            'temp_max' => (float) $tempMax,
            'unit' => '°C',
            'humidity' => 52 + ($seed % 38),
            'wind_speed' => (float) $wind,
            'pressure' => 1002 + ($seed % 20),
            'visibility' => 7000 + ($seed % 3000),
            'condition' => Str::title($condition),
            'condition_icon' => $rainChance > 60 ? '10d' : '02d',
            'sunrise' => now()->startOfDay()->addHours(5)->addMinutes(45)->timestamp,
            'sunset' => now()->startOfDay()->addHours(18)->addMinutes(35)->timestamp,
            'forecast' => $this->mockDaily($temp, $condition),
            'hourly' => $this->mockHourly($temp, $condition),
            'farming_advice' => $this->farmingAdvice($condition, $temp, $wind, $rainChance),
        ];
    }

    private function mockDaily(float $temp, string $condition): array
    {
        return collect(range(0, 6))->map(fn ($day) => [
            'date' => now()->addDays($day)->toDateString(),
            'day_name' => $day === 0 ? 'Today' : now()->addDays($day)->format('D'),
            'high' => (float) random_int(40, 46),
            'low' => (float) random_int(33, 38),
            'condition' => Str::title($condition),
            'icon' => str_contains($condition, 'rain') ? '10d' : '02d',
            'rain_chance' => min(95, 20 + ($day * 9)),
            'humidity' => min(92, 58 + ($day * 4)),
            'wind' => round(10 + ($day * 2.5), 1),
        ])->all();
    }

    private function mockHourly(float $temp, string $condition): array
    {
        return collect(range(1, 12))->map(fn ($hour) => [
            'time' => now()->addHours($hour)->format('H:i'),
            'temp' => (float) random_int(35, 44),
            'condition' => Str::title($condition),
            'icon' => str_contains($condition, 'rain') ? '10d' : '02d',
            'rain_chance' => min(90, 12 + ($hour * 5)),
        ])->all();
    }

    private function farmingAdvice(string $condition, float $temp, float $wind, float $rain): string
    {
        $condition = Str::lower($condition);

        if (str_contains($condition, 'storm') || str_contains($condition, 'thunder')) {
            return 'Storm alert. Do not go to fields. Secure equipment.';
        }
        if ($rain > 70) {
            return 'Avoid spraying pesticides today. Good time to skip irrigation.';
        }
        if ($temp > 40) {
            return 'Heatwave risk. Water crops early morning. Protect livestock.';
        }
        if ($wind > 30) {
            return 'High winds. Delay crop spraying. Secure greenhouses.';
        }
        if (str_contains($condition, 'clear') && $temp >= 20 && $temp <= 30) {
            return 'Ideal conditions for field work and harvesting.';
        }
        if ($temp < 12) {
            return 'Cold stress possible. Protect nursery beds and delay irrigation until late morning.';
        }
        if (str_contains($condition, 'rain')) {
            return 'Monitor drainage and avoid fertilizer application until rainfall passes.';
        }

        return 'Weather is suitable for routine field scouting, irrigation checks, and light field work.';
    }
}
