@extends('layouts.admin')

@section('title', 'Événements')

@section('content')
<div class="page-header">
    <div>
        <h1>Événements</h1>
        <p>Ajouter, modifier ou supprimer les événements.</p>
    </div>
    <a href="{{ route('admin.events.create') }}" class="btn btn-primary">+ Nouvel</a>
</div>

<div class="events-grid">
    @forelse ($events as $event)
        <div class="event-card">
            <div class="event-top">
                <div>
                    <h2>{{ $event->titre }}</h2>
                    <div class="meta">
                        {{ $event->date_evenement->format('d/m/Y') }}
                        @if($event->heure_debut)
                            · {{ $event->heure_debut }}@if($event->heure_fin) - {{ $event->heure_fin }}@endif
                        @endif
                    </div>
                </div>
                @if ($event->important)
                    <span class="badge failed">Important</span>
                @endif
            </div>

            <p>{{ $event->description }}</p>

            <div class="actions">
                <a href="{{ route('admin.events.edit', $event) }}" class="btn btn-outline">Modifier</a>
                <form method="POST" action="{{ route('admin.events.destroy', $event) }}" onsubmit="return confirm('Supprimer cet événement ?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Supprimer</button>
                </form>
            </div>
        </div>
    @empty
        <div class="empty-state">Aucun événement pour le moment.</div>
    @endforelse
</div>

<div class="pagination-wrap">
    {{ $events->links() }}
</div>
@endsection