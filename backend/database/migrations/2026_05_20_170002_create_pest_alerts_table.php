<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pest_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crop_id')->nullable()->constrained()->nullOnDelete();
            $table->string('pest_name');
            $table->string('common_name')->nullable();
            $table->json('affected_crops');
            $table->json('affected_states');
            $table->string('season');
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->json('symptoms');
            $table->json('prevention_organic');
            $table->json('prevention_chemical');
            $table->text('emergency_action');
            $table->unsignedTinyInteger('risk_score')->default(0);
            $table->boolean('is_active')->default(true);
            $table->date('reported_date')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pest_alerts');
    }
};
