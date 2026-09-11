<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrator TU',
                'email' => 'tu@siakad.test',
                'role' => 'TU',
            ],
            [
                'name' => 'Wakakur',
                'email' => 'wakakur@siakad.test',
                'role' => 'Wakakur',
            ],
            [
                'name' => 'Guru Mata Pelajaran',
                'email' => 'guru@siakad.test',
                'role' => 'Guru Mata Pelajaran',
            ],
            [
                'name' => 'Wali Kelas',
                'email' => 'wali.kelas@siakad.test',
                'role' => 'Wali Kelas',
            ],
            [
                'name' => 'Siswa',
                'email' => 'siswa@siakad.test',
                'role' => 'Siswa',
            ],
        ];

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role'])->firstOrFail();

            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'role_id' => $role->id,
                    'name' => $userData['name'],
                    'password' => Hash::make('password123'),
                ]
            );
        }
    }
}