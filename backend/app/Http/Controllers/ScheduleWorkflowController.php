<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleWorkflowController extends Controller
{
    public function monitoring(Request $request): JsonResponse
    {
        if ($request->user()->role?->name !== 'Wakakur') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wakakur yang dapat mengakses monitoring jadwal.',
            ], 403);
        }

        $schedules = Schedule::with([
            'teacher.user',
            'class',
            'subject',
        ])
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => $schedules,
        ]);
    }

    public function teacherSchedules(Request $request): JsonResponse
    {
        if ($request->user()->role?->name !== 'Guru Mata Pelajaran') {
            return response()->json([
                'message' => 'Forbidden. Endpoint ini hanya untuk Guru Mata Pelajaran.',
            ], 403);
        }

        $teacher = $request->user()->teacher;

        if (!$teacher) {
            return response()->json([
                'message' => 'Data guru untuk user ini tidak ditemukan.',
            ], 404);
        }

        $schedules = Schedule::with([
            'teacher.user',
            'class',
            'subject',
        ])
            ->where('teacher_id', $teacher->id)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => $schedules,
        ]);
    }

    public function studentSchedules(Request $request): JsonResponse
    {
        if ($request->user()->role?->name !== 'Siswa') {
            return response()->json([
                'message' => 'Forbidden. Endpoint ini hanya untuk Siswa.',
            ], 403);
        }

        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'message' => 'Data siswa untuk user ini tidak ditemukan.',
            ], 404);
        }

        $schedules = Schedule::with([
            'teacher.user',
            'class',
            'subject',
        ])
            ->where('class_id', $student->class_id)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => $schedules,
        ]);
    }

    public function approve(Request $request, Schedule $schedule): JsonResponse
    {
        if ($request->user()->role?->name !== 'Wakakur') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wakakur yang dapat menyetujui jadwal.',
            ], 403);
        }

        if ($schedule->status !== 'draft') {
            return response()->json([
                'message' => 'Jadwal hanya dapat disetujui ketika berstatus draft.',
            ], 422);
        }

        $schedule->update([
            'status' => 'approved',
        ]);

        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Jadwal berhasil disetujui.',
            'data' => $schedule,
        ]);
    }

    public function reject(Request $request, Schedule $schedule): JsonResponse
    {
        if ($request->user()->role?->name !== 'Wakakur') {
            return response()->json([
                'message' => 'Forbidden. Hanya Wakakur yang dapat menolak jadwal.',
            ], 403);
        }

        if ($schedule->status !== 'draft') {
            return response()->json([
                'message' => 'Jadwal hanya dapat ditolak ketika berstatus draft.',
            ], 422);
        }

        $schedule->update([
            'status' => 'rejected',
        ]);

        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Jadwal berhasil ditolak.',
            'data' => $schedule,
        ]);
    }

    public function resubmit(Request $request, Schedule $schedule): JsonResponse
    {
        if ($request->user()->role?->name !== 'TU') {
            return response()->json([
                'message' => 'Forbidden. Hanya TU yang dapat mengirim ulang jadwal.',
            ], 403);
        }

        if ($schedule->status !== 'rejected') {
            return response()->json([
                'message' => 'Jadwal hanya dapat dikirim ulang ketika berstatus rejected.',
            ], 422);
        }

        $schedule->update([
            'status' => 'draft',
        ]);

        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Jadwal berhasil dikirim ulang untuk validasi.',
            'data' => $schedule,
        ]);
    }
}