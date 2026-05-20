<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('city');
            $table->string('state');
            $table->decimal('temperature', 5, 2);
            $table->unsignedInteger('humidity');
            $table->decimal('wind_speed', 6, 2);
            $table->decimal('rainfall', 8, 2)->default(0);
            $table->string('condition');
            $table->json('forecast_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_logs');
    }
};
