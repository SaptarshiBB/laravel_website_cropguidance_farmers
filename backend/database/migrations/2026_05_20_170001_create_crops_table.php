<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('local_names');
            $table->enum('season', ['kharif', 'rabi', 'zaid']);
            $table->json('suitable_states');
            $table->json('suitable_soils');
            $table->decimal('min_temp', 5, 2);
            $table->decimal('max_temp', 5, 2);
            $table->decimal('min_rainfall', 8, 2);
            $table->decimal('max_rainfall', 8, 2);
            $table->enum('water_requirement', ['low', 'medium', 'high']);
            $table->json('fertilizer_npk');
            $table->string('organic_fertilizer');
            $table->json('yield_per_acre');
            $table->unsignedSmallInteger('duration_days');
            $table->json('sowing_months');
            $table->json('harvest_months');
            $table->text('description');
            $table->json('precautions');
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
