<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modifier le rappel - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device dashboard">

  <header>
    <div class="top-row">
      <div>
        <h1>Modifier le rappel</h1>
      </div>
      <a href="{{ route('agenda.index') }}" style="display:flex; align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </a>
    </div>
  </header>

  <main class="content" style="padding-top:24px;">
    <div class="card">
      <form method="POST" action="{{ route('agenda.update', $item) }}">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label>Titre</label>
            <input type="text" name="titre" value="{{ old('titre', $item->titre) }}" required>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea name="description">{{ old('description', $item->description) }}</textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="date_rappel" value="{{ old('date_rappel', $item->date_rappel->format('Y-m-d')) }}" required>
            </div>
            <div class="form-group">
                <label>Heure (facultatif)</label>
                <input type="time" name="heure_rappel" value="{{ old('heure_rappel', $item->heure_rappel) }}">
            </div>
        </div>

        <button type="submit" class="submit-btn">Enregistrer</button>
      </form>
    </div>
  </main>

</div>
</body>
</html>