<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@cropguidance.com'], ['name' => 'Admin Manager', 'password' => Hash::make('Admin@12345'), 'role' => 'admin', 'state' => 'Maharashtra', 'district' => 'Pune', 'phone' => '9876543210']);
        User::updateOrCreate(['email' => 'farmer@cropguidance.com'], ['name' => 'Ramesh Patil', 'password' => Hash::make('password'), 'role' => 'farmer', 'state' => 'Maharashtra', 'district' => 'Nashik', 'phone' => '9876501234']);
    }
}
