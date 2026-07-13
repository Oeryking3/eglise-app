<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@ambassademiracles.com'],
            [
                'nom'      => 'Gouguia',
                'prenom'   => 'Yannick',
                'password' => Hash::make('admin1234'), 
                'role'     => 'admin',
            ]
        );
    }
}