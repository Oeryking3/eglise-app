<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'membres' => User::forActingTenant()->where('role', 'membre')->count(),
            'evenements' => Event::count(),
            'paiements' => Payment::withTrashed()->where('statut', 'reussi')->count(),
            'revenus' => Payment::withTrashed()->where('statut', 'reussi')->sum('montant'),
        ]);
    }
}
