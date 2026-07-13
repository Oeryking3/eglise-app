@extends('layouts.admin')

@section('title', 'Modifier événement')

@section('content')
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h1 class="h4 mb-1">Modifier l'événement</h1>
      <p class="text-muted">Mets à jour les informations de l'événement.</p>
    </div>
    <a href="{{ route('admin.events.index') }}" class="btn btn-outline-secondary">Retour</a>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">
      <form method="POST" action="{{ route('admin.events.update', $event) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
          <label class="form-label">Titre</label>
          <input type="text" name="titre" value="{{ old('titre', $event->titre) }}" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea name="description" class="form-control" rows="4">{{ old('description', $event->description) }}</textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Image actuelle</label>
          <div class="mb-2"><img src="{{ $event->image_url }}" alt="" class="img-fluid rounded" style="max-width: 180px;"></div>
          <input type="file" name="image" class="form-control" accept="image/*">
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label class="form-label">Date de l'événement</label>
            <input type="date" name="date_evenement" value="{{ old('date_evenement', $event->date_evenement->format('Y-m-d')) }}" class="form-control" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Heure de début</label>
            <input type="text" name="heure_debut" value="{{ old('heure_debut', $event->heure_debut) }}" class="form-control">
          </div>
          <div class="col-md-4">
            <label class="form-label">Heure de fin</label>
            <input type="text" name="heure_fin" value="{{ old('heure_fin', $event->heure_fin) }}" class="form-control">
          </div>
        </div>

        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" name="important" id="important" value="1" {{ old('important', $event->important) ? 'checked' : '' }}>
          <label class="form-check-label" for="important">Marquer comme événement important</label>
        </div>

        <button type="submit" class="btn btn-primary">Mettre à jour</button>
      </form>
    </div>
  </div>
@endsection
