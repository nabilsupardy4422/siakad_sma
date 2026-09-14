<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WakakurKbmMonitoringController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role?->name !== 'Wakakur') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wakakur yang dapat mengakses monitoring KBM.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Format tanggal tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $date = $request->query('date', now()->toDateString());

        $schedules = Schedule::query()
            ->with([
                'teacher.user',
                'class.students',
                'subject',
            ])
            ->where('status', 'approved')
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        $scheduleIds = $schedules->pluck('id');

        $attendanceCounts = Attendance::query()
            ->whereIn('schedule_id', $scheduleIds)
            ->whereDate('date', $date)
            ->selectRaw('schedule_id, COUNT(DISTINCT student_id) as recorded_students')
            ->groupBy('schedule_id')
            ->pluck('recorded_students', 'schedule_id');

        $monitoring = $schedules
            ->map(function (Schedule $schedule) use ($attendanceCounts) {
                $totalStudents = $schedule->class?->students?->count() ?? 0;
                $recordedStudents = (int) ($attendanceCounts[$schedule->id] ?? 0);

                return [
                    'id' => $schedule->id,

                    'teacher' => [
                        'id' => $schedule->teacher?->id,
                        'name' => $schedule->teacher?->user?->name,
                        'nip' => $schedule->teacher?->nip,
                    ],

                    'class' => [
                        'id' => $schedule->class?->id,
                        'name' => $schedule->class?->name,
                        'level' => $schedule->class?->level,
                    ],

                    'subject' => [
                        'id' => $schedule->subject?->id,
                        'code' => $schedule->subject?->code,
                        'name' => $schedule->subject?->name,
                    ],

                    'day' => $schedule->day,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,

                    'attendance' => [
                        'recorded_students' => $recordedStudents,
                        'total_students' => $totalStudents,
                        'is_recorded' => $recordedStudents > 0,
                        'is_complete' => $totalStudents > 0
                            && $recordedStudents >= $totalStudents,
                    ],

                    'status' => $recordedStudents > 0
                        ? 'recorded'
                        : 'not_recorded',
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Monitoring KBM berhasil diambil.',
            'data' => [
                'date' => $date,

                'summary' => [
                    'total_schedules' => $monitoring->count(),

                    'recorded_schedules' => $monitoring
                        ->where('status', 'recorded')
                        ->count(),

                    'not_recorded_schedules' => $monitoring
                        ->where('status', 'not_recorded')
                        ->count(),

                    'complete_attendance' => $monitoring
                        ->where('attendance.is_complete', true)
                        ->count(),
                ],

                'monitoring' => $monitoring,
            ],
        ]);
    }
}