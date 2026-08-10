<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ChurchNotification;
use App\Models\LiveStream;
use App\Models\AgendaItem;

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

        $upcomingEvents = Event::where('important', true)
            ->orderBy('date_evenement')
            ->take(3)
            ->get();

        $notifications = ChurchNotification::latest()->take(4)->get();
        $liveStream = LiveStream::current();

        // Rappels d'agenda arrivés à échéance, pas encore notifiés
        $agendaReminders = AgendaItem::where('user_id', $user->id)
            ->where('date_rappel', '<=', now()->toDateString())
            ->where('notifie', false)
            ->get();

        // Un rappel du jour même reste visible à chaque connexion tant que sa
        // journée n'est pas terminée — seuls les rappels de jours précédents
        // sont marqués comme notifiés, pour ne plus jamais réapparaître après coup.
        AgendaItem::where('user_id', $user->id)
            ->where('date_rappel', '<', now()->toDateString())
            ->where('notifie', false)
            ->update(['notifie' => true]);

        return view('accueil', compact('user', 'upcomingEvents', 'notifications', 'liveStream', 'agendaReminders'));
    }
}