<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleWorkflowController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\WaliKelasAttendanceController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\StudentGradeController;
use App\Http\Controllers\WaliKelasGradeController;
use App\Http\Controllers\WakakurGradeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WakakurKbmMonitoringController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // TU
    Route::middleware('role:TU')->group(function () {
        Route::get('/schedule-options', [ScheduleController::class, 'options']);

        Route::apiResource('schedules', ScheduleController::class);
    });

    // Wakakur
    Route::get('/schedule-monitoring', [ScheduleWorkflowController::class, 'monitoring'])
    ->middleware('role:Wakakur');

    Route::post('/schedules/{schedule}/approve', [ScheduleWorkflowController::class, 'approve'])
    ->middleware('role:Wakakur');

    Route::post('/schedules/{schedule}/reject', [ScheduleWorkflowController::class, 'reject'])
    ->middleware('role:Wakakur');

    // Wakakur - Monitoring Nilai
    Route::get('/wakakur/grade-monitoring', [WakakurGradeController::class, 'index'])
    ->middleware('role:Wakakur');

    // Wakakur - Monitoring KBM
    Route::get(
        '/wakakur/kbm-monitoring',
        [WakakurKbmMonitoringController::class, 'index']
    )->middleware('role:Wakakur');

    // Guru Mata Pelajaran
    Route::get(
        '/teacher-schedules',
        [ScheduleWorkflowController::class, 'teacherSchedules']
    )->middleware('role:Guru Mata Pelajaran');

    Route::middleware('role:Guru Mata Pelajaran')->group(function () {
        // Absensi
        Route::get('/schedules/{schedule}/attendance', [
            AttendanceController::class,
            'index',
        ]);

        Route::post('/schedules/{schedule}/attendance', [
            AttendanceController::class,
            'store',
        ]);

        // Penilaian
        Route::get('/schedules/{schedule}/grades', [
            GradeController::class,
            'index',
        ]);

        Route::post('/schedules/{schedule}/grades', [
            GradeController::class,
            'store',
        ]);

        Route::put('/grades/{grade}', [
            GradeController::class,
            'update',
        ]);
    });

    // Siswa
    Route::get(
        '/student-schedules',
        [ScheduleWorkflowController::class, 'studentSchedules']
    )->middleware('role:Siswa');

    Route::get(
        '/student-attendance',
        [StudentAttendanceController::class, 'index']
    )->middleware('role:Siswa');

    // TU - resubmit schedule
    Route::post(
        '/schedules/{schedule}/resubmit',
        [ScheduleWorkflowController::class, 'resubmit']
    )->middleware('role:TU');

    // Wali Kelas
    Route::get(
        '/wali-kelas/attendance',
        [WaliKelasAttendanceController::class, 'index']
    )->middleware('role:Wali Kelas');

    // Wali Kelas - Penilaian
    Route::get(
        '/wali-kelas/grades',
        [WaliKelasGradeController::class, 'index']
    )->middleware('role:Wali Kelas');

    // Siswa - Penilaian
    Route::get(
        '/student-grades',
        [StudentGradeController::class, 'index']
    )->middleware('role:Siswa');
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'API SIAKAD berhasil terhubung',
    ]);
});