<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tous les événements - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device dashboard">

  <header>
    <div class="top-row">
      <div>
        <h1>Tous les événements</h1>
        <div class="sub">Passés et à venir</div>
      </div>
      <a href="{{ route('accueil') }}" style="display:flex; align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </a>
    </div>
  </header>

  <main class="content" style="padding-top:24px;">
    <div class="public-events-list">
      @forelse ($events as $event)
        <div class="public-event-card">
          <div class="public-event-img">
            <img src="{{ $event->image_url }}" alt="{{ $event->titre }}">
            @if ($event->important)
              <span class="public-event-badge">Important</span>
            @endif
          </div>
          <div class="public-event-body">
            <h2>{{ $event->titre }}</h2>
            <div class="public-event-meta">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ $event->date_evenement->format('d/m/Y') }}
              @if ($event->heure_debut)
                <span class="dot">·</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ $event->heure_debut }}@if($event->heure_fin) - {{ $event->heure_fin }}@endif
              @endif
            </div>
            @if ($event->description)
              <p>{{ $event->description }}</p>
            @endif
          </div>
        </div>
      @empty
        <div class="empty-state">Aucun événement pour le moment.</div>
      @endforelse
    </div>

    <div class="pagination-wrap">{{ $events->links() }}</div>
  </main>

</div>
</body>
</html>