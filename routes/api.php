<?php

use App\Http\Controllers\BiometricImportController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\NotificationController;


Route::post('/biometrics/import', [BiometricImportController::class, 'import']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/export/{format}', [UserController::class, 'export']); 

Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});