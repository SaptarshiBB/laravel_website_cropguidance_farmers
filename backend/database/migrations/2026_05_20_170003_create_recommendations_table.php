<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('soil_type');
            $table->string('state');
            $table->enum('season', ['kharif', 'rabi', 'zaid']);
            $table->decimal('temperature', 5, 2);
            $table->decimal('rainfall', 8, 2);
            $table->string('water_availability');
            $table->json('recommended_crops');
            $table->text('fertilizer_advice');
            $table->text('ai_guidance');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
