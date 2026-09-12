<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role?->name !== 'Siswa') {
            return response()->json([
                'message' => 'Forbidden. Hanya Siswa yang dapat mengakses riwayat presensi.',
            ], 403);
        }

        $student = $user->student;

        if (!$student) {
            return response()->json([
                'message' => 'Data siswa untuk user ini tidak ditemukan.',
            ], 404);
        }

        $attendances = Attendance::query()
            ->with([
                'schedule.subject',
                'schedule.teacher.user',
            ])
            ->where('student_id', $student->id)
            ->orderByDesc('date')
            ->get()
            ->map(function (Attendance $attendance) {
                return [
                    'id' => $attendance->id,
                    'date' => $attendance->date?->format('Y-m-d'),
                    'status' => $attendance->status,
                    'schedule' => [
                        'id' => $attendance->schedule?->id,
                        'day' => $attendance->schedule?->day,
                        'start_time' => $attendance->schedule?->start_time,
                        'end_time' => $attendance->schedule?->end_time,
                        'subject' => [
                            'code' => $attendance->schedule?->subject?->code,
                            'name' => $attendance->schedule?->subject?->name,
                        ],
                        'teacher' => [
                            'name' => $attendance->schedule?->teacher?->user?->name,
                        ],
                    ],
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Riwayat presensi berhasil diambil.',
            'data' => $attendances,
        ]);
    }
}