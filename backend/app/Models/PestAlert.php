<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PestAlert extends Model
{
    protected $fillable = [
        'crop_id', 'pest_name', 'common_name', 'affected_crops', 'affected_states', 'season',
        'severity', 'symptoms', 'prevention_organic', 'prevention_chemical', 'emergency_action',
        'risk_score', 'is_active', 'reported_date', 'source',
    ];

    protected $casts = [
        'affected_crops' => 'array',
        'affected_states' => 'array',
        'symptoms' => 'array',
        'prevention_organic' => 'array',
        'prevention_chemical' => 'array',
        'risk_score' => 'integer',
        'is_active' => 'boolean',
        'reported_date' => 'date',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
