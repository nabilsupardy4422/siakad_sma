<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentGradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role?->name !== 'Siswa') {
            return response()->json([
                'message' => 'Forbidden. Hanya Siswa yang dapat mengakses nilai.',
            ], 403);
        }

        $student = $user->student;

        if (!$student) {
            return response()->json([
                'message' => 'Data siswa untuk user ini tidak ditemukan.',
            ], 404);
        }

        $grades = Grade::query()
            ->with([
                'subject',
                'teacher.user',
            ])
            ->where('student_id', $student->id)
            ->get()
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
            ->values();

        return response()->json([
            'message' => 'Nilai siswa berhasil diambil.',
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->user?->name,
                    'class' => [
                        'id' => $student->class?->id,
                        'name' => $student->class?->name,
                        'level' => $student->class?->level,
                    ],
                ],
                'grades' => $grades,
            ],
        ]);
    }
}