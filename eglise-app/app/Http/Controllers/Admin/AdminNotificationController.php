<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChurchNotification;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $notifications = ChurchNotification::latest()->paginate(10);
        return view('admin.notifications.index', compact('notifications'));
    }

    public function create()
    {
        return view('admin.notifications.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'   => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        ChurchNotification::create($data);

        return redirect()->route('admin.notifications.index')->with('success', 'Notification créée.');
    }

    public function edit(ChurchNotification $notification)
    {
        return view('admin.notifications.edit', compact('notification'));
    }

    public function update(Request $request, ChurchNotification $notification)
    {
        $data = $request->validate([
            'titre'   => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $notification->update($data);

        return redirect()->route('admin.notifications.index')->with('success', 'Notification mise à jour.');
    }

    public function destroy(ChurchNotification $notification)
    {
        $notification->delete();
        return back()->with('success', 'Notification supprimée.');
    }
}