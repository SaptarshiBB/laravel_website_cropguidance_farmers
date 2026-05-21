<?php

namespace App\Services;

use App\Models\Crop;

class CropRecommendationService
{
    public function getRecommendations(array $inputs): array
    {
        $inputs['season'] = strtolower($inputs['season']);
        $inputs['water_availability'] = $this->normalizeWater($inputs['water_availability'] ?? 'medium');
        $inputs['soil_type'] = $this->normalizeSoil($inputs['soil_type'] ?? '');
        $scored = [];

        foreach (Crop::all() as $crop) {
            $score = 0;
            $reasons = [];
            $warnings = [];

            if (!in_array($inputs['season'], [$crop->season, 'any'], true)) {
                continue;
            }

            if (in_array($inputs['state'], $crop->suitable_states ?? [], true)) {
                $score += 30;
                $reasons[] = "Well-suited for {$inputs['state']}";
            } else {
                continue;
            }

            if (in_array($inputs['soil_type'], $crop->suitable_soils ?? [], true)) {
                $score += 25;
                $reasons[] = "Ideal for {$inputs['soil_type']} soil";
            } else {
                $score -= 10;
                $warnings[] = "Not ideal for {$inputs['soil_type']} soil";
            }

            $temperature = (float) $inputs['temperature'];
            if ($temperature >= $crop->min_temp && $temperature <= $crop->max_temp) {
                $score += 20;
                $reasons[] = "Temperature {$temperature}C is optimal";
            } elseif ($temperature < $crop->min_temp - 5 || $temperature > $crop->max_temp + 5) {
                $score -= 15;
                $warnings[] = 'Temperature not ideal';
            } else {
                $score += 5;
            }

            $rainfall = (float) $inputs['rainfall'];
            if ($rainfall >= $crop->min_rainfall && $rainfall <= $crop->max_rainfall) {
                $score += 15;
                $reasons[] = "Rainfall {$rainfall}mm matches requirement";
            } elseif ($rainfall < $crop->min_rainfall * 0.7) {
                $score -= 10;
                $warnings[] = 'Insufficient rainfall - irrigation needed';
            } else {
                $score += 5;
            }

            $waterMap = ['low' => 1, 'medium' => 2, 'high' => 3];
            $inputWater = $waterMap[$inputs['water_availability']] ?? 2;
            $cropWater = $waterMap[$crop->water_requirement] ?? 2;
            if ($inputWater >= $cropWater) {
                $score += 10;
                $reasons[] = 'Water availability matches crop requirement';
            } else {
                $score -= 5;
                $warnings[] = 'May need additional irrigation';
            }

            if ($score > 0) {
                $scored[] = [
                    'crop' => $crop,
                    'score' => $score,
                    'suitability_percent' => min(100, max(0, $score)),
                    'reasons' => $reasons,
                    'warnings' => $warnings,
                    'fertilizer_advice' => $this->getFertilizerAdvice($crop, $inputs),
                    'yield_estimate' => $crop->yield_per_acre,
                    'farming_calendar' => $this->getFarmingCalendar($crop),
                ];
            }
        }

        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($scored, 0, 5);
    }

    public function recommend(array $inputs): array
    {
        $recommendations = $this->getRecommendations($inputs);

        return [
            'recommendations' => $recommendations,
            'crops' => array_map(fn ($item) => $item['crop'], $recommendations),
            'fertilizer_advice' => 'Use the crop-specific NPK schedules shown in each recommendation.',
            'ai_guidance' => 'Recommendations are filtered by state first, then scored by soil, temperature, rainfall, and water availability.',
            'calendar' => ['Sowing', 'Growing', 'Harvesting'],
        ];
    }

    private function getFertilizerAdvice(Crop $crop, array $inputs): array
    {
        $npk = $crop->fertilizer_npk ?? [];

        return [
            'npk' => $npk,
            'schedule' => [
                'basal' => 'Apply ' . ($npk['P'] ?? 20) . 'kg P2O5 and ' . ($npk['K'] ?? 20) . 'kg K2O at sowing',
                'top_dress_1' => 'Apply ' . (($npk['N'] ?? 40) / 2) . 'kg N/acre at 30 days',
                'top_dress_2' => 'Apply remaining ' . (($npk['N'] ?? 40) / 2) . 'kg N/acre at 60 days',
            ],
            'organic' => $crop->organic_fertilizer,
            'soil_amendment' => $inputs['soil_type'] === 'Sandy'
                ? 'Add organic matter/FYM to improve water retention'
                : ($inputs['soil_type'] === 'Clay' ? 'Add gypsum to improve drainage' : 'Soil structure is good'),
        ];
    }

    private function getFarmingCalendar(Crop $crop): array
    {
        return [
            'sowing' => $crop->sowing_months,
            'growing' => [$crop->duration_days . ' days total crop duration'],
            'harvesting' => $crop->harvest_months,
        ];
    }

    private function normalizeWater(string $water): string
    {
        return match (strtolower($water)) {
            'irrigated', 'ample', 'high' => 'high',
            'rainfed', 'low' => 'low',
            default => 'medium',
        };
    }

    private function normalizeSoil(string $soil): string
    {
        return match ($soil) {
            'Black (Regur)' => 'Black',
            'Saline/Alkaline' => 'Saline',
            default => $soil,
        };
    }
}
