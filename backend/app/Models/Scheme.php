<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scheme extends Model
{
    protected $fillable = ['name', 'ministry', 'description', 'benefits', 'eligibility', 'apply_url', 'deadline', 'is_active', 'image_url'];
    protected $casts = ['benefits' => 'array', 'deadline' => 'date', 'is_active' => 'boolean'];
}
