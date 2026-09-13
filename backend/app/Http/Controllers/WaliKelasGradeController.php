<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaliKelasGradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role?->name !== 'Wali Kelas') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wali Kelas yang dapat mengakses rekap nilai.',
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

        $studentIds = $class->students
            ->pluck('id')
            ->values();

        $grades = Grade::query()
            ->with([
                'student.user',
                'subject',
                'teacher.user',
            ])
            ->whereIn('student_id', $studentIds)
            ->get();

        $students = $class->students
            ->map(function ($student) use ($grades) {
                $studentGrades = $grades
                    ->where('student_id', $student->id)
                    ->values();

                return [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->user?->name,
                    'grades' => $studentGrades
                        ->map(function (Grade $grade) {
                            return [
                                'id' => $grade->id,
                                'score' => $grade->score,
                                'subject' => [
                                    'id' => $grade->subject?->id,
                                    'code' => $grade->subject?->code,
                                    'name' => $grade->subject?->name,
                                ],
                                'teacher' => [
                                    'id' => $grade->teacher?->id,
                                    'name' => $grade->teacher?->user?->name,
                                    'nip' => $grade->teacher?->nip,
                                ],
                            ];
                        })
                        ->values(),
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Rekap nilai Wali Kelas berhasil diambil.',
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
                    'total_grades' => $grades->count(),
                ],
                'students' => $students,
            ],
        ]);
    }
}
