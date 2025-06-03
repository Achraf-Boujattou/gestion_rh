<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->paginate(10);

        return response()->json([
            'notifications' => $notifications
        ]);
    }

    public function unreadCount()
    {
        $count = auth()->user()->notifications()
            ->where('read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->update(['read' => true]);

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        auth()->user()->notifications()
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['success' => true]);
    }
}
