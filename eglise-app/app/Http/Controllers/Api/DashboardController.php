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

        $upcomingEvents = Event::where('important', true)
            ->orderBy('date_evenement')
            ->take(3)
            ->get();

        $notifications = ChurchNotification::latest()->take(4)->get();

        $liveStream = LiveStream::current();

        $reminders = AgendaItem::where('user_id', $user->id)
            ->where('date_rappel', '<=', now()->toDateString())
            ->where('notifie', false)
            ->get();

        AgendaItem::whereIn('id', $reminders->pluck('id'))->update(['notifie' => true]);

        return response()->json([
            'user' => new UserResource($user),
            'upcoming_events' => EventResource::collection($upcomingEvents),
            'notifications' => ChurchNotificationResource::collection($notifications),
            'live_stream' => new LiveStreamResource($liveStream),
            'agenda_reminders' => AgendaItemResource::collection($reminders),
        ]);
    }
}
