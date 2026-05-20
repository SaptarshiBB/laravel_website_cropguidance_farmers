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
            $table->enum('season', ['kharif', 'rabi', 'zaid']);
            $table->json('soil_types');
            $table->decimal('min_temp', 5, 2);
            $table->decimal('max_temp', 5, 2);
            $table->decimal('min_rainfall', 8, 2);
            $table->decimal('max_rainfall', 8, 2);
            $table->text('fertilizer_recommendation');
            $table->string('yield_per_acre');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
