<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\CropController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PestAlertController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\SchemeController;
use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/schemes', [SchemeController::class, 'index']);
Route::get('/schemes/{id}', [SchemeController::class, 'show']);
Route::get('/crops', [CropController::class, 'index']);
Route::get('/crops/{id}', [CropController::class, 'show']);
Route::get('/pest-alerts', [PestAlertController::class, 'index']);
Route::get('/pest-alerts/state', [PestAlertController::class, 'getByState']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/weather', [WeatherController::class, 'getCurrentWeather']);
    Route::get('/weather/forecast', [WeatherController::class, 'getForecast']);
    Route::post('/weather/log', [WeatherController::class, 'storeWeatherLog']);
    Route::get('/recommendations', [RecommendationController::class, 'getUserHistory']);
    Route::post('/recommendations', [RecommendationController::class, 'getRecommendation']);
    Route::get('/dashboard/summary', [DashboardController::class, 'getFarmerSummary']);
    Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/crops', [CropController::class, 'store']);
        Route::put('/crops/{id}', [CropController::class, 'update']);
        Route::delete('/crops/{id}', [CropController::class, 'destroy']);
        Route::post('/pest-alerts', [PestAlertController::class, 'store']);
        Route::put('/pest-alerts/{id}', [PestAlertController::class, 'update']);
        Route::post('/schemes', [SchemeController::class, 'store']);
        Route::get('/admin/analytics', [AdminController::class, 'getAnalytics']);
        Route::get('/dashboard/admin', [DashboardController::class, 'getAdminAnalytics']);
    });
});
