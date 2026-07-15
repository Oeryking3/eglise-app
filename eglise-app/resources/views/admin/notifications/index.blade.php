@extends('layouts.admin')

@section('title', 'Notifications')

@section('content')
  <div class="page-title">Notifications</div>

  <a href="{{ route('admin.notifications.create') }}" class="add-btn">+ Nouvelle notification</a>

  @forelse ($notifications as $notif)
    <div class="list-card">
      <div class="t">{{ $notif->titre }}</div>
      <div class="s">{{ \Illuminate\Support\Str::limit($notif->message, 90) }}</div>
      <div class="row-actions">
        <a href="{{ route('admin.notifications.edit', $notif) }}">Modifier</a>
        <form method="POST" action="{{ route('admin.notifications.destroy', $notif) }}" onsubmit="return confirm('Supprimer cette notification ?');">
          @csrf @method('DELETE')
          <button type="submit">Supprimer</button>
        </form>
      </div>
    </div>
  @empty
    <div class="empty-state">Aucune notification.</div>
  @endforelse

  <div class="pagination-wrap">{{ $notifications->links() }}</div>
@endsection