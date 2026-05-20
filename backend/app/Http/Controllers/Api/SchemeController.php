<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scheme;
use Illuminate\Http\Request;

class SchemeController extends Controller
{
    public function index()
    {
        return response()->json(Scheme::where('is_active', true)->latest()->get());
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
        return response()->json($scheme, 201);
    }
}
