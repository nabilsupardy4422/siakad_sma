<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // USER / TEACHER
        // =========================

        $guruUser = User::where('email', 'guru@siakad.test')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Guru Mata Pelajaran');
            })
            ->firstOrFail();

        $guru = Teacher::updateOrCreate(
            ['user_id' => $guruUser->id],
            [
                'nip' => 'TEST001',
            ]
        );

        $waliKelasUser = User::where('email', 'wali.kelas@siakad.test')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Wali Kelas');
            })
            ->firstOrFail();

        $waliKelas = Teacher::updateOrCreate(
            ['user_id' => $waliKelasUser->id],
            [
                'nip' => 'TEST003',
            ]
        );

        // =========================
        // CLASS
        // =========================

        $class = ClassModel::updateOrCreate(
            [
                'name' => 'X IPA 1',
                'level' => 'X',
            ],
            [
                'wali_kelas_id' => $waliKelas->id,
            ]
        );

        // =========================
        // STUDENT
        // =========================

        $siswaUser = User::where('email', 'siswa@siakad.test')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Siswa');
            })
            ->firstOrFail();

        Student::updateOrCreate(
            [
                'user_id' => $siswaUser->id,
            ],
            [
                'class_id' => $class->id,
                'nis' => '20260001',
            ]
        );

        // =========================
        // SUBJECT
        // =========================

        $subject = Subject::updateOrCreate(
            [
                'code' => 'MAT-X',
            ],
            [
                'name' => 'Matematika',
            ]
        );

        // =========================
        // SCHEDULE
        // =========================

        Schedule::updateOrCreate(
            [
                'teacher_id' => $guru->id,
                'class_id' => $class->id,
                'subject_id' => $subject->id,
                'day' => 'Senin',
                'start_time' => '08:30:00',
                'end_time' => '10:00:00',
            ],
            [
                'status' => 'approved',
            ]
        );
    }
}