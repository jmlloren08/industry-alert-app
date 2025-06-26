<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\Plant\MakeController;
use App\Http\Controllers\Plant\ModelController;
use App\Http\Controllers\Plant\TypeController;
use App\Http\Controllers\RegController;
use App\Http\Controllers\RegulationController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SourceController;
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

    Route::get('/auth/verified/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('/auth/verified/alerts', AlertController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/sources', SourceController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/regulations', RegulationController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/organizations', OrganizationController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/sites', SiteController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/plant-types', TypeController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/plant-makes', MakeController::class)
        ->except(['destroy']);

    Route::resource('/auth/verified/plant-models', ModelController::class)
        ->except(['destroy']);
});

// Fallback route for Inertia
Route::fallback(function () {
    return Inertia::render('errors/404', ['status' => 404]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
