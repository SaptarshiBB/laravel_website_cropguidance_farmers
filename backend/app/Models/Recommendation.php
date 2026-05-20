<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $fillable = ['user_id', 'soil_type', 'state', 'season', 'temperature', 'rainfall', 'water_availability', 'recommended_crops', 'fertilizer_advice', 'ai_guidance'];
    protected $casts = ['recommended_crops' => 'array', 'temperature' => 'float', 'rainfall' => 'float'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
