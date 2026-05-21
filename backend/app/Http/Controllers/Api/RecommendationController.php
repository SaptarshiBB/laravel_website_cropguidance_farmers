<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use App\Services\CropRecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(private CropRecommendationService $service) {}

    public function getRecommendation(Request $request)
    {
        $validated = $request->validate([
            'soil_type' => ['required', 'string'],
            'state' => ['required', 'string'],
            'season' => ['required', 'in:kharif,rabi,zaid'],
            'temperature' => ['required', 'numeric', 'between:0,60'],
            'rainfall' => ['required', 'numeric', 'min:0'],
            'water_availability' => ['required', 'string'],
            'budget' => ['nullable', 'string'],
        ]);

        $recommendations = $this->service->getRecommendations($validated);

        if ($request->user()) {
            Recommendation::create([
                'user_id' => $request->user()->id,
                'soil_type' => $validated['soil_type'],
                'state' => $validated['state'],
                'season' => $validated['season'],
                'temperature' => $validated['temperature'],
                'rainfall' => $validated['rainfall'],
                'water_availability' => $validated['water_availability'],
                'recommended_crops' => $recommendations,
                'fertilizer_advice' => 'See crop-specific fertilizer schedule.',
                'ai_guidance' => 'State suitability is a hard filter; soil, weather, rainfall, and water availability determine the score.',
            ]);
        }

        return response()->json(['success' => true, 'data' => $recommendations, 'result' => ['recommendations' => $recommendations]]);
    }

    public function getUserHistory(Request $request)
    {
        return response()->json($request->user()->recommendations()->with('user')->latest()->paginate(20));
    }
}
