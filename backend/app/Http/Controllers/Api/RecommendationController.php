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
            'soil_type' => ['required', 'string'], 'state' => ['required', 'string'], 'season' => ['required', 'in:kharif,rabi,zaid'],
            'temperature' => ['required', 'numeric', 'between:0,60'], 'rainfall' => ['required', 'numeric', 'min:0'], 'water_availability' => ['required', 'string'],
        ]);
        $result = $this->service->recommend($validated);
        $record = Recommendation::create($validated + [
            'user_id' => $request->user()->id,
            'recommended_crops' => $result['crops'],
            'fertilizer_advice' => $result['fertilizer_advice'],
            'ai_guidance' => $result['ai_guidance'],
        ]);
        return response()->json(['recommendation' => $record, 'result' => $result]);
    }

    public function getUserHistory(Request $request)
    {
        return response()->json($request->user()->recommendations()->latest()->get());
    }
}
