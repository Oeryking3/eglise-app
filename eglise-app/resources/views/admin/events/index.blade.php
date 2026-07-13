@extends('layouts.admin')

@section('title', 'Événements')

@section('content')
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h1 class="h4 mb-1">Événements</h1>
      <p class="text-muted">Ajouter, modifier ou supprimer les événements.</p>
    </div>
    <a href="{{ route('admin.events.create') }}" class="btn btn-primary">+ Nouvel événement</a>
  </div>

  <div class="row g-3">
    @forelse ($events as $event)
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 class="h5 mb-1">{{ $event->titre }}</h2>
                <small class="text-muted">{{ $event->date_evenement->format('d/m/Y') }}@if($event->heure_debut) · {{ $event->heure_debut }}@if($event->heure_fin) - {{ $event->heure_fin }}@endif @endif</small>
              </div>
              @if ($event->important)
                <span class="badge bg-danger">Important</span>
              @endif
            </div>
            <p class="mb-3 text-truncate">{{ $event->description }}</p>
            <div class="d-flex gap-2 flex-wrap">
              <a href="{{ route('admin.events.edit', $event) }}" class="btn btn-outline-secondary btn-sm">Modifier</a>
              <form method="POST" action="{{ route('admin.events.destroy', $event) }}" onsubmit="return confirm('Supprimer cet événement ?');">
                @csrf @method('DELETE')
                <button type="submit" class="btn btn-outline-danger btn-sm">Supprimer</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    @empty
      <div class="col-12">
        <div class="alert alert-info">Aucun événement pour le moment.</div>
      </div>
    @endforelse
  </div>

  <div class="mt-4">{{ $events->links('pagination::bootstrap-5') }}</div>
@endsection
