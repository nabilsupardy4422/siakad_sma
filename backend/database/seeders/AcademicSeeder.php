<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        $waliKelasUser = User::where('email', 'wali.kelas@siakad.test')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Wali Kelas');
            })
            ->firstOrFail();

        $waliKelasTeacher = Teacher::updateOrCreate(
            ['user_id' => $waliKelasUser->id],
            [
                'nip' => 'TEST003',
            ]
        );

        ClassModel::where('name', 'X IPA 1')
            ->where('level', 'X')
            ->update([
                'wali_kelas_id' => $waliKelasTeacher->id,
            ]);
    }
}