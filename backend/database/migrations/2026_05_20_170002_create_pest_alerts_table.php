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
            $table->foreignId('crop_id')->constrained()->cascadeOnDelete();
            $table->string('pest_name');
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->json('affected_states');
            $table->text('symptoms');
            $table->text('prevention');
            $table->text('emergency_action');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pest_alerts');
    }
};
