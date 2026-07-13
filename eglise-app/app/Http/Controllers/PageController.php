<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ChurchNotification;

class PageController extends Controller
{
    public function splash()
    {
        return view('splash');
    }

    public function home()
    {
        return view('home');
    }

    public function saving()
    {
        return view('saving');
    }

    public function confirm()
    {
        return view('confirm');
    }

    public function accueil()
    {
        $user = auth()->user();
        $importantEvents = Event::where('important', true)
            ->orderBy('date_evenement')
            ->take(3)
            ->get();
        $events = Event::orderBy('date_evenement')->take(10)->get();
        $notifications = ChurchNotification::latest()->take(4)->get();

        return view('accueil', compact('user', 'importantEvents', 'events', 'notifications'));
    }
}