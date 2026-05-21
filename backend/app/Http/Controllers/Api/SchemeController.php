<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scheme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SchemeController extends Controller
{
    public function index()
    {
        $schemes = Cache::remember('all_schemes', 3600, fn () => Scheme::where('is_active', true)->latest()->get());

        return response()->json($schemes);
    }

    public function show($id)
    {
        return response()->json(Scheme::findOrFail($id));
    }

    public function store(Request $request)
    {
        $scheme = Scheme::create($request->validate([
            'name' => ['required', 'string'], 'ministry' => ['required', 'string'], 'description' => ['required', 'string'], 'benefits' => ['required', 'array'],
            'eligibility' => ['required', 'string'], 'apply_url' => ['required', 'url'], 'deadline' => ['nullable', 'date'], 'is_active' => ['boolean'], 'image_url' => ['nullable', 'url'],
        ]));
        Cache::forget('all_schemes');
        return response()->json($scheme, 201);
    }
}
