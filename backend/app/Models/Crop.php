<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [
        'name', 'local_names', 'season', 'suitable_states', 'suitable_soils', 'min_temp', 'max_temp',
        'min_rainfall', 'max_rainfall', 'water_requirement', 'fertilizer_npk', 'organic_fertilizer',
        'yield_per_acre', 'duration_days', 'sowing_months', 'harvest_months', 'description',
        'precautions', 'image_url',
    ];

    protected $casts = [
        'local_names' => 'array',
        'suitable_states' => 'array',
        'suitable_soils' => 'array',
        'min_temp' => 'float',
        'max_temp' => 'float',
        'min_rainfall' => 'float',
        'max_rainfall' => 'float',
        'fertilizer_npk' => 'array',
        'yield_per_acre' => 'array',
        'duration_days' => 'integer',
        'sowing_months' => 'array',
        'harvest_months' => 'array',
        'precautions' => 'array',
    ];

    public function pestAlerts()
    {
        return $this->hasMany(PestAlert::class);
    }
}
