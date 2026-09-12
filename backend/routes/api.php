<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScheduleWorkflowController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\StudentAttendanceController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:TU')->group(function () {
        Route::get('/schedule-options', [ScheduleController::class, 'options']);

        Route::apiResource('schedules', ScheduleController::class);
    });

    Route::get('/schedule-monitoring', [ScheduleWorkflowController::class, 'monitoring'])
        ->middleware('role:Wakakur');

    Route::get('/teacher-schedules', [ScheduleWorkflowController::class, 'teacherSchedules'])
        ->middleware('role:Guru Mata Pelajaran');

    Route::get('/student-schedules', [ScheduleWorkflowController::class, 'studentSchedules'])
        ->middleware('role:Siswa');

    Route::get('/student-attendance', [StudentAttendanceController::class, 'index'])
        ->middleware('role:Siswa');

    Route::post('/schedules/{schedule}/approve', [ScheduleWorkflowController::class, 'approve'])
        ->middleware('role:Wakakur');

    Route::post('/schedules/{schedule}/reject', [ScheduleWorkflowController::class, 'reject'])
        ->middleware('role:Wakakur');

    Route::post('/schedules/{schedule}/resubmit', [ScheduleWorkflowController::class, 'resubmit'])
        ->middleware('role:TU');

        Route::middleware('role:Guru Mata Pelajaran')->group(function () {
            Route::get('/schedules/{schedule}/attendance', [
                AttendanceController::class,
                'index',
            ]);

            Route::post('/schedules/{schedule}/attendance', [
                AttendanceController::class,
                'store',
            ]);
        });
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'API SIAKAD berhasil terhubung',
    ]);
});