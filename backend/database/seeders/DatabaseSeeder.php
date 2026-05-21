<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([UserSeeder::class, CropSeeder::class, PestAlertSeeder::class, SchemeSeeder::class]);

        User::updateOrCreate(
            ['email' => 'admin@farmapp.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin@1234'),
                'role' => 'admin',
            ]
        );

        $this->command->info('Admin created: admin@farmapp.com / Admin@1234');
    }
}
