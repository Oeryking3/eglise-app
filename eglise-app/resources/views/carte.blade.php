<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ma carte - {{ $user->eglise->nom ?? 'Église' }}</title>
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

    @if ($user->carte_est_valide)
      <div class="member-id-card">
        <div class="member-id-header">
          <div class="member-id-badge">CARTE DE MEMBRE</div>
          @if ($user->groupe_sanguin)
            <div class="member-id-blood">{{ $user->groupe_sanguin }}</div>
          @endif
        </div>

        <div class="member-id-body">
          <div class="member-id-photo">
            @if ($user->carte_photo_url)
              <img src="{{ $user->carte_photo_url }}" alt="Photo">
            @else
              <div class="member-id-photo-placeholder">{{ substr($user->prenom, 0, 1) }}{{ substr($user->nom, 0, 1) }}</div>
            @endif
          </div>

          <div class="member-id-info">
            <div class="member-id-label">Nom</div>
            <div class="member-id-value">{{ strtoupper($user->nom) }}</div>

            <div class="member-id-label">Prénom</div>
            <div class="member-id-value">{{ strtoupper($user->prenom) }}</div>

            @if ($user->date_naissance)
              <div class="member-id-label">Date de naissance</div>
              <div class="member-id-value">{{ $user->date_naissance->format('d/m/Y') }}</div>
            @endif

            @if ($user->sexe)
              <div class="member-id-label">Sexe</div>
              <div class="member-id-value">{{ $user->sexe }}</div>
            @endif

            @if ($user->lieu_residence)
              <div class="member-id-label">Lieu de résidence</div>
              <div class="member-id-value">{{ $user->lieu_residence }}</div>
            @endif

            <div class="member-id-label">Église</div>
            <div class="member-id-value">{{ strtoupper($user->eglise->nom ?? '') }}</div>
          </div>
        </div>

        @if ($user->carte_expiration)
          <div class="member-id-expiry">Valide jusqu'au {{ $user->carte_expiration->format('d/m/Y') }}</div>
        @endif
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
          <span>{{ $user->eglise->nom ?? 'Église' }}</span>
        </div>
        <div class="member-card-status">
          @if (! $user->carte_membre)
            Carte non activée
          @elseif ($user->carte_expiration && $user->carte_expiration->isPast())
            Carte expirée le {{ $user->carte_expiration->format('d/m/Y') }}
          @else
            Carte désactivée
          @endif
        </div>
      </div>
      <p style="font-family:Arial, sans-serif; color:#999; font-size:13px; text-align:center; margin-top:16px;">
        Contacte l'administration pour activer ou renouveler ta carte de membre.
      </p>
    @endif

  </main>

</div>
</body>
</html>