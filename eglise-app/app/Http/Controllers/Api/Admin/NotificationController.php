<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChurchNotificationResource;
use App\Models\ChurchNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return ChurchNotificationResource::collection(
            ChurchNotification::latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $notification = ChurchNotification::create($data);

        return response()->json(['notification' => new ChurchNotificationResource($notification)], 201);
    }

    public function update(Request $request, ChurchNotification $notification)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $notification->update($data);

        return response()->json(['notification' => new ChurchNotificationResource($notification)]);
    }

    public function destroy(ChurchNotification $notification)
    {
        $notification->delete();

        return response()->json(['message' => 'Notification supprimée.']);
    }
}
