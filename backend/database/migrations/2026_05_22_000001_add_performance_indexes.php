<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('auth_logs', function (Blueprint $table) {
            $table->index('user_id', 'auth_logs_user_id_perf_index');
            $table->index('action', 'auth_logs_action_perf_index');
            $table->index('created_at', 'auth_logs_created_at_perf_index');
        });

        Schema::table('recommendations', function (Blueprint $table) {
            $table->index('user_id', 'recommendations_user_id_perf_index');
            $table->index('created_at', 'recommendations_created_at_perf_index');
        });

        Schema::table('pest_alerts', function (Blueprint $table) {
            if (Schema::hasColumn('pest_alerts', 'state')) {
                $table->index('state', 'pest_alerts_state_perf_index');
            }
            $table->index('season', 'pest_alerts_season_perf_index');
        });

        Schema::table('crops', function (Blueprint $table) {
            $table->index('season', 'crops_season_perf_index');
        });
    }

    public function down(): void
    {
        Schema::table('auth_logs', function (Blueprint $table) {
            $table->dropIndex('auth_logs_user_id_perf_index');
            $table->dropIndex('auth_logs_action_perf_index');
            $table->dropIndex('auth_logs_created_at_perf_index');
        });

        Schema::table('recommendations', function (Blueprint $table) {
            $table->dropIndex('recommendations_user_id_perf_index');
            $table->dropIndex('recommendations_created_at_perf_index');
        });

        Schema::table('pest_alerts', function (Blueprint $table) {
            if (Schema::hasColumn('pest_alerts', 'state')) {
                $table->dropIndex('pest_alerts_state_perf_index');
            }
            $table->dropIndex('pest_alerts_season_perf_index');
        });

        Schema::table('crops', function (Blueprint $table) {
            $table->dropIndex('crops_season_perf_index');
        });
    }
};
