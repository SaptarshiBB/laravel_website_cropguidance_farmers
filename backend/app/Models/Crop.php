<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = ['name', 'season', 'soil_types', 'min_temp', 'max_temp', 'min_rainfall', 'max_rainfall', 'fertilizer_recommendation', 'yield_per_acre', 'description', 'image_url'];
    protected $casts = ['soil_types' => 'array', 'min_temp' => 'float', 'max_temp' => 'float', 'min_rainfall' => 'float', 'max_rainfall' => 'float'];

    public function pestAlerts()
    {
        return $this->hasMany(PestAlert::class);
    }
}
