<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PestAlert extends Model
{
    protected $fillable = ['crop_id', 'pest_name', 'severity', 'affected_states', 'symptoms', 'prevention', 'emergency_action', 'is_active'];
    protected $casts = ['affected_states' => 'array', 'is_active' => 'boolean'];

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
