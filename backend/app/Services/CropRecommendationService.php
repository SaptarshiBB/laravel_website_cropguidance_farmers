<?php

namespace App\Services;

use App\Models\Crop;

class CropRecommendationService
{
    public function recommend(array $input): array
    {
        $soil = strtolower($input['soil_type']);
        $season = strtolower($input['season']);
        $temp = (float) $input['temperature'];
        $rain = (float) $input['rainfall'];
        $water = strtolower($input['water_availability']);

        $crops = Crop::query()->where('season', $season)->get()->map(function (Crop $crop) use ($soil, $temp, $rain, $water) {
            $score = 35;
            if (in_array($soil, array_map('strtolower', $crop->soil_types), true)) {
                $score += 25;
            }
            if ($temp >= $crop->min_temp && $temp <= $crop->max_temp) {
                $score += 20;
            } else {
                $score += max(0, 12 - min(abs($temp - $crop->min_temp), abs($temp - $crop->max_temp)));
            }
            if ($rain >= $crop->min_rainfall && $rain <= $crop->max_rainfall) {
                $score += 15;
            } else {
                $score += max(0, 10 - min(abs($rain - $crop->min_rainfall), abs($rain - $crop->max_rainfall)) / 100);
            }
            if (($water === 'irrigated' && $crop->max_rainfall < 1000) || ($water === 'rainfed' && $crop->min_rainfall < 800) || $water === 'semi-irrigated') {
                $score += 5;
            }

            return [
                'id' => $crop->id,
                'name' => $crop->name,
                'season' => $crop->season,
                'soil_types' => $crop->soil_types,
                'image_url' => $crop->image_url,
                'yield_per_acre' => $crop->yield_per_acre,
                'fertilizer_recommendation' => $crop->fertilizer_recommendation,
                'description' => $crop->description,
                'suitability_score' => min(99, round($score)),
                'water_needs' => $crop->min_rainfall > 900 ? 'High' : ($crop->min_rainfall > 450 ? 'Medium' : 'Low'),
            ];
        })->sortByDesc('suitability_score')->take(3)->values()->all();

        return [
            'crops' => $crops,
            'fertilizer_advice' => 'Use soil-test based NPK application, add 2-3 tonnes compost per acre, split nitrogen into basal and top dressing stages, and add micronutrients only after deficiency symptoms or lab report.',
            'ai_guidance' => 'Based on season, soil, temperature, rainfall, and water availability, the top crop balances climate fit with input efficiency. Prepare drainage before sowing, choose certified seed, and monitor pest advisories weekly.',
            'calendar' => ['Land preparation', 'Seed treatment', 'Sowing', 'First irrigation', 'Nutrient top dressing', 'Pest scouting', 'Harvest planning'],
        ];
    }
}
