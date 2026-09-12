<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\Grade;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    public function index(
        Request $request,
        Schedule $schedule
    ): JsonResponse {
        $user = $request->user();

        if ($user->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Hanya Guru Mata Pelajaran yang dapat mengakses input nilai.',
            ], 403);
        }

        $teacher = $user->teacher;

        if (!$teacher) {
            return response()->json([
                'message' => 'Data guru untuk user ini tidak ditemukan.',
            ], 404);
        }

        if ($schedule->teacher_id !== $teacher->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki kewenangan terhadap jadwal ini.',
            ], 403);
        }

        $schedule->load([
            'teacher.user',
            'class.students.user',
            'subject',
        ]);

        $studentIds = $schedule->class->students
            ->pluck('id')
            ->values();

        $grades = Grade::query()
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $schedule->subject_id)
            ->whereIn('student_id', $studentIds)
            ->get()
            ->keyBy('student_id');

        $students = $schedule->class->students
            ->map(function ($student) use ($grades) {
                $grade = $grades->get($student->id);

                return [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->user?->name,
                    'grade' => $grade ? [
                        'id' => $grade->id,
                        'score' => $grade->score,
                    ] : null,
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Data input nilai berhasil diambil.',
            'data' => [
                'schedule' => $schedule,
                'students' => $students,
            ],
        ]);
    }

    public function store(
        StoreGradeRequest $request,
        Schedule $schedule
    ): JsonResponse {
        $user = $request->user();

        if ($user->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Hanya Guru Mata Pelajaran yang dapat menyimpan nilai.',
            ], 403);
        }

        $teacher = $user->teacher;

        if (!$teacher) {
            return response()->json([
                'message' => 'Data guru untuk user ini tidak ditemukan.',
            ], 404);
        }

        if ($schedule->teacher_id !== $teacher->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki kewenangan terhadap jadwal ini.',
            ], 403);
        }

        $schedule->load('class.students');

        $validated = $request->validated();

        $studentIds = collect($validated['grades'])
            ->pluck('student_id')
            ->unique()
            ->values();

        $validStudentCount = $schedule->class()
            ->withCount([
                'students' => function ($query) use ($studentIds) {
                    $query->whereIn('id', $studentIds);
                },
            ])
            ->first()
            ->students_count;

        if ($validStudentCount !== $studentIds->count()) {
            return response()->json([
                'message' => 'Terdapat siswa yang bukan bagian dari kelas pada jadwal ini.',
            ], 422);
        }

        DB::transaction(function () use (
            $validated,
            $schedule,
            $teacher
        ) {
            foreach ($validated['grades'] as $gradeData) {
                Grade::updateOrCreate(
                    [
                        'student_id' => $gradeData['student_id'],
                        'subject_id' => $schedule->subject_id,
                        'teacher_id' => $teacher->id,
                    ],
                    [
                        'score' => $gradeData['score'],
                    ]
                );
            }
        });

        $grades = Grade::query()
            ->with([
                'student.user',
                'subject',
                'teacher.user',
            ])
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $schedule->subject_id)
            ->whereIn('student_id', $studentIds)
            ->get();

        return response()->json([
            'message' => 'Nilai berhasil disimpan.',
            'data' => [
                'schedule_id' => $schedule->id,
                'subject_id' => $schedule->subject_id,
                'teacher_id' => $teacher->id,
                'grades' => $grades,
            ],
        ]);
    }

    public function update(
        UpdateGradeRequest $request,
        Grade $grade
    ): JsonResponse {
        $user = $request->user();

        if ($user->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Hanya Guru Mata Pelajaran yang dapat mengubah nilai.',
            ], 403);
        }

        $teacher = $user->teacher;

        if (!$teacher) {
            return response()->json([
                'message' => 'Data guru untuk user ini tidak ditemukan.',
            ], 404);
        }

        if ($grade->teacher_id !== $teacher->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki kewenangan terhadap nilai ini.',
            ], 403);
        }

        $grade->load('student');

        $hasTeachingSchedule = Schedule::query()
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $grade->subject_id)
            ->where('class_id', $grade->student->class_id)
            ->exists();

        if (!$hasTeachingSchedule) {
            return response()->json([
                'message' => 'Anda tidak memiliki kewenangan terhadap mata pelajaran dan kelas siswa ini.',
            ], 403);
        }

        $grade->update(
            $request->validated()
        );

        $grade->load([
            'student.user',
            'subject',
            'teacher.user',
        ]);

        return response()->json([
            'message' => 'Nilai berhasil diperbarui.',
            'data' => $grade,
        ]);
    }
}