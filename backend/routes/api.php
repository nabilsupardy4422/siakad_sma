<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/schedule-options', [ScheduleController::class, 'options']);

    Route::apiResource('schedules', ScheduleController::class);
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'API SIAKAD berhasil terhubung',
    ]);
});