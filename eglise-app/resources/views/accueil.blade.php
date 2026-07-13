<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Accueil - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device dashboard">

  <header>
    <div class="top-row">
      <div>
        <h1>Coucou, {{ $user->prenom }}</h1>
        <div class="sub">Que la paix du Seigneur soit avec toi.</div>
      </div>
      <div class="icons">
        <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" style="display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </a>
      </div>
    </div>
    <form id="logout-form" method="POST" action="{{ route('logout') }}" style="display:none;">
      @csrf
    </form>
  </header>

  <div class="hero-card">
    <img src="{{ asset('img/hero.png') }}" alt="Église Ambassade des Miracles">
  </div>

  <main class="content">

    <div class="section-h">Évènements importants</div>
    <div class="important-events-grid">
      @forelse ($importantEvents as $event)
        <div class="important-event-card">
          <img src="{{ $event->image_url }}" alt="{{ $event->titre }}">
          <div class="info">
            <div class="label">Important</div>
            <h2>{{ $event->titre }}</h2>
            <p>{{ \Illuminate\Support\Str::limit($event->description, 100) }}</p>
            <div class="meta">
              <span>{{ $event->date_evenement->format('d/m/Y') }}</span>
              @if ($event->heure_debut)
                <span>{{ $event->heure_debut }}@if($event->heure_fin) - {{ $event->heure_fin }}@endif</span>
              @endif
            </div>
          </div>
        </div>
      @empty
        <div class="important-event-card empty">
          <div class="info">
            <h2>Aucun événement important</h2>
            <p>Les événements importants apparaîtront ici dès qu’ils seront ajoutés.</p>
          </div>
        </div>
      @endforelse
    </div>

    <div class="section-h">Évènements à venir</div>
    <div class="events-scroll">
      @forelse ($events as $event)
        <div class="event-tile">
          <img src="{{ $event->image_url }}" alt="{{ $event->titre }}">
          <div class="ov">
            <div class="t">{{ $event->titre }}</div>
            <div class="s">
              @if ($event->heure_debut && $event->heure_fin)
                {{ $event->heure_debut }} - {{ $event->heure_fin }}
              @else
                {{ $event->heure_debut }}
              @endif
            </div>
          </div>
        </div>
      @empty
        <p style="font-family:Arial, sans-serif; color:#999; font-size:13px;">Aucun événement pour le moment.</p>
      @endforelse
    </div>

    <div class="section-h">Notifications</div>
    <div class="notif-wrap">
      <div class="notif-list">
        @forelse ($notifications as $notif)
          <div class="notif-item">
            <div class="notif-icon"><svg viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 12V8.24l-8 6-8-6V18h16z"/></svg></div>
            <div class="notif-text">
              <div class="t">{{ $notif->titre }}</div>
              <div class="s">{{ $notif->message }}</div>
            </div>
          </div>
        @empty
          <p style="font-family:Arial, sans-serif; color:#999; font-size:13px;">Aucune notification.</p>
        @endforelse
      </div>
      <div class="notif-side">
        <img src="{{ asset('img/candle.png') }}" alt="Bougie">
      </div>
    </div>

    <button type="button" class="cta-miracle" onclick="window.location.href='{{ route('payment') }}';">Comment créer un miracle</button>

  </main>

</div>
</body>
</html>
