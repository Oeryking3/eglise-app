<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentRelayController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminMemberController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\LivreController;
use App\Http\Controllers\Admin\LiveStreamController;
use App\Http\Controllers\Admin\CardBenefitController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\Admin\MembershipCardController;
use App\Http\Controllers\LivreDownloadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Parcours public / membre
|--------------------------------------------------------------------------
*/

Route::get('/', [PageController::class, 'splash'])->name('splash');
Route::get('/bienvenue', [PageController::class, 'home'])->name('home');

Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.attempt')->middleware('throttle:6,1');

Route::get('/inscription', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/inscription', [AuthController::class, 'signup'])->name('signup.attempt')->middleware('throttle:6,1');

Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout');

Route::get('/enregistrement', [PageController::class, 'saving'])->name('saving');

Route::get('/paiement/retour', [PaymentRelayController::class, 'retour'])->name('paiement.retour');

Route::get('/livres/{livre}/telecharger', [LivreDownloadController::class, 'show'])
    ->name('livres.telecharger')
    ->middleware('signed');
Route::get('/confirmation', [PageController::class, 'confirm'])->name('confirm');

Route::middleware('auth')->group(function () {
    Route::get('/accueil', [PageController::class, 'accueil'])->name('accueil');
    Route::get('/evenements', [EventController::class, 'index'])->name('events.index');

    Route::get('/paiement', [PaymentController::class, 'show'])->name('payment');
    Route::post('/paiement', [PaymentController::class, 'process'])->name('payment.process');
    Route::get('/telechargement', [PaymentController::class, 'download'])->name('download');

    Route::get('/carte', [CardController::class, 'show'])->name('card.show');

Route::prefix('agenda')->name('agenda.')->group(function () {
    Route::get('/', [AgendaController::class, 'index'])->name('index');
    Route::get('/creer', [AgendaController::class, 'create'])->name('create');
    Route::post('/', [AgendaController::class, 'store'])->name('store');
    Route::get('/{item}/modifier', [AgendaController::class, 'edit'])->name('edit');
    Route::put('/{item}', [AgendaController::class, 'update'])->name('update');
    Route::delete('/{item}', [AgendaController::class, 'destroy'])->name('destroy');
});
});

/*
|--------------------------------------------------------------------------
| Espace admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'is_admin', 'require_eglise_context'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('evenements', AdminEventController::class)
        ->parameters(['evenements' => 'event'])
        ->names('events');

    Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/creer', [AdminNotificationController::class, 'create'])->name('notifications.create');
    Route::post('notifications', [AdminNotificationController::class, 'store'])->name('notifications.store');
    Route::get('notifications/{notification}/modifier', [AdminNotificationController::class, 'edit'])->name('notifications.edit');
    Route::put('notifications/{notification}', [AdminNotificationController::class, 'update'])->name('notifications.update');
    Route::delete('notifications/{notification}', [AdminNotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::get('paiements', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::put('paiements/{payment}/statut', [AdminPaymentController::class, 'updateStatus'])->name('payments.updateStatus');
    Route::delete('paiements/{payment}', [AdminPaymentController::class, 'destroy'])->name('payments.destroy');

    Route::get('membres', [AdminMemberController::class, 'index'])->name('members.index');
    Route::get('membres/{member}/modifier', [AdminMemberController::class, 'edit'])->name('members.edit');
    Route::put('membres/{member}', [AdminMemberController::class, 'update'])->name('members.update');
    Route::delete('membres/{member}', [AdminMemberController::class, 'destroy'])->name('members.destroy');

    Route::prefix('livres')->name('livres.')->group(function () {
        Route::get('/', [LivreController::class, 'index'])->name('index');
        Route::get('/creer', [LivreController::class, 'create'])->name('create');
        Route::post('/', [LivreController::class, 'store'])->name('store');
        Route::delete('/{livre}', [LivreController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('avantages')->name('avantages.')->group(function () {
        Route::get('/', [CardBenefitController::class, 'index'])->name('index');
        Route::get('/creer', [CardBenefitController::class, 'create'])->name('create');
        Route::post('/', [CardBenefitController::class, 'store'])->name('store');
       Route::delete('/{benefit}', [CardBenefitController::class, 'destroy'])->name('destroy');
});

    Route::get('direct', [LiveStreamController::class, 'edit'])->name('direct.edit');
    Route::put('direct', [LiveStreamController::class, 'update'])->name('direct.update');

    

Route::prefix('cartes')->name('cartes.')->group(function () {
    Route::get('/', [MembershipCardController::class, 'index'])->name('index');
    Route::get('/{member}/modifier', [MembershipCardController::class, 'edit'])->name('edit');
    Route::put('/{member}', [MembershipCardController::class, 'update'])->name('update');
    Route::delete('/{member}', [MembershipCardController::class, 'destroy'])->name('destroy');
});
});