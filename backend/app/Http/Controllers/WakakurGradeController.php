<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WakakurGradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role?->name !== 'Wakakur') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wakakur yang dapat mengakses monitoring nilai.',
            ], 403);
        }

        $students = Student::query()
            ->with('class')
            ->get();

        $grades = Grade::query()
            ->with([
                'student.class',
                'subject',
                'teacher.user',
            ])
            ->get();

        $totalStudents = $students->count();

        $studentsWithGrades = $grades
            ->pluck('student_id')
            ->unique()
            ->count();

        $studentsWithoutGrades = max(
            $totalStudents - $studentsWithGrades,
            0
        );

        /*
         * Rekap nilai dikelompokkan berdasarkan:
         * - Kelas
         * - Mata pelajaran
         * - Guru
         *
         * Tidak menghitung rata-rata atau predikat nilai
         * karena belum ditentukan dalam requirement/database.
         */
        $monitoring = $grades
            ->groupBy(function ($grade) {
                return implode('-', [
                    $grade->student?->class_id,
                    $grade->subject_id,
                    $grade->teacher_id,
                ]);
            })
            ->map(function ($gradeGroup) {
                $firstGrade = $gradeGroup->first();

                $class = $firstGrade->student?->class;
                $subject = $firstGrade->subject;
                $teacher = $firstGrade->teacher;

                $totalClassStudents = Student::query()
                    ->where('class_id', $class?->id)
                    ->count();

                $gradedStudents = $gradeGroup
                    ->pluck('student_id')
                    ->unique()
                    ->count();

                return [
                    'class' => [
                        'id' => $class?->id,
                        'name' => $class?->name,
                        'level' => $class?->level,
                    ],

                    'subject' => [
                        'id' => $subject?->id,
                        'code' => $subject?->code,
                        'name' => $subject?->name,
                    ],

                    'teacher' => [
                        'id' => $teacher?->id,
                        'name' => $teacher?->user?->name,
                        'nip' => $teacher?->nip,
                    ],

                    'total_students' => $totalClassStudents,
                    'graded_students' => $gradedStudents,
                    'ungraded_students' => max(
                        $totalClassStudents - $gradedStudents,
                        0
                    ),
                    'total_grades' => $gradeGroup->count(),
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Monitoring nilai berhasil diambil.',

            'data' => [
                'summary' => [
                    'total_students' => $totalStudents,
                    'students_with_grades' => $studentsWithGrades,
                    'students_without_grades' => $studentsWithoutGrades,
                    'total_grades' => $grades->count(),
                    'total_classes' => $students
                        ->pluck('class_id')
                        ->filter()
                        ->unique()
                        ->count(),
                ],

                'monitoring' => $monitoring,
            ],
        ]);
    }
}