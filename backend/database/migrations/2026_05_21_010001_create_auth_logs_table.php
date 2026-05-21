<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('auth_logs')) {
            Schema::create('auth_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->enum('action', ['login', 'logout', 'register']);
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->timestamps();
            });

            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::table('auth_logs')->where('action', 'failed_login')->update(['action' => 'login']);
            DB::statement("ALTER TABLE auth_logs MODIFY action ENUM('login','logout','register') NOT NULL");
            if (Schema::hasColumn('auth_logs', 'email')) {
                DB::statement('ALTER TABLE auth_logs MODIFY email VARCHAR(255) NULL');
            }
            if (Schema::hasColumn('auth_logs', 'logged_at')) {
                DB::statement('ALTER TABLE auth_logs MODIFY logged_at TIMESTAMP NULL');
            }
        }
    }

    public function down(): void
    {
        //
    }
};
