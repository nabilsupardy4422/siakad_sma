<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\ClassModel;
use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $schedules = Schedule::with([
            'teacher.user',
            'class',
            'subject',
        ])
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'message' => 'Data jadwal berhasil diambil.',
            'data' => $schedules,
        ]);
    }

    public function options(): JsonResponse
    {
        return response()->json([
            'message' => 'Data pilihan jadwal berhasil diambil.',
            'data' => [
                'teachers' => Teacher::with('user')
                    ->orderBy('id')
                    ->get(),
                'classes' => ClassModel::orderBy('level')
                    ->orderBy('name')
                    ->get(),
                'subjects' => Subject::orderBy('name')
                    ->get(),
            ],
        ]);
    }

    public function store(StoreScheduleRequest $request): JsonResponse
    {
        $this->validateScheduleConflict(
            $request->validated()
        );

        $schedule = Schedule::create(
            $request->validated()
        );

        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Jadwal berhasil ditambahkan.',
            'data' => $schedule,
        ], 201);
    }

    public function show(Schedule $schedule): JsonResponse
    {
        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Detail jadwal berhasil diambil.',
            'data' => $schedule,
        ]);
    }

    public function update(
        UpdateScheduleRequest $request,
        Schedule $schedule
    ): JsonResponse {
        $this->validateScheduleConflict(
            $request->validated(),
            $schedule->id
        );

        $schedule->update(
            $request->validated()
        );

        $schedule->load([
            'teacher.user',
            'class',
            'subject',
        ]);

        return response()->json([
            'message' => 'Jadwal berhasil diperbarui.',
            'data' => $schedule,
        ]);
    }

    public function destroy(Schedule $schedule): JsonResponse
    {
        $schedule->delete();

        return response()->json([
            'message' => 'Jadwal berhasil dihapus.',
        ]);
    }

    private function validateScheduleConflict(
        array $data,
        ?int $ignoreScheduleId = null
    ): void {
        $query = Schedule::query()
            ->where('day', $data['day'])
            ->where(function ($query) use ($data) {
                $query
                    ->where('start_time', '<', $data['end_time'])
                    ->where('end_time', '>', $data['start_time']);
            });

        if ($ignoreScheduleId !== null) {
            $query->where('id', '!=', $ignoreScheduleId);
        }

        $teacherConflict = (clone $query)
            ->where('teacher_id', $data['teacher_id'])
            ->exists();

        if ($teacherConflict) {
            throw ValidationException::withMessages([
                'teacher_id' => [
                    'Guru sudah memiliki jadwal lain pada waktu tersebut.',
                ],
            ]);
        }

        $classConflict = (clone $query)
            ->where('class_id', $data['class_id'])
            ->exists();

        if ($classConflict) {
            throw ValidationException::withMessages([
                'class_id' => [
                    'Kelas sudah memiliki jadwal lain pada waktu tersebut.',
                ],
            ]);
        }
    }
}