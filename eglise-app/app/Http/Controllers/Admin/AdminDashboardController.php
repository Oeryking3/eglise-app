<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'membres'      => User::where('role', 'membre')->count(),
            'evenements'   => Event::count(),
            'paiements'    => Payment::where('statut', 'reussi')->count(),
            'revenus'      => Payment::where('statut', 'reussi')->sum('montant'),
        ];

        return view('admin.dashboard', compact('stats'));
    }
}