<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mon agenda - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device dashboard">

  <header>
    <div class="top-row">
      <div>
        <h1>Mon agenda</h1>
        <div class="sub">Tes rappels personnels</div>
      </div>
      <a href="{{ route('accueil') }}" style="display:flex; align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </a>
    </div>
  </header>

  <main class="content" style="padding-top:24px;">
    <a href="{{ route('agenda.create') }}" class="add-btn">+ Ajouter un rappel</a>

    <div class="events-grid">
      @forelse ($items as $item)
        <div class="event-card">
          <div class="event-top">
            <h2>{{ $item->titre }}</h2>
          </div>
          <div class="meta">
            {{ $item->date_rappel->format('d/m/Y') }}
            @if ($item->heure_rappel)
              · {{ \Illuminate\Support\Str::substr($item->heure_rappel, 0, 5) }}
            @endif
          </div>
          @if ($item->description)
            <p>{{ $item->description }}</p>
          @endif
          <div class="actions">
            <a href="{{ route('agenda.edit', $item) }}" class="btn btn-outline btn-sm">Modifier</a>
            <form method="POST" action="{{ route('agenda.destroy', $item) }}" onsubmit="return confirm('Supprimer ce rappel ?');">
              @csrf
              @method('DELETE')
              <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
            </form>
          </div>
        </div>
      @empty
        <div class="empty-state">Aucun rappel pour le moment.</div>
      @endforelse
    </div>
  </main>

</div>
</body>
</html>