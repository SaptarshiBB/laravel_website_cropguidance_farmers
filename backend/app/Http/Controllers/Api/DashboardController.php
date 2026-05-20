<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\PestAlert;
use App\Models\Recommendation;
use App\Models\Scheme;
use App\Models\User;
use App\Services\WeatherService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private WeatherService $weather) {}

    public function getFarmerSummary(Request $request)
    {
        $user = $request->user();
        $forecast = $this->weather->forecast($user->district ?: 'Pune', $user->state ?: 'Maharashtra');
        $alerts = PestAlert::with('crop')->where('is_active', true)->latest()->take(4)->get();
        $crops = Crop::latest()->take(3)->get();
        $schemes = Scheme::where('is_active', true)->latest()->take(2)->get();

        return response()->json([
            'weather' => $forecast['current'],
            'weekly_rainfall' => collect($forecast['daily'])->map(fn ($d) => ['day' => $d['day'], 'rainfall' => $d['rainfall']])->all(),
            'temperature_trend' => collect($forecast['daily'])->map(fn ($d) => ['day' => $d['day'], 'temperature' => $d['high']])->all(),
            'yield_prediction' => [['month' => 'Jun', 'yield' => 18], ['month' => 'Jul', 'yield' => 24], ['month' => 'Aug', 'yield' => 32], ['month' => 'Sep', 'yield' => 38], ['month' => 'Oct', 'yield' => 44]],
            'alerts' => $alerts,
            'recommended_crops' => $crops,
            'schemes' => $schemes,
            'tips' => ['Scout fields every 3-4 days after rain.', 'Use mulching to reduce evaporation.', 'Keep fertilizer away from direct seed contact.'],
            'irrigation' => 'Irrigate in the early morning only if topsoil is dry below 5 cm.',
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
