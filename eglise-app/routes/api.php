<?php

use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\Admin\CardBenefitController as AdminCardBenefitController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\Admin\LivreController as AdminLivreController;
use App\Http\Controllers\Api\Admin\LiveStreamController as AdminLiveStreamController;
use App\Http\Controllers\Api\Admin\MemberController as AdminMemberController;
use App\Http\Controllers\Api\Admin\MembershipCardController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EgliseController;
use App\Http\Controllers\Api\EgliseRequestController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\LivreController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SuperAdmin\EgliseController as SuperAdminEgliseController;
use App\Http\Controllers\Api\SuperAdmin\EgliseRequestController as SuperAdminEgliseRequestController;
use App\Http\Controllers\Api\SuperAdmin\StatsController as SuperAdminStatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth publique
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/eglises', [EgliseController::class, 'index']);
Route::post('/eglises/demandes', [EgliseRequestController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Parcours membre (auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/accueil', [DashboardController::class, 'index']);
    Route::get('/evenements', [EventController::class, 'index']);
    Route::get('/evenements/{event}', [EventController::class, 'show']);

    Route::get('/agenda', [AgendaController::class, 'index']);
    Route::post('/agenda', [AgendaController::class, 'store']);
    Route::put('/agenda/{item}', [AgendaController::class, 'update']);
    Route::delete('/agenda/{item}', [AgendaController::class, 'destroy']);

    Route::get('/carte', [CardController::class, 'show']);

    Route::get('/paiement/config', [PaymentController::class, 'config']);
    Route::post('/paiement', [PaymentController::class, 'store']);
    Route::get('/paiements/{payment}', [PaymentController::class, 'show']);
    Route::get('/livres', [LivreController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | Espace admin (auth:sanctum + is_admin_api)
    |--------------------------------------------------------------------------
    */

    Route::middleware('is_super_admin_api')->prefix('super-admin')->group(function () {
        Route::get('/eglises', [SuperAdminEgliseController::class, 'index']);
        Route::post('/eglises/{eglise}/desactiver', [SuperAdminEgliseController::class, 'deactivate']);
        Route::post('/eglises/{eglise}/reactiver', [SuperAdminEgliseController::class, 'reactivate']);
        Route::delete('/eglises/{eglise}', [SuperAdminEgliseController::class, 'destroy']);

        Route::get('/demandes', [SuperAdminEgliseRequestController::class, 'index']);
        Route::post('/demandes/{eglise}/approuver', [SuperAdminEgliseRequestController::class, 'approve']);
        Route::post('/demandes/{eglise}/rejeter', [SuperAdminEgliseRequestController::class, 'reject']);

        Route::get('/stats', [SuperAdminStatsController::class, 'index']);
    });

    Route::middleware(['is_admin_api', 'require_eglise_context'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/evenements', [AdminEventController::class, 'index']);
        Route::post('/evenements', [AdminEventController::class, 'store']);
        Route::get('/evenements/{event}', [AdminEventController::class, 'show']);
        Route::put('/evenements/{event}', [AdminEventController::class, 'update']);
        Route::delete('/evenements/{event}', [AdminEventController::class, 'destroy']);

        Route::get('/notifications', [AdminNotificationController::class, 'index']);
        Route::post('/notifications', [AdminNotificationController::class, 'store']);
        Route::put('/notifications/{notification}', [AdminNotificationController::class, 'update']);
        Route::delete('/notifications/{notification}', [AdminNotificationController::class, 'destroy']);

        Route::get('/paiements', [AdminPaymentController::class, 'index']);
        Route::put('/paiements/{payment}/statut', [AdminPaymentController::class, 'updateStatus']);
        Route::delete('/paiements/{payment}', [AdminPaymentController::class, 'destroy']);

        Route::get('/membres', [AdminMemberController::class, 'index']);
        Route::put('/membres/{member}', [AdminMemberController::class, 'update']);
        Route::delete('/membres/{member}', [AdminMemberController::class, 'destroy']);

        Route::get('/livres', [AdminLivreController::class, 'index']);
        Route::post('/livres', [AdminLivreController::class, 'store']);
        Route::delete('/livres/{livre}', [AdminLivreController::class, 'destroy']);

        Route::get('/avantages', [AdminCardBenefitController::class, 'index']);
        Route::post('/avantages', [AdminCardBenefitController::class, 'store']);
        Route::delete('/avantages/{benefit}', [AdminCardBenefitController::class, 'destroy']);

        Route::get('/direct', [AdminLiveStreamController::class, 'edit']);
        Route::put('/direct', [AdminLiveStreamController::class, 'update']);

        Route::get('/cartes', [MembershipCardController::class, 'index']);
        Route::post('/cartes/import', [MembershipCardController::class, 'import']);
        Route::get('/cartes/{member}', [MembershipCardController::class, 'edit']);
        Route::put('/cartes/{member}', [MembershipCardController::class, 'update']);
        Route::delete('/cartes/{member}', [MembershipCardController::class, 'destroy']);
    });
});
