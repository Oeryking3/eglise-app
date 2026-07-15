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

        // On les marque comme notifiés pour ne pas les réafficher aux prochaines connexions
        AgendaItem::where('user_id', $user->id)
            ->where('date_rappel', '<=', now()->toDateString())
            ->where('notifie', false)
            ->update(['notifie' => true]);

        return view('accueil', compact('user', 'upcomingEvents', 'notifications', 'liveStream', 'agendaReminders'));
    }
}