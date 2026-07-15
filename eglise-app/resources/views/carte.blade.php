<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ma carte - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device dashboard">

  <header>
    <div class="top-row">
      <div>
        <h1>Ma carte de membre</h1>
      </div>
      <a href="{{ route('accueil') }}" style="display:flex; align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </a>
    </div>
  </header>

  <main class="content" style="padding-top:24px;">

    @if ($user->carte_membre)
      <div class="member-card-visual">
        <div class="member-card-top">
          <span>Église Ambassade des Miracles</span>
          <span class="member-card-badge">MEMBRE</span>
        </div>
        <div class="member-card-name">{{ $user->prenom }} {{ $user->nom }}</div>
        <div class="member-card-status">Carte active</div>
      </div>

      <div class="section-h" style="margin-top:26px;">Tes avantages</div>
      <div class="events-grid">
        @forelse ($benefits as $benefit)
          <div class="event-card">
            <div class="event-top">
              <h2>{{ $benefit->titre }}</h2>
            </div>
            @if ($benefit->description)
              <p>{{ $benefit->description }}</p>
            @endif
          </div>
        @empty
          <div class="empty-state">Aucun avantage pour le moment.</div>
        @endforelse
      </div>
    @else
      <div class="member-card-visual inactive">
        <div class="member-card-top">
          <span>Église Ambassade des Miracles</span>
        </div>
        <div class="member-card-status">Carte non activée</div>
      </div>
      <p style="font-family:Arial, sans-serif; color:#999; font-size:13px; text-align:center; margin-top:16px;">
        Contacte l'administration pour activer ta carte de membre.
      </p>
    @endif

  </main>

</div>
</body>
</html>