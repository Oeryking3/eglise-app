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
  @if ($agendaReminders->isNotEmpty())
      <div style="padding:0 6%; margin-top:16px;">
        @foreach ($agendaReminders as $reminder)
          <div class="alert-ok" style="background:#FFF3ED; border-color:#f5d5c4; color:#B5121B;">
            <strong>Rappel :</strong> {{ $reminder->titre }}
            @if ($reminder->description)
              — {{ $reminder->description }}
            @endif
          </div>
        @endforeach
      </div>
    @endif
  <div class="hero-card">
    <img src="{{ asset('img/hero.png') }}" alt="Église Ambassade des Miracles">
  </div>

  <main class="content">

    <div class="section-h">Évènements à venir</div>

    <div class="events-carousel">
      <div class="events-carousel-track" id="eventsCarouselTrack">
        @forelse ($upcomingEvents as $event)
          <div class="event-carousel-card">
            <img src="{{ $event->image_url }}" alt="{{ $event->titre }}">
            <div class="ov">
              <div class="t">{{ $event->titre }}</div>
              <div class="s">
                {{ $event->date_evenement->format('d/m/Y') }}
                @if ($event->heure_debut)
                  · {{ $event->heure_debut }}
                @endif
              </div>
            </div>
          </div>
        @empty
          <div class="event-carousel-card empty">
            <div class="ov" style="position:static; background:none; align-items:center; justify-content:center; height:100%;">
              <div class="t" style="color:#999;">Aucun événement à venir</div>
            </div>
          </div>
        @endforelse
      </div>
    </div>

    <a href="{{ route('events.index') }}" class="see-all-events-btn">Voir tous les événements</a>

   @if ($liveStream->actif && $liveStream->embed_url)
      <div class="section-h">En direct</div>
      <div class="live-embed">
        <iframe
          src="{{ $liveStream->embed_url }}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    @elseif ($liveStream->actif && $liveStream->url)
      <div class="section-h">En direct</div>
      <a href="{{ $liveStream->url }}" target="_blank" rel="noopener" class="live-box" style="text-decoration:none;">
        <div class="play-btn">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </a>
    @endif

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
      <!-- <div class="notif-side">
        <img src="{{ asset('img/candle.png') }}" alt="Bougie">
      </div> -->
    </div>

    <button type="button" class="cta-miracle" onclick="window.location.href='{{ route('payment') }}';">Comment créer un miracle</button>

    <a href="{{ route('agenda.index') }}" class="see-all-events-btn" style="margin-top:14px;">Mon agenda</a>
    <a href="{{ route('card.show') }}" class="see-all-events-btn" style="margin-top:14px;">Ma carte de membre</a>

  </main>

</div>

<script>
  (function () {
    const track = document.getElementById('eventsCarouselTrack');
    if (!track || track.children.length <= 1) return;

    let index = 0;
    const totalCards = track.children.length;

    setInterval(() => {
      index = (index + 1) % totalCards;
      const card = track.children[index];
      track.scrollTo({
        left: card.offsetLeft - 20,
        behavior: 'smooth'
      });
    }, 3500);
  })();
</script>

</body>
</html>