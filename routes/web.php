<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\HazardController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\Plant\MakeController;
use App\Http\Controllers\Plant\ModelController;
use App\Http\Controllers\Plant\TypeController;
use App\Http\Controllers\RegulationController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SourceController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Termwind\render;

// Route::get('/auth/redirect', [AuthController::class, 'redirectToMicrosoft'])->name('microsoft.login');
// Route::get('/auth/callback', [AuthController::class, 'handleMicrosoftCallback'])->name('microsoft.callback');

Route::get('/', function () {
    // if (Auth::check()) {
    //     return redirect()->route('dashboard');
    // }
    // return redirect()->route('login');
    return Inertia::render('maintenance');
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {

//     Route::get('/documentation', [DocumentationController::class, 'index'])->name('documentation.index');
//     Route::get('/documentation/{slug}', [DocumentationController::class, 'index'])->name('documentation.show');

//     Route::get('/auth/verified/dashboard', [DashboardController::class, 'index'])->name('dashboard');
//     Route::get('/auth/verified/dashboard/metrics', [DashboardController::class, 'getMetrics']);
//     Route::get('/auth/verified/dashboard/alerts-over-time', [DashboardController::class, 'getAlertsOverTime']);
//     Route::get('/auth/verified/dashboard/recent-alerts', [DashboardController::class, 'getRecentAlerts']);
//     Route::get('/auth/verified/dashboard/alerts-by-source', [DashboardController::class, 'getAlertsBySource']);
//     Route::get('/auth/verified/dashboard/alerts-by-regulation', [DashboardController::class, 'getAlertsByRegulation']);
//     Route::get('/auth/verified/dashboard/alerts-by-organization', [DashboardController::class, 'getAlertsByOrganization']);
//     Route::get('/auth/verified/dashboard/alerts-by-site', [DashboardController::class, 'getAlertsBySite']);
//     Route::get('/auth/verified/dashboard/alerts-by-hazard', [DashboardController::class, 'getAlertsByHazard']);
//     Route::get('/auth/verified/dashboard/alerts-by-plant-type', [DashboardController::class, 'getAlertsByPlantType']);
//     Route::get('/auth/verified/dashboard/filtered-data', [DashboardController::class, 'getFilteredData']);

//     Route::get('/auth/verified/dashboard/filter-options/sources', [DashboardController::class, 'getSources']);
//     Route::get('/auth/verified/dashboard/filter-options/regulations', [DashboardController::class, 'getRegulations']);
//     Route::get('/auth/verified/dashboard/filter-options/organizations', [DashboardController::class, 'getOrganizations']);
//     Route::get('/auth/verified/dashboard/filter-options/sites', [DashboardController::class, 'getSites']);
//     Route::get('/auth/verified/dashboard/filter-options/hazards', [DashboardController::class, 'getHazards']);
//     Route::get('/auth/verified/dashboard/filter-options/plant-types', [DashboardController::class, 'getPlantTypes']);

//     Route::get('/auth/verified/alerts/bulk-edit', [AlertController::class, 'bulkEdit'])->name('alerts.bulk-edit');
//     Route::post('/auth/verified/alerts/bulk-update', [AlertController::class, 'bulkUpdate'])->name('alerts.bulk-update');
//     Route::delete('/auth/verified/alerts/bulk-delete', [AlertController::class, 'bulkDelete'])->name('alerts.bulk-delete');
//     Route::patch('/auth/verified/alerts/{alert}/mark-reviewed', [AlertController::class, 'markAsReviewed'])->name('alerts.mark-reviewed');
//     Route::patch('/auth/verified/alerts/{alert}/mark-new', [AlertController::class, 'markAsNew'])->name('alerts.mark-new');
//     Route::get('/auth/verified/alerts/review-metrics', [AlertController::class, 'getReviewMetrics'])->name('alerts.review-metrics');
//     Route::resource('/auth/verified/alerts', AlertController::class);

//     Route::resource('/auth/verified/sources', SourceController::class);
//     Route::resource('/auth/verified/regulations', RegulationController::class);
//     Route::resource('/auth/verified/organizations', OrganizationController::class);
//     Route::resource('/auth/verified/sites', SiteController::class);
//     Route::resource('/auth/verified/plant-types', TypeController::class);
//     Route::resource('/auth/verified/plant-makes', MakeController::class);
//     Route::resource('/auth/verified/plant-models', ModelController::class);
//     Route::resource('/auth/verified/hazards', HazardController::class);
// });

// // Fallback route for Inertia
// Route::fallback(function () {
//     return Inertia::render('errors/404', ['status' => 404]);
// });


// require __DIR__ . '/settings.php';
// require __DIR__ . '/auth.php';
