<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Fallback route for Inertia
Route::fallback(function () {
    return Inertia::render('errors/404', ['status' => 404]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
