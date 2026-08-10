<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgendaItemResource;
use App\Http\Resources\ChurchNotificationResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\LiveStreamResource;
use App\Http\Resources\UserResource;
use App\Models\AgendaItem;
use App\Models\ChurchNotification;
use App\Models\Event;
use App\Models\LiveStream;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $eglise = $user->eglise;

        $upcomingEvents = $eglise && ! $eglise->hasFeature('evenements')
            ? collect()
            : Event::where('important', true)->orderBy('date_evenement')->take(3)->get();

        $notifications = $eglise && ! $eglise->hasFeature('notifications')
            ? collect()
            : ChurchNotification::latest()->take(4)->get();

        $liveStream = $eglise && ! $eglise->hasFeature('direct') ? null : LiveStream::current();

        $reminders = AgendaItem::where('user_id', $user->id)
            ->where('date_rappel', '<=', now()->toDateString())
            ->where('notifie', false)
            ->get();

        // Un rappel du jour même reste visible à chaque ouverture de l'app
        // tant que sa journée n'est pas terminée — seuls les rappels déjà
        // passés (jours précédents) sont marqués comme notifiés, pour ne
        // plus jamais réapparaître après coup.
        AgendaItem::whereIn('id', $reminders->pluck('id'))
            ->where('date_rappel', '<', now()->toDateString())
            ->update(['notifie' => true]);

        return response()->json([
            'user' => new UserResource($user),
            'upcoming_events' => EventResource::collection($upcomingEvents),
            'notifications' => ChurchNotificationResource::collection($notifications),
            'live_stream' => $liveStream ? new LiveStreamResource($liveStream) : null,
            'agenda_reminders' => AgendaItemResource::collection($reminders),
        ]);
    }
}
