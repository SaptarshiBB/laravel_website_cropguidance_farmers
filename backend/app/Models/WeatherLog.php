<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherLog extends Model
{
    protected $fillable = ['user_id', 'city', 'state', 'temperature', 'humidity', 'wind_speed', 'rainfall', 'condition', 'forecast_data'];
    protected $casts = ['forecast_data' => 'array', 'temperature' => 'float', 'wind_speed' => 'float', 'rainfall' => 'float'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
