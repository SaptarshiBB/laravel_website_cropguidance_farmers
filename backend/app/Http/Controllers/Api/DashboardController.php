<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\PestAlert;
use App\Models\Recommendation;
use App\Models\Scheme;
use App\Models\User;
use App\Services\CropRecommendationService;
use App\Services\WeatherService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private WeatherService $weather, private CropRecommendationService $recommendations) {}

    public function getFarmerSummary(Request $request)
    {
        $user = $request->user();
        $weather = $this->weather->getWeatherByCity($user->district ?: ($user->state ?: 'Delhi'), $user->state ?: '');
        $alerts = PestAlert::with('crop')
            ->where('is_active', true)
            ->when($user->state, fn ($query) => $query->whereJsonContains('affected_states', $user->state))
            ->orderBy('risk_score', 'desc')
            ->take(4)
            ->get();
        $recommended = $this->recommendations->getRecommendations([
            'state' => $user->state ?: 'Punjab',
            'soil_type' => 'Loamy',
            'season' => 'kharif',
            'temperature' => $weather['temperature'],
            'rainfall' => 800,
            'water_availability' => 'medium',
            'budget' => 'medium',
        ]);
        $schemes = Scheme::where('is_active', true)->latest()->take(2)->get();

        return response()->json([
            'weather' => $weather,
            'weekly_rainfall' => collect($weather['forecast'])->map(fn ($day) => ['day' => $day['day_name'], 'rainfall' => $day['rain_chance']])->all(),
            'temperature_trend' => collect($weather['forecast'])->map(fn ($day) => ['day' => $day['day_name'], 'temperature' => $day['high']])->all(),
            'yield_prediction' => collect($recommended)->map(fn ($item) => ['month' => $item['crop']->name, 'yield' => $item['suitability_percent']])->all(),
            'alerts' => $alerts,
            'recommended_crops' => $recommended,
            'schemes' => $schemes,
            'tips' => [$weather['farming_advice'], 'Scout fields every 3-4 days after rain.', 'Use soil-test based fertilizer doses.'],
            'irrigation' => $weather['farming_advice'],
        ]);
    }

    public function getAdminAnalytics(Request $request)
    {
        return response()->json([
            'totals' => ['users' => User::count(), 'alerts' => PestAlert::where('is_active', true)->count(), 'crops' => Crop::count(), 'schemes' => Scheme::count()],
            'user_growth' => [['month' => 'Jan', 'users' => 120], ['month' => 'Feb', 'users' => 180], ['month' => 'Mar', 'users' => 260], ['month' => 'Apr', 'users' => 390], ['month' => 'May', 'users' => User::count() + 420]],
            'alerts_by_severity' => PestAlert::selectRaw('severity, count(*) as count')->groupBy('severity')->get(),
            'recent_users' => User::latest()->take(8)->get(),
            'recent_recommendations' => Recommendation::with('user')->latest()->take(8)->get(),
        ]);
    }
}
