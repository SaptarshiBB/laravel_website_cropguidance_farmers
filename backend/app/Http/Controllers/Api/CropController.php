<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use Illuminate\Http\Request;

class CropController extends Controller
{
    public function index()
    {
        return response()->json(Crop::with('pestAlerts')->latest()->get());
    }

    public function show($id)
    {
        return response()->json(Crop::with('pestAlerts')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $crop = Crop::create($this->validated($request));
        return response()->json($crop, 201);
    }

    public function update(Request $request, $id)
    {
        $crop = Crop::findOrFail($id);
        $crop->update($this->validated($request));
        return response()->json($crop);
    }

    public function destroy($id)
    {
        Crop::findOrFail($id)->delete();
        return response()->json(['message' => 'Crop deleted successfully.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string'], 'season' => ['required', 'in:kharif,rabi,zaid'], 'soil_types' => ['required', 'array'],
            'min_temp' => ['required', 'numeric'], 'max_temp' => ['required', 'numeric'], 'min_rainfall' => ['required', 'numeric'], 'max_rainfall' => ['required', 'numeric'],
            'fertilizer_recommendation' => ['required', 'string'], 'yield_per_acre' => ['required', 'string'], 'description' => ['required', 'string'], 'image_url' => ['nullable', 'url'],
        ]);
    }
}
