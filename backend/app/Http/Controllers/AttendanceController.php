<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(
        Request $request,
        Schedule $schedule
    ): JsonResponse {
        $user = $request->user();

        if ($user->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Hanya Guru Mata Pelajaran yang dapat mengakses absensi.',
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

        if ($schedule->status !== 'approved') {
            return response()->json([
                'message' => 'Absensi hanya dapat dilakukan pada jadwal yang sudah disetujui.',
            ], 422);
        }

        $request->validate([
            'date' => [
                'required',
                'date_format:Y-m-d',
            ],
        ]);

        $date = $request->query('date');

        $schedule->load([
            'teacher.user',
            'class.students.user',
            'subject',
        ]);

        $attendances = Attendance::query()
            ->where('schedule_id', $schedule->id)
            ->whereDate('date', $date)
            ->get()
            ->keyBy('student_id');

        $students = $schedule->class->students
            ->map(function ($student) use ($attendances) {
                $attendance = $attendances->get($student->id);

                return [
                    'id' => $student->id,
                    'nis' => $student->nis,
                    'name' => $student->user?->name,
                    'attendance' => $attendance ? [
                        'id' => $attendance->id,
                        'status' => $attendance->status,
                        'date' => $attendance->date?->format('Y-m-d'),
                    ] : null,
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Data absensi berhasil diambil.',
            'data' => [
                'schedule' => $schedule,
                'date' => $date,
                'students' => $students,
            ],
        ]);
    }

    public function store(
        StoreAttendanceRequest $request,
        Schedule $schedule
    ): JsonResponse {
        $user = $request->user();

        if ($user->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Hanya Guru Mata Pelajaran yang dapat mencatat absensi.',
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

        if ($schedule->status !== 'approved') {
            return response()->json([
                'message' => 'Absensi hanya dapat dicatat pada jadwal yang sudah disetujui.',
            ], 422);
        }

        $validated = $request->validated();

        $studentIds = collect($validated['attendances'])
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

        DB::transaction(function () use ($validated, $schedule) {
            foreach ($validated['attendances'] as $attendanceData) {
                Attendance::updateOrCreate(
                    [
                        'schedule_id' => $schedule->id,
                        'student_id' => $attendanceData['student_id'],
                        'date' => $validated['date'],
                    ],
                    [
                        'status' => $attendanceData['status'],
                    ]
                );
            }
        });

        $attendances = Attendance::query()
            ->with('student.user')
            ->where('schedule_id', $schedule->id)
            ->whereDate('date', $validated['date'])
            ->get();

        return response()->json([
            'message' => 'Absensi berhasil disimpan.',
            'data' => [
                'schedule_id' => $schedule->id,
                'date' => $validated['date'],
                'attendances' => $attendances,
            ],
        ]);
    }
}