<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaliKelasAttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role?->name !== 'Wali Kelas') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wali Kelas yang dapat mengakses rekap presensi.',
            ], 403);
        }

        $teacher = $user->teacher;

        if (!$teacher) {
            return response()->json([
                'message' => 'Data guru untuk user Wali Kelas tidak ditemukan.',
            ], 404);
        }

        $class = $teacher->waliKelasClass()
            ->with('students.user')
            ->first();

        if (!$class) {
            return response()->json([
                'message' => 'Kelas yang menjadi tanggung jawab Wali Kelas tidak ditemukan.',
            ], 404);
        }

        $attendances = Attendance::query()
            ->with('student.user')
            ->whereHas('student', function ($query) use ($class) {
                $query->where('class_id', $class->id);
            })
            ->get();

        $students = $class->students
            ->map(function ($student) use ($attendances) {
                $studentAttendances = $attendances->where(
                    'student_id',
                    $student->id
                );

                return [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->user?->name,
                    'summary' => [
                        'hadir' => $studentAttendances
                            ->where('status', 'hadir')
                            ->count(),
                        'izin' => $studentAttendances
                            ->where('status', 'izin')
                            ->count(),
                        'sakit' => $studentAttendances
                            ->where('status', 'sakit')
                            ->count(),
                        'alpa' => $studentAttendances
                            ->where('status', 'alpa')
                            ->count(),
                    ],
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Rekap presensi Wali Kelas berhasil diambil.',
            'data' => [
                'class' => [
                    'id' => $class->id,
                    'name' => $class->name,
                    'level' => $class->level,
                    'wali_kelas' => [
                        'name' => $teacher->user?->name,
                        'nip' => $teacher->nip,
                    ],
                ],

                'summary' => [
                    'total_students' => $class->students->count(),
                    'hadir' => $attendances->where('status', 'hadir')->count(),
                    'izin' => $attendances->where('status', 'izin')->count(),
                    'sakit' => $attendances->where('status', 'sakit')->count(),
                    'alpa' => $attendances->where('status', 'alpa')->count(),
                ],

                'students' => $students,
            ],
        ]);
    }
}