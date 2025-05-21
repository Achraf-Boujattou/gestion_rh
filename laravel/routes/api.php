<?php

use App\Http\Controllers\BiometricImportController;
use App\Http\Controllers\UserController;

Route::post('/biometrics/import', [BiometricImportController::class, 'import']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/export/{format}', [UserController::class, 'export']); 